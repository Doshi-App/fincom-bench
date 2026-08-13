import Link from "next/link";
import { HAS_RESULTS } from "@/lib/results";
import type { InstitutionAction } from "@/lib/categories";

/**
 * A site-wide banner that states which state this benchmark is actually in,
 * so no page can show numbers without their caveat. It reads the published results rather
 * than `submissions/` directly, because the transcripts under `submissions/`
 * are tens of MB and exist to be audited, not read on every build.
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

export const REPO_URL = "https://github.com/Doshi-App/fincom-bench";

/** The GitHub mark, inline so it needs no external asset and takes the
 * surrounding text colour. */
export function GithubIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={className}>
      <path
        fillRule="evenodd"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
      />
    </svg>
  );
}

/** The one link every page carries to the source: the rules, the dataset and
 * the harness that produced the number on screen are all in this repo, not
 * asserted on the page. */
export function GithubLink({ className = "" }: { className?: string }) {
  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 ${className}`}
    >
      <GithubIcon />
      <span>View source on GitHub</span>
    </a>
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
          <Link href="/compare" className="hover:text-foreground">
            Compare
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
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="View source on GitHub"
          aria-label="View source on GitHub"
          className="ml-auto flex items-center gap-2 text-sm text-muted hover:text-foreground"
        >
          <GithubIcon />
          <span className="hidden sm:inline">GitHub</span>
        </a>
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
          against the same 2-condition test as every other unregulated assistant. It will not get a
          leaderboard row of its own: it runs the same models already on this leaderboard through
          the harness in this repository, and its result reports the uplift it adds on top of each
          base model. The rules, the dataset, and the harness are in this repository — the only
          harness used anywhere in this benchmark — so the grade can be checked, not trusted.
        </p>
        <p className="mt-4 max-w-2xl">
          Model providers have not been contacted about their inclusion on this leaderboard. If a
          provider asks for its model to be removed, it will be removed.
        </p>
        <p className="mt-4 max-w-2xl">
          Want a model scored?{" "}
          <a
            href="mailto:benji@doshi.app?subject=FinCom%20Bench%3A%20score%20request%20(model)"
            className="text-accent hover:underline"
          >
            Email us
          </a>
          . Want your bank&apos;s own harness scored?{" "}
          <a
            href="mailto:benji@doshi.app?subject=FinCom%20Bench%3A%20score%20request%20(harness)"
            className="text-accent hover:underline"
          >
            Email us
          </a>
          .
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

/** A fail-rate meter, 0-100. Lower is better, so it fills in fail colour. */
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
 * What happens at the institution when a finding lands. This is the only
 * escalation signal the benchmark reports. There is no severity
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
