import MarginRail from "@/components/MarginRail";
import MobileFolioStrip from "@/components/MobileFolioStrip";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SkipLink from "@/components/SkipLink";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { notesData } from "@/data/notes";

/**
 * Phase 8 — the editorial index.
 * Each note links to its own URL so it can be shared, indexed and given its own
 * metadata. The essays live in src/data/notes.ts; adding one there adds it here
 * and to the sitemap.
 */
export default function NotesPage() {
  useDocumentMeta({
    title: "Notes — THE OFFICE",
    description:
      "Field notes from THE OFFICE on book positioning, author websites, algorithmic book discovery, and building systems that outlast the season.",
    path: "/notes",
  });

  return (
    <div className="min-h-screen bg-paper text-charcoal flex flex-col">
      <SkipLink />
      <SiteHeader mode="page" />

      <main id="main" className="flex-1 py-14 sm:py-20" aria-labelledby="notes-heading">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10">
            <MarginRail
              sectionNum="N"
              sectionLabel="NOTES & INSIGHTS"
              folio="NOTES"
              note="Essays on book strategy, digital craft, search systems, and the business of publishing."
            />
            <div className="col-span-12 lg:col-span-10">
              <MobileFolioStrip sectionNum="N" sectionLabel="NOTES & INSIGHTS" folio="NOTES" />
              <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
                WRITING / FIELD NOTES
              </div>
              <h1
                id="notes-heading"
                className="font-display tracking-display text-[36px] sm:text-[52px] lg:text-[68px] leading-[0.98] font-light max-w-[20ch] mb-4"
              >
                Notes on the work.
              </h1>
              <p className="text-[16px] leading-[1.65] opacity-80 max-w-prose mb-12">
                We write about what we do: category architecture, editorial
                front-ends, algorithmic book discovery, and building systems
                that outlast the season. Written by the studio — no guest posts,
                no sponsored content.
              </p>

              <div className="space-y-12">
                {notesData.map((note) => (
                  <article
                    key={note.slug}
                    id={note.slug}
                    className="border-t border-black pt-8"
                  >
                    <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] tracking-mono opacity-60 mb-3">
                      <span>{note.date}</span>
                      <span aria-hidden="true">·</span>
                      <span>{note.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{note.readTime}</span>
                    </div>
                    <h2 className="font-display text-[26px] sm:text-[34px] tracking-display leading-tight mb-4">
                      <a
                        href={`/notes/${note.slug}`}
                        className="no-underline text-inherit hover:underline decoration-1 underline-offset-4"
                      >
                        {note.title}
                      </a>
                    </h2>
                    <p className="text-[16px] leading-[1.65] opacity-90 max-w-prose mb-6">
                      {note.excerpt}
                    </p>
                    <a
                      href={`/notes/${note.slug}`}
                      className="inline-flex items-center gap-2 border border-black px-4 py-2 font-mono text-[11px] tracking-mono uppercase font-semibold hover:bg-black hover:text-white transition-colors"
                    >
                      Read the full note ({note.readTime}) →
                    </a>
                  </article>
                ))}
              </div>

              {/* Inquiries callout */}
              <div className="mt-20 border border-black bg-paper-tint p-8 sm:p-10">
                <div className="font-mono text-[11px] tracking-mono opacity-60 mb-2">
                  THE OFFICE / EDITORIAL PRACTICE
                </div>
                <h2 className="font-display text-[24px] sm:text-[30px] tracking-display leading-snug mb-3">
                  Have a manuscript, backlist, or digital system to discuss?
                </h2>
                <p className="text-[15px] leading-[1.65] opacity-80 max-w-prose mb-6">
                  We take on a small number of engagements each quarter. We read
                  every brief personally, and we reply within two working days —
                  including when the answer is that we are not the right studio
                  for it.
                </p>
                <a
                  href="/#contact"
                  className="inline-flex items-center gap-2 bg-black text-white px-5 py-3 font-mono text-[12px] tracking-mono font-semibold hover:bg-black/80 transition-colors"
                >
                  SEND US YOUR BRIEF →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter mode="page" />
    </div>
  );
}
