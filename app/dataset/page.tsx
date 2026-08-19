import { META_EVAL, BENCHMARK_OPEN, BENCHMARK_HOLDOUT, type DatasetInfo } from "@/lib/datasets";
import { CATEGORIES } from "@/lib/categories";
import { StatTile, KpiRow } from "../components/stat-tile";
import { BarChart, type BarDatum } from "../components/bar-chart";
import { REPO_URL } from "../components/site-chrome";

const JURISDICTION_LABEL: Record<string, string> = { uk: "United Kingdom", eu: "European Union", us: "United States", au: "Australia" };

function jurisdictionBars(info: DatasetInfo): BarDatum[] {
  return Object.entries(info.byJurisdiction)
    .sort((a, b) => b[1] - a[1])
    .map(([j, n]) => ({ key: j, label: JURISDICTION_LABEL[j] ?? j, value: n }));
}

function categoryBars(info: DatasetInfo): BarDatum[] {
  const order = new Map(CATEGORIES.map((c, i) => [c.id, i]));
  return Object.entries(info.byCategory)
    .sort((a, b) => (order.get(a[0]) ?? 99) - (order.get(b[0]) ?? 99))
    .map(([id, n]) => ({ key: id, label: CATEGORIES.find((c) => c.id === id)?.label ?? id, value: n }));
}

function DatasetSection({ title, file, purpose, info }: { title: string; file: string; purpose: string; info: DatasetInfo }) {
  return (
    <div className="rounded-lg border border-border p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <a href={`${REPO_URL}/blob/main/datasets/${file}`} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-accent hover:underline">
          {file}
        </a>
      </div>
      <p className="mt-1.5 text-sm text-muted">{purpose}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{info.rows} rows</p>
      <div className="mt-5 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">By jurisdiction</p>
          <div className="mt-3">
            <BarChart data={jurisdictionBars(info)} tone="accent" />
          </div>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">By category</p>
          <div className="mt-3">
            <BarChart data={categoryBars(info)} tone="accent" />
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = { title: "Dataset" };

export default function DatasetPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">The dataset</h1>
      <p className="mt-4 max-w-2xl text-muted">
        1 set of 274 probes, applied in 2 phases. Phase 1 picks the judge on the meta-eval set,
        where every reply already exists. Phase 2 reuses the same probes with the reply column
        removed, sends each one to every assistant under test, and scores what comes back.
      </p>

      <div className="mt-8">
        <KpiRow>
          <StatTile label="Meta-eval set" value={META_EVAL.rows} note="Judge selection only — never scores an assistant." />
          <StatTile label="Benchmark, open" value={BENCHMARK_OPEN.rows} note="Anyone may run a submission on these probes." />
          <StatTile label="Benchmark, holdout" value={BENCHMARK_HOLDOUT.rows} note="Seed of a future gated split." />
          <StatTile label="Open / holdout split" value="70 / 30" note="Stratified by category — both halves cover all 15." />
        </KpiRow>
      </div>

      <div className="mt-10 space-y-6">
        <DatasetSection
          title="Meta-eval set"
          file="meta-eval.csv"
          purpose="Picks the judge. Human labellers and 5 candidate judge models mark the same pre-written replies; whichever model agrees most becomes the judge for phase 2."
          info={META_EVAL}
        />
        <DatasetSection
          title="Benchmark, open"
          file="benchmark-open.csv"
          purpose="The primary evaluation set. The reply column is empty — each assistant under test writes its own."
          info={BENCHMARK_OPEN}
        />
        <DatasetSection
          title="Benchmark, holdout"
          file="benchmark-holdout.csv"
          purpose="Reserved as the seed of a future gated split. Reported separately per submission, not folded into the open-set leaderboard."
          info={BENCHMARK_HOLDOUT}
        />
      </div>

      <div className="mt-10 rounded-lg border border-border bg-surface-1 p-5 text-sm text-muted">
        <p className="font-medium text-fg">No contamination-resistance claim.</p>
        <p className="mt-1.5 leading-relaxed">
          Both benchmark files are published, so a model may have seen these probes or text like
          them. The open/holdout split is kept so a future gated split can reuse it, and so a
          submission can report the 2 halves separately — it is not a claim that today&apos;s
          numbers are contamination-free.
        </p>
      </div>
    </div>
  );
}
