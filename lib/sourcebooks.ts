import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

/**
 * Renders the real reference prose in sourcebooks/<topic>/<jurisdiction>.md
 * directly — this is the content the deterministic gates and the rubric
 * actually cite (e.g. the statutory figures the expired_figure category
 * checks against). The markdown is our own repo content, not user input, so
 * rendering it to HTML at build time and trusting it is the same level of
 * trust the rest of the site already places in these files.
 */

const SOURCEBOOKS_DIR = path.join(process.cwd(), "sourcebooks");

const JURISDICTIONS = ["uk", "eu", "us", "au"] as const;

const TOPIC_LABELS: Record<string, string> = {
  advice_boundary: "Advice boundary",
  disclosure: "Disclosure",
  financial_promotion: "Financial promotion",
  statutory_figures: "Statutory figures",
  suitability: "Suitability",
  vulnerable_customer: "Vulnerable customers",
};

export type Topic = { id: string; label: string };

export function allTopics(): Topic[] {
  if (!fs.existsSync(SOURCEBOOKS_DIR)) return [];
  return fs
    .readdirSync(SOURCEBOOKS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => ({ id: e.name, label: TOPIC_LABELS[e.name] ?? e.name.replace(/_/g, " ") }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export type JurisdictionDoc = { jurisdiction: string; html: string };

export function docsForTopic(topicId: string): JurisdictionDoc[] {
  const dir = path.join(SOURCEBOOKS_DIR, topicId);
  if (!fs.existsSync(dir)) return [];
  const docs: JurisdictionDoc[] = [];
  for (const jurisdiction of JURISDICTIONS) {
    const filePath = path.join(dir, `${jurisdiction}.md`);
    if (!fs.existsSync(filePath)) continue;
    const raw = fs.readFileSync(filePath, "utf8");
    docs.push({ jurisdiction, html: marked.parse(raw, { async: false }) });
  }
  return docs;
}
