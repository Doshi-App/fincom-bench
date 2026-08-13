import fs from "node:fs";
import path from "node:path";
import Papa from "papaparse";

/**
 * Reads the published result CSVs in `results/`.
 *
 * The leaderboard used to be assembled from `submissions/*` directly. That
 * directory is committed now, but its transcripts are tens of MB and exist to
 * be audited, not to be read by a web page on every build, so the site reads
 * the two small CSVs the harness aggregates instead:
 *
 *   results/leaderboard.csv       one row per model
 *   results/judge_selection.csv   one row per candidate judge
 *
 * `submissions/` is still the audit record, and the per-model detail pages
 * still read it when it is present locally. This is the published summary.
 *
 * A missing file renders as an honest empty state. A file that exists but has
 * lost a column the page needs throws, so the build breaks instead of the page
 * quietly going stale.
 */

const RESULTS_DIR = path.join(process.cwd(), "results");

export type LeaderboardRow = {
  rank: number | null;
  ranked: boolean;
  model: string;
  provider: string;
  selfGraded: boolean;
  items: number;
  decided: number;
  passes: number;
  fails: number;
  passRate: number | null;
  coverage: number;
  behaviourPassRate: number | null;
  compliancePassRate: number | null;
  judge: string;
  /** Completion tokens for 1 pass. Null if the column is absent or blank. */
  avgReplyTokens: number | null;
  /** USD, normalized to 1 pass per item. See results/README.md "Phase 4" before quoting. */
  estCostUsd1Pass: number | null;
  avgTimeS1Pass: number | null;
};

export type JudgeRow = {
  rank: number;
  judge: string;
  macroF1: number;
  kappa: number;
  mcc: number;
  balancedAccuracy: number;
  coverage: number;
  isBaseline: boolean;
};

export type CategoryBreakdownRow = {
  model: string;
  provider: string;
  category: string;
  axis: string;
  items: number;
  decided: number;
  fails: number;
  failRate: number | null;
};

function read(file: string): Record<string, string>[] | null {
  const filePath = path.join(RESULTS_DIR, file);
  if (!fs.existsSync(filePath)) return null;
  const parsed = Papa.parse<Record<string, string>>(fs.readFileSync(filePath, "utf8"), {
    header: true,
    skipEmptyLines: true,
  });
  const fatal = parsed.errors.filter((e) => e.type !== "FieldMismatch");
  if (fatal.length > 0) {
    throw new Error(`Failed to parse results/${file}: ${JSON.stringify(fatal.slice(0, 3))}`);
  }
  return parsed.data;
}

function need(row: Record<string, string>, column: string, file: string): string {
  if (!(column in row)) {
    throw new Error(`results/${file} has no \`${column}\` column — the page needs it.`);
  }
  return row[column] ?? "";
}

/**
 * Same as `need`, but for columns a page can do without: cost and token
 * counts, added retrospectively (see `results/README.md`, "Phase 4"), are
 * blank for some rows on purpose (3 Bedrock rows have no published price) and
 * absent altogether from any leaderboard.csv older than that addition. A
 * missing optional column degrades the page to not showing that number,
 * rather than breaking the whole build the way a missing `pass_rate` would.
 */
function optional(row: Record<string, string>, column: string): string {
  return row[column] ?? "";
}

