"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { pct } from "./chart-color";
import { describeModel, iconForMaker } from "./model-names";

type Model = { model: string; provider: string; rank: number | null };
type Category = { id: string; label: string; axis: "compliance" | "behaviour" };
type Matrix = Record<string, Record<string, number | null>>;

function ModelSelect({
  models,
  value,
  onChange,
  label,
}: {
  models: Model[];
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <label className="flex flex-1 flex-col gap-1.5">
      <span className="text-xs font-medium text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-border bg-surface-1 px-3 py-2 text-sm text-fg outline-none focus:border-accent"
      >
        {models.map((m) => {
          const d = describeModel(m.model, m.provider);
          return (
            <option key={m.model} value={m.model}>
              {m.rank ? `#${m.rank} ` : ""}
              {d.maker} {d.name} — via {d.host}
            </option>
          );
        })}
      </select>
    </label>
  );
}

/**
 * A focused pick-2, delta-first comparison — the biggest gap sorts to the
 * top so the reader sees the story immediately, not after scanning 15 rows.
 * Delta bars use the emphasis pattern: the bigger side's bar takes the fail
 * hue, the smaller side is muted, because the gap is the point.
 */
export function CompareTool({ models, categories, matrix }: { models: Model[]; categories: Category[]; matrix: Matrix }) {
  const [modelA, setModelA] = useState(models[0]?.model ?? "");
  const [modelB, setModelB] = useState(models[1]?.model ?? models[0]?.model ?? "");

  const infoA = models.find((m) => m.model === modelA);
  const infoB = models.find((m) => m.model === modelB);
  const dA = infoA ? describeModel(infoA.model, infoA.provider) : null;
  const dB = infoB ? describeModel(infoB.model, infoB.provider) : null;
  const displayA = dA ? `${dA.maker} ${dA.name}` : modelA;
  const displayB = dB ? `${dB.maker} ${dB.name}` : modelB;

  const rows = useMemo(() => {
    return categories
      .map((c) => {
        const a = matrix[modelA]?.[c.id] ?? null;
        const b = matrix[modelB]?.[c.id] ?? null;
        const delta = a !== null && b !== null ? a - b : null;
        return { ...c, a, b, delta };
      })
      .sort((x, y) => Math.abs(y.delta ?? -1) - Math.abs(x.delta ?? -1));
  }, [modelA, modelB, categories, matrix]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <ModelSelect models={models} value={modelA} onChange={setModelA} label="Model A" />
          {dA && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
              <Image src={iconForMaker(dA.maker)} alt="" width={16} height={16} className="h-4 w-4 rounded-full border border-border" />
              {displayA}
            </p>
          )}
        </div>
        <div className="flex-1">
          <ModelSelect models={models} value={modelB} onChange={setModelB} label="Model B" />
          {dB && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
              <Image src={iconForMaker(dB.maker)} alt="" width={16} height={16} className="h-4 w-4 rounded-full border border-border" />
              {displayB}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {rows.map((r) => {
          const failA = r.a;
          const failB = r.b;
          const max = Math.max(failA ?? 0, failB ?? 0, 0.05);
          const aWorse = (r.a ?? 0) >= (r.b ?? 0);
          return (
            <div key={r.id} className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-fg">{r.label}</span>
                <span className="text-xs text-muted">
                  {r.delta === null ? "no data" : `${Math.round(Math.abs(r.delta) * 100)}pp gap`}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-[3.5rem_1fr_3rem] items-center gap-2 text-xs">
                <span className="truncate text-muted" title={displayA}>
                  A
                </span>
                <div className="h-3 rounded-sm bg-surface-2">
                  <div
                    className="h-full rounded-r-sm"
                    style={{
                      width: `${Math.max(1.5, ((failA ?? 0) / max) * 100)}%`,
                      background: aWorse ? "var(--fail)" : "var(--muted)",
                      opacity: aWorse ? 1 : 0.55,
                    }}
                  />
                </div>
                <span className="text-right tabular text-muted">{pct(failA)}</span>
                <span className="truncate text-muted" title={displayB}>
                  B
                </span>
                <div className="h-3 rounded-sm bg-surface-2">
                  <div
                    className="h-full rounded-r-sm"
                    style={{
                      width: `${Math.max(1.5, ((failB ?? 0) / max) * 100)}%`,
                      background: !aWorse ? "var(--fail)" : "var(--muted)",
                      opacity: !aWorse ? 1 : 0.55,
                    }}
                  />
                </div>
                <span className="text-right tabular text-muted">{pct(failB)}</span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted">Bars show failure rate — shorter and paler is better. The highlighted (fail-colored) side is whichever model is worse on that category.</p>
    </div>
  );
}
