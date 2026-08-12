import Link from "next/link";
import { notFound } from "next/navigation";
import { allTopics, docsForTopic } from "@/lib/sourcebooks";

export function generateStaticParams() {
  return allTopics().map((t) => ({ topic: t.id }));
}

export async function generateMetadata({ params }: PageProps<"/sourcebooks/[topic]">) {
  const { topic } = await params;
  return { title: allTopics().find((t) => t.id === topic)?.label ?? "Sourcebook" };
}

const JURISDICTION_NAMES: Record<string, string> = {
  uk: "United Kingdom",
  eu: "European Union",
  us: "United States",
  au: "Australia",
};

export default async function TopicPage({ params }: PageProps<"/sourcebooks/[topic]">) {
  const { topic } = await params;
  const meta = allTopics().find((t) => t.id === topic);
  if (!meta) notFound();

  const docs = docsForTopic(topic);
  if (docs.length === 0) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <p className="text-sm text-muted">
        <Link href="/sourcebooks" className="hover:underline">
          Sourcebooks
        </Link>{" "}
        / {meta.label}
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{meta.label}</h1>

      <div className="mt-10 space-y-12">
        {docs.map((d) => (
          <section key={d.jurisdiction} id={d.jurisdiction}>
            <p className="text-xs font-medium uppercase tracking-wide text-accent">
              {JURISDICTION_NAMES[d.jurisdiction] ?? d.jurisdiction}
            </p>
            {/* Trusted repo content, rendered from our own committed markdown — same trust level as the rest of the site. */}
            <div className="prose-doc mt-2" dangerouslySetInnerHTML={{ __html: d.html }} />
          </section>
        ))}
      </div>
    </div>
  );
}
