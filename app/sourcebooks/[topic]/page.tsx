import { notFound } from "next/navigation";
import Link from "next/link";
import { allTopics, docsForTopic } from "@/lib/sourcebooks";

const JURISDICTION_LABEL: Record<string, string> = { uk: "United Kingdom", eu: "European Union", us: "United States", au: "Australia" };

export function generateStaticParams() {
  return allTopics().map((t) => ({ topic: t.id }));
}

export async function generateMetadata({ params }: PageProps<"/sourcebooks/[topic]">) {
  const { topic } = await params;
  return { title: allTopics().find((t) => t.id === topic)?.label ?? "Sourcebook" };
}

export default async function SourcebookTopicPage({ params }: PageProps<"/sourcebooks/[topic]">) {
  const { topic } = await params;
  const meta = allTopics().find((t) => t.id === topic);
  if (!meta) notFound();
  const docs = docsForTopic(topic);
  if (docs.length === 0) notFound();

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <p className="text-sm">
        <Link href="/sourcebooks" className="text-accent hover:underline">
          ← Sourcebooks
        </Link>
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{meta.label}</h1>
      <div className="mt-10 space-y-10">
        {docs.map((d) => (
          <section key={d.jurisdiction}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              {JURISDICTION_LABEL[d.jurisdiction] ?? d.jurisdiction}
            </h2>
            <div className="prose-doc mt-3" dangerouslySetInnerHTML={{ __html: d.html }} />
          </section>
        ))}
      </div>
    </div>
  );
}
