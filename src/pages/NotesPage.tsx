import { useState } from "react";
import MarginRail from "@/components/MarginRail";
import MobileFolioStrip from "@/components/MobileFolioStrip";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SkipLink from "@/components/SkipLink";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useI18n } from "@/lib/i18n";
import { notesData } from "@/data/notes";

export default function NotesPage() {
  const { lang } = useI18n();
  const P = lang === "pt";
  const [query, setQuery] = useState("");

  useDocumentMeta({
    title: P ? "Notas — THE OFFICE 360" : "Notes — THE OFFICE 360",
    description: P
      ? "Notas do estúdio sobre posicionamento, web editorial, descoberta algorítmica de livros e sistemas."
      : "Field notes from THE OFFICE 360 on book positioning, author websites, algorithmic book discovery, and building systems that outlast the season.",
    path: "/notes",
  });

  const q = query.trim().toLowerCase();
  const filtered = q
    ? notesData.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.excerpt.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q) ||
          n.paragraphs.some((p) => p.toLowerCase().includes(q))
      )
    : notesData;

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
              note={P ? "Ensaios sobre o ofício." : "Essays on the work."}
            />
            <div className="col-span-12 lg:col-span-10">
              <MobileFolioStrip sectionNum="N" sectionLabel="NOTES & INSIGHTS" folio="NOTES" />
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="font-mono text-[11px] tracking-mono opacity-60">
                  {P ? "ESCRITA / NOTAS DE CAMPO" : "WRITING / FIELD NOTES"}
                </div>
                <a href="/rss.xml" className="font-mono text-[11px] tracking-mono underline opacity-70 hover:opacity-100">
                  RSS ↗
                </a>
              </div>
              <h1
                id="notes-heading"
                className="font-display tracking-display text-[36px] sm:text-[52px] lg:text-[68px] leading-[0.98] font-light max-w-[20ch] mb-4"
              >
                {P ? "Notas sobre o trabalho." : "Notes on the work."}
              </h1>
              <p className="text-[16px] leading-[1.65] opacity-80 max-w-prose mb-8">
                {P
                  ? "Escrevemos sobre o que fazemos: arquitetura de categoria, front-ends editoriais, descoberta algorítmica de livros e sistemas que duram."
                  : "We write about what we do: category architecture, editorial front-ends, algorithmic book discovery, and building systems that outlast the season."}
              </p>

              <div className="mb-10">
                <label htmlFor="notes-search" className="block font-mono text-[11px] tracking-mono opacity-60 mb-2">
                  {P ? "PESQUISAR NAS NOTAS" : "SEARCH THE NOTES"}
                </label>
                <input
                  id="notes-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={P ? "posicionamento, Amazon, IA…" : "positioning, Amazon, AI…"}
                  className="w-full max-w-md bg-transparent border-b border-black/50 focus:border-black py-2 text-[15px] outline-none transition-colors"
                />
                {q && (
                  <p className="mt-2 font-mono text-[11px] tracking-mono opacity-60" aria-live="polite">
                    {filtered.length} {P ? "resultado(s)" : "result(s)"}
                  </p>
                )}
              </div>

              <div className="space-y-12">
                {filtered.map((note) => (
                  <article key={note.slug} id={note.slug} className="border-t border-black pt-8">
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
                    <p className="text-[16px] leading-[1.65] opacity-90 max-w-prose mb-6">{note.excerpt}</p>
                    <a
                      href={`/notes/${note.slug}`}
                      className="inline-flex items-center gap-2 border border-black px-4 py-2 font-mono text-[11px] tracking-mono uppercase font-semibold hover:bg-black hover:text-white transition-colors"
                    >
                      {P ? `Ler a nota completa (${note.readTime})` : `Read the full note (${note.readTime})`} →
                    </a>
                  </article>
                ))}
                {q && filtered.length === 0 && (
                  <p className="text-[15px] leading-[1.6] opacity-70 border-t border-black pt-8">
                    {P ? "Nada encontrado para essa pesquisa." : "Nothing found for that search."}
                  </p>
                )}
              </div>

              <div className="mt-20 border border-black bg-paper-tint p-8 sm:p-10">
                <div className="font-mono text-[11px] tracking-mono opacity-60 mb-2">
                  THE OFFICE 360 / EDITORIAL PRACTICE
                </div>
                <h2 className="font-display text-[24px] sm:text-[30px] tracking-display leading-snug mb-3">
                  {P ? "Tem um manuscrito, catálogo ou sistema digital para discutir?" : "Have a manuscript, backlist, or digital system to discuss?"}
                </h2>
                <p className="text-[15px] leading-[1.65] opacity-80 max-w-prose mb-6">
                  {P
                    ? "Aceitamos poucos projetos por trimestre e lemos cada brief pessoalmente."
                    : "We take on a small number of engagements each quarter. We read every brief personally."}
                </p>
                <a
                  href="/#contact"
                  className="inline-flex items-center gap-2 bg-black text-white px-5 py-3 font-mono text-[12px] tracking-mono font-semibold hover:bg-black/80 transition-colors"
                >
                  {P ? "ENVIE-NOS O SEU BRIEF →" : "SEND US YOUR BRIEF →"}
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
