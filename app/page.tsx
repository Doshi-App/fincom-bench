import Link from "next/link";
import { JUDGE_SELECTION_RUNS, HAS_LEADERBOARD_DATA } from "@/lib/submissions";
import { CATEGORIES } from "@/data/categories";
import { FailMeter, ActionTag } from "@/components/site";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <section className="max-w-3xl">
        <p className="text-sm font-medium text-accent">4 jurisdictions · 2 axes · 15 categories</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Does your AI assistant break the rules when it talks about money?
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          FinCom Bench sends probes to an AI assistant and grades the replies against real conduct
          rules from the United Kingdom, the European Union, the United States and Australia. Every
          finding cites the clause it breaks.
        </p>
      </section>

      <section className="mt-14 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-5">
          <h2 className="font-semibold tracking-tight">Compliance</h2>
          <p className="mt-2 text-sm text-muted">
            Did the content break a named rule? 7 categories, scored on all 4 jurisdictions.
          </p>
        </div>
        <div className="rounded-lg border border-border p-5">
          <h2 className="font-semibold tracking-tight">Behaviour</h2>
          <p className="mt-2 text-sm text-muted">
            Did the assistant use a manipulative or helpful technique? 8 categories, scored on all 4
            jurisdictions — UK cited to PRIN 2A, EU to AI Act / DSA, US to FTC Act / CFPB, AU to ASIC.
          </p>
        </div>
      </section>

      <section className="mt-16 rounded-lg border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold tracking-tight">
          {HAS_LEADERBOARD_DATA ? "Leaderboard" : "No benchmark leaderboard yet"}
        </h2>
        {!HAS_LEADERBOARD_DATA && (
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Scoring assistants (GPT, Grok, Claude, Doshi FCP, and a regulated bank assistant) is
            phase 2 of a run, and it happens only after a judge is chosen in phase 1. That choice
            has not been made yet, so there is no leaderboard to show. What has run so far is judge
            selection: a candidate judge model marks the meta-eval set, and the model that agrees
            most with the human labels becomes the judge.
          </p>
        )}

        {JUDGE_SELECTION_RUNS.length > 0 ? (
          <div className="scroll-x mt-6 rounded-lg border border-border">
            <table className="w-full min-w-[46rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-surface text-xs uppercase tracking-wide text-muted">
                  <th className="px-4 py-3 font-medium">Candidate judge</th>
                  <th className="px-4 py-3 font-medium">Fail rate on meta-eval</th>
                  <th className="px-4 py-3 font-medium">Graded / items</th>
                  <th className="px-4 py-3 font-medium">Run</th>
                </tr>
              </thead>
              <tbody>
                {JUDGE_SELECTION_RUNS.map(({ dir, run }) => {
                  const entry = run.leaderboard[0];
                  return (
                    <tr key={dir} className="border-b border-border last:border-0">
                      <td className="px-4 py-3.5">
                        <Link href={`/models/${encodeURIComponent(run.assistant)}`} className="font-medium hover:underline">
                          {run.assistant}
                        </Link>
                      </td>
                      <td className="px-4 py-3.5">
                        {entry.fail_rate === null ? (
                          <span className="text-sm text-muted">— (nothing graded yet)</span>
                        ) : (
                          <FailMeter value={entry.fail_rate * 100} />
                        )}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-sm tabular-nums text-muted">
                        {entry.graded} / {entry.items}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs text-muted">{dir}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">No submissions have run yet.</p>
        )}
        <p className="mt-3 max-w-2xl text-sm text-muted">
          This is not a leaderboard. It is a record of who has been tried as the judge, and how
          often their labels found a finding on a dataset written to contain them. No assistant
          grades its own leaderboard row — the winner here goes on to grade every assistant in
          phase 2.
        </p>
      </section>

      <section className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight">The 15 finding categories</h2>
          <Link href="/categories" className="text-sm text-accent hover:underline">
            Full detail on each →
          </Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/categories/${c.id}`}
              className="flex items-baseline gap-3 rounded-lg border border-border p-4 transition-colors hover:border-accent"
            >
              <span className="shrink-0 rounded border border-border bg-surface px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted">
                {c.axis}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium">{c.label}</span>
                <span className="mt-0.5 block text-xs text-muted">{c.description}</span>
              </span>
              <span className="ml-auto shrink-0">
                <ActionTag action={c.institutionAction} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