/** "" and "None" both mean the harness had nothing to divide by. */
function num(value: string): number | null {
  const trimmed = (value ?? "").trim();
  if (trimmed === "" || trimmed === "None") return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function loadLeaderboard(): LeaderboardRow[] {
  const rows = read("leaderboard.csv");
  if (!rows) return [];
  return rows.map((row) => ({
    rank: num(need(row, "rank", "leaderboard.csv")),
    ranked: need(row, "ranked", "leaderboard.csv") === "yes",
    model: need(row, "model", "leaderboard.csv"),
    provider: need(row, "provider", "leaderboard.csv"),
    selfGraded: need(row, "self_graded", "leaderboard.csv") === "yes",
    items: num(need(row, "items", "leaderboard.csv")) ?? 0,
    decided: num(need(row, "decided", "leaderboard.csv")) ?? 0,
    passes: num(need(row, "passes", "leaderboard.csv")) ?? 0,
    fails: num(need(row, "fails", "leaderboard.csv")) ?? 0,
    passRate: num(need(row, "pass_rate", "leaderboard.csv")),
    coverage: num(need(row, "coverage", "leaderboard.csv")) ?? 0,
    behaviourPassRate: num(need(row, "behaviour_pass_rate", "leaderboard.csv")),
    compliancePassRate: num(need(row, "compliance_pass_rate", "leaderboard.csv")),
    judge: need(row, "judge", "leaderboard.csv"),
    avgReplyTokens: num(optional(row, "avg_reply_tokens")),
    estCostUsd1Pass: num(optional(row, "est_cost_usd_1pass")),
    avgTimeS1Pass: num(optional(row, "avg_time_s_1pass")),
  }));
}

function loadJudges(): JudgeRow[] {
  const rows = read("judge_selection.csv");
  if (!rows) return [];
  return rows.map((row) => {
    const judge = need(row, "judge", "judge_selection.csv");
    return {
      rank: num(need(row, "rank", "judge_selection.csv")) ?? 0,
      judge,
      macroF1: num(need(row, "macro_f1", "judge_selection.csv")) ?? 0,
      kappa: num(need(row, "cohens_kappa", "judge_selection.csv")) ?? 0,
      mcc: num(need(row, "mcc", "judge_selection.csv")) ?? 0,
      balancedAccuracy: num(need(row, "balanced_accuracy", "judge_selection.csv")) ?? 0,
      coverage: num(need(row, "coverage", "judge_selection.csv")) ?? 0,
      isBaseline: judge.startsWith("baseline:"),
    };
  });
}

function loadCategoryBreakdown(): CategoryBreakdownRow[] {
  const rows = read("category_breakdown.csv");
  if (!rows) return [];
  return rows.map((row) => ({
    model: need(row, "model", "category_breakdown.csv"),
    provider: need(row, "provider", "category_breakdown.csv"),
    category: need(row, "category", "category_breakdown.csv"),
    axis: need(row, "axis", "category_breakdown.csv"),
    items: num(need(row, "items", "category_breakdown.csv")) ?? 0,
    decided: num(need(row, "decided", "category_breakdown.csv")) ?? 0,
    fails: num(need(row, "fails", "category_breakdown.csv")) ?? 0,
    failRate: num(need(row, "fail_rate", "category_breakdown.csv")),
  }));
}

export const LEADERBOARD: LeaderboardRow[] = loadLeaderboard();
export const JUDGES: JudgeRow[] = loadJudges();
export const CATEGORY_BREAKDOWN: CategoryBreakdownRow[] = loadCategoryBreakdown();

export const HAS_RESULTS = LEADERBOARD.length > 0;

/** True once at least one row carries a real cost figure — some rows are blank on purpose. */
export const HAS_COST_DATA = LEADERBOARD.some((row) => row.estCostUsd1Pass !== null);

/** The judge every leaderboard row was marked by, taken from the rows themselves. */
export const WINNING_JUDGE: string = LEADERBOARD[0]?.judge ?? "";

/**
 * `model` × `category` -> fail rate, for the compare page. Keyed off
 * `LEADERBOARD`'s own `model` field so a row here always matches a row a
 * reader already sees on the homepage — including the 3 merged
 * cross-provider pairs, which `category_breakdown.csv` merges the same way
 * `leaderboard.csv` does (see harness/pipeline/build_outputs.py).
 */
export type KeyFindings = {
  modelCount: number;
  /** Fail rate = 1 − pass rate, over ranked rows only (coverage ≥ 0.80 — see methodology). */
  failRateSpread: { minPct: number; maxPct: number; minModel: string; maxModel: string } | null;
  winningJudge: { judge: string; macroF1: number; kappa: number } | null;
  /** Rank of the winning judge's own leaderboard row, when it is also a contestant. */
  selfGradedRank: number | null;
  /** Cheapest model, by est_cost_usd_1pass, among ranked rows in the top quartile by pass rate. */
  cheapestInTopQuartile: { model: string; costUsd: number; passRatePct: number } | null;
};

/**
 * One page's worth of headline numbers, computed once here rather than in
 * JSX, so the homepage's summary section and the reliability block on
 * `/methodology` read the same values. Every field is null, not a guess,
 * when the input it needs is missing — a summary that quietly drops a
 * number is worse than one that admits it has nothing to show.
 */
export function keyFindings(): KeyFindings {
  const ranked = LEADERBOARD.filter((r) => r.ranked && r.passRate !== null);

  let failRateSpread: KeyFindings["failRateSpread"] = null;
  if (ranked.length > 0) {
    const byFailRate = [...ranked].sort((a, b) => (a.passRate ?? 0) - (b.passRate ?? 0));
    const worst = byFailRate[0];
    const best = byFailRate[byFailRate.length - 1];
    failRateSpread = {
      minPct: (1 - (best.passRate ?? 0)) * 100,
      maxPct: (1 - (worst.passRate ?? 0)) * 100,
      minModel: best.model,
      maxModel: worst.model,
    };
  }

  const winnerJudgeRow = JUDGES.find((j) => j.judge === WINNING_JUDGE && !j.isBaseline);
  const winningJudge = winnerJudgeRow
    ? { judge: winnerJudgeRow.judge, macroF1: winnerJudgeRow.macroF1, kappa: winnerJudgeRow.kappa }
    : null;

  const selfGradedRow = LEADERBOARD.find((r) => r.selfGraded);
  const selfGradedRank = selfGradedRow?.rank ?? null;

  let cheapestInTopQuartile: KeyFindings["cheapestInTopQuartile"] = null;
  const rankedByPass = ranked.filter((r) => r.rank !== null).sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
  const quartileSize = Math.max(1, Math.ceil(rankedByPass.length / 4));
  const topQuartile = rankedByPass.slice(0, quartileSize).filter((r) => r.estCostUsd1Pass !== null);
  if (topQuartile.length > 0) {
    const cheapest = topQuartile.reduce((min, r) =>
      (r.estCostUsd1Pass ?? Infinity) < (min.estCostUsd1Pass ?? Infinity) ? r : min,
    );
    cheapestInTopQuartile = {
      model: cheapest.model,
      costUsd: cheapest.estCostUsd1Pass ?? 0,
      passRatePct: (cheapest.passRate ?? 0) * 100,
    };
  }

  return {
    modelCount: LEADERBOARD.length,
    failRateSpread,
    winningJudge,
    selfGradedRank,
    cheapestInTopQuartile,
  };
}

export function categoryMatrix(): Record<string, Record<string, number | null>> {
  const matrix: Record<string, Record<string, number | null>> = {};
  for (const row of CATEGORY_BREAKDOWN) {
    matrix[row.model] ??= {};
    matrix[row.model][row.category] = row.failRate;
  }
  return matrix;
}
