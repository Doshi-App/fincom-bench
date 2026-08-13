import type { Metadata } from "next";
import Link from "next/link";
import { META_EVAL, BENCHMARK_OPEN, BENCHMARK_HOLDOUT, type DatasetInfo } from "@/lib/datasets";
import { getCategory } from "@/lib/categories";

export const metadata: Metadata = { title: "Dataset" };

const JURISDICTION_NAMES: Record<string, string> = {
  uk: "United Kingdom",
  eu: "European Union",
  us: "United States",
  au: "Australia",
};

function BreakdownTable({ counts, labelFor }: { counts: Record<string, number>; labelFor?: (key: string) => string }) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return (
    <table className="w-full min-w-[26rem] border-collapse text-left">
      <tbody>
        {entries.map(([key, n]) => (
          <tr key={key} className="border-b border-border last:border-0">
            <td className="px-4 py-2 text-sm">{labelFor ? labelFor(key) : key}</td>
            <td className="px-4 py-2">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-24 overflow-hidden rounded-full bg-border" aria-hidden>
                  <span
                    className="block h-full rounded-full bg-accent"
                    style={{ width: `${total > 0 ? (n / total) * 100 : 0}%` }}
                  />
                </span>
                <span className="font-mono text-xs tabular-nums text-muted">{n}</span>
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DatasetSection({ title, description, info }: { title: string; description: string; info: DatasetInfo }) {
  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <code className="rounded border border-border bg-surface px-1.5 py-0.5 text-xs">datasets/{info.file}</code>
      </div>
      <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>
      <p className="mt-3 text-sm">
        <span className="font-mono text-lg tabular-nums">{info.rows}</span>{" "}
        <span className="text-muted">rows · {info.columns.length} columns</span>
      </p>
      {info.shortRows > 0 && (
        <p className="mt-2 text-sm text-critical">
          {info.shortRows} of {info.rows} rows have fewer fields than the header declares — the
          header was updated without regenerating the row data. jurisdiction and category are still
          positionally correct, so the counts below are not affected, but later columns may not line
          up with their header name for these rows.
        </p>
      )}

      <div className="mt-5 grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted">By jurisdiction</h3>
          <div className="mt-2 scroll-x rounded-lg border border-border">
            <BreakdownTable counts={info.byJurisdiction} labelFor={(k) => JURISDICTION_NAMES[k] ?? k} />
          </div>
        </div>
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted">By category</h3>
          <div className="mt-2 scroll-x rounded-lg border border-border">
            <BreakdownTable counts={info.byCategory} labelFor={(k) => getCategory(k)?.label ?? k} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DatasetPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Dataset</h1>
      <p className="mt-4 max-w-2xl text-muted">
        One set of 274 probes, applied in two phases. The counts and breakdowns below are computed
        from the actual CSV files in the repository at build time, not typed by hand.
      </p>

      <DatasetSection
        title="Phase 1 — meta-eval (choose the judge)"
        description="274 probes, each with a pre-written reply. Two human labellers (the two human labellers) mark each reply pass or fail; 12 candidate judge models mark the same rows with no sight of the human labels. The model that agrees most with the humans becomes the judge. The human labels are never published."
        info={META_EVAL}
      />

      <DatasetSection
        title="Phase 2 — benchmark, open split"
        description="The primary evaluation set. Anyone may run a submission on these probes. Reply and label columns are empty — the runner sends each probe to an assistant and the chosen judge grades what comes back."
        info={BENCHMARK_OPEN}
      />

      <DatasetSection
        title="Phase 2 — benchmark, holdout split"
        description="Reserved as the seed of a future gated split; reported separately per submission. Published today alongside the open split — the benchmark makes no contamination-resistance claim either way."
        info={BENCHMARK_HOLDOUT}
      />

      <p className="mt-10 text-sm text-muted">
        See <Link href="/methodology" className="text-accent hover:underline">methodology</Link> for how
        a phase-1 run picks the judge, and how phase 2 scores an assistant against it.
      </p>
    </div>
  );
}
