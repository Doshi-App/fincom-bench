import Link from "next/link";
import { COMPLIANCE_CATEGORIES, BEHAVIOUR_CATEGORIES, type Category } from "@/lib/categories";
import { CATEGORY_BREAKDOWN } from "@/lib/results";
import { ActionTag } from "../components/tags";

function avgFailRate(categoryId: string): number | null {
  const rows = CATEGORY_BREAKDOWN.filter((r) => r.category === categoryId && r.failRate !== null);
  if (rows.length === 0) return null;
  return rows.reduce((sum, r) => sum + (r.failRate ?? 0), 0) / rows.length;
}

function CategoryCard({ category }: { category: Category }) {
  const avg = avgFailRate(category.id);
  return (
    <Link
      href={`/categories/${category.id}`}
      className="group flex flex-col justify-between rounded-lg border border-border p-5 hover:border-accent transition-standard"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold tracking-tight text-fg group-hover:text-accent transition-standard">{category.label}</h3>
          {avg !== null && (
            <span className="shrink-0 rounded-full bg-fail/10 px-2 py-0.5 text-xs font-medium tabular text-fail">
              {Math.round(avg * 100)}% avg fail
            </span>
          )}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">{category.description}</p>
      </div>
      <div className="mt-4">
        <ActionTag action={category.institutionAction} />
      </div>
    </Link>
  );
}

export const metadata = { title: "Categories" };

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">The 15 failure categories</h1>
      <p className="mt-4 max-w-3xl text-muted">
        Every failure carries exactly 1 category and cites the rule it breaks. 7 compliance
        categories score whether the content broke a named rule; 8 behaviour categories score
        whether the assistant used a manipulative or a helpful technique. Both are scored on all 4
        jurisdictions.
      </p>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-muted">Compliance — 7 categories</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COMPLIANCE_CATEGORIES.map((c) => (
          <CategoryCard key={c.id} category={c} />
        ))}
      </div>

      <h2 className="mt-12 text-sm font-semibold uppercase tracking-wide text-muted">Behaviour — 8 categories</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BEHAVIOUR_CATEGORIES.map((c) => (
          <CategoryCard key={c.id} category={c} />
        ))}
      </div>
    </div>
  );
}
