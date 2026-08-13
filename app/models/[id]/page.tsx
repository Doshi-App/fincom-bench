import Link from "next/link";
import { notFound } from "next/navigation";
import { allAssistants, submissionsForAssistant } from "@/lib/submissions";
import { getCategory } from "@/lib/categories";
import { FailMeter, ActionTag } from "@/lib/site";

export function generateStaticParams() {
  return allAssistants().map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<"/models/[id]">) {
  const { id } = await params;
  return { title: decodeURIComponent(id) };
}

export default async function ModelPage({ params }: PageProps<"/models/[id]">) {
  const { id } = await params;
  const assistant = decodeURIComponent(id);
  const submissions = submissionsForAssistant(assistant);
  if (submissions.length === 0) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">{assistant}</h1>

      <div className="mt-12 space-y-10">
        {submissions.map(({ dir, run, isJudgeSelection }) => (
          <section key={dir}>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-lg font-semibold tracking-tight">
                {isJudgeSelection ? "Judge-selection run" : "Benchmark run"}
              </h2>
              <p className="font-mono text-xs text-muted">
                {run.started_at} · dataset {run.dataset.split("/").pop()} · judge {run.judge}
              </p>
            </div>
            {isJudgeSelection && (
              <p className="mt-2 max-w-2xl text-sm text-muted">
                This run scores {assistant} as a candidate <em>judge</em> marking the meta-eval set,
                not as an assistant under test. It is not a leaderboard entry.
              </p>
            )}

            {run.leaderboard.map((entry, i) => (
              <div key={i} className="mt-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs uppercase tracking-wide text-muted">Fail rate</p>
                    <p className="mt-2 font-mono text-2xl tabular-nums">
                      {entry.fail_rate === null ? "—" : `${(entry.fail_rate * 100).toFixed(1)}%`}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs uppercase tracking-wide text-muted">Threshold</p>
                    <p className="mt-2 text-sm">{entry.threshold}</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-xs uppercase tracking-wide text-muted">Items</p>
                    <p className="mt-2 font-mono text-2xl tabular-nums">
                      {entry.graded} / {entry.items}
                    </p>
                  </div>
                </div>

                <div className="scroll-x mt-5 rounded-lg border border-border">
                  <table className="w-full min-w-[38rem] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-border bg-surface text-xs uppercase tracking-wide text-muted">
                        <th className="px-4 py-3 font-medium">Category</th>
                        <th className="px-4 py-3 font-medium">Axis</th>
                        <th className="px-4 py-3 font-medium">Fail rate</th>
                        <th className="px-4 py-3 font-medium">Items</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(entry.categories).map(([categoryId, c]) => {
                        const category = getCategory(categoryId);
                        const rate = c.items > 0 ? Math.round((c.fails / c.items) * 1000) / 10 : 0;
                        return (
                          <tr key={categoryId} className="border-b border-border last:border-0">
                            <td className="px-4 py-3.5">
                              <Link href={`/categories/${categoryId}`} className="font-medium hover:underline">
                                {category?.label ?? categoryId}
                              </Link>
                              {category && (
                                <span className="ml-2 inline-block align-middle">
                                  <ActionTag action={category.institutionAction} />
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3.5 text-sm text-muted">{c.axis}</td>
                            <td className="px-4 py-3.5">
                              <FailMeter value={rate} />
                            </td>
                            <td className="px-4 py-3.5 font-mono text-sm tabular-nums text-muted">{c.items}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
