import { z } from "zod";

/**
 * A submission is a directory in submissions/, written by the harness
 * (harness/fincom_runner). The site reads run.json straight from that
 * directory — there is no hand-authored copy. This schema matches the real
 * shape already produced by the runner, not an idealised one.
 *
 * A run's `dataset` field decides its kind:
 *   - a path ending in "meta-eval.csv" -> a judge-selection run (Phase 1:
 *     a candidate judge model marks the meta-eval set).
 *   - anything else -> a benchmark run (Phase 2: an assistant under test is
 *     scored by the chosen judge). None of these exist yet.
 * The site must never present a judge-selection run as a leaderboard entry.
 */

export const CategoryResult = z.object({
  axis: z.enum(["compliance", "behaviour"]),
  items: z.number().int().nonnegative(),
  fails: z.number().int().nonnegative(),
  arguable: z.number().int().nonnegative(),
  ungraded: z.number().int().nonnegative(),
  errors: z.number().int().nonnegative(),
  /** "fail" if the category has any finding, "" if it is clean. */
  cell: z.string(),
});
export type CategoryResult = z.infer<typeof CategoryResult>;

export const LeaderboardEntry = z.object({
  assistant: z.string().min(1),
  threshold: z.string(),
  items: z.number().int().nonnegative(),
  graded: z.number().int().nonnegative(),
  fails: z.number().int().nonnegative(),
  passes: z.number().int().nonnegative(),
  arguable: z.number().int().nonnegative(),
  ungraded: z.number().int().nonnegative(),
  errors: z.number().int().nonnegative(),
  /** null when graded is 0 — a 0/0 rate, e.g. an early run nothing decided yet. */
  fail_rate: z.number().nullable(),
  decided_by_gate: z.number().int().nonnegative(),
  decided_by_judge: z.number().int().nonnegative(),
  categories: z.record(z.string(), CategoryResult),
});
export type LeaderboardEntry = z.infer<typeof LeaderboardEntry>;

export const Run = z.object({
  run_id: z.string().min(1),
  assistant: z.string().min(1),
  started_at: z.string().min(1),
  written_at: z.string().min(1).optional(),
  dataset: z.string().min(1),
  provider: z.string().min(1),
  judge: z.string().min(1),
  permissions: z.string(),
  rules_dir: z.string().optional(),
  items: z.number().int().nonnegative(),
  confirm_gate_fails: z.boolean().optional(),
  include_examples: z.boolean().optional(),
  leaderboard: z.array(LeaderboardEntry).min(1),
});
export type Run = z.infer<typeof Run>;

/** A single graded finding, read from a run's transcript.jsonl. */
export const Finding = z.object({
  finding_id: z.string(),
  assistant: z.string(),
  rule_id: z.string(),
  jurisdiction: z.string(),
  axis: z.enum(["compliance", "behaviour"]),
  category: z.string(),
  item: z.object({
    type: z.string(),
    item_id: z.string().optional(),
    probe: z.string(),
    reply: z.string(),
  }),
  authority: z
    .object({
      source: z.string().optional(),
      clause: z.string().optional(),
      url: z.string().optional(),
    })
    .optional(),
  permissions: z.string().optional(),
  threshold: z.string().optional(),
  institution_action: z.string().optional(),
  judge: z.object({
    verdict: z.enum(["pass", "fail", "arguable", "ungraded", "error"]),
    model: z.string().optional(),
    reasoning: z.string().optional(),
  }),
});
export type Finding = z.infer<typeof Finding>;

/** Whether a dataset path is the meta-eval set (Phase 1, judge selection). */
export function isJudgeSelectionDataset(dataset: string): boolean {
  return dataset.endsWith("meta-eval.csv");
}
