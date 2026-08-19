import Link from "next/link";
import { allTopics } from "@/lib/sourcebooks";

export const metadata = { title: "Sourcebooks" };

export default function SourcebooksPage() {
  const topics = allTopics();
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Sourcebooks</h1>
      <p className="mt-4 max-w-2xl text-muted">
        The reference prose the deterministic gates and the rubric cite directly — statutory
        figures, disclosure requirements, the advice boundary, suitability, vulnerable-customer
        rules and financial promotion, 1 file per jurisdiction per topic.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((t) => (
          <Link
            key={t.id}
            href={`/sourcebooks/${t.id}`}
            className="rounded-lg border border-border p-5 hover:border-accent transition-standard"
          >
            <h2 className="font-semibold tracking-tight text-fg">{t.label}</h2>
            <p className="mt-1.5 text-sm text-muted">UK, EU, US and AU, where published.</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
