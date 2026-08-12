import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

/**
 * Reads the real per-jurisdiction citations straight out of
 * rules/grading/*.md frontmatter, instead of hand-transcribing them into a
 * data file that can drift from the rule the benchmark actually grades
 * against. One file per category; a file can carry more than one rule per
 * jurisdiction (e.g. expired_figure lists several UK figures separately).
 */

const RULES_DIR = path.join(process.cwd(), "rules", "grading");

const RuleEntry = z.object({
  id: z.string().min(1),
  jurisdiction: z.enum(["uk", "eu", "us", "au"]),
  authority: z.object({
    source: z.string().min(1),
    // YAML parses an unquoted value like "8.28" as a number, not a string —
    // coerce rather than reject, since it's still a legitimate clause id.
    clause: z.coerce.string().min(1),
    url: z.string().min(1),
  }),
  /** Only recorded once per category, usually on the UK entry — the probe is the same chat message across jurisdictions. */
  probe: z.string().min(1).optional(),
});

const GradingFile = z.object({
  category: z.string().min(1),
  rules: z.array(RuleEntry).min(1),
});

export type RuleEntry = z.infer<typeof RuleEntry>;

function loadGradingFiles(): Map<string, RuleEntry[]> {
  const byCategory = new Map<string, RuleEntry[]>();
  if (!fs.existsSync(RULES_DIR)) return byCategory;
  const files = fs.readdirSync(RULES_DIR).filter((f) => f.endsWith(".md"));
  for (const file of files) {
    const raw = fs.readFileSync(path.join(RULES_DIR, file), "utf8");
    const { data } = matter(raw);
    const parsed = GradingFile.safeParse(data);
    if (!parsed.success) {
      throw new Error(
        `Invalid frontmatter in rules/grading/${file}:\n${JSON.stringify(parsed.error.issues, null, 2)}`,
      );
    }
    byCategory.set(parsed.data.category, parsed.data.rules);
  }
  return byCategory;
}

const RULES_BY_CATEGORY = loadGradingFiles();

export function rulesForCategory(categoryId: string): RuleEntry[] {
  return RULES_BY_CATEGORY.get(categoryId) ?? [];
}

const JURISDICTION_ORDER = ["uk", "eu", "us", "au"] as const;

export function jurisdictionsForCategory(categoryId: string): { jurisdiction: string; rules: RuleEntry[] }[] {
  const rules = rulesForCategory(categoryId);
  return JURISDICTION_ORDER.map((j) => ({ jurisdiction: j, rules: rules.filter((r) => r.jurisdiction === j) })).filter(
    (g) => g.rules.length > 0,
  );
}

export function allCategoryIdsWithRules(): string[] {
  return [...RULES_BY_CATEGORY.keys()];
}

/** The probe is one chat message tested across jurisdictions — recorded once per category, not per rule. */
export function probeForCategory(categoryId: string): string | undefined {
  return rulesForCategory(categoryId).find((r) => r.probe)?.probe;
}
