import type { ReactNode } from "react";

/**
 * Stat tile contract (dataviz/references/marks-and-anatomy.md): label in
 * sentence case with no trailing colon, value in the default proportional
 * sans (never tabular-nums — that's for table columns, not a display
 * figure), an optional note carrying the caveat a bare number would hide.
 */
export function StatTile({ label, value, note }: { label: string; value: ReactNode; note?: ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-surface-1 p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-fg">{value}</p>
      {note && <p className="mt-2 text-sm leading-relaxed text-muted">{note}</p>}
    </div>
  );
}

export function KpiRow({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{children}</div>;
}
