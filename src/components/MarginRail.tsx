/**
 * The left "margin column" — manuscript galley inspired.
 * Holds running metadata so the right column can breathe.
 * Not used on mobile; collapses into a top strip.
 */
type Props = {
  sectionNum: string;
  sectionLabel: string;
  folio?: string;
  note?: string;
  inverse?: boolean;
};

export default function MarginRail({
  sectionNum,
  sectionLabel,
  folio,
  note,
  inverse = false,
}: Props) {
  return (
    <aside
      className={[
        "hidden lg:flex flex-col text-[11px] font-mono tracking-mono",
        inverse ? "text-white/80" : "text-black",
      ].join(" ")}
      aria-hidden="true"
    >
      <div className="sticky top-20 pt-2">
        <div className={[inverse ? "border-t border-white/20" : "rule-t", "pt-3 mb-4"].join(" ")}>
          <div className="opacity-50">SEC.</div>
          <div className="text-base font-semibold">{sectionNum}</div>
        </div>

        <div className="mb-6">
          <div className="opacity-50 mb-1">PORTFOLIO</div>
          <div>{folio ?? "—"}</div>
        </div>

        <div className="mb-6">
          <div className="opacity-50 mb-1">RUNNING HEAD</div>
          <div className="leading-snug">{sectionLabel}</div>
        </div>

        {note && (
          <div className="mb-6">
            <div className="opacity-50 mb-1">MARGINALIA</div>
            <div className="leading-snug opacity-80">{note}</div>
          </div>
        )}

        <div className="mt-auto pt-10 opacity-40 leading-tight">
          <div>THE OFFICE</div>
          <div>EST. 2021</div>
          <div>LISBON · NYC</div>
        </div>
      </div>
    </aside>
  );
}
