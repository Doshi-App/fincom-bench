import { LEADERBOARD, HAS_RESULTS, categoryMatrix } from "@/lib/results";
import { CATEGORIES } from "@/lib/categories";
import { CompareTool } from "../components/compare-tool";
import { EmptyState } from "../components/site-chrome";

export const metadata = { title: "Compare models" };

export default function ComparePage() {
  if (!HAS_RESULTS) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-14">
        <h1 className="text-3xl font-semibold tracking-tight">Compare models</h1>
        <div className="mt-6">
          <EmptyState title="Nothing to compare yet" body="No benchmark leaderboard has published results yet." />
        </div>
      </div>
    );
  }

  const models = LEADERBOARD.map((r) => ({ model: r.model, provider: r.provider, rank: r.rank })).sort(
    (a, b) => (a.rank ?? 999) - (b.rank ?? 999),
  );
  const categories = CATEGORIES.map((c) => ({ id: c.id, label: c.label, axis: c.axis }));
  const matrix = categoryMatrix();

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Compare 2 models</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Pick any 2 models to see where they actually differ — the failure rate on each of the 15
        categories, biggest gap first. A model that ranks a few places above another can still lose
        badly on 1 specific category.
      </p>
      <p className="mt-2 max-w-2xl text-xs text-muted">
        Same caveats as the leaderboard: 1 judge, 1 run, no repeat for variance. A category with few
        decided probes is noisier than one with many — see{" "}
        <a href="/methodology" className="text-accent hover:underline">
          methodology
        </a>
        .
      </p>

      <div className="mt-8">
        <CompareTool models={models} categories={categories} matrix={matrix} />
      </div>
    </div>
  );
}
