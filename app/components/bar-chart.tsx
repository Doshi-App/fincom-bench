import Image from "next/image";

export type BarDatum = {
  key: string;
  label: string;
  value: number;
  /** Shown after the label, e.g. an n= count. Kept out of the bar itself. */
  meta?: string;
  emphasis?: boolean;
  /** Path to a small square icon (e.g. a maker badge) shown before the label. */
  icon?: string;
};

const TONE_VAR: Record<"fail" | "accent" | "pass", string> = {
  fail: "var(--fail)",
  accent: "var(--accent)",
  pass: "var(--pass)",
};

/**
 * A single horizontal-bar chart, one hue (dataviz mark spec): ≤24px thick,
 * 4px rounded data-end, grows from a single left baseline, direct end-label
 * — no legend box, because one series needs none. `emphasis` mutes every
 * non-emphasized bar to gray (the "one series is the point" pattern) instead
 * of adding a second hue.
 */
export function BarChart({
  data,
  tone = "accent",
  max,
  formatValue = (v) => `${Math.round(v)}`,
  hasEmphasis = false,
}: {
  data: BarDatum[];
  tone?: "fail" | "accent" | "pass";
  max?: number;
  formatValue?: (v: number) => string;
  hasEmphasis?: boolean;
}) {
  const scaleMax = max ?? Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="space-y-2.5">
      {data.map((d) => {
        const width = Math.max(1.5, Math.min(100, (d.value / scaleMax) * 100));
        const color = hasEmphasis && !d.emphasis ? "var(--muted)" : TONE_VAR[tone];
        return (
          <div key={d.key} className="flex items-center gap-3 text-sm">
            <span className="flex w-48 shrink-0 items-center gap-1.5 truncate text-fg" title={d.label}>
              {d.icon && <Image src={d.icon} alt="" width={16} height={16} className="h-4 w-4 shrink-0 rounded-full border border-border" />}
              <span className="truncate">{d.label}</span>
            </span>
            <div className="relative h-4 flex-1 rounded-sm bg-surface-2">
              <div
                className="h-full rounded-r-sm"
                style={{ width: `${width}%`, background: color, opacity: hasEmphasis && !d.emphasis ? 0.55 : 1 }}
              />
            </div>
            <span className="w-14 shrink-0 text-right tabular text-muted">{formatValue(d.value)}</span>
            {d.meta && <span className="shrink-0 text-xs text-muted">{d.meta}</span>}
          </div>
        );
      })}
    </div>
  );
}
