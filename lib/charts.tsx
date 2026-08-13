/**
 * A dependency-free scatter chart, plain inline SVG.
 *
 * The site has no chart library in `package.json` — every other page is an
 * HTML table with CSS cell-shading (see `CompareMatrix`'s `cellStyle`). This
 * keeps that convention rather than adding a dependency for 2 charts: cost
 * and reply length against pass rate, the same "price is not judgment" and
 * "effort is not judgment" comparisons a reviewer would otherwise have to
 * read out of a 54-row table by eye.
 *
 * Static markup only, no client JS: with ~50 points on screen at once,
 * hover tooltips would need a "use client" component and state, and the
 * numbers involved (cost, tokens) are already on the leaderboard table a
 * click away — this chart's job is the shape of the relationship, not a
 * lookup tool.
 */

export type ScatterPoint = {
  x: number;
  y: number;
  label: string;
  /** Shown with its own text label on the chart; keep this to a handful of points or it clutters. */
  annotate?: boolean;
};

type ScatterChartProps = {
  points: ScatterPoint[];
  xLabel: string;
  yLabel: string;
  /** Cost spans ~3 orders of magnitude ($0.008–$5.82); log scale keeps the cheap end legible. */
  xScale?: "linear" | "log";
  formatX?: (x: number) => string;
  formatY?: (y: number) => string;
};

const WIDTH = 720;
const HEIGHT = 320;
const MARGIN = { top: 16, right: 20, bottom: 40, left: 48 };

function niceTicks(min: number, max: number, count: number): number[] {
  if (min === max) return [min];
  const step = (max - min) / (count - 1);
  return Array.from({ length: count }, (_, i) => min + i * step);
}

function logTicks(min: number, max: number): number[] {
  const lo = Math.floor(Math.log10(min));
  const hi = Math.ceil(Math.log10(max));
  const ticks: number[] = [];
  for (let e = lo; e <= hi; e++) ticks.push(10 ** e);
  return ticks;
}

export function ScatterChart({
  points,
  xLabel,
  yLabel,
  xScale = "linear",
  formatX = (x) => String(x),
  formatY = (y) => String(y),
}: ScatterChartProps) {
  if (points.length === 0) return null;

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = 0;
  const yMax = Math.max(100, ...ys);

  const plotW = WIDTH - MARGIN.left - MARGIN.right;
  const plotH = HEIGHT - MARGIN.top - MARGIN.bottom;

  const toX = (x: number) => {
    if (xScale === "log") {
      const lo = Math.log10(Math.max(xMin, 1e-6));
      const hi = Math.log10(Math.max(xMax, xMin * 10));
      const t = (Math.log10(Math.max(x, 1e-6)) - lo) / (hi - lo || 1);
      return MARGIN.left + t * plotW;
    }
    const t = (x - xMin) / (xMax - xMin || 1);
    return MARGIN.left + t * plotW;
  };
  const toY = (y: number) => {
    const t = (y - yMin) / (yMax - yMin || 1);
    return MARGIN.top + (1 - t) * plotH;
  };

  const xTicks = xScale === "log" ? logTicks(Math.max(xMin, 1e-6), xMax) : niceTicks(xMin, xMax, 5);
  const yTicks = niceTicks(yMin, yMax, 5);

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Scatter of ${yLabel} against ${xLabel}`}
    >
      {yTicks.map((t) => (
        <g key={`y-${t}`}>
          <line
            x1={MARGIN.left}
            x2={WIDTH - MARGIN.right}
            y1={toY(t)}
            y2={toY(t)}
            stroke="var(--color-border)"
            strokeWidth={1}
          />
          <text x={MARGIN.left - 8} y={toY(t)} textAnchor="end" dy="0.32em" className="fill-muted text-[10px]">
            {formatY(t)}
          </text>
        </g>
      ))}

      {xTicks.map((t) => (
        <g key={`x-${t}`}>
          <line
            x1={toX(t)}
            x2={toX(t)}
            y1={MARGIN.top}
            y2={HEIGHT - MARGIN.bottom}
            stroke="var(--color-border)"
            strokeWidth={1}
            opacity={0.5}
          />
          <text x={toX(t)} y={HEIGHT - MARGIN.bottom + 16} textAnchor="middle" className="fill-muted text-[10px]">
            {formatX(t)}
          </text>
        </g>
      ))}

      {points.map((p) => (
        <g key={p.label}>
          <circle
            cx={toX(p.x)}
            cy={toY(p.y)}
            r={p.annotate ? 4 : 3}
            className={p.annotate ? "fill-accent" : "fill-muted"}
            opacity={p.annotate ? 1 : 0.6}
          />
          {p.annotate && (
            <text
              x={toX(p.x) + 6}
              y={toY(p.y) - 6}
              className="fill-foreground text-[10px] font-medium"
            >
              {p.label}
            </text>
          )}
        </g>
      ))}

      <text
        x={MARGIN.left + plotW / 2}
        y={HEIGHT - 4}
        textAnchor="middle"
        className="fill-muted text-[10px] uppercase tracking-wide"
      >
        {xLabel}
      </text>
      <text
        x={12}
        y={MARGIN.top + plotH / 2}
        textAnchor="middle"
        transform={`rotate(-90, 12, ${MARGIN.top + plotH / 2})`}
        className="fill-muted text-[10px] uppercase tracking-wide"
      >
        {yLabel}
      </text>
    </svg>
  );
}
