import type { ReactNode } from "react";

function Step({ title, detail, human }: { title: string; detail: string; human?: boolean }) {
  return (
    <div
      className={`min-w-[11rem] flex-1 rounded-lg border bg-surface-1 p-3.5 ${
        human ? "border-t-[3px] border-t-accent border-x-border border-b-border" : "border-border"
      }`}
    >
      <p className="text-sm font-semibold text-fg">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted">{detail}</p>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex shrink-0 items-center justify-center px-1 text-muted" aria-hidden="true">
      <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
        <path d="M0 6H17M17 6L12 1M17 6L12 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function Lane({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{title}</p>
      <div className="mt-3 flex flex-wrap items-stretch gap-2 sm:flex-nowrap">{children}</div>
    </div>
  );
}

/**
 * The 2-pass run, as a diagram — the mechanism the site keeps referring
 * back to, not a decorative flowchart. A teal top border marks a step a
 * person does, same convention as the README's mermaid diagram.
 */
export function PipelineDiagram() {
  return (
    <div className="space-y-8">
      <Lane title="Pass 1 — choose the judge (the replies already exist)">
        <Step human title="Meta-eval set" detail="274 hand-written probes, each with a pre-written reply." />
        <Arrow />
        <div className="flex flex-1 flex-col gap-2 sm:flex-row">
          <Step human title="Human labellers" detail="2 people read the rule and mark each reply pass or fail." />
          <Step title="Candidate judges" detail="5 models mark the same rows, blind to the human labels." />
        </div>
        <Arrow />
        <Step title="The judge" detail="The model whose labels agree most with the 2 people, by macro-F1." />
      </Lane>
      <Lane title="Pass 2 — score the assistants (the replies do not exist yet)">
        <Step title="Benchmark set" detail="The same probes, reply column empty." />
        <Arrow />
        <Step title="Assistants under test" detail="GPT, Grok, Claude and others each write their own reply." />
        <Arrow />
        <Step title="The judge" detail="Pass 1's winner marks every reply against the same rules." />
        <Arrow />
        <Step title="Leaderboard" detail="Fail = a finding that cites its clause. Pass = no record." />
      </Lane>
      <p className="text-xs text-muted">
        <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm border-t-2 border-t-accent bg-surface-1 align-middle" />
        marks a step a person does. Everything else is a model.
      </p>
    </div>
  );
}
