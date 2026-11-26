/**
 * Section marker.
 *
 * This replaces the old "margin rail": a four-line manuscript galley column —
 * SEC. / PORTFOLIO / RUNNING HEAD / MARGINALIA — pinned to the left of every
 * section on the site. Those labels were decorative, and "folio", "running
 * head" and "marginalia" are book-production words that mean nothing to a
 * visitor evaluating a digital consultancy. A device a reader cannot use is
 * decoration with extra steps.
 *
 * What it is now: one number, one short label. The number is in the accent and
 * set large enough to act as a position marker, which is the only part of the
 * old rail that did real work — knowing where you are in a long page. The
 * label sits beneath it in small caps-free sans.
 *
 * The prop names are kept so the 23 pages that pass them keep compiling; the
 * `folio` and `note` values are deliberately no longer rendered. The notes were
 * marginal commentary addressed to nobody in particular and were the most
 * generated-sounding copy on the site.
 */
type Props = {
  sectionNum: string;
  sectionLabel: string;
  /** Accepted for call-site compatibility; no longer rendered. */
  folio?: string;
  /** Accepted for call-site compatibility; no longer rendered. */
  note?: string;
  inverse?: boolean;
};

export default function MarginRail({ sectionNum, sectionLabel, inverse = false }: Props) {
  return (
    <aside
      className={["hidden lg:block col-span-2", inverse ? "text-white" : "text-ink"].join(" ")}
      aria-hidden="true"
    >
      <div className="sticky top-[92px] pt-1">
        <div
          className={[
            "display-lg text-[38px] leading-none tabular-nums",
            inverse ? "text-white/85" : "text-signal",
          ].join(" ")}
        >
          {sectionNum}
        </div>
        <div
          className={[
            "mt-3 h-px w-8",
            inverse ? "bg-white/30" : "bg-faint",
          ].join(" ")}
        />
        <p
          className={[
            "mt-3 max-w-[14ch] text-[11.5px] font-medium leading-[1.45] tracking-[0.01em]",
            inverse ? "text-white/55" : "text-mute",
          ].join(" ")}
        >
          {sectionLabel}
        </p>
      </div>
    </aside>
  );
}
