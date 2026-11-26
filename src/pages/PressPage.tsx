import MarginRail from "@/components/MarginRail";
import MobileFolioStrip from "@/components/MobileFolioStrip";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SkipLink from "@/components/SkipLink";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useI18n } from "@/lib/i18n";
import { CONTACT_EMAIL } from "@/lib/site";

export default function PressPage() {
  const { lang } = useI18n();
  const P = lang === "pt";

  useDocumentMeta({
    title: P ? "Imprensa — THE OFFICE 360" : "Press & media kit — THE OFFICE 360",
    description: P
      ? "Factos do estúdio, logótipos e contactos de imprensa."
      : "Studio facts, logos, the sample deliverable, and press contacts.",
    path: "/press",
  });

  const facts = [
    { k: P ? "Nome" : "Name", v: "THE OFFICE 360" },
    { k: P ? "Fundado" : "Founded", v: "2021" },
    { k: P ? "Dimensão" : "Size", v: P ? "Quatro sócios, seis divisões" : "Four principals, six divisions" },
    { k: P ? "Bases" : "Bases", v: P ? "Lisboa & Nova Iorque" : "Lisbon & New York" },
    { k: P ? "Idiomas" : "Languages", v: "EN · PT" },
    { k: P ? "Serviços" : "Services", v: P ? "Estratégia de livros · Investigação · Web · Automação" : "Book strategy · Research · Web · Automation" },
  ];

  return (
    <div className="min-h-screen bg-paper text-charcoal flex flex-col">
      <SkipLink />
      <SiteHeader mode="page" />

      <main id="main" className="flex-1 py-14 sm:py-20" aria-labelledby="press-heading">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10">
            <MarginRail
              sectionNum="P"
              sectionLabel={P ? "IMPREENSA" : "PRESS / MEDIA KIT"}
              folio="PRESS"
              note={P ? "Factos, não adjectivos." : "Facts, not adjectives."}
            />
            <div className="col-span-12 lg:col-span-10">
              <MobileFolioStrip sectionNum="P" sectionLabel="PRESS / MEDIA KIT" folio="PRESS" />
              <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-mute mb-4">PRESS / MEDIA KIT</div>
              <h1
                id="press-heading"
                className="display-xl text-[36px] sm:text-[52px] lg:text-[68px] max-w-[20ch] mb-10"
              >
                {P ? "Imprensa e media kit." : "Press & media kit."}
              </h1>

              <div className="grid grid-cols-12 gap-x-6 gap-y-10">
                <div className="col-span-12 lg:col-span-7">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-mute mb-4">
                    {P ? "FACTOS DO ESTÚDIO" : "STUDIO FACTS"}
                  </div>
                  <dl className="border-t border-ink">
                    {facts.map((f) => (
                      <div key={f.k} className="grid grid-cols-12 border-b border-faint py-3">
                        <dt className="col-span-4 text-[11px] font-semibold uppercase tracking-[0.06em] text-mute">{f.k}</dt>
                        <dd className="col-span-8 text-[15px] leading-[1.5]">{f.v}</dd>
                      </div>
                    ))}
                  </dl>

                  <p className="mt-8 text-[15.5px] leading-[1.7] max-w-prose">
                    {P
                      ? "Para entrevistas, citações ou material de imprensa, escreva-nos. Respondemos em dois dias úteis."
                      : "For interviews, quotes or press material, write to us. We reply within two working days."}
                  </p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(P ? "Imprensa" : "Press enquiry")}`}
                    className="mt-5 inline-block btn-primary"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>

                <div className="col-span-12 lg:col-span-4 lg:col-start-9">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-mute mb-4">
                    {P ? "MATERIAIS" : "ASSETS"}
                  </div>
                  <ul className="space-y-3 text-[14px]">
                    <li>
                      <a href="/favicon.svg" download className="btn-secondary inline-block !py-2.5 !px-4 !text-[11.5px]">
                        ↓ {P ? "Logótipo (SVG)" : "Logo (SVG)"}
                      </a>
                    </li>
                    <li>
                      <a href="/og-image.png" download className="btn-secondary inline-block !py-2.5 !px-4 !text-[11.5px]">
                        ↓ {P ? "Imagem de partilha (PNG)" : "Share image (PNG)"}
                      </a>
                    </li>
                    <li>
                      <a href="/downloads/amazon-seo-sample-report.pdf" download className="btn-secondary inline-block !py-2.5 !px-4 !text-[11.5px]">
                        ↓ {P ? "Relatório de exemplo (PDF)" : "Sample deliverable (PDF)"}
                      </a>
                    </li>
                  </ul>
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
