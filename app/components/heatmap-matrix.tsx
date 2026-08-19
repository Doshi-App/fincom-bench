"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { failCellStyle, pct } from "./chart-color";
import { slugModel } from "./model-slug";
import { describeModel, iconForMaker } from "./model-names";

export type MatrixModel = { model: string; provider: string; rank: number | null; failRate: number | null };
export type MatrixCategory = { id: string; label: string; axis: "compliance" | "behaviour" };
export type MatrixBreakdownRow = { model: string; category: string; items: number; decided: number };

type Matrix = Record<string, Record<string, number | null>>;
/** "input" keeps the order the caller passed in (e.g. a curated lead-with-these-models list) instead of re-sorting by rank on mount. */
type SortKey = "overall" | "input" | string;

const CATEGORY_COL_WIDTH = 224;
const MODEL_COL_WIDTH = 128;
// The header is a fixed h-24 (96px, line-clamped) so its exact height is
// known up front — the sticky "Overall" row right below it uses top-24 to
// match. Tailwind needs the literal utility, not a computed constant.

function SortButton({
  active,
  dir,
  label,
  onClick,
  title,
}: {
  active: boolean;
  dir: "asc" | "desc";
  label: string;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex w-full items-center justify-between gap-1.5 rounded px-3 py-2.5 text-left text-sm hover:bg-surface-2 ${
        active ? "font-semibold text-fg" : "text-muted"
      }`}
    >
      <span className="truncate">{label}</span>
      {active && <span className="shrink-0 text-accent">{dir === "asc" ? "↑" : "↓"}</span>}
    </button>
  );
}

/**
 * The flagship leaderboard: rows are the 15 finding categories (grouped by
 * axis), columns are models — scrollable horizontally rather than rotated,
 * since a readable name needs real width. Headers stack maker / name /
 * rank, matching every other model reference on the site. Each cell mixes
 * the one fail-rate hue toward the surface by that model's fail rate on
 * that category (sequential encoding — dataviz color-formula.md) — the
 * printed number is the pass rate (the positive framing readers expect on
 * a leaderboard), while the color still encodes risk, so a risky cell
 * reads as risky even though the number on it is "how often it passed."
 * Click a category's row label to re-sort every model column by that
 * category instead of overall rank.
 */
export function HeatmapMatrix({
  models,
  categories,
  matrix,
  breakdown,
  initialSort = "overall",
}: {
  models: MatrixModel[];
  categories: MatrixCategory[];
  matrix: Matrix;
  breakdown: MatrixBreakdownRow[];
  initialSort?: SortKey;
}) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>(initialSort);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const compliance = useMemo(() => categories.filter((c) => c.axis === "compliance"), [categories]);
  const behaviour = useMemo(() => categories.filter((c) => c.axis === "behaviour"), [categories]);

  const breakdownIndex = useMemo(() => {
    const map = new Map<string, { items: number; decided: number }>();
    for (const row of breakdown) map.set(`${row.model} ${row.category}`, row);
    return map;
  }, [breakdown]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return models;
    return models.filter((m) => {
      const d = describeModel(m.model, m.provider);
      return (
        m.model.toLowerCase().includes(q) ||
        m.provider.toLowerCase().includes(q) ||
        d.maker.toLowerCase().includes(q) ||
        d.name.toLowerCase().includes(q)
      );
    });
  }, [models, query]);

  const sorted = useMemo(() => {
    if (sortKey === "input") return filtered;
    function valueFor(m: MatrixModel): number | null {
      if (sortKey === "overall") return m.failRate;
      return matrix[m.model]?.[sortKey] ?? null;
    }
    return [...filtered].sort((a, b) => {
      const va = valueFor(a);
      const vb = valueFor(b);
      if (va === null && vb === null) return 0;
      if (va === null) return 1;
      if (vb === null) return -1;
      return sortDir === "asc" ? va - vb : vb - va;
    });
  }, [filtered, sortKey, sortDir, matrix]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function CategoryRow({ category }: { category: MatrixCategory }) {
    return (
      <tr className="border-b border-border">
        <th scope="row" className="sticky left-0 z-10 bg-bg p-0 text-left font-normal" style={{ width: CATEGORY_COL_WIDTH }}>
          <SortButton
            active={sortKey === category.id}
            dir={sortDir}
            label={category.label}
            title={`Sort models by pass rate on ${category.label}`}
            onClick={() => handleSort(category.id)}
          />
        </th>
        {sorted.map((m) => {
          const rate = matrix[m.model]?.[category.id] ?? null;
          const counts = breakdownIndex.get(`${m.model} ${category.id}`);
          const style = failCellStyle(rate);
          const d = describeModel(m.model, m.provider);
          const label =
            rate === null
              ? `${d.maker} ${d.name} — ${category.label}: no data`
              : `${d.maker} ${d.name} — ${category.label}: ${pct(1 - rate)} pass rate${counts ? ` (${counts.decided}/${counts.items} decided)` : ""}`;
          return (
            <td key={m.model} title={label} className="p-[2px] text-center align-middle" style={{ width: MODEL_COL_WIDTH }}>
              <div className="flex h-10 items-center justify-center rounded-sm text-[13px] tabular" style={style}>
                {rate === null ? "" : `${Math.round((1 - rate) * 100)}%`}
              </div>
            </td>
          );
        })}
      </tr>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Filter models or providers…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-64 rounded-lg border border-border bg-surface-1 px-3.5 py-2 text-sm outline-none focus:border-accent"
        />
        <div className="flex items-center gap-2.5 text-xs text-muted">
          <span>Pass rate shown · color = fail risk</span>
          <div
            className="h-2.5 w-24 rounded-full"
            style={{ background: "linear-gradient(to right, color-mix(in oklch, var(--fail) 6%, var(--surface-2)), var(--fail))" }}
            aria-hidden="true"
          />
          <span>low risk</span>
          <span>high risk</span>
        </div>
      </div>

      <div className="scroll-x mt-6 max-h-[46rem] rounded-lg border border-border">
        <table className="border-collapse text-left" style={{ minWidth: CATEGORY_COL_WIDTH + sorted.length * MODEL_COL_WIDTH }}>
          <thead>
            <tr className="border-b border-border">
              <th
                className="sticky left-0 top-0 z-20 bg-surface-1 p-3 text-left text-sm font-medium text-muted"
                style={{ width: CATEGORY_COL_WIDTH }}
              >
                Category
              </th>
              {sorted.map((m) => {
                const d = describeModel(m.model, m.provider);
                return (
                  <th
                    key={m.model}
                    className="sticky top-0 z-10 h-24 border-l border-border bg-surface-1 p-0 align-middle"
                    style={{ width: MODEL_COL_WIDTH }}
                  >
                    <Link
                      href={`/models/${slugModel(m.model)}`}
                      title={`${d.maker} ${d.name} — via ${d.host} — open model detail`}
                      className="flex h-24 flex-col items-center justify-center gap-0.5 overflow-hidden px-2 py-1.5 text-center hover:text-accent"
                    >
                      <Image src={iconForMaker(d.maker)} alt="" width={16} height={16} className="h-4 w-4 rounded-full border border-border" />
                      <span className="text-[11px] text-muted">{d.maker}</span>
                      <span className="line-clamp-2 text-xs font-semibold leading-tight text-fg">{d.name}</span>
                      {m.rank && <span className="text-[11px] text-muted">#{m.rank} of 54</span>}
                    </Link>
                  </th>
                );
              })}
            </tr>
            <tr className="border-b border-border">
              <th className="sticky left-0 top-24 z-20 bg-surface-2 p-0 text-left font-normal" style={{ width: CATEGORY_COL_WIDTH }}>
                <SortButton
                  active={sortKey === "overall"}
                  dir={sortDir}
                  label="Overall"
                  title="Sort models by overall pass rate"
                  onClick={() => handleSort("overall")}
                />
              </th>
              {sorted.map((m) => {
                const style = failCellStyle(m.failRate);
                return (
                  <td
                    key={m.model}
                    className="sticky top-24 z-10 border-l border-border bg-surface-2 p-[2px] text-center"
                    style={{ width: MODEL_COL_WIDTH }}
                  >
                    <div className="flex h-10 items-center justify-center rounded-sm text-[13px] font-semibold tabular" style={style}>
                      {m.failRate === null ? "—" : `${Math.round((1 - m.failRate) * 100)}%`}
                    </div>
                  </td>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan={sorted.length + 1}
                className="sticky left-0 bg-bg px-3 pb-2 pt-5 text-xs font-semibold uppercase tracking-wide text-muted"
              >
                Compliance
              </td>
            </tr>
            {compliance.map((c) => (
              <CategoryRow key={c.id} category={c} />
            ))}
            <tr>
              <td
                colSpan={sorted.length + 1}
                className="sticky left-0 bg-bg px-3 pb-2 pt-6 text-xs font-semibold uppercase tracking-wide text-muted"
              >
                Behaviour
              </td>
            </tr>
            {behaviour.map((c) => (
              <CategoryRow key={c.id} category={c} />
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-muted">
        Each cell is the pass rate (%) that model earned on that category — higher is better; the
        tile&apos;s color still tracks fail risk, darker being worse. Hover a cell for the exact
        count. Click a row label (or &ldquo;Overall&rdquo;) to sort model columns by it. Showing{" "}
        {sorted.length} of {models.length} models.
      </p>
    </div>
  );
}
