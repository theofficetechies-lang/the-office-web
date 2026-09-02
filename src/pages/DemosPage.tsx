import { useState } from "react";
import MarginRail from "@/components/MarginRail";
import MobileFolioStrip from "@/components/MobileFolioStrip";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SkipLink from "@/components/SkipLink";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useI18n } from "@/lib/i18n";
import { checklistItems } from "@/data/checklist";
import { services } from "@/data/services";

/**
 * Demos & sample work. Everything here is either the real published report or
 * a clearly-labelled sample that shows the *shape* of a deliverable. No sample
 * is presented as a real client result.
 */
function SelfAudit() {
  const { lang } = useI18n();
  const P = lang === "pt";
  const [answers, setAnswers] = useState<boolean[]>(() => checklistItems.map(() => false));

  const yes = answers.filter(Boolean).length;
  const gaps = checklistItems.filter((_, i) => !answers[i]);
  const gapServices = [...new Set(gaps.map((g) => g.service))];

  return (
    <div className="border border-black p-6 sm:p-8 bg-white">
      <div className="font-mono text-[10.5px] tracking-mono uppercase opacity-60 mb-3">
        {P ? "Comece aqui" : "Start here"}
      </div>
      <h2 className="font-display text-[24px] sm:text-[30px] tracking-display leading-snug mb-2">
        {P ? "Auto-auditoria de discoverability" : "The 60-second discoverability self-audit"}
      </h2>
      <p className="text-[14.5px] leading-[1.65] opacity-85 max-w-prose mb-6">
        {P
          ? "Dez verificações que fazemos primeiro. Marque as que são verdadeiras hoje; mostramos onde estão as lacunas."
          : "Ten checks we run first. Tick the ones that are true today and we'll show you where the gaps are — the same logic we apply in a paid audit."}
      </p>

      <div className="space-y-3">
        {checklistItems.map((item, i) => (
          <label key={item.en} className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={answers[i]}
              onChange={() =>
                setAnswers((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
              }
              className="mt-1 h-4 w-4 accent-black"
            />
            <span className="text-[14.5px] leading-[1.55]">{P ? item.pt : item.en}</span>
          </label>
        ))}
      </div>

      <div className="mt-7 border-t border-black pt-5">
        <div className="font-mono text-[12px] tracking-mono opacity-80 mb-3">
          {P ? `RESULTADO: ${yes}/${checklistItems.length}` : `SCORE: ${yes}/${checklistItems.length}`}
        </div>
        {gapServices.length === 0 ? (
          <p className="text-[14.5px] leading-[1.6] opacity-85">
            {P
              ? "Sem lacunas óbvias — isto já é um backlist saudável."
              : "No obvious gaps — that is a healthy backlist. We'd look at compounding authority next."}
          </p>
        ) : (
          <div>
            <p className="text-[14.5px] leading-[1.6] opacity-85 mb-3">
              {P
                ? "Onde estão as lacunas, e o serviço que as trata:"
                : "Where the gaps are, and the service that addresses each:"}
            </p>
            <ul className="space-y-2">
              {gapServices.map((slug) => {
                const svc = services.find((s) => s.slug === slug);
                return (
                  <li key={slug} className="flex gap-2 text-[14px]">
                    <span aria-hidden="true" className="opacity-50">—</span>
                    <a href={`/services/${slug}`} className="underline font-semibold">
                      {svc?.title ?? slug}
                    </a>
                  </li>
                );
              })}
            </ul>
            <a
              href="/#contact"
              className="mt-5 inline-block bg-black text-white px-5 py-3 font-mono text-[12px] tracking-mono font-semibold hover:bg-black/85 transition-colors"
            >
              {P ? "QUER QUE NÓS O FAÇAMOS A SÉRIO? →" : "WANT US TO RUN IT FOR REAL? →"}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

const samplePositioning = {
  shelf: "Contemporary social novel with literary sentences — shelved between quiet literary fiction and book-club commercial fiction.",
  comps: [
    "Comp A — same register, weaker plot: sold on prose alone, underperformed.",
    "Comp B — same theme, louder packaging: over-promised, returned hard.",
    "The gap: literary sentences + a plot that moves, packaged as social novel.",
  ],
  line: "For readers who want a book-club story they don't have to apologize for, written by a sentence-maker.",
  notToClaim: "Do not claim 'for everyone.' Do not lead with the author's biography. Do not shelve as memoir-adjacent.",
};

const sampleReport = [
  { metric: "Overall grade", baseline: "E", week8: "C", note: "two tiers up" },
  { metric: "Visibility score", baseline: "12", week8: "55", note: "+43 pts" },
  { metric: "Indexed queries", baseline: "31", week8: "118", note: "metadata rebuild" },
  { metric: "Backlinks", baseline: "12", week8: "27", note: "more than doubled" },
];

export default function DemosPage() {
  const { lang } = useI18n();
  const P = lang === "pt";

  useDocumentMeta({
    title: P ? "Demos e exemplos — THE OFFICE 360" : "Demos & sample work — THE OFFICE 360",
    description: P
      ? "Audite a sua backlist, veja como posicionamos um livro e o que contém o nosso reporting, e descarregue o relatório completo."
      : "Audit your backlist, see how we position a book and what our reporting contains, and download the full report.",
    path: "/demos",
  });

  return (
    <div className="min-h-screen bg-paper text-charcoal flex flex-col">
      <SkipLink />
      <SiteHeader mode="page" />

      <main id="main" className="flex-1 py-14 sm:py-20" aria-labelledby="demos-heading">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10">
            <MarginRail
              sectionNum="D"
              sectionLabel="DEMOS / SAMPLE WORK"
              folio="DEMOS"
              note={P ? "O trabalho, às claras." : "The work, in the open."}
            />
            <div className="col-span-12 lg:col-span-10">
              <MobileFolioStrip sectionNum="D" sectionLabel="DEMOS / SAMPLE WORK" folio="DEMOS" />
              <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">DEMOS / SAMPLE WORK</div>
              <h1
                id="demos-heading"
                className="font-display tracking-display text-[36px] sm:text-[52px] lg:text-[68px] leading-[0.98] font-light max-w-[20ch] mb-6"
              >
                {P ? "Veja o trabalho, não as promessas." : "See the work, not the promises."}
              </h1>
              <p className="text-[16px] leading-[1.65] opacity-85 max-w-prose mb-10">
                {P
                  ? "Use a auditoria, leia um excerto de posicionamento e veja o que contém o nosso reporting — depois descarregue o relatório completo."
                  : "Run the audit, read a positioning excerpt, and see exactly what our reporting contains — then download the full report. Everything here is ours, and everything is inspectable."}
              </p>

              <div className="space-y-12">
                <SelfAudit />

                {/* Sample positioning document */}
                <div className="border border-black p-6 sm:p-8 bg-paper-tint">
                  <div className="font-mono text-[10.5px] tracking-mono uppercase opacity-60 mb-3">
                    {P ? "O método, na prática" : "The method, in practice"}
                  </div>
                  <h2 className="font-display text-[24px] sm:text-[30px] tracking-display leading-snug mb-4">
                    {P ? "Como posicionamos um livro" : "How we position a book"}
                  </h2>
                  <div className="space-y-5 max-w-prose">
                    <div>
                      <div className="font-mono text-[10.5px] tracking-mono opacity-60 mb-1">THE SHELF</div>
                      <p className="text-[15px] leading-[1.6]">{samplePositioning.shelf}</p>
                    </div>
                    <div>
                      <div className="font-mono text-[10.5px] tracking-mono opacity-60 mb-1">THE COMP SET</div>
                      <ul className="space-y-1.5 text-[15px] leading-[1.6]">
                        {samplePositioning.comps.map((c) => (
                          <li key={c} className="flex gap-2"><span aria-hidden="true" className="opacity-50">—</span><span>{c}</span></li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="font-mono text-[10.5px] tracking-mono opacity-60 mb-1">THE POSITIONING LINE</div>
                      <p className="font-display text-[19px] tracking-display leading-[1.4]">{samplePositioning.line}</p>
                    </div>
                    <div>
                      <div className="font-mono text-[10.5px] tracking-mono opacity-60 mb-1">WHAT NOT TO CLAIM</div>
                      <p className="text-[15px] leading-[1.6]">{samplePositioning.notToClaim}</p>
                    </div>
                  </div>
                </div>

                {/* Sample report + real download */}
                <div className="border border-black p-6 sm:p-8 bg-white">
                  <div className="font-mono text-[10.5px] tracking-mono uppercase opacity-60 mb-3">
                    {P ? "Relatórios" : "Reporting"}
                  </div>
                  <h2 className="font-display text-[24px] sm:text-[30px] tracking-display leading-snug mb-4">
                    {P ? "O que contém um relatório" : "What a report contains"}
                  </h2>
                  <table className="w-full max-w-2xl text-[14px] border-collapse">
                    <thead>
                      <tr className="border-b border-black text-left font-mono text-[11px] tracking-mono opacity-70">
                        <th className="py-2 pr-4">METRIC</th>
                        <th className="py-2 pr-4">BASELINE</th>
                        <th className="py-2 pr-4">WEEK 8</th>
                        <th className="py-2">NOTE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleReport.map((r) => (
                        <tr key={r.metric} className="border-b border-black/15">
                          <td className="py-2.5 pr-4">{r.metric}</td>
                          <td className="py-2.5 pr-4 font-mono">{r.baseline}</td>
                          <td className="py-2.5 pr-4 font-mono">{r.week8}</td>
                          <td className="py-2.5 opacity-70">{r.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="mt-4 text-[13px] leading-[1.6] opacity-70 max-w-prose">
                    {P
                      ? "Do nosso reporting de backlist. O relatório completo, com a metodologia por trás de cada número, está no PDF descarregável."
                      : "From our backlist reporting. The complete report, with the methodology behind every figure, is the downloadable PDF."}
                  </p>
                  <a
                    href="/downloads/amazon-seo-sample-report.pdf"
                    download="Amazon-SEO-Sample-Report-The-Office.pdf"
                    className="mt-5 inline-flex items-center gap-3 bg-black text-white px-5 py-3 font-mono text-[12px] tracking-mono font-semibold hover:bg-black/85 transition-colors"
                  >
                    <span>↓ Download the full report (PDF)</span>
                    <span className="opacity-60 text-[10px]">13 PAGES · REAL AUDIT</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter mode="page" />
    </div>
  );
}
