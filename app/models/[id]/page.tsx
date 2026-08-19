import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LEADERBOARD, CATEGORY_BREAKDOWN } from "@/lib/results";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { allAssistants, submissionsForAssistant, exemplarsFor } from "@/lib/submissions";
import { slugModel } from "../../components/model-slug";
import { describeModel, iconForMaker } from "../../components/model-names";
import { StatTile, KpiRow } from "../../components/stat-tile";
import { BarChart, type BarDatum } from "../../components/bar-chart";
import { VerdictPill } from "../../components/tags";
import { pct, fmtUsd } from "../../components/chart-color";

export function generateStaticParams() {
  return LEADERBOARD.map((r) => ({ id: slugModel(r.model) }));
}

export async function generateMetadata({ params }: PageProps<"/models/[id]">) {
  const { id } = await params;
  const row = LEADERBOARD.find((r) => slugModel(r.model) === id);
  if (!row) return { title: "Model" };
  const d = describeModel(row.model, row.provider);
  return { title: `${d.maker} ${d.name}` };
}

/**
 * Best-effort only: the leaderboard's `model` field can fold 2 inference
 * providers' runs into 1 averaged row (see results/README.md), and a raw
 * submission's `assistant` field is `provider:model`. Where they don't line
 * up 1:1, the exemplar section is simply omitted — an honest gap, not a
 * guess.
 */
function findAssistant(model: string): string | undefined {
  return allAssistants().find((a) => a === model || a.endsWith(`:${model}`) || a.split(":").pop() === model);
}

export default async function ModelPage({ params }: PageProps<"/models/[id]">) {
  const { id } = await params;
  const row = LEADERBOARD.find((r) => slugModel(r.model) === id);
  if (!row) notFound();

  const breakdown = CATEGORY_BREAKDOWN.filter((r) => r.model === row.model);
  const byCategory = new Map(breakdown.map((r) => [r.category, r]));
  const bars: BarDatum[] = CATEGORIES.map((c) => {
    const b = byCategory.get(c.id);
    return { key: c.id, label: c.label, value: b?.failRate !== undefined && b.failRate !== null ? b.failRate * 100 : 0, meta: b ? `${b.decided}/${b.items}` : undefined };
  });

  const assistant = findAssistant(row.model);
  const submissions = assistant ? submissionsForAssistant(assistant) : [];
  const exemplars = submissions.length > 0 ? submissions.flatMap((s) => exemplarsFor(s.dir, "product_recommendation", 1)) : [];
  const d = describeModel(row.model, row.provider);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <p className="text-sm text-muted">{row.rank ? `Rank #${row.rank} of ${LEADERBOARD.filter((r) => r.ranked).length}` : "Unranked"}</p>
      <div className="mt-2 flex items-center gap-3">
        <Image src={iconForMaker(d.maker)} alt="" width={40} height={40} className="h-10 w-10 rounded-full border border-border" />
        <div>
          <p className="text-sm font-medium text-muted">{d.maker}</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{d.name}</h1>
        </div>
      </div>
      <p className="mt-2 text-muted">
        via {d.host}
        {row.selfGraded && " · this model is also the judge that graded this leaderboard"}
      </p>
      <p className="mt-1 font-mono text-xs text-muted" title="The raw model id, for cross-referencing the CSVs and transcripts.">
        {row.model}
      </p>

      <div className="mt-8">
        <KpiRow>
          <StatTile label="Failure rate" value={pct(row.failRate)} note={`${row.fails} of ${row.decided} decided probes failed.`} />
          <StatTile label="Coverage" value={pct(row.coverage)} note="Share of probes the judge actually decided." />
          <StatTile label="Compliance / behaviour" value={`${pct(row.compliancePassRate)} / ${pct(row.behaviourPassRate)}`} />
          <StatTile
            label="Cost per pass"
            value={fmtUsd(row.estCostUsd1Pass)}
            note={row.avgReplyTokens ? `${row.avgReplyTokens} avg reply tokens, ${row.avgTimeS1Pass ?? "—"}s.` : undefined}
          />
        </KpiRow>
      </div>

      <div className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight">Failure rate by category</h2>
        <p className="mt-1 text-sm text-muted">Lower is better. The count beside each bar is decided/total probes for that category.</p>
        <div className="mt-5 rounded-lg border border-border p-5">
          <BarChart data={bars} tone="fail" max={100} formatValue={(v) => `${Math.round(v)}%`} />
        </div>
      </div>

      {exemplars.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-semibold tracking-tight">Example finding</h2>
          {exemplars.map((f) => (
            <div key={f.finding_id} className="mt-4 rounded-lg border border-border p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-fg">{getCategory(f.category)?.label ?? f.category}</p>
                <VerdictPill verdict={f.judge.verdict} />
              </div>
              <p className="mt-3 text-sm text-muted">Probe</p>
              <p className="mt-1 text-sm text-fg">{f.item.probe}</p>
              <p className="mt-3 text-sm text-muted">Reply</p>
              <p className="mt-1 text-sm text-fg">{f.item.reply}</p>
              {f.judge.reasoning && (
                <>
                  <p className="mt-3 text-sm text-muted">Judge reasoning</p>
                  <p className="mt-1 text-sm text-fg">{f.judge.reasoning}</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="mt-12 text-sm">
        <Link href="/leaderboard" className="text-accent hover:underline">
          ← Back to the leaderboard
        </Link>
      </p>
    </div>
  );
}
