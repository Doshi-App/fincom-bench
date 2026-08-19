import Link from "next/link";
import Image from "next/image";
import type { LeaderboardRow } from "@/lib/results";
import { pct, fmtUsd } from "./chart-color";
import { slugModel } from "./model-slug";
import { describeModel, iconForMaker } from "./model-names";

/** The classic 1-row-per-model view — a plain sorted table, no interactivity needed beyond what's already sortable in the source CSV. */
export function RankedList({ rows, hasCostData }: { rows: LeaderboardRow[]; hasCostData: boolean }) {
  return (
    <div className="scroll-x rounded-lg border border-border">
      <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-wide text-muted">
            <th className="border-b border-border bg-surface-1 px-4 py-3 font-medium">#</th>
            <th className="border-b border-border bg-surface-1 px-4 py-3 font-medium">Model</th>
            <th className="border-b border-border bg-surface-1 px-4 py-3 font-medium">Host</th>
            <th className="border-b border-border bg-surface-1 px-4 py-3 text-right font-medium">Pass rate</th>
            <th className="border-b border-border bg-surface-1 px-4 py-3 text-right font-medium">Compliance</th>
            <th className="border-b border-border bg-surface-1 px-4 py-3 text-right font-medium">Behaviour</th>
            <th className="border-b border-border bg-surface-1 px-4 py-3 text-right font-medium">Coverage</th>
            {hasCostData && <th className="border-b border-border bg-surface-1 px-4 py-3 text-right font-medium">Cost / pass</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const d = describeModel(r.model, r.provider);
            return (
            <tr key={r.model} className="border-b border-border last:border-0 hover:bg-surface-1">
              <td className="px-4 py-2.5 tabular text-muted">{r.rank ?? "—"}</td>
              <td className="px-4 py-2.5">
                <Link href={`/models/${slugModel(r.model)}`} className="inline-flex items-center gap-2 text-fg hover:text-accent">
                  <Image src={iconForMaker(d.maker)} alt="" width={20} height={20} className="h-5 w-5 shrink-0 rounded-full border border-border" />
                  <span>
                    <span className="text-xs text-muted">{d.maker}</span> <span className="font-medium">{d.name}</span>
                  </span>
                </Link>
                {r.selfGraded && (
                  <span className="ml-2 rounded-full bg-arguable/20 px-1.5 py-0.5 text-[10px] text-arguable">judge</span>
                )}
              </td>
              <td className="px-4 py-2.5 text-muted">{d.host}</td>
              <td className="px-4 py-2.5 text-right tabular font-medium">{pct(r.passRate)}</td>
              <td className="px-4 py-2.5 text-right tabular text-muted">{pct(r.compliancePassRate)}</td>
              <td className="px-4 py-2.5 text-right tabular text-muted">{pct(r.behaviourPassRate)}</td>
              <td className="px-4 py-2.5 text-right tabular text-muted">{pct(r.coverage)}</td>
              {hasCostData && <td className="px-4 py-2.5 text-right tabular text-muted">{fmtUsd(r.estCostUsd1Pass)}</td>}
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
