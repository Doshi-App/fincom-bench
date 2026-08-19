import Link from "next/link";
import { LEADERBOARD, CATEGORY_BREAKDOWN, HAS_RESULTS, HAS_COST_DATA, WINNING_JUDGE, categoryMatrix } from "@/lib/results";
import { CATEGORIES } from "@/lib/categories";
import { LeaderboardView } from "../components/leaderboard-view";
import { CostAccuracyScatter, type ScatterPoint } from "../components/cost-accuracy-scatter";
import { EmptyState } from "../components/site-chrome";
import { describeWithHostPrefix } from "../components/model-names";

export const metadata = { title: "Leaderboard" };

export default function LeaderboardPage() {
  if (!HAS_RESULTS) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-14">
        <h1 className="text-3xl font-semibold tracking-tight">Leaderboard</h1>
        <div className="mt-6">
          <EmptyState
            title="No benchmark leaderboard yet"
            body="Scoring assistants is phase 2 of a run, and it happens only after a judge is chosen in phase 1."
          />
        </div>
      </div>
    );
  }

  const models = LEADERBOARD.map((r) => ({
    model: r.model,
    provider: r.provider,
    rank: r.rank,
    failRate: r.failRate,
  }));
  const categories = CATEGORIES.map((c) => ({ id: c.id, label: c.label, axis: c.axis }));
  const matrix = categoryMatrix();
  const breakdown = CATEGORY_BREAKDOWN.map((r) => ({ model: r.model, category: r.category, items: r.items, decided: r.decided }));

  const ranked = LEADERBOARD.filter((r) => r.ranked && r.rank !== null).sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
  const quartileSize = Math.max(1, Math.ceil(ranked.length / 4));
  const topQuartileModels = new Set(ranked.slice(0, quartileSize).map((r) => r.model));
  const scatterPoints: ScatterPoint[] = LEADERBOARD.filter((r) => r.failRate !== null && r.estCostUsd1Pass !== null && r.estCostUsd1Pass! > 0).map(
    (r) => ({
      model: r.model,
      provider: r.provider,
      failRate: r.failRate ?? 0,
      costUsd: r.estCostUsd1Pass ?? 0,
      topQuartile: topQuartileModels.has(r.model),
    }),
  );

  const judge = describeWithHostPrefix(WINNING_JUDGE);

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Leaderboard</h1>
      <p className="mt-4 max-w-3xl text-muted">
        {LEADERBOARD.length} models, each sent the same open probes and marked by{" "}
        <span className="font-medium text-fg">
          {judge.maker} {judge.name}
        </span>
        , the judge that agreed most with the human labels in phase 1. Every cell below is a failure
        rate for 1 model on 1 failure category — the same shape as the rubric itself, not a single
        overall score.
      </p>
      <p className="mt-3 max-w-3xl rounded-lg border border-border bg-surface-1 p-3 text-sm text-muted">
        <span className="font-medium text-fg">Read the gaps with care.</span> 1 judge, 1 run, no repeat
        for variance. A cell backed by few decided probes is noisier than one backed by many — hover a
        cell to see the count. See{" "}
        <Link href="/methodology" className="text-accent hover:underline">
          methodology
        </Link>{" "}
        before reading a small gap as a real difference.
      </p>

      <div className="mt-8">
        <LeaderboardView models={models} categories={categories} matrix={matrix} breakdown={breakdown} rows={ranked} hasCostData={HAS_COST_DATA} />
      </div>

      {HAS_COST_DATA && scatterPoints.length > 0 && (
        <div className="mt-14 rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold tracking-tight">Cost vs. failure rate</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Estimated cost of 1 pass over the item set against failure rate. The top quartile of ranked
            models is highlighted — the models that are both accurate and cheap sit toward the
            bottom-left.
          </p>
          <div className="mt-4 flex items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent" /> Top quartile by rank
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-muted" /> Other ranked models
            </span>
          </div>
          <div className="mt-4">
            <CostAccuracyScatter points={scatterPoints} />
          </div>
          <p className="mt-3 text-xs text-muted">
            Cost estimates mix real, list-price and market-rate figures across providers — see{" "}
            <Link href="/methodology" className="text-accent hover:underline">
              methodology
            </Link>{" "}
            before quoting one.
          </p>
        </div>
      )}
    </div>
  );
}
