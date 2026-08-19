import Link from "next/link";
import Image from "next/image";
import { LEADERBOARD, HAS_RESULTS, notableFindings } from "@/lib/results";
import { getCategory } from "@/lib/categories";
import { GithubCTA } from "./components/site-chrome";
import { StatTile, KpiRow } from "./components/stat-tile";
import { BarChart, type BarDatum } from "./components/bar-chart";
import { describeModel, iconForMaker } from "./components/model-names";

/** A small inline icon for stat tiles that don't have a model maker badge. */
function TileIcon({ kind }: { kind: "warn" | "check" }) {
  const color = kind === "warn" ? "var(--fail)" : "var(--pass)";
  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border"
      style={{ color }}
      aria-hidden
    >
      {kind === "warn" ? (
        <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
          <path d="M8 1L0 15h16L8 1zm0 5v5M8 12.5v.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
          <path d="M3 8.5l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

/**
 * The simple, whole-model view for the homepage: 1 number per model (failure
 * rate), not the 15-category breakdown — that detail lives on /leaderboard.
 * The actual top 10 by rank, in rank order (lowest failure rate first).
 */
function homepageOverview(): BarDatum[] {
  const shortlist = LEADERBOARD.filter((r) => r.ranked && r.rank !== null)
    .sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999))
    .slice(0, 10);
  return shortlist.map((r) => {
    const d = describeModel(r.model, r.provider);
    return {
      key: r.model,
      label: d.name,
      value: (r.failRate ?? 0) * 100,
      meta: r.rank ? `#${r.rank}` : undefined,
      icon: iconForMaker(d.maker),
    };
  });
}

const AXIS_PLAIN: Record<string, string> = {
  compliance: "getting the facts and rules right",
  behaviour: "treating people fairly, without rushing them",
};

export default function Home() {
  const findings = HAS_RESULTS ? notableFindings() : null;

  return (
    <div>
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-8 text-center">
        <p className="text-sm font-medium text-accent">A public, open benchmark</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl">
          Do AI models break financial rules?
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
          We tested 54 AI models against real financial rules.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <GithubCTA />
          <Link
            href="/methodology"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-fg hover:bg-surface-1 transition-standard"
          >
            How we grade a reply
          </Link>
        </div>
      </section>

      {HAS_RESULTS && (
        <section className="mx-auto max-w-4xl px-6 py-10">
          <h2 className="text-center text-2xl font-semibold tracking-tight">Lowest failure rates</h2>
          <p className="mt-2 text-center text-muted">Failure rate. Lower is better. The 10 lowest of 54 models.</p>
          <div className="mt-8 rounded-lg border border-border p-6">
            <BarChart data={homepageOverview()} tone="fail" max={100} formatValue={(v) => `${Math.round(v)}%`} />
          </div>
          <p className="mt-4 text-center text-sm">
            <Link href="/leaderboard" className="text-accent hover:underline">
              See all 54 models, broken down by failure category →
            </Link>
          </p>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-6 py-10">
        <h2 className="text-center text-2xl font-semibold tracking-tight">What we check</h2>
        <div className="mt-6 rounded-lg border border-border bg-surface-1 p-6">
          <p className="text-sm text-muted">An AI chat assistant gets asked a question, and answers:</p>
          <p className="mt-2 leading-relaxed text-fg">
            &ldquo;A stocks and shares ISA holding the FTSE All-World ETF is a great combination —
            open one today before rates change.&rdquo;
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            That reply breaks 2 rules at once: it recommends a specific investment, which only a
            licensed adviser may do, and it invents urgency. We check every reply against real rules
            like these.
          </p>
        </div>
        <p className="mt-4 text-center text-sm">
          <Link href="/methodology" className="text-accent hover:underline">
            Read exactly how a reply gets marked →
          </Link>
        </p>
      </section>

      {findings && (
        <section className="mx-auto max-w-7xl px-6 py-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">A few things we noticed</h2>
          <div className="mt-4">
            <KpiRow>
              {findings.hardestCategory &&
                (() => {
                  const c = getCategory(findings.hardestCategory.categoryId);
                  return (
                    <StatTile
                      label="What trips up every model"
                      value={`${Math.round(findings.hardestCategory.avgFailRatePct)}%`}
                      icon={<TileIcon kind="warn" />}
                      note={
                        <>
                          <strong className="text-fg">{c?.label ?? findings.hardestCategory.categoryId}:</strong> {c?.description}
                        </>
                      }
                    />
                  );
                })()}
              {findings.cleanestCategory &&
                (() => {
                  const c = getCategory(findings.cleanestCategory.categoryId);
                  return (
                    <StatTile
                      label="What every model gets right"
                      value={`${Math.round(100 - findings.cleanestCategory.avgFailRatePct)}%`}
                      icon={<TileIcon kind="check" />}
                      note={
                        <>
                          <strong className="text-fg">{c?.label ?? findings.cleanestCategory.categoryId}:</strong> {c?.description}
                        </>
                      }
                    />
                  );
                })()}
              {findings.biggestBlindSpot &&
                (() => {
                  const d = describeModel(findings.biggestBlindSpot.model, findings.biggestBlindSpot.provider);
                  const c = getCategory(findings.biggestBlindSpot.categoryId);
                  return (
                    <StatTile
                      label="Ranking well can still hide a weak spot"
                      value={`${Math.round(findings.biggestBlindSpot.failRatePct)}%`}
                      icon={<Image src={iconForMaker(d.maker)} alt="" width={32} height={32} className="h-8 w-8 rounded-full border border-border" />}
                      note={
                        <>
                          {d.maker} {d.name} ranks #{findings.biggestBlindSpot.rank} of 54, but keeps failing at{" "}
                          <strong className="text-fg">{c?.label ?? findings.biggestBlindSpot.categoryId}</strong>: {c?.description}
                        </>
                      }
                    />
                  );
                })()}
              {findings.biggestAxisGap &&
                (() => {
                  const d = describeModel(findings.biggestAxisGap.model, findings.biggestAxisGap.provider);
                  const better = findings.biggestAxisGap.worseAxis === "compliance" ? "behaviour" : "compliance";
                  return (
                    <StatTile
                      label="Being right isn't the same as being fair"
                      value={`${Math.round(findings.biggestAxisGap.gapPct)}%`}
                      icon={<Image src={iconForMaker(d.maker)} alt="" width={32} height={32} className="h-8 w-8 rounded-full border border-border" />}
                      note={`${d.maker} ${d.name} is far better at ${AXIS_PLAIN[better]} than at ${AXIS_PLAIN[findings.biggestAxisGap.worseAxis]}.`}
                    />
                  );
                })()}
            </KpiRow>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-lg border border-border bg-surface-1 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-semibold tracking-tight">Every rule, every dataset and every line of code is public.</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Run the tests yourself. Tell us if we got one wrong.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <GithubCTA />
            <Link
              href="/dataset"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-fg hover:bg-surface-2 transition-standard"
            >
              See the questions we asked
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
