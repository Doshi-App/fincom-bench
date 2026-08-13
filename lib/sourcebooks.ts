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

// Each sourcebook file ends with a "Machine-readable data below" section: a
// fenced YAML block that harness/fincom_runner/figures.py reads, kept for
// reference and possible future use. No code parses it on the website today.
// Cut it before render so the page shows the human prose, not a raw YAML dump.
function stripMachineReadableBlock(raw: string): string {
  const markerIndex = raw.indexOf("Machine-readable data below");
  if (markerIndex === -1) return raw;
  const prose = raw.slice(0, markerIndex);
  return prose.replace(/\n-{3,}\s*$/, "\n");
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
    const prose = stripMachineReadableBlock(raw);
    docs.push({ jurisdiction, html: marked.parse(prose, { async: false }) });
  }
  return docs;
}
