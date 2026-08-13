import Link from "next/link";
import type { Metadata } from "next";
import { COMPLIANCE_CATEGORIES, BEHAVIOUR_CATEGORIES } from "@/lib/categories";
import { ActionTag } from "@/lib/site";

export const metadata: Metadata = { title: "Categories" };

export default function CategoriesIndex() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Categories</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Every finding carries exactly one of these 15 categories. The compliance axis has 7; the
        behaviour axis has 8. Both are scored on all 4 jurisdictions except naming a bias helpfully,
        which is UK-only.
      </p>

      {[
        { title: "Compliance", items: COMPLIANCE_CATEGORIES },
        { title: "Behaviour", items: BEHAVIOUR_CATEGORIES },
      ].map((group) => (
        <section key={group.title} className="mt-10">
          <h2 className="text-lg font-semibold tracking-tight">{group.title}</h2>
          <div className="mt-4 space-y-3">
            {group.items.map((c) => (
              <Link
                key={c.id}
                href={`/categories/${c.id}`}
                className="block rounded-lg border border-border p-5 transition-colors hover:border-accent"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-semibold tracking-tight">{c.label}</h3>
                  <ActionTag action={c.institutionAction} />
                </div>
                <p className="mt-2 text-sm text-muted">{c.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
