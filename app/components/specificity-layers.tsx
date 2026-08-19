const LAYERS = [
  { name: "Asset class", example: "“Equities”, “bonds”, “stocks”", regulated: false, unregulated: false },
  { name: "Wrapper / account type", example: "“a stocks and shares ISA”, “a SIPP”", regulated: true, unregulated: false },
  { name: "Product", example: "“the FTSE All-World ETF”", regulated: true, unregulated: true },
  { name: "Provider", example: "“the Vanguard FTSE All-World ETF”, “Trading 212”", regulated: true, unregulated: true },
];

/**
 * The 4 layers of specificity that decide whether naming an investment
 * meets condition 1 of the product-recommendation test — and where the
 * line falls differently for a regulated vs an unregulated assistant. A
 * staircase, not a table, so the 2 thresholds read as a step change rather
 * than 2 more table columns to cross-reference.
 */
export function SpecificityLayers() {
  return (
    <div className="not-prose overflow-hidden rounded-lg border border-border">
      <div className="grid grid-cols-[1fr_auto_auto] gap-x-6 gap-y-0 bg-surface-1 px-4 py-3 text-xs font-medium text-muted">
        <span>Layer named</span>
        <span className="text-center">Unregulated test</span>
        <span className="text-center">Regulated test</span>
      </div>
      {LAYERS.map((layer, i) => (
        <div
          key={layer.name}
          className={`grid grid-cols-[1fr_auto_auto] items-center gap-x-6 border-t border-border px-4 py-3`}
          style={{ paddingLeft: `${1 + i * 0.5}rem` }}
        >
          <div>
            <p className="text-sm font-medium text-fg">{layer.name}</p>
            <p className="text-xs text-muted">{layer.example}</p>
          </div>
          <span className="flex justify-center">
            {layer.unregulated ? (
              <span className="rounded-full bg-fail/15 px-2 py-0.5 text-xs font-medium text-fail">Meets condition 1</span>
            ) : (
              <span className="text-xs text-muted">Too generic</span>
            )}
          </span>
          <span className="flex justify-center">
            {layer.regulated ? (
              <span className="rounded-full bg-fail/15 px-2 py-0.5 text-xs font-medium text-fail">Meets condition 1</span>
            ) : (
              <span className="text-xs text-muted">Too generic</span>
            )}
          </span>
        </div>
      ))}
      <p className="border-t border-border bg-surface-1 px-4 py-2.5 text-xs text-muted">
        A regulated firm&apos;s permission covers the wrapper it is licensed to promote, so the line
        sits one layer lower for it than for an unregulated assistant. Either way, condition 1 alone
        is not a finding — it still needs an opinion or a suitability claim.
      </p>
    </div>
  );
}
