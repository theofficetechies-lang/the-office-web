import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SkipLink from "@/components/SkipLink";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useI18n, type Lang } from "@/lib/i18n";

/**
 * Second lead magnet: a print-ready backlist audit checklist. Published as a
 * page (no fake PDF) with a print stylesheet, so "download" = your browser's
 * Save-as-PDF. Honest and maintenance-free.
 */
export default function ChecklistPage() {
  const { lang } = useI18n();
  const L: Lang = lang === "pt" ? "pt" : "en";
  const P = L === "pt";

  useDocumentMeta({
    title: P ? "Checklist de auditoria de backlist — THE OFFICE" : "Backlist audit checklist — THE OFFICE",
    description: P
      ? "Uma checklist imprimível para auditar a sua listagem na Amazon."
      : "A printable checklist for auditing your Amazon listing.",
    path: "/resources/backlist-audit-checklist",
  });

  const items: { en: string; pt: string }[] = [
    { en: "Title and subtitle state the reader and the promise — no keyword stuffing.", pt: "Título e subtítulo indicam o leitor e a promessa — sem enchimento de palavras-chave." },
    { en: "The 7 backend keyword fields avoid repeating words already in the title.", pt: "Os 7 campos de palavras-chave evitam repetir palavras já no título." },
    { en: "Backend fields capture latent intent: comp authors, settings, reader queries.", pt: "Os campos capturam intenção latente: autores comparáveis, cenários, perguntas de leitores." },
    { en: "The book sits in granular browse nodes, not only a crowded top-level category.", pt: "O livro está em nós de navegação granulares, não só numa categoria de topo sobrelotada." },
    { en: "The description front-loads the hook in the first two lines.", pt: "A descrição apresenta o gancho nas duas primeiras linhas." },
    { en: "Cover reads at thumbnail size and matches the shelf's genre signals.", pt: "A capa lê-se em miniatura e corresponde aos sinais de género da prateleira." },
    { en: "Reviews are answered and the most helpful critical review is addressed.", pt: "As avaliações são respondidas e a crítica mais útil é abordada." },
    { en: "Price is coherent with the comp set and the category's expectations.", pt: "O preço é coerente com os comparáveis e as expectativas da categoria." },
    { en: "A+ / enhanced content exists and leads with the strongest proof.", pt: "Existe conteúdo A+ / melhorado, a abrir com a prova mais forte." },
    { en: "You know your grade and visibility trend over the last 8 weeks.", pt: "Conhece a sua nota e a tendência de visibilidade das últimas 8 semanas." },
  ];

  return (
    <div className="min-h-screen bg-paper text-charcoal flex flex-col">
      <SkipLink />
      <SiteHeader mode="page" />

      <main id="main" className="flex-1 py-14 sm:py-20">
        <div className="mx-auto max-w-[800px] px-4 sm:px-6">
          <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
            {P ? "RECURSO / CHECKLIST" : "RESOURCE / CHECKLIST"}
          </div>
          <h1 className="font-display tracking-display text-[32px] sm:text-[48px] leading-[1] font-light max-w-[20ch] mb-4">
            {P ? "Checklist de auditoria de backlist." : "The backlist audit checklist."}
          </h1>
          <p className="text-[16px] leading-[1.65] opacity-85 max-w-prose mb-8">
            {P
              ? "Dez verificações que fazemos primeiro. Imprima ou guarde como PDF — é sua."
              : "Ten checks we run first. Print it or save it as a PDF — it's yours."}
          </p>

          <ol className="space-y-4 border-t border-black pt-6 checklist">
            {items.map((item, i) => (
              <li key={item.en} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="shrink-0 w-6 h-6 border border-black flex items-center justify-center font-mono text-[11px]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[15.5px] leading-[1.6]">{P ? item.pt : item.en}</span>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap items-center gap-4 no-print">
            <button
              type="button"
              onClick={() => window.print()}
              className="bg-black text-white px-5 py-3 font-mono text-[12px] tracking-mono font-semibold hover:bg-black/85 transition-colors cursor-pointer"
            >
              {P ? "IMPRIMIR / GUARDAR PDF ↓" : "PRINT / SAVE AS PDF ↓"}
            </button>
            <a href="/#contact" className="font-mono text-[12px] tracking-mono font-semibold border-b border-black">
              {P ? "QUER QUE NÓS O FAÇAMOS? →" : "WANT US TO RUN IT? →"}
            </a>
          </div>
        </div>
      </main>

      <SiteFooter mode="page" />
    </div>
  );
}
