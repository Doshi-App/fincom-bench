"use client";

import { useState } from "react";
import { HeatmapMatrix, type MatrixBreakdownRow, type MatrixCategory, type MatrixModel } from "./heatmap-matrix";
import { RankedList } from "./ranked-list";
import type { LeaderboardRow } from "@/lib/results";

export function LeaderboardView({
  models,
  categories,
  matrix,
  breakdown,
  rows,
  hasCostData,
}: {
  models: MatrixModel[];
  categories: MatrixCategory[];
  matrix: Record<string, Record<string, number | null>>;
  breakdown: MatrixBreakdownRow[];
  rows: LeaderboardRow[];
  hasCostData: boolean;
}) {
  const [view, setView] = useState<"matrix" | "ranked">("matrix");

  return (
    <div>
      <div className="mb-4 inline-flex rounded-lg border border-border p-1 text-sm">
        {(["matrix", "ranked"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`rounded-md px-3 py-1.5 font-medium transition-standard ${
              view === v ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"
            }`}
          >
            {v === "matrix" ? "Category matrix" : "Ranked list"}
          </button>
        ))}
      </div>
      {view === "matrix" ? (
        <HeatmapMatrix models={models} categories={categories} matrix={matrix} breakdown={breakdown} />
      ) : (
        <RankedList rows={rows} hasCostData={hasCostData} />
      )}
    </div>
  );
}
