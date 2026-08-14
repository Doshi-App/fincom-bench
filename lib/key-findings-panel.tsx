import Link from "next/link";
import { keyFindings, WINNING_JUDGE } from "@/lib/results";

/**
 * The stat-first summary a skimming reader hits before any table: what this
 * run found, in 4-5 rows, each 1 number and 1 sentence saying what it means.
 * Placed right after the hero and before the leaderboard, on the theory that
 * a reader should get the finding before the method — the same reason the
 * Steward KYC whitepaper puts its "what the study found" page ahead of its
 * appendix. Every number here already exists on the page somewhere else;
 * this section repeats none of the caveats and adds no new claim, it just
 * puts the headline numbers in one place instead of leaving a reader to
 * assemble them from 2 separate tables.
 */
export function KeyFindingsPanel() {
  const findings = keyFindings();

  const rows: { stat: string; label: string; note: string }[] = [];

  rows.push({
    stat: String(findings.modelCount),
    label: "models scored",
    note: `Every model answered the same open probes, marked by ${WINNING_JUDGE || "the phase-1 judge"}.`,
  });

  if (findings.failRateSpread) {
    const { minPct, maxPct, minModel, maxModel } = findings.failRateSpread;
    rows.push({
      stat: `${minPct.toFixed(1)}–${maxPct.toFixed(1)}%`,
      label: "fail-rate spread",
      note: `${minModel} fails least on this run's judge, ${maxModel} fails most. One judge, one pass — see the caveats below before reading adjacent rows as a ranking.`,
    });
  }

  if (findings.winningJudge) {
    rows.push({
      stat: `κ ${findings.winningJudge.kappa.toFixed(2)}`,
      label: "judge agreement with human labels",
      note: `Macro-F1 ${findings.winningJudge.macroF1.toFixed(3)} won phase 1. Substantial agreement, not near-perfect — every number above inherits it.`,
    });
  }

  if (findings.selfGradedRank !== null) {
    rows.push({
      stat: `#${findings.selfGradedRank} of ${findings.modelCount}`,
      label: "where the judge's own model landed",
      note: "The winning judge is also a ranked contestant. Mid-table, not top — at least not the shape self-preference would take.",
    });
  }

  if (findings.cheapestInTopQuartile) {
    const { model, costUsd, passRatePct } = findings.cheapestInTopQuartile;
    rows.push({
      stat: `$${costUsd < 0.01 ? costUsd.toFixed(3) : costUsd.toFixed(2)}`,
      label: "cheapest model in the top quartile",
      note: `${model} passed ${passRatePct.toFixed(1)}% of decided probes at that price per review. See the chart below before assuming price and pass rate move together.`,
    });
  }

  if (rows.length === 0) return null;

  return (
    <section className="mt-14 rounded-lg border border-border bg-surface p-6">
      <h2 className="text-lg font-semibold tracking-tight">What this run found</h2>
      <p className="mt-2 max-w-3xl text-sm text-muted">
        The headline numbers from the leaderboard below, in one place.{" "}
        <Link href="/methodology" className="text-accent hover:underline">
          Full caveats are in the methodology
        </Link>{" "}
        — this panel restates none of them.
      </p>
      <dl className="mt-6 divide-y divide-border">
        {rows.map((row) => (
          <div key={row.label} className="grid gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[9rem_1fr]">
            <dt>
              <span className="font-mono text-2xl font-semibold tabular-nums text-accent">{row.stat}</span>
              <span className="mt-0.5 block text-xs uppercase tracking-wide text-muted">{row.label}</span>
            </dt>
            <dd className="text-sm text-muted">{row.note}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
