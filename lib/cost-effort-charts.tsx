import { LEADERBOARD, keyFindings } from "@/lib/results";
import { ScatterChart, type ScatterPoint } from "@/lib/charts";

/**
 * "Price is not judgment" and "effort is not judgment" — the same
 * decoupling the Steward KYC whitepaper charts, applied to this
 * leaderboard's own cost and reply-length columns (`est_cost_usd_1pass`,
 * `avg_reply_tokens` in `results/leaderboard.csv`). Both columns already
 * existed before this section did; nothing here re-runs the benchmark or
 * adds a new claim, it only draws a relationship the table already implies
 * but a reader would otherwise have to eyeball across 54 rows.
 */
export function CostAndEffortCharts() {
  const ranked = LEADERBOARD.filter((r) => r.ranked && r.passRate !== null);
  const findings = keyFindings();

  const costPoints: ScatterPoint[] = ranked
    .filter((r) => r.estCostUsd1Pass !== null)
    .map((r) => ({
      x: r.estCostUsd1Pass as number,
      y: (r.passRate as number) * 100,
      label: r.model,
      annotate: r.model === findings.cheapestInTopQuartile?.model,
    }));

  const tokenPoints: ScatterPoint[] = ranked
    .filter((r) => r.avgReplyTokens !== null)
    .map((r) => ({
      x: r.avgReplyTokens as number,
      y: (r.passRate as number) * 100,
      label: r.model,
    }));

  if (costPoints.length === 0 && tokenPoints.length === 0) return null;

  return (
    <section className="mt-16 rounded-lg border border-border bg-surface p-6">
      <h2 className="text-lg font-semibold tracking-tight">Price and effort are not judgment</h2>
      <p className="mt-2 max-w-3xl text-sm text-muted">
        Cost and reply length are estimates added after the run (see{" "}
        <span className="font-mono text-xs">results/README.md</span>, &quot;Phase 4&quot;), not a
        controlled second pass. Read the shape, not any single row&apos;s exact position.
      </p>

      {costPoints.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-foreground">Cost per pass vs. pass rate</h3>
          <ScatterChart
            points={costPoints}
            xLabel="Cost per pass, USD (log scale)"
            yLabel="Pass rate (%)"
            xScale="log"
            formatX={(x) => (x < 0.01 ? `$${x.toFixed(3)}` : `$${x.toFixed(2)}`)}
            formatY={(y) => `${y.toFixed(0)}%`}
          />
          <p className="mt-2 text-xs text-muted">
            Each dot is 1 model. Cost spans roughly 3 orders of magnitude ($0.008 to over $5), and
            the highest-cost rows do not sit at the top of the pass-rate axis. 3 Bedrock rows with
            no published price are left out of this chart, not scored as $0.
          </p>
        </div>
      )}

      {tokenPoints.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-medium text-foreground">Reply length vs. pass rate</h3>
          <ScatterChart
            points={tokenPoints}
            xLabel="Avg. completion tokens per reply"
            yLabel="Pass rate (%)"
            formatX={(x) => x.toLocaleString()}
            formatY={(y) => `${y.toFixed(0)}%`}
          />
          <p className="mt-2 text-xs text-muted">
            A longer reply is not a more compliant one on this run — length and pass rate show no
            consistent relationship across the board.
          </p>
        </div>
      )}
    </section>
  );
}
