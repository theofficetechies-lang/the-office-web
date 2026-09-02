import { useEffect, useState } from "react";
import MarginRail from "@/components/MarginRail";
import MobileFolioStrip from "@/components/MobileFolioStrip";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SkipLink from "@/components/SkipLink";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { getAdjacentNotes, getNote, notesData } from "@/data/notes";

/**
 * Phase 8 — a note at its own URL.
 * Essays were previously trapped behind an accordion on /notes, which meant no
 * shareable link, no indexable page and no per-note metadata. Each note now has
 * a route of its own, driven by src/data/notes.ts.
 */
/** Thin scroll-progress bar, hidden in print. */
function ReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? h.scrollTop / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 h-[2px] bg-black z-50 no-print"
      style={{ width: `${p * 100}%` }}
    />
  );
}

function ShareRow() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };
  return (
    <div className="flex flex-wrap items-center gap-3 no-print">
      <button
        type="button"
        onClick={copy}
        className="border border-black px-4 py-2 font-mono text-[11px] tracking-mono font-semibold hover:bg-black hover:text-white transition-colors cursor-pointer"
      >
        {copied ? "COPIED ✓" : "COPY LINK"}
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="border border-black px-4 py-2 font-mono text-[11px] tracking-mono font-semibold hover:bg-black hover:text-white transition-colors cursor-pointer"
      >
        PRINT
      </button>
    </div>
  );
}

export default function NotePage({ slug }: { slug: string }) {
  const note = getNote(slug);
  const { prev, next } = getAdjacentNotes(slug);

  useDocumentMeta({
    title: note ? `${note.title} — Notes, THE OFFICE 360` : "Note not found — THE OFFICE 360",
    description: note?.excerpt ?? "The note you were looking for is not in the archive.",
    path: `/notes/${slug}`,
    noindex: !note,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  if (!note) {
    return (
      <div className="min-h-screen bg-paper text-charcoal flex flex-col">
        <SkipLink />
        <SiteHeader mode="page" />
        <main id="main" className="flex-1">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-20">
            <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
              404 / NOTE NOT FOUND
            </div>
            <h1 className="font-display tracking-display text-[36px] sm:text-[56px] leading-[1] font-light max-w-[18ch] mb-6">
              That note is not in the archive.
            </h1>
            <a
              href="/notes"
              className="inline-block bg-black text-white px-5 py-3 font-mono text-[12px] tracking-mono font-semibold hover:bg-black/85 transition-colors"
            >
              ALL NOTES →
            </a>
          </div>
        </main>
        <SiteFooter mode="page" />
      </div>
    );
  }

  const others = notesData.filter((n) => n.slug !== note.slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-paper text-charcoal flex flex-col">
      <ReadingProgress />
      <SkipLink />
      <SiteHeader mode="page" />

      <main id="main" className="flex-1">
        <article aria-labelledby="note-heading">
          <section className="rule-b">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
              <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-12 sm:py-16">
                <MarginRail
                  sectionNum="N"
                  sectionLabel={note.category.toUpperCase()}
                  folio={`NOTE / ${note.slug.slice(0, 12).toUpperCase()}`}
                  note="Notes are written by the studio, about the work. No guest posts, no sponsored content."
                />

                <div className="col-span-12 lg:col-span-10">
                  <MobileFolioStrip
                    sectionNum="N"
                    sectionLabel={note.category.toUpperCase()}
                    folio="FIELD NOTE"
                  />

                  <a
                    href="/notes"
                    className="inline-block font-mono text-[11px] tracking-mono opacity-60 hover:opacity-100 mb-8"
                  >
                    ← ALL NOTES
                  </a>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] tracking-mono opacity-70 mb-5">
                    <span>{note.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>{note.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{note.readTime}</span>
                  </div>

                  <h1
                    id="note-heading"
                    className="font-display tracking-display text-[34px] sm:text-[52px] lg:text-[64px] leading-[1] font-light max-w-[20ch] mb-6"
                  >
                    {note.title}
                  </h1>

                  <p className="text-[17px] sm:text-[19px] leading-[1.6] max-w-prose opacity-90">
                    {note.excerpt}
                  </p>
                  <div className="mt-6">
                    <ShareRow />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rule-b">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
              <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-12 sm:py-16">
                <div className="col-span-12 lg:col-span-3">
                  <div className="font-mono text-[11px] tracking-mono opacity-60 lg:sticky lg:top-24">
                    FIELD NOTE
                    <br />
                    {note.date.toUpperCase()}
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-8 mt-6 lg:mt-0 space-y-7">
                  {note.paragraphs.map((para, i) => (
                    <p
                      key={i}
                      className="text-[16.5px] sm:text-[17.5px] leading-[1.75] max-w-prose"
                    >
                      {para}
                    </p>
                  ))}

                  <aside className="mt-10 border-l-2 border-black pl-5 py-2">
                    <div className="font-mono text-[10.5px] tracking-mono uppercase opacity-60 mb-2">
                      Key takeaway
                    </div>
                    <p className="font-display text-[20px] sm:text-[22px] tracking-display leading-[1.35]">
                      {note.keyTakeaway}
                    </p>
                  </aside>
                </div>
              </div>
            </div>
          </section>
        </article>

        <section className="rule-b bg-paper-tint">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-12 sm:py-16">
            <div className="font-mono text-[11px] tracking-mono opacity-60 mb-6">MORE NOTES</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {others.map((n) => (
                <a
                  key={n.slug}
                  href={`/notes/${n.slug}`}
                  className="group flex flex-col gap-3 border border-black p-6 no-underline text-inherit transition-colors hover:bg-black hover:text-white"
                >
                  <span className="font-mono text-[10.5px] tracking-mono opacity-60">
                    {n.date} · {n.category}
                  </span>
                  <span className="font-display text-[20px] sm:text-[22px] tracking-display leading-[1.15]">
                    {n.title}
                  </span>
                  <span className="font-mono text-[11px] tracking-mono opacity-70 mt-auto pt-3">
                    READ →
                  </span>
                </a>
              ))}
            </div>

            {(prev || next) && (
              <nav
                className="mt-10 pt-6 border-t border-black/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-mono text-[11px] tracking-mono"
                aria-label="Note navigation"
              >
                {prev ? (
                  <a href={`/notes/${prev.slug}`} className="underline opacity-70 hover:opacity-100">
                    ← {prev.title.toUpperCase()}
                  </a>
                ) : (
                  <span />
                )}
                {next && (
                  <a href={`/notes/${next.slug}`} className="underline opacity-70 hover:opacity-100">
                    {next.title.toUpperCase()} →
                  </a>
                )}
              </nav>
            )}
          </div>
        </section>

        <section className="bg-black text-white on-ink">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-16 sm:py-20">
            <h2 className="font-display tracking-display text-[30px] sm:text-[44px] leading-[1.02] font-light max-w-[20ch] mb-5">
              Have a manuscript, backlist, or digital system to discuss?
            </h2>
            <p className="text-[16px] leading-[1.65] opacity-85 max-w-prose mb-8">
              We take a small number of engagements each quarter and read every
              brief personally.
            </p>
            <a
              href="/#contact"
              className="inline-block bg-white text-black px-5 py-3 font-mono text-[12px] tracking-mono font-semibold border border-white hover:bg-transparent hover:text-white transition-colors"
            >
              SEND US YOUR BRIEF →
            </a>
          </div>
        </section>
      </main>

      <SiteFooter mode="page" />
    </div>
  );
}
