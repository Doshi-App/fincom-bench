import Link from "next/link";
import { HAS_RESULTS } from "@/lib/results";
import type { InstitutionAction } from "@/data/categories";

/**
 * Same mechanism as conductbench's SampleDataBanner, repurposed for whichever
 * state this benchmark is actually in. It reads the published results rather
 * than `submissions/`, which is gitignored and therefore always empty on a
 * deployed build — keying the banner off that made a finished run render as
 * "nothing has run yet".
 *
 * With results published the banner does not disappear, because the run has a
 * caveat a reader needs before they read the table: it is one judge, one pass,
 * no repeat for variance.
 */
export function NoLeaderboardBanner() {
  if (!HAS_RESULTS) {
    return (
      <div className="border-b border-critical/40 bg-critical/10 px-6 py-2.5 text-center text-sm text-critical">
        <strong className="font-semibold">No benchmark leaderboard yet.</strong> Judge selection is
        in progress. See the panel on the homepage for what has actually run.
      </div>
    );
  }
  return (
    <div className="border-b border-border bg-surface px-6 py-2.5 text-center text-sm text-muted">
      <strong className="font-semibold text-fg">Preliminary results.</strong> One judge, one run,
      no repeat for variance, and the frontier hosted models are not in it yet.{" "}
      <Link href="/methodology" className="text-accent hover:underline">
        What this does and does not show →
      </Link>
    </div>
  );
}

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          FinCom&nbsp;Bench
        </Link>
        <nav className="flex flex-wrap items-center gap-6 text-sm text-muted">
          <Link href="/" className="hover:text-foreground">
            Leaderboard
          </Link>
          <Link href="/categories" className="hover:text-foreground">
            Categories
          </Link>
          <Link href="/dataset" className="hover:text-foreground">
            Dataset
          </Link>
          <Link href="/sourcebooks" className="hover:text-foreground">
            Sourcebooks
          </Link>
          <Link href="/methodology" className="hover:text-foreground">
            Methodology
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-muted">
        <p className="max-w-2xl">
          FinCom Bench is built and published by Doshi, which also builds Doshi FCP — one of the
          assistants it will score. Doshi FCP is a contestant, never the judge, and it is scored
          against the same 2-condition test as every other unregulated assistant. The rules, the
          dataset, and the harness are in this repository so the grade can be checked, not trusted.
        </p>
        <p className="mt-4">
          Not affiliated with or endorsed by the FCA, the EU, the CFPB, the FTC, or ASIC.
        </p>
      </div>
    </footer>
  );
}

export function AuthorBadge() {
  return (
    <span
      className="ml-2 rounded border border-border bg-surface px-1.5 py-0.5 align-middle text-[11px] font-medium text-muted"
      title="Built by the authors of this benchmark. Disclosed conflict of interest."
    >
      author&apos;s system
    </span>
  );
}

/** A fail-rate meter, 0-100. Lower is better, unlike conductbench's pass-rate meter. */
export function FailMeter({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-border" aria-hidden>
        <span
          className="block h-full rounded-full bg-fail"
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </span>
      <span className="font-mono text-sm tabular-nums">{value.toFixed(1)}%</span>
    </span>
  );
}

/** Like FailMeter, but for a score where more is better, so it fills in pass colour. */
export function PassMeter({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-border" aria-hidden>
        <span
          className="block h-full rounded-full bg-pass"
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </span>
      <span className="font-mono text-sm tabular-nums">{value.toFixed(1)}%</span>
    </span>
  );
}

export function VerdictTag({ verdict }: { verdict: "pass" | "fail" | "arguable" | "ungraded" | "error" }) {
  const map = {
    pass: { label: "Pass", cls: "border-pass/40 bg-pass/10 text-pass" },
    fail: { label: "Fail", cls: "border-fail/40 bg-fail/10 text-fail" },
    arguable: { label: "Arguable", cls: "border-border bg-surface text-muted" },
    ungraded: { label: "Ungraded", cls: "border-border bg-surface text-muted" },
    error: { label: "Error", cls: "border-critical/50 bg-critical/10 text-critical" },
  }[verdict];
  return <span className={`rounded border px-2 py-0.5 text-xs font-medium ${map.cls}`}>{map.label}</span>;
}

/**
 * What happens at the institution when a finding lands — the closest real
 * analog to conductbench's "critical breach" flag. There is no severity
 * tier here; the category alone decides the action.
 */
export function ActionTag({ action }: { action: InstitutionAction }) {
  const map: Record<InstitutionAction, { label: string; cls: string }> = {
    automatic: { label: "Automatic", cls: "border-critical/50 bg-critical/10 text-critical" },
    notify: { label: "Notify", cls: "border-fail/40 bg-fail/10 text-fail" },
    approve: { label: "Approve", cls: "border-border bg-surface text-muted" },
    none: { label: "Positive signal", cls: "border-pass/40 bg-pass/10 text-pass" },
  };
  const m = map[action];
  return <span className={`rounded border px-2 py-0.5 text-xs font-medium ${m.cls}`}>{m.label}</span>;
}
