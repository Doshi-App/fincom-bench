"use client";

import { useState } from "react";
import { describeModel } from "./model-names";

export type ScatterPoint = { model: string; provider: string; failRate: number; costUsd: number; topQuartile: boolean };

const W = 640;
const H = 360;
const PAD = { top: 16, right: 16, bottom: 36, left: 56 };

/**
 * Cost vs failure rate. The story is "these few models are both cheap and
 * accurate," not "54 identities" — so this is the emphasis pattern (one
 * accent hue for the top quartile, gray for the rest), never 54 categorical
 * colors. Log scale on cost because the range spans 3+ orders of magnitude;
 * a single axis per measure, so this is not a dual-axis chart — 2 axes, 1
 * plot, 1 relationship.
 *
 * A real positioned tooltip, not an SVG `<title>` child — React DOM's
 * server renderer has a long-standing quirk where an element literally
 * named "title" gets special-cased for the HTML head, which drops its text
 * when it's actually an SVG title and produces a hydration mismatch.
 */
export function CostAccuracyScatter({ points }: { points: ScatterPoint[] }) {
  const [hover, setHover] = useState<ScatterPoint | null>(null);

  if (points.length === 0) return null;
  const costs = points.map((p) => p.costUsd).filter((c) => c > 0);
  const minLog = Math.floor(Math.log10(Math.min(...costs)));
  const maxLog = Math.ceil(Math.log10(Math.max(...costs)));
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  // Rounded to 2 decimals: pixel coordinates don't need 17 significant
  // digits, and the unrounded float can serialize 1 bit differently between
  // Node's V8 and the browser's, which reads as a hydration mismatch.
  const round2 = (n: number) => Math.round(n * 100) / 100;
  const x = (failRate: number) => round2(PAD.left + failRate * plotW);
  const y = (cost: number) => {
    const t = (Math.log10(cost) - minLog) / (maxLog - minLog || 1);
    return round2(PAD.top + (1 - t) * plotH);
  };

  const xTicks = [0, 0.25, 0.5, 0.75, 1];
  const yTicks: number[] = [];
  for (let l = minLog; l <= maxLog; l++) yTicks.push(Math.pow(10, l));

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Cost per pass versus failure rate, one dot per model">
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--border)" strokeWidth="1" />
            <text x={PAD.left - 8} y={y(t)} textAnchor="end" dominantBaseline="middle" className="fill-muted" fontSize="10">
              {t < 0.01 ? `$${t.toFixed(3)}` : `$${t.toFixed(2)}`}
            </text>
          </g>
        ))}
        {xTicks.map((t) => (
          <text key={t} x={x(t)} y={H - PAD.bottom + 18} textAnchor="middle" className="fill-muted" fontSize="10">
            {Math.round(t * 100)}%
          </text>
        ))}
        <line x1={PAD.left} x2={W - PAD.right} y1={H - PAD.bottom} y2={H - PAD.bottom} stroke="var(--muted)" strokeWidth="1" />
        <text x={W / 2} y={H - 4} textAnchor="middle" className="fill-muted" fontSize="10">
          Failure rate
        </text>
        <text x={16} y={12} textAnchor="start" className="fill-muted" fontSize="10">
          Cost / pass (log)
        </text>
        {points.map((p) => (
          <circle
            key={p.model}
            cx={x(p.failRate)}
            cy={y(p.costUsd)}
            r={p.topQuartile ? 5 : 4}
            fill={p.topQuartile ? "var(--accent)" : "var(--muted)"}
            fillOpacity={p.topQuartile ? 0.9 : 0.45}
            stroke="var(--surface-1)"
            strokeWidth={2}
            onMouseEnter={() => setHover(p)}
            onMouseLeave={() => setHover((h) => (h === p ? null : h))}
            style={{ cursor: "pointer" }}
          />
        ))}
        {hover && (
          <circle cx={x(hover.failRate)} cy={y(hover.costUsd)} r={8} fill="none" stroke="var(--fg)" strokeWidth={1.5} pointerEvents="none" />
        )}
      </svg>
      {hover && (
        <div
          className="pointer-events-none absolute rounded-md border border-border bg-surface-1 px-2.5 py-1.5 text-xs shadow-sm"
          style={{
            left: `${(x(hover.failRate) / W) * 100}%`,
            top: `${(y(hover.costUsd) / H) * 100}%`,
            transform: "translate(-50%, -130%)",
          }}
        >
          {(() => {
            const d = describeModel(hover.model, hover.provider);
            return (
              <>
                <p className="font-medium text-fg">
                  {d.maker} {d.name}
                </p>
                <p className="text-muted">
                  via {d.host} · {Math.round(hover.failRate * 100)}% fail · ${hover.costUsd.toFixed(4)}/pass
                </p>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
