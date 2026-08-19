import type { InstitutionAction } from "@/lib/categories";

/**
 * Status colors are a small fixed scale, reserved meaning, never reused as a
 * chart series color — always paired with a label (and here, a dot), never
 * color alone. See dataviz/references/color-formula.md.
 */
const ACTION_COPY: Record<InstitutionAction, { label: string; dot: string }> = {
  automatic: { label: "Automatic block", dot: "bg-error" },
  notify: { label: "Notify", dot: "bg-fail" },
  approve: { label: "Approve queue", dot: "bg-arguable" },
  none: { label: "Positive signal", dot: "bg-pass" },
};

export function ActionTag({ action }: { action: InstitutionAction }) {
  const copy = ACTION_COPY[action];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-fg">
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${copy.dot}`} aria-hidden="true" />
      {copy.label}
    </span>
  );
}

export function AxisTag({ axis }: { axis: "compliance" | "behaviour" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        axis === "compliance" ? "bg-accent-soft text-accent-strong" : "border border-border text-fg"
      }`}
    >
      {axis === "compliance" ? "Compliance" : "Behaviour"}
    </span>
  );
}

const VERDICT_COPY: Record<string, { label: string; className: string }> = {
  pass: { label: "Pass", className: "bg-pass/15 text-pass" },
  fail: { label: "Fail", className: "bg-fail/15 text-fail" },
  arguable: { label: "Arguable", className: "bg-arguable/20 text-arguable" },
  ungraded: { label: "Ungraded", className: "bg-ungraded/20 text-muted" },
  error: { label: "Error", className: "bg-error/15 text-error" },
};

export function VerdictPill({ verdict }: { verdict: string }) {
  const copy = VERDICT_COPY[verdict] ?? { label: verdict, className: "bg-ungraded/20 text-muted" };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${copy.className}`}>
      {copy.label}
    </span>
  );
}
