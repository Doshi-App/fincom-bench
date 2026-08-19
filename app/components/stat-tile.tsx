import type { ReactNode } from "react";

/**
 * Stat tile contract (dataviz/references/marks-and-anatomy.md): label in
 * sentence case with no trailing colon, value in the default proportional
 * sans (never tabular-nums — that's for table columns, not a display
 * figure), an optional note carrying the caveat a bare number would hide.
 */
export function StatTile({ label, value, note, icon }: { label: string; value: ReactNode; note?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-surface-1 p-5">
      <div className="flex items-start gap-3">
        {icon && <div className="shrink-0">{icon}</div>}
        <div className="min-w-0">
          <p className="text-sm text-muted">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-fg">{value}</p>
          {note && <p className="mt-2 text-xs leading-relaxed text-muted">{note}</p>}
        </div>
      </div>
    </div>
  );
}

export function KpiRow({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{children}</div>;
}
