import SkipLink from "../components/SkipLink";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { notesData } from "../data/notes";

/**
 * /insights — the editorial index the transformation brief asks for.
 *
 * The site already publishes notes at /notes/<slug>; what was missing was an index
 * with the brief's topic framing (technology, AI & automation, growth, publishing,
 * strategy). Rather than invent a second content store, this groups the existing
 * notes by their own category field — one source of truth, two ways in.
 */
export default function InsightsPage() {
  useDocumentMeta({
    title: "Insights — THE OFFICE 360",
    description:
      "Written thinking on technology, AI and automation, digital growth, publishing and business strategy — from the studio that does the work.",
    path: "/insights",
  });

  const published = notesData;

  /* Group by the note's own category so this index cannot drift from the notes. */
  const byCategory = new Map<string, typeof published>();
  for (const note of published) {
    const key = (note.category ?? "Studio notes").toString();
    if (!byCategory.has(key)) byCategory.set(key, []);
    byCategory.get(key)!.push(note);
  }

  return (
    <div className="min-h-screen bg-paper text-charcoal flex flex-col">
      <SkipLink />
      <SiteHeader mode="page" />

      <main id="main" className="flex-1">
        <section className="rule-b" aria-labelledby="insights-heading">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 py-10 sm:py-16 lg:py-20">
            <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-mute mb-3">
              INSIGHTS / WRITING
            </div>
            <h1
              id="insights-heading"
              className="display-xl text-[40px] leading-[1.0] sm:text-[60px] sm:leading-[0.98] lg:text-[84px] lg:leading-[0.96] max-w-[16ch]"
            >
              Thinking, written down.
            </h1>
            <p className="mt-6 text-[16.5px] leading-[1.7] max-w-prose opacity-90">
              No content calendar and no filler. These are notes written when there was something
              specific to say — usually because a client question or a piece of work made it
              unavoidable.
            </p>
            <div className="mt-8 text-[11px] font-semibold uppercase tracking-[0.06em] text-mute">
              {published.length} PUBLISHED · {byCategory.size} TOPICS
            </div>
          </div>
        </section>

        {[...byCategory.entries()].map(([category, items], idx) => (
          <section key={category} className="rule-b" aria-labelledby={`cat-${idx}`}>
            <div className="mx-auto max-w-[1440px] px-5 sm:px-8 py-12 sm:py-16">
              <div className="grid grid-cols-12 gap-x-6 gap-y-8">
                <div className="col-span-12 lg:col-span-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-mute mb-2">
                    {String(idx + 1).padStart(2, "0")} / TOPIC
                  </div>
                  <h2
                    id={`cat-${idx}`}
                    className="display-lg text-[24px] sm:text-[30px]"
                  >
                    {category}
                  </h2>
                </div>
                <div className="col-span-12 lg:col-span-8 lg:col-start-5">
                  <ul className="border-t border-ink">
                    {items.map((note) => (
                      <li key={note.slug} className="border-b border-faint/20 py-4">
                        <a href={`/notes/${note.slug}`} className="group block">
                          <h3 className="font-display text-[21px] leading-[1.2] group-hover:underline decoration-1 underline-offset-4 mb-1">
                            {note.title}
                          </h3>
                          <p className="text-[14px] leading-[1.6] opacity-75 max-w-prose">
                            {note.excerpt}
                          </p>
                          <div className="mt-2 text-[10.5px] font-medium text-mute">
                            {note.date}
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        ))}

        <section aria-labelledby="insights-cta">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 py-14 sm:py-20">
            <h2
              id="insights-cta"
              className="display-xl text-[30px] sm:text-[46px] max-w-[22ch] mb-6"
            >
              Reading is not the same as starting.
            </h2>
            <a
              href="/contact"
              className="inline-block btn-primary"
            >
              START YOUR PROJECT →
            </a>
          </div>
        </section>
      </main>

      <SiteFooter mode="page" />
    </div>
  );
}
