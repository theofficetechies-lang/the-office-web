import ManifestBar from "@/components/ManifestBar";
import MarginRail from "@/components/MarginRail";
import MobileFolioStrip from "@/components/MobileFolioStrip";

const notes = [
  {
    slug: "what-book-positioning-actually-means",
    title: "What book positioning actually means",
    date: "August 2026",
    excerpt:
      "Most authors think positioning is a tagline. It is not. Positioning is the answer to a single question: what shelf does this book belong on, and why would someone who walks past every other title on that shelf stop for this one?",
  },
  {
    slug: "why-most-author-websites-fail",
    title: "Why most author websites fail",
    date: "July 2026",
    excerpt:
      "The typical author site is a digital CV: bio, book list, events, contact. It treats every visitor as someone who already knows who the author is. The problem is that most visitors do not.",
  },
  {
    slug: "how-to-audit-your-own-amazon-listing",
    title: "How to audit your own Amazon listing",
    date: "June 2026",
    excerpt:
      "Amazon is a search engine dressed as a shop. If your metadata is weak, your book is invisible. Here is a practical checklist for authors and publishers who want to improve discoverability without hiring an agency.",
  },
];

export default function NotesPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <ManifestBar />
      <header className="rule-b">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-4 flex items-center gap-6">
          <a
            href="/"
            className="font-display text-[20px] sm:text-[22px] tracking-display-tight font-semibold"
            aria-label="THE OFFICE — home"
          >
            THE&nbsp;OFFICE
            <span className="font-mono text-[10px] tracking-mono align-top ml-1 opacity-60">®</span>
          </a>
          <nav className="ml-auto hidden md:flex items-center gap-7 font-mono text-[12px] tracking-mono">
            <a href="/" className="hover:opacity-60">HOME</a>
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
              note="Short essays on publishing, craft, and the business of books."
            />
            <div className="col-span-12 lg:col-span-10">
              <MobileFolioStrip sectionNum="N" sectionLabel="NOTES & INSIGHTS" folio="NOTES" />
              <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
                WRITING / NOTES
              </div>
              <h1
                id="notes-heading"
                className="font-display tracking-display text-[36px] sm:text-[52px] lg:text-[68px] leading-[0.98] font-light max-w-[20ch] mb-10"
              >
                Notes on the work.
              </h1>

              <div className="space-y-10">
                {notes.map((note) => (
                  <article key={note.slug} className="border-t border-black pt-6">
                    <div className="font-mono text-[11px] tracking-mono opacity-60 mb-2">
                      {note.date}
                    </div>
                    <h2 className="font-display text-[22px] sm:text-[26px] tracking-display leading-tight mb-3">
                      {note.title}
                    </h2>
                    <p className="text-[15px] leading-[1.65] opacity-85 max-w-prose mb-4">
                      {note.excerpt}
                    </p>
                    <span className="font-mono text-[11px] tracking-mono opacity-50">
                      Full post coming soon.
                    </span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-black/20">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-6 flex flex-col gap-3 font-mono text-[11px] tracking-mono opacity-80 sm:flex-row sm:items-center">
          <div>© {new Date().getFullYear()} THE OFFICE STUDIO.</div>
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
