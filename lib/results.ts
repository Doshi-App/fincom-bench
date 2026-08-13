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

export const LEADERBOARD: LeaderboardRow[] = loadLeaderboard();
export const JUDGES: JudgeRow[] = loadJudges();

export const HAS_RESULTS = LEADERBOARD.length > 0;

/** The judge every leaderboard row was marked by, taken from the rows themselves. */
export const WINNING_JUDGE: string = LEADERBOARD[0]?.judge ?? "";
