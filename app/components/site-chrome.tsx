import Link from "next/link";

export const REPO_URL = "https://github.com/Doshi-App/fincon-bench";

const NAV = [
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/compare", label: "Compare" },
  { href: "/categories", label: "Categories" },
  { href: "/methodology", label: "Methodology" },
  { href: "/dataset", label: "Dataset" },
  { href: "/sourcebooks", label: "Sourcebooks" },
];

export function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export function GithubCTA({ variant = "primary" }: { variant?: "primary" | "secondary" }) {
  const base = "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-standard";
  const styles =
    variant === "primary"
      ? `${base} bg-accent text-accent-fg hover:bg-accent-strong`
      : `${base} border border-border text-fg hover:bg-surface-1`;
  return (
    <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className={styles}>
      <GithubIcon className="h-4 w-4" />
      View on GitHub
    </a>
  );
}

function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0">
      <svg viewBox="0 0 49 50" className="h-6 w-6" aria-hidden="true">
        <defs>
          <linearGradient id="doshi-grad-header" x1="2" y1="4" x2="47" y2="47" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#58D09E" />
            <stop offset="28%" stopColor="#49A3E4" />
            <stop offset="55%" stopColor="#FFC451" />
            <stop offset="78%" stopColor="#FD6E65" />
            <stop offset="100%" stopColor="#8B7AF6" />
          </linearGradient>
        </defs>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="url(#doshi-grad-header)"
          d="M24.4649 49.0372C37.7402 49.0372 48.502 38.2754 48.502 25C48.502 11.7247 37.7402 0.962891 24.4649 0.962891C11.1895 0.962891 0.427734 11.7247 0.427734 25C0.427734 38.2754 11.1895 49.0372 24.4649 49.0372ZM13.561 28.5122L16.0996 25.9735C16.6381 25.4351 16.6405 24.5629 16.107 24.0196L13.4611 21.3347C11.3902 19.2638 11.4268 15.8798 13.5756 13.8576C15.6514 11.9012 18.9623 12.1059 20.9796 14.1232L23.5085 16.6545C24.0494 17.1954 24.9289 17.1954 25.4698 16.6545L28.1571 13.9697C30.2279 11.8988 33.612 11.9353 35.6342 14.0842C37.5905 16.1599 37.3859 19.4709 35.3686 21.4882L32.8299 24.0269C32.2915 24.5653 32.2866 25.4375 32.8226 25.9808L35.4685 28.6656C37.5394 30.7365 37.5028 34.1206 35.354 36.1428C33.2782 38.0991 29.9673 37.8945 27.95 35.8772L25.4186 33.3458C24.8778 32.805 23.9982 32.805 23.4574 33.3458L20.7725 36.0307C18.7017 38.1016 15.3176 38.065 13.2954 35.9162C11.3391 33.8404 11.5437 30.5294 13.561 28.5122Z"
        />
      </svg>
      <span className="font-semibold tracking-tight text-fg">Fincon Bench</span>
    </Link>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/95 backdrop-saturate-150">
      <div className="scroll-x mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
        <Wordmark />
        <nav className="flex flex-1 items-center gap-5 text-sm text-muted whitespace-nowrap">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-fg transition-standard">
              {item.label}
            </Link>
          ))}
        </nav>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto hidden shrink-0 items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-fg hover:bg-surface-1 sm:inline-flex transition-standard"
        >
          <GithubIcon className="h-4 w-4" />
          GitHub
        </a>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <p className="text-sm font-semibold text-fg">Fincon Bench</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              A public benchmark for financial compliance and behaviour in AI chat replies, graded
              against real conduct rules from the UK, the EU, the US and Australia.
            </p>
          </div>
          <div className="flex gap-10 text-sm">
            <div>
              <p className="font-medium text-fg">Benchmark</p>
              <ul className="mt-2 space-y-1.5 text-muted">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-fg transition-standard">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium text-fg">Repository</p>
              <ul className="mt-2 space-y-1.5 text-muted">
                <li>
                  <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="hover:text-fg transition-standard">
                    Source on GitHub
                  </a>
                </li>
                <li>
                  <a href={`${REPO_URL}/blob/main/docs/rubric.md`} target="_blank" rel="noopener noreferrer" className="hover:text-fg transition-standard">
                    Rubric
                  </a>
                </li>
                <li>
                  <a href={`${REPO_URL}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer" className="hover:text-fg transition-standard">
                    Propose a rule
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-10 border-t border-border pt-6 text-xs text-muted">
          Rules, sourcebooks and datasets are CC BY 4.0. The harness and this website are Apache 2.0.
          This benchmark does not replace legal advice.
        </p>
      </div>
    </footer>
  );
}

export function NoResultsBanner() {
  return (
    <div className="border-b border-border bg-arguable/10">
      <p className="mx-auto max-w-7xl px-6 py-2 text-center text-sm text-fg">
        No benchmark leaderboard yet — scoring assistants is phase 2 of a run, and it happens only
        after a judge is chosen in phase 1.
      </p>
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface-1 p-8 text-center">
      <p className="font-semibold text-fg">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{body}</p>
    </div>
  );
}
