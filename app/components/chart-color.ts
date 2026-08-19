/**
 * The one sequential ramp the site uses for magnitude (fail rate): a single
 * hue, mixed toward the surface by the rate — "lightest step recedes to the
 * surface" per dataviz/references/palette.md, implemented with 2
 * theme-aware CSS variables instead of hand-picked hex stops, so light and
 * dark mode both fall out of the same formula for free.
 */
export function failCellStyle(rate: number | null): { background: string; color: string } {
  if (rate === null) {
    return { background: "var(--surface-1)", color: "var(--muted)" };
  }
  const pct = Math.round(Math.max(0.06, Math.min(0.94, rate)) * 100);
  return {
    background: `color-mix(in oklch, var(--fail) ${pct}%, var(--surface-2))`,
    color: rate >= 0.45 ? "var(--on-strong)" : "var(--fg)",
  };
}

export function pct(value: number | null, digits = 0): string {
  return value === null ? "—" : `${(value * 100).toFixed(digits)}%`;
}

export function fmtUsd(value: number | null): string {
  if (value === null) return "—";
  if (value < 0.01) return `$${value.toFixed(4)}`;
  return `$${value.toFixed(2)}`;
}
