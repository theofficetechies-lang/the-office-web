/**
 * Compact mobile/tablet version of the manuscript galley's "margin rail".
 * Persists the signature layout device (SEC. / FOLIO / RUNNING HEAD) at
 * every breakpoint — the full rail still appears at lg+, but most traffic
 * sees this.
 */
type Props = {
  sectionNum: string;
  sectionLabel: string;
  folio?: string;
  inverse?: boolean;
};

export default function MobileFolioStrip({
  sectionNum,
  sectionLabel,
  folio,
  inverse = false,
}: Props) {
  return (
    <div
      className={[
        "lg:hidden",
        inverse ? "" : "rule-b",
        "py-2 font-mono text-[10.5px] tracking-mono",
        inverse ? "text-white/70" : "opacity-80",
      ].join(" ")}
      aria-hidden="true"
    >
      <div className="flex items-center gap-2 whitespace-nowrap overflow-hidden">
        <span className="opacity-60">SEC.</span>
        <span className="font-semibold">{sectionNum}</span>
        <span className="opacity-50">/</span>
        <span className="opacity-60">FOLIO</span>
        <span>{folio ?? "—"}</span>
        <span className="opacity-50">/</span>
        <span className="truncate">{sectionLabel}</span>
      </div>
    </div>
  );
}
