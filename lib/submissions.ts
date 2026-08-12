import fs from "node:fs";
import path from "node:path";
import { Run, Finding, isJudgeSelectionDataset } from "./run-schema";

const SUBMISSIONS_DIR = path.join(process.cwd(), "submissions");

export type Submission = {
  dir: string;
  run: Run;
  isJudgeSelection: boolean;
};

/**
 * Reads every submissions/<run-id>/run.json directly — the harness writes
 * this file, the site never duplicates it. submissions/ is gitignored today,
 * so a fresh checkout (including Vercel's) may have none; that renders as an
 * honest "no runs yet" state rather than a build failure. A run.json that
 * *does* exist but fails to parse still throws — a submission the harness
 * wrote badly should not render silently as if it were fine.
 */
function loadSubmissions(): Submission[] {
  if (!fs.existsSync(SUBMISSIONS_DIR)) return [];
  const entries = fs.readdirSync(SUBMISSIONS_DIR, { withFileTypes: true });
  const submissions: Submission[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue; // skips stray files like the meta-eval results aggregate
    const dir = path.join(SUBMISSIONS_DIR, entry.name);
    const runPath = path.join(dir, "run.json");
    if (!fs.existsSync(runPath)) continue; // not a run directory
    const raw = JSON.parse(fs.readFileSync(runPath, "utf8"));
    const parsed = Run.safeParse(raw);
    if (!parsed.success) {
      throw new Error(
        `Invalid run file submissions/${entry.name}/run.json:\n${JSON.stringify(parsed.error.issues, null, 2)}`,
      );
    }
    submissions.push({
      dir: entry.name,
      run: parsed.data,
      isJudgeSelection: isJudgeSelectionDataset(parsed.data.dataset),
    });
  }
  return submissions.sort((a, b) => a.run.started_at.localeCompare(b.run.started_at));
}

export const SUBMISSIONS: Submission[] = loadSubmissions();

/** Phase 1: a candidate judge model marks the meta-eval set. */
export const JUDGE_SELECTION_RUNS = SUBMISSIONS.filter((s) => s.isJudgeSelection);

/** Phase 2: the chosen judge scores an assistant under test. None exist yet. */
export const LEADERBOARD_RUNS = SUBMISSIONS.filter((s) => !s.isJudgeSelection);

export const HAS_LEADERBOARD_DATA = LEADERBOARD_RUNS.length > 0;

export function allAssistants(): string[] {
  const seen = new Set<string>();
  for (const s of SUBMISSIONS) seen.add(s.run.assistant);
  return [...seen.values()];
}

export function submissionsForAssistant(assistant: string): Submission[] {
  return SUBMISSIONS.filter((s) => s.run.assistant === assistant);
}

/**
 * Fail rate for one category across a run's leaderboard entries (a run may
 * carry more than one leaderboard row, e.g. one per threshold tested).
 */
export function categoryTotals(run: Run, categoryId: string) {
  let items = 0;
  let fails = 0;
  for (const entry of run.leaderboard) {
    const c = entry.categories[categoryId];
    if (!c) continue;
    items += c.items;
    fails += c.fails;
  }
  return { items, fails };
}

export function submissionsCoveringCategory(categoryId: string): Submission[] {
  return SUBMISSIONS.filter((s) => categoryTotals(s.run, categoryId).items > 0);
}

/**
 * Reads real findings straight from a run's transcript.jsonl — there is no
 * hand-written exemplar list. Returns at most `limit` findings for the given
 * category, preferring fails so the examples shown are the ones a reader
 * would actually want to audit.
 */
export function exemplarsFor(dir: string, categoryId: string, limit = 3): Finding[] {
  const transcriptPath = path.join(SUBMISSIONS_DIR, dir, "transcript.jsonl");
  if (!fs.existsSync(transcriptPath)) return [];
  const lines = fs.readFileSync(transcriptPath, "utf8").split("\n").filter(Boolean);
  const matches: Finding[] = [];
  for (const line of lines) {
    let raw: unknown;
    try {
      raw = JSON.parse(line);
    } catch {
      continue; // a stray blank/malformed line in the transcript is not fatal to the page
    }
    const parsed = Finding.safeParse(raw);
    if (!parsed.success) continue;
    if (parsed.data.category !== categoryId) continue;
    matches.push(parsed.data);
  }
  matches.sort((a, b) => (a.judge.verdict === "fail" ? -1 : 1) - (b.judge.verdict === "fail" ? -1 : 1));
  return matches.slice(0, limit);
}
