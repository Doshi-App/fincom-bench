import Link from "next/link";
import { LEADERBOARD, JUDGES, HAS_RESULTS, WINNING_JUDGE } from "@/lib/results";
import { CATEGORIES } from "@/lib/categories";
import { PassMeter, ActionTag, GithubIcon, REPO_URL } from "@/lib/site";

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

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-fg hover:opacity-90"
          >
            <GithubIcon className="h-4 w-4" />
            View the repo on GitHub
          </a>
          <Link
            href="/methodology"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface"
          >
            Read the methodology
          </Link>
        </div>
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
          {HAS_RESULTS ? "Leaderboard" : "No benchmark leaderboard yet"}
        </h2>

        {!HAS_RESULTS ? (
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Scoring assistants is phase 2 of a run, and it happens only after a judge is chosen in
            phase 1. No run has published results yet.
          </p>
        ) : (
          <>
            <p className="mt-2 max-w-3xl text-sm text-muted">
              {LEADERBOARD.length} models, each sent the {LEADERBOARD[0]?.items} open probes and
              marked by <span className="font-mono text-xs">{WINNING_JUDGE}</span>, the judge that
              agreed most with the human labels in phase 1. Pass rate counts only the probes the
              judge decided; coverage says what share that was — below 100% means the judge left the
              rest of that model&apos;s probes undecided, not a software test-coverage number.
            </p>
            <p className="mt-3 max-w-3xl rounded border border-border bg-bg p-3 text-sm text-muted">
              <span className="font-medium text-fg">Read the gaps with care.</span> These are one
              judge&apos;s marks from a single run, with no repeat for variance. A model run
              through 2 inference providers (Bedrock and Ollama Cloud) is 1 row here, averaged — and
              the 2 runs it averages can land several points apart, wider than most gaps between
              neighbouring rows — so neighbouring places are not a quality ranking. See{" "}
              <Link href="/methodology" className="text-accent hover:underline">
                methodology
              </Link>{" "}
              for the full caveats.
            </p>

            <div className="scroll-x mt-6 max-h-[34rem] overflow-y-auto rounded-lg border border-border">
              <table className="w-full min-w-[52rem] border-collapse text-left">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-muted">
                    <th className="sticky top-0 z-10 border-b border-border bg-surface px-4 py-3 font-medium">#</th>
                    <th className="sticky top-0 z-10 border-b border-border bg-surface px-4 py-3 font-medium">
                      Model
                    </th>
                    <th className="sticky top-0 z-10 border-b border-border bg-surface px-4 py-3 font-medium">
                      Host
                    </th>
                    <th className="sticky top-0 z-10 border-b border-border bg-surface px-4 py-3 font-medium">
                      Pass rate
                    </th>
                    <th className="sticky top-0 z-10 border-b border-border bg-surface px-4 py-3 font-medium">
                      Pass / fail
                    </th>
                    <th className="sticky top-0 z-10 border-b border-border bg-surface px-4 py-3 font-medium">
                      Coverage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {LEADERBOARD.map((row) => {
                    const isTopTier = row.rank !== null && row.rank <= 3;
                    return (
                      <tr
                        key={`${row.provider}:${row.model}`}
                        className={`border-b border-border last:border-0 even:bg-surface/50 ${
                          isTopTier ? "border-l-2 border-l-accent" : ""
                        }`}
                      >
                        <td className="px-4 py-3.5 font-mono text-sm tabular-nums text-muted">
                          <span className={isTopTier ? "font-semibold text-accent" : ""}>{row.rank ?? "—"}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-sm">{row.model}</span>
                          {row.selfGraded && (
                            <span
                              className="ml-2 rounded border border-border bg-surface px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted"
                              title="This model is also the judge. Its own row is self-reported."
                            >
                              self-graded
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-sm text-muted">{row.provider}</td>
                        <td className="px-4 py-3.5">
                          {row.passRate === null ? (
                            <span className="text-sm text-muted">—</span>
                          ) : (
                            <PassMeter value={row.passRate * 100} />
                          )}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-sm tabular-nums text-muted">
                          {row.passes} / {row.fails}
                        </td>
                        <td
                          className={`px-4 py-3.5 font-mono text-sm tabular-nums ${row.coverage < 0.95 ? "text-fail" : "text-muted"}`}
                          title={row.coverage < 0.95 ? "Below 95% coverage — this rate rests on fewer decided probes than most rows." : undefined}
                        >
                          {(row.coverage * 100).toFixed(0)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-muted">
              Top 3 marked. Coverage below 95% is flagged — that rate rests on fewer decided probes
              than most rows.
            </p>
          </>
        )}

        {HAS_RESULTS && (
          <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-6">
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-fg hover:opacity-90"
            >
              Compare 2 models by category →
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface"
            >
              Browse the 15 categories →
            </Link>
          </div>
        )}
      </section>

      {JUDGES.length > 0 && (
        <section className="mt-16 rounded-lg border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold tracking-tight">Phase 1 — choosing the judge</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted">
            Every candidate marked the same hand-labelled rows, so the only thing that varied was
            the judge. Macro-F1 decides. The human labels are lopsided, so an always-fail baseline
            is scored alongside the candidates: it takes high accuracy and zero kappa, which is why
            accuracy is not the metric here.
          </p>
          <p className="mt-3 max-w-3xl rounded border border-border bg-bg p-3 text-sm text-muted">
            <span className="font-medium text-fg">The hand labels behind this table are not
            published.</span> They are not gitignored by mistake — a candidate judge must not read
            them before scoring — but that means an outside reader cannot independently reproduce
            or verify this choice of judge from this repository alone.
          </p>
          <div className="scroll-x mt-6 rounded-lg border border-border">
            <table className="w-full min-w-[46rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-surface text-xs uppercase tracking-wide text-muted">
                  <th className="px-4 py-3 font-medium">#</th>
                  <th className="px-4 py-3 font-medium">Candidate judge</th>
                  <th className="px-4 py-3 font-medium">Macro-F1</th>
                  <th className="px-4 py-3 font-medium">Cohen&apos;s κ</th>
                  <th className="px-4 py-3 font-medium">Balanced acc.</th>
                </tr>
              </thead>
              <tbody>
                {JUDGES.map((row) => (
                  <tr
                    key={row.judge}
                    className={`border-b border-border last:border-0 ${row.isBaseline ? "text-muted" : ""}`}
                  >
                    <td className="px-4 py-3.5 font-mono text-sm tabular-nums text-muted">
                      {row.isBaseline ? "—" : row.rank}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-sm">{row.judge}</td>
                    <td className="px-4 py-3.5 font-mono text-sm tabular-nums">
                      {row.macroF1.toFixed(4)}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-sm tabular-nums">
                      {row.kappa.toFixed(3)}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-sm tabular-nums">
                      {row.balancedAccuracy.toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

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
