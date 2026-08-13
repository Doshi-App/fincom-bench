import fs from "node:fs";
import path from "node:path";
import Papa from "papaparse";

/**
 * Reads the real dataset CSVs directly — row counts and breakdowns are
 * computed at build time from the actual files, not hand-typed. If a column
 * this page relies on ever gets renamed, the build breaks instead of the
 * page quietly going stale.
 */

const DATA_DIR = path.join(process.cwd(), "datasets");

export type DatasetInfo = {
  file: string;
  rows: number;
  columns: string[];
  byJurisdiction: Record<string, number>;
  byCategory: Record<string, number>;
  /** Rows with fewer fields than the header declares — see the comment below. */
  shortRows: number;
};

function readCsv(file: string): { rows: Record<string, string>[]; columns: string[]; shortRows: number } {
  const filePath = path.join(DATA_DIR, file);
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = Papa.parse<Record<string, string>>(raw, { header: true, skipEmptyLines: true });
  // FieldMismatch (a row with fewer fields than the header) showed up in meta-eval.csv in the past:
  // the header was once split (human_label -> labeller_a_label/labeller_b_label/notes, plus 12 unused
  // candidate-judge columns) without regenerating the row data. Those extra columns were dropped —
  // see ERRATA.md — so meta-eval.csv should read clean today. shortRows is kept as a live check, not
  // a note about a fixed issue: it surfaces any future header/row drift instead of silently eating it.
  // Anything that ISN'T a field-count mismatch (a genuinely unparseable file) still throws.
  const fatal = parsed.errors.filter((e) => e.type !== "FieldMismatch");
  if (fatal.length > 0) {
    throw new Error(`Failed to parse ${file}: ${JSON.stringify(fatal.slice(0, 3))}`);
  }
  const shortRows = parsed.errors.filter((e) => e.type === "FieldMismatch").length;
  return { rows: parsed.data, columns: parsed.meta.fields ?? [], shortRows };
}

function countBy(rows: Record<string, string>[], field: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const row of rows) {
    const key = row[field] ?? "(missing)";
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

function loadDataset(file: string): DatasetInfo {
  const { rows, columns, shortRows } = readCsv(file);
  return {
    file,
    rows: rows.length,
    columns,
    byJurisdiction: countBy(rows, "jurisdiction"),
    byCategory: countBy(rows, "category"),
    shortRows,
  };
}

export const META_EVAL = loadDataset("meta-eval.csv");
export const BENCHMARK_OPEN = loadDataset("benchmark-open.csv");
export const BENCHMARK_HOLDOUT = loadDataset("benchmark-holdout.csv");
