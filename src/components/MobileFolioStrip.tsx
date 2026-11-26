/**
 * Compact mobile counterpart to the section marker.
 *
 * The old version recreated the galley strip — SEC. / PORTFOLIO / RUNNING
 * HEAD — at every breakpoint under `lg`. Most traffic never saw the desktop
 * rail, so most traffic saw the most decorative version of it. This keeps the
 * one part that carried information (the section number) and drops the rest.
 */
type Props = {
  sectionNum: string;
  sectionLabel: string;
  /** Accepted for call-site compatibility; no longer rendered. */
  folio?: string;
  inverse?: boolean;
};

export default function MobileFolioStrip({ sectionNum, sectionLabel, inverse = false }: Props) {
  return (
    <div
      className={[
        "lg:hidden mb-6 flex items-baseline gap-3",
        inverse ? "text-white" : "text-ink",
      ].join(" ")}
      aria-hidden="true"
    >
      <span className={["display-lg text-[26px] leading-none tabular-nums", inverse ? "text-white/85" : "text-signal"].join(" ")}>
        {sectionNum}
      </span>
      <span className={["h-3 w-px", inverse ? "bg-white/25" : "bg-faint"].join(" ")} />
      <span className={["text-[11px] font-medium", inverse ? "text-white/55" : "text-mute"].join(" ")}>
        {sectionLabel}
      </span>
    </div>
  );
}
