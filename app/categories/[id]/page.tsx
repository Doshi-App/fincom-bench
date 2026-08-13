import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { jurisdictionsForCategory, probeForCategory } from "@/lib/rules";
import { ActionTag } from "@/lib/site";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/categories/[id]">) {
  const { id } = await params;
  return { title: getCategory(id)?.label ?? "Category" };
}

const JURISDICTION_NAMES: Record<string, string> = {
  uk: "United Kingdom",
  eu: "European Union",
  us: "United States",
  au: "Australia",
};

export default async function CategoryPage({ params }: PageProps<"/categories/[id]">) {
  const { id } = await params;
  const category = getCategory(id);
  if (!category) notFound();

  const jurisdictions = jurisdictionsForCategory(id);
  const probe = probeForCategory(id);

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <p className="text-sm text-muted">
        <Link href="/categories" className="hover:underline">
          Categories
        </Link>{" "}
        / {category.label}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">{category.label}</h1>
        <ActionTag action={category.institutionAction} />
      </div>
      <p className="mt-4 text-lg leading-relaxed text-muted">{category.description}</p>
      <p className="mt-2 text-sm text-muted">
        Axis: <span className="font-medium text-foreground">{category.axis}</span> · Institution
        action on a finding: <span className="font-medium text-foreground">{category.institutionAction}</span>
      </p>
      {probe && (
        <p className="mt-4 rounded-lg border border-border bg-surface p-4 text-sm">
          <span className="font-medium">Example probe.</span>{" "}
          <span className="text-muted">The same message is tested across jurisdictions:</span>{" "}
          &ldquo;{probe}&rdquo;
        </p>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">Authority by jurisdiction</h2>
        {jurisdictions.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No rule file found for this category.</p>
        ) : (
          <div className="mt-4 space-y-5">
            {jurisdictions.map(({ jurisdiction, rules }) => (
              <div key={jurisdiction} className="rounded-lg border border-border p-4">
                <h3 className="text-sm font-semibold tracking-tight">
                  {JURISDICTION_NAMES[jurisdiction] ?? jurisdiction}
                </h3>
                <ul className="mt-2 space-y-2">
                  {rules.map((r) => (
                    <li key={r.id} className="text-sm">
                      <a href={r.authority.url} className="font-mono text-xs text-accent hover:underline">
                        {r.authority.source} {r.authority.clause}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        <p className="mt-3 text-sm text-muted">
          The full pass/fail rubric, edge cases, and worked examples are in{" "}
          <code className="rounded border border-border bg-surface px-1.5 py-0.5 text-xs">
            rules/grading/{id}.md
          </code>{" "}
          in the repository. The underlying reference content — statutory figures, the advice
          boundary, disclosure, and more — is in{" "}
          <Link href="/sourcebooks" className="text-accent hover:underline">
            the sourcebooks
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
