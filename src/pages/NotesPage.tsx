import { useState } from "react";
import ManifestBar from "@/components/ManifestBar";
import MarginRail from "@/components/MarginRail";
import MobileFolioStrip from "@/components/MobileFolioStrip";
import { notesData, type NoteItem } from "@/data/notes";

export default function NotesPage() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const toggleNote = (slug: string) => {
    setActiveSlug((prev) => (prev === slug ? null : slug));
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <ManifestBar />
      <header className="rule-b">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-4 flex items-center justify-between">
          <a
            href="/"
            className="font-display text-[20px] sm:text-[22px] tracking-display-tight font-semibold"
            aria-label="THE OFFICE — home"
          >
            THE&nbsp;OFFICE
            <span className="font-mono text-[10px] tracking-mono align-top ml-1 opacity-60">®</span>
          </a>
          <nav className="flex items-center gap-7 font-mono text-[12px] tracking-mono">
            <a href="/" className="hover:opacity-60">HOME</a>
            <a href="/#services" className="hover:opacity-60 hidden sm:inline">SERVICES</a>
            <a href="/#work" className="hover:opacity-60 hidden sm:inline">WORK</a>
            <a href="/#contact" className="hover:opacity-60">CONTACT</a>
          </nav>
        </div>
      </header>

      <main className="py-14 sm:py-20" aria-labelledby="notes-heading">
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
                We write about what we do: category architecture, editorial front-ends, algorithmic book discovery, and building systems that outlast the season.
              </p>

              <div className="space-y-12">
                {notesData.map((note: NoteItem) => {
                  const isOpen = activeSlug === note.slug;
                  return (
                    <article
                      key={note.slug}
                      id={note.slug}
                      className="border-t border-black pt-8 transition-colors"
                    >
                      <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] tracking-mono opacity-60 mb-3">
                        <span>{note.date}</span>
                        <span>·</span>
                        <span>{note.category}</span>
                        <span>·</span>
                        <span>{note.readTime}</span>
                      </div>
                      <h2 className="font-display text-[26px] sm:text-[34px] tracking-display leading-tight mb-4">
                        {note.title}
                      </h2>
                      <p className="text-[16px] leading-[1.65] opacity-90 max-w-prose mb-6 font-normal">
                        {note.excerpt}
                      </p>

                      {isOpen ? (
                        <div className="space-y-6 pt-4 border-t border-black/15 max-w-prose">
                          {note.paragraphs.map((para, idx) => (
                            <p key={idx} className="text-[15.5px] leading-[1.75] opacity-85">
                              {para}
                            </p>
                          ))}
                          <div className="mt-8 border-l-2 border-black pl-5 py-2 font-mono text-[13px] tracking-mono leading-[1.6] opacity-90">
                            <strong>KEY TAKEAWAY:</strong> {note.keyTakeaway}
                          </div>
                          <div className="pt-4">
                            <button
                              type="button"
                              onClick={() => toggleNote(note.slug)}
                              className="font-mono text-[11px] tracking-mono underline opacity-70 hover:opacity-100 cursor-pointer"
                            >
                              ↑ COLLAPSE ESSAY
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleNote(note.slug)}
                          className="inline-flex items-center gap-2 border border-black px-4 py-2 font-mono text-[11px] tracking-mono uppercase font-semibold hover:bg-black hover:text-white transition-colors cursor-pointer"
                        >
                          Read Full Essay ({note.readTime}) →
                        </button>
                      )}
                    </article>
                  );
                })}
              </div>

              {/* Inquiries callout */}
              <div className="mt-20 border border-black p-8 sm:p-10">
                <div className="font-mono text-[11px] tracking-mono opacity-60 mb-2">
                  THE OFFICE / EDITORIAL PRACTICE
                </div>
                <h3 className="font-display text-[24px] sm:text-[30px] tracking-display leading-snug mb-3">
                  Have a manuscript, backlist, or digital system to discuss?
                </h3>
                <p className="text-[15px] leading-[1.65] opacity-80 max-w-prose mb-6">
                  We take on a small number of engagements each quarter. We read every brief personally.
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

      <footer className="border-t border-black/20">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-6 flex flex-col gap-3 font-mono text-[11px] tracking-mono opacity-80 sm:flex-row sm:items-center">
          <div>© {new Date().getFullYear()} THE OFFICE STUDIO. ALL RIGHTS RESERVED.</div>
          <div className="hidden sm:block opacity-50">/</div>
          <nav className="flex items-center gap-4">
            <a href="/privacy" className="hover:opacity-100 opacity-80 underline-offset-2 hover:underline">PRIVACY</a>
            <a href="/terms" className="hover:opacity-100 opacity-80 underline-offset-2 hover:underline">TERMS</a>
          </nav>
          <div className="sm:ml-auto">
            <a href="/" className="hover:opacity-100 opacity-80">← BACK TO HOME</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
