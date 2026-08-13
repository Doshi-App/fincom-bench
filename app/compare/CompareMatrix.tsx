"use client";

import { useMemo, useState } from "react";

export type MatrixModel = {
  model: string;
  provider: string;
  rank: number | null;
};

export type MatrixCategory = {
  id: string;
  label: string;
  axis: "compliance" | "behaviour";
};

type Matrix = Record<string, Record<string, number | null>>;

/** Fail-rate cell, 0-1. Same red the rest of the site uses for "fail" —
 * opacity carries the intensity so there is only 1 colour to learn. */
function cellStyle(rate: number | null): React.CSSProperties {
  if (rate === null) return {};
  return { backgroundColor: "var(--fail)", opacity: Math.max(0.08, Math.min(0.95, rate)) };
}

function CategoryHeader({ category }: { category: MatrixCategory }) {
  return (
    <th
      className="border-b border-border px-1 py-2 text-left align-bottom font-normal text-muted"
      title={category.label}
    >
      <span
        className="inline-block whitespace-nowrap text-[11px]"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        {category.label}
      </span>
    </th>
  );
}

function HeadToHead({
  modelA,
  modelB,
  categories,
  matrix,
  onClear,
}: {
  modelA: string;
  modelB: string;
  categories: MatrixCategory[];
  matrix: Matrix;
  onClear: () => void;
}) {
  const rows = categories
    .map((c) => {
      const a = matrix[modelA]?.[c.id] ?? null;
      const b = matrix[modelB]?.[c.id] ?? null;
      const delta = a !== null && b !== null ? a - b : null;
      return { ...c, a, b, delta };
    })
    .sort((x, y) => Math.abs(y.delta ?? -1) - Math.abs(x.delta ?? -1));

  const pct = (v: number | null) => (v === null ? "—" : `${Math.round(v * 100)}%`);

  return (
    <div className="rounded-lg border border-accent/40 bg-accent/5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-mono text-sm font-semibold">
          {modelA} <span className="font-sans font-normal text-muted">vs</span> {modelB}
        </h2>
        <button onClick={onClear} className="text-xs text-muted hover:underline">
          Clear
        </button>
      </div>
      <p className="mt-1 text-xs text-muted">
        Fail rate per category, biggest gap first. Lower is better for both models.
      </p>
      <div className="mt-3 space-y-1.5">
        {rows.map((r) => (
          <div key={r.id} className="grid grid-cols-[1fr_3.5rem_3.5rem] items-center gap-3 text-xs">
            <span className="truncate" title={r.label}>
              {r.label}
            </span>
            <span className="text-right font-mono tabular-nums">{pct(r.a)}</span>
            <span className="text-right font-mono tabular-nums text-muted">{pct(r.b)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CompareMatrix({
  models,
  categories,
  matrix,
}: {
  models: MatrixModel[];
  categories: MatrixCategory[];
  matrix: Matrix;
}) {
  const [pinned, setPinned] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const compliance = useMemo(() => categories.filter((c) => c.axis === "compliance"), [categories]);
  const behaviour = useMemo(() => categories.filter((c) => c.axis === "behaviour"), [categories]);
  const ordered = useMemo(() => [...compliance, ...behaviour], [compliance, behaviour]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return models;
    return models.filter((m) => m.model.toLowerCase().includes(q) || m.provider.toLowerCase().includes(q));
  }, [models, query]);

  function togglePin(model: string) {
    setPinned((prev) => {
      if (prev.includes(model)) return prev.filter((m) => m !== model);
      if (prev.length >= 2) return [prev[1], model];
      return [...prev, model];
    });
  }

  return (
    <div>
      {pinned.length === 2 && (
        <div className="mb-6">
          <HeadToHead
            modelA={pinned[0]}
            modelB={pinned[1]}
            categories={categories}
            matrix={matrix}
            onClear={() => setPinned([])}
          />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Filter models…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-64 rounded border border-border bg-surface px-3 py-1.5 text-sm outline-none focus:border-accent"
        />
        <p className="text-xs text-muted">
          {pinned.length === 0 && "Click 2 rows to compare them head to head."}
          {pinned.length === 1 && `${pinned[0]} pinned — click 1 more to compare.`}
        </p>
      </div>

      <div className="scroll-x mt-4 rounded-lg border border-border">
        <table className="w-full min-w-max border-collapse text-xs">
          <thead>
            <tr>
              <th rowSpan={2} className="sticky left-0 z-10 border-b border-border bg-surface px-3 py-2 text-left align-bottom">
                Model
              </th>
              <th
                colSpan={compliance.length}
                className="border-b border-border px-2 py-1 text-center font-medium text-muted"
              >
                Compliance
              </th>
              <th
                colSpan={behaviour.length}
                className="border-b border-border px-2 py-1 text-center font-medium text-muted"
              >
                Behaviour
              </th>
            </tr>
            <tr>
              {ordered.map((c) => (
                <CategoryHeader key={c.id} category={c} />
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => {
              const isPinned = pinned.includes(m.model);
              return (
                <tr key={m.model} className={`border-b border-border last:border-0 ${isPinned ? "bg-accent/10" : ""}`}>
                  <td className={`sticky left-0 z-10 px-1 py-1 ${isPinned ? "bg-accent/10" : "bg-background"}`}>
                    <button
                      onClick={() => togglePin(m.model)}
                      className="flex w-full items-center gap-2 rounded px-2 py-1 text-left font-mono hover:bg-surface"
                      title="Click to pin for head-to-head comparison"
                    >
                      {m.rank && <span className="text-muted">#{m.rank}</span>}
                      <span className="truncate">{m.model}</span>
                    </button>
                  </td>
                  {ordered.map((c) => {
                    const rate = matrix[m.model]?.[c.id] ?? null;
                    return (
                      <td key={c.id} className="px-1 py-1 text-center font-mono tabular-nums" style={cellStyle(rate)}>
                        {rate === null ? "—" : Math.round(rate * 100)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted">
        Each cell is the fail rate (%) that model earned on that category — lower is better. Darker
        red is a higher fail rate. Filtered to {filtered.length} of {models.length} models.
      </p>
    </div>
  );
}
