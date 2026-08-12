import Link from "next/link";
import type { Metadata } from "next";
import { allTopics } from "@/lib/sourcebooks";

export const metadata: Metadata = { title: "Sourcebooks" };

export default function SourcebooksIndex() {
  const topics = allTopics();
  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Sourcebooks</h1>
      <p className="mt-4 max-w-2xl text-muted">
        The reference content the rules actually cite — one topic per regulatory area, one file per
        jurisdiction. This is where the deterministic gates get their numbers from: the{" "}
        <code className="rounded border border-border bg-surface px-1.5 py-0.5 text-xs">
          expired_figure
        </code>{" "}
        category, for example, checks a reply against the statutory figures topic below.
      </p>

      <div className="mt-10 space-y-4">
        {topics.map((t) => (
          <Link
            key={t.id}
            href={`/sourcebooks/${t.id}`}
            className="block rounded-lg border border-border p-5 transition-colors hover:border-accent"
          >
            <h2 className="font-semibold tracking-tight">{t.label}</h2>
            <p className="mt-1 text-sm text-muted">United Kingdom · European Union · United States · Australia</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
