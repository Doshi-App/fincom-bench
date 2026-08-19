import { notFound } from "next/navigation";
import Link from "next/link";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { jurisdictionsForCategory, probeForCategory } from "@/lib/rules";
import { CATEGORY_BREAKDOWN } from "@/lib/results";
import { submissionsCoveringCategory, exemplarsFor } from "@/lib/submissions";
import { ActionTag, AxisTag, VerdictPill } from "../../components/tags";
import { BarChart, type BarDatum } from "../../components/bar-chart";
import { slugModel } from "../../components/model-slug";
import { describeModel, describeWithHostPrefix } from "../../components/model-names";

const JURISDICTION_LABEL: Record<string, string> = { uk: "United Kingdom", eu: "European Union", us: "United States", au: "Australia" };

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/categories/[id]">) {
  const { id } = await params;
  return { title: getCategory(id)?.label ?? "Category" };
}

export default async function CategoryPage({ params }: PageProps<"/categories/[id]">) {
  const { id } = await params;
  const category = getCategory(id);
  if (!category) notFound();

  const jurisdictions = jurisdictionsForCategory(id);
  const probe = probeForCategory(id);

  const worst: BarDatum[] = CATEGORY_BREAKDOWN.filter((r) => r.category === id && r.failRate !== null)
    .sort((a, b) => (b.failRate ?? 0) - (a.failRate ?? 0))
    .slice(0, 10)
    .map((r) => {
      const d = describeModel(r.model, r.provider);
      return { key: r.model, label: `${d.maker} ${d.name}`, value: (r.failRate ?? 0) * 100, meta: `${r.decided}/${r.items}` };
    });

  // Judge-selection runs grade "hand-written-replies", not a real assistant
  // (see lib/submissions.ts) — exclude them so an exemplar always names a
  // real benchmarked model.
  const submissions = submissionsCoveringCategory(id)
    .filter((s) => !s.isJudgeSelection)
    .slice(0, 1);
  const exemplars = submissions.flatMap((s) => exemplarsFor(s.dir, id, 2));

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <div className="flex flex-wrap items-center gap-2">
        <AxisTag axis={category.axis} />
        <ActionTag action={category.institutionAction} />
      </div>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{category.label}</h1>
      <p className="mt-4 max-w-2xl text-muted">{category.description}</p>

      {probe && (
        <div className="mt-6 rounded-lg border border-border bg-surface-1 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Example probe</p>
          <p className="mt-1.5 font-mono text-sm text-fg">&ldquo;{probe}&rdquo;</p>
        </div>
      )}

      {jurisdictions.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold tracking-tight">Cited per jurisdiction</h2>
          <div className="mt-4 space-y-3">
            {jurisdictions.map((g) => (
              <div key={g.jurisdiction} className="rounded-lg border border-border p-4">
                <p className="text-sm font-semibold text-fg">{JURISDICTION_LABEL[g.jurisdiction] ?? g.jurisdiction}</p>
                <ul className="mt-2 space-y-1.5">
                  {g.rules.map((r) => (
                    <li key={r.id} className="text-sm text-muted">
                      <a href={r.authority.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                        {r.authority.source} {r.authority.clause}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {worst.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold tracking-tight">Worst 10 models on this category</h2>
          <div className="mt-4 rounded-lg border border-border p-5">
            <BarChart data={worst} tone="fail" max={100} formatValue={(v) => `${Math.round(v)}%`} />
          </div>
        </div>
      )}

      {exemplars.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold tracking-tight">Exemplar findings</h2>
          <div className="mt-4 space-y-4">
            {exemplars.map((f) => {
              const d = describeWithHostPrefix(f.assistant);
              return (
              <div key={f.finding_id} className="rounded-lg border border-border p-5">
                <div className="flex items-center justify-between gap-3">
                  <Link href={`/models/${slugModel(f.assistant.split(":").pop() ?? f.assistant)}`} className="text-sm text-fg hover:text-accent">
                    <span className="text-muted">{d.maker}</span> <span className="font-medium">{d.name}</span>
                  </Link>
                  <VerdictPill verdict={f.judge.verdict} />
                </div>
                <p className="mt-3 text-sm text-muted">Probe</p>
                <p className="mt-1 text-sm text-fg">{f.item.probe}</p>
                <p className="mt-3 text-sm text-muted">Reply</p>
                <p className="mt-1 text-sm text-fg">{f.item.reply}</p>
              </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="mt-12 text-sm">
        <Link href="/categories" className="text-accent hover:underline">
          ← All categories
        </Link>
      </p>
    </div>
  );
}
