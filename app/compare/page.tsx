import { LEADERBOARD, HAS_RESULTS, categoryMatrix } from "@/lib/results";
import { CATEGORIES } from "@/lib/categories";
import { CompareMatrix } from "./CompareMatrix";

export const metadata = { title: "Compare models" };

export default function ComparePage() {
  if (!HAS_RESULTS) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-14">
        <h1 className="text-3xl font-semibold tracking-tight">Compare models</h1>
        <p className="mt-4 text-muted">No benchmark leaderboard yet — nothing to compare.</p>
      </div>
    );
  }

  const matrix = categoryMatrix();
  const models = LEADERBOARD.map((row) => ({
    model: row.model,
    provider: row.provider,
    rank: row.rank,
    failRate: row.passRate === null ? null : 1 - row.passRate,
  }));

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Compare models</h1>
      <p className="mt-4 max-w-3xl text-muted">
        A model does not pass or fail as 1 thing — it earns a different fail rate on each of the 15
        finding categories below. This page breaks every row on the homepage leaderboard down by
        category, so it is clear which model fails on which kind of finding, not just how it ranks
        overall. Click any 2 model rows to pin them and see the gap category by category.
      </p>
      <p className="mt-2 max-w-3xl text-xs text-muted">
        Same caveats as the homepage apply here: 1 judge, 1 run, no repeat for variance. A cell with
        few decided probes for that category is noisier than 1 with many — see{" "}
        <a href="/methodology" className="text-accent hover:underline">
          methodology
        </a>{" "}
        before reading a small gap as a real difference.
      </p>

      <div className="mt-8">
        <CompareMatrix models={models} categories={CATEGORIES} matrix={matrix} />
      </div>
    </div>
  );
}
