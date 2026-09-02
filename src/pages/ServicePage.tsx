import { useEffect } from "react";
import MarginRail from "@/components/MarginRail";
import MobileFolioStrip from "@/components/MobileFolioStrip";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SkipLink from "@/components/SkipLink";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useI18n } from "@/lib/i18n";
import { services } from "@/data/services";

function Block({ label, items, tint = false }: { label: string; items: string[]; tint?: boolean }) {
  return (
    <section className={tint ? "rule-b bg-paper-tint" : "rule-b"}>
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-12 sm:py-16">
          <div className="col-span-12 lg:col-span-3">
            <div className="font-mono text-[11px] tracking-mono opacity-60">{label}</div>
          </div>
          <ul className="col-span-12 lg:col-span-9 mt-4 lg:mt-0 space-y-4">
            {items.map((item, i) => (
              <li key={item} className="flex gap-4 text-[15.5px] leading-[1.65]">
                <span className="font-mono text-[11px] tracking-mono opacity-50 pt-1 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="max-w-prose">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function ServicePage({ slug }: { slug: string }) {
  const { t } = useI18n();
  const service = services.find((s) => s.slug === slug);

  useDocumentMeta({
    title: service ? `${service.title} — THE OFFICE 360` : "Service not found — THE OFFICE 360",
    description: service?.what ?? "The service you were looking for is not in the archive.",
    path: `/services/${slug}`,
    noindex: !service,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  if (!service) {
    return (
      <div className="min-h-screen bg-paper text-charcoal flex flex-col">
        <SkipLink />
        <SiteHeader mode="page" />
        <main id="main" className="flex-1">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-20">
            <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">404 / SERVICE</div>
            <h1 className="font-display tracking-display text-[36px] sm:text-[56px] leading-[1] font-light max-w-[18ch] mb-6">
              That service is not in the archive.
            </h1>
            <a
              href="/#services"
              className="inline-block bg-black text-white px-5 py-3 font-mono text-[12px] tracking-mono font-semibold hover:bg-black/85 transition-colors"
            >
              {t("section.services").toUpperCase()} →
            </a>
          </div>
        </main>
        <SiteFooter mode="page" />
      </div>
    );
  }

  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);


  return (
    <div className="min-h-screen bg-paper text-charcoal flex flex-col">
      <SkipLink />
      <SiteHeader mode="page" />

      <main id="main" className="flex-1">
        <section className="rule-b">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-12 sm:py-20">
              <MarginRail
                sectionNum={service.n}
                sectionLabel={service.title.toUpperCase()}
                folio={`SERVICE / ${service.n}`}
                note={service.pricing}
              />
              <div className="col-span-12 lg:col-span-10">
                <MobileFolioStrip
                  sectionNum={service.n}
                  sectionLabel={service.title.toUpperCase()}
                  folio={`SERVICE / ${service.n}`}
                />
                <a href="/#services" className="inline-block font-mono text-[11px] tracking-mono opacity-60 hover:opacity-100 mb-8">
                  ← {t("section.services").toUpperCase()}
                </a>
                <h1 className="font-display tracking-display text-[34px] sm:text-[52px] lg:text-[64px] leading-[1] font-light max-w-[20ch] mb-4">
                  {service.title}
                </h1>
                <div className="font-mono text-[12px] tracking-mono opacity-70 mb-6">{service.tagline}</div>
                <p className="text-[17px] sm:text-[19px] leading-[1.6] max-w-prose opacity-90">{service.what}</p>
                <div className="mt-6 border border-black bg-paper-tint p-5 font-mono text-[11px] tracking-mono opacity-80 max-w-prose">
                  {t("common.pricing").toUpperCase()}: {service.pricing}
                </div>
              </div>
            </div>
          </div>
        </section>

        <Block label={t("common.analyze").toUpperCase()} items={service.analyze} tint />
        <Block label={t("common.actions").toUpperCase()} items={service.actions} />
        <Block label={t("common.receive").toUpperCase()} items={service.receive} tint />

        <section className="rule-b">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-12 sm:py-16">
              <div className="col-span-12 lg:col-span-3">
                <div className="font-mono text-[11px] tracking-mono opacity-60">{t("common.measured").toUpperCase()}</div>
              </div>
              <p className="col-span-12 lg:col-span-9 mt-4 lg:mt-0 text-[16px] leading-[1.7] max-w-prose">
                {service.measured}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-black text-white on-ink">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-16 sm:py-20">
            <h2 className="font-display tracking-display text-[30px] sm:text-[44px] leading-[1.02] font-light max-w-[20ch] mb-5">
              {t("section.contactTitle1")} <span className="italic">{t("section.contactTitle2")}</span> {t("section.contactTitle3")}
            </h2>
            <a
              href="/#contact"
              className="inline-block bg-white text-black px-5 py-3 font-mono text-[12px] tracking-mono font-semibold border border-white hover:bg-transparent hover:text-white transition-colors"
            >
              {t("cta.requestAnalysis").toUpperCase()} →
            </a>
          </div>
        </section>

        {others.length > 0 && (
          <section className="rule-b">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-12 sm:py-16">
              <div className="font-mono text-[11px] tracking-mono opacity-60 mb-6">
                {t("section.services").toUpperCase()}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                {others.map((s) => (
                  <a
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="group flex flex-col gap-3 border border-black p-6 no-underline text-inherit transition-colors hover:bg-black hover:text-white"
                  >
                    <span className="font-mono text-[10.5px] tracking-mono opacity-60">{s.n}</span>
                    <span className="font-display text-[20px] tracking-display leading-[1.15]">{s.title}</span>
                    <span className="font-mono text-[11px] tracking-mono opacity-70 mt-auto pt-3">
                      {t("common.readMore").toUpperCase()} →
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <SiteFooter mode="page" />
    </div>
  );
}
