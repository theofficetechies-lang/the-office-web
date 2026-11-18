import { useEffect } from "react";
import MarginRail from "@/components/MarginRail";
import MobileFolioStrip from "@/components/MobileFolioStrip";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SkipLink from "@/components/SkipLink";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useI18n } from "@/lib/i18n";
import { processStages } from "@/data/process";
import { divisions } from "@/data/divisions";
import { getServiceDetail, resolveRelated } from "@/data/serviceDetailIndex";
import { getCatalogService } from "@/data/serviceCatalog";
import type { ServiceDetail } from "@/data/serviceDetailTypes";

/**
 * Numbered list block — the existing service-page rhythm, reused.
 *
 * One component for scope, deliverables, benefits and audience so the page has a
 * single list style rather than four near-identical ones.
 */
function ListBlock({
  label,
  items,
  tint = false,
  numbered = true,
}: {
  label: string;
  items: string[];
  tint?: boolean;
  numbered?: boolean;
}) {
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
                {numbered && (
                  <span className="font-mono text-[11px] tracking-mono opacity-50 pt-1 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                )}
                {!numbered && (
                  <span aria-hidden="true" className="opacity-50 shrink-0 pt-1">
                    —
                  </span>
                )}
                <span className="max-w-prose">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** Prose block for the problem / approach sections. */
function ProseBlock({
  label,
  paragraphs,
  first,
}: {
  label: string;
  paragraphs: string[];
  first?: boolean;
}) {
  return (
    <section className="rule-b">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-12 sm:py-16">
          <div className="col-span-12 lg:col-span-3">
            <div className="font-mono text-[11px] tracking-mono opacity-60">{label}</div>
          </div>
          <div className="col-span-12 lg:col-span-9 mt-4 lg:mt-0 space-y-5">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className={
                  first && i === 0
                    ? "text-[17px] sm:text-[19px] leading-[1.6] max-w-prose opacity-90"
                    : "text-[15.5px] sm:text-[16px] leading-[1.7] max-w-prose opacity-90"
                }
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The six-stage method, rendered once per service page from the shared source.
 *
 * Reusing `processStages` rather than writing bespoke per-service process copy is
 * what keeps the 40 pages from contradicting each other — and it is the honest
 * position: the method really is the same, only the content of each stage differs.
 */
function ProcessBlock() {
  return (
    <section className="rule-b">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-12 sm:py-16">
          <div className="col-span-12 lg:col-span-3">
            <div className="font-mono text-[11px] tracking-mono opacity-60">HOW IT RUNS</div>
            <p className="mt-3 text-[13px] leading-[1.6] opacity-70 max-w-[26ch]">
              The same six stages on every engagement. Only what happens inside them changes.
            </p>
          </div>
          <ol className="col-span-12 lg:col-span-9 mt-6 lg:mt-0 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            {processStages.map((stage) => (
              <li key={stage.n} className="border-t border-black pt-3">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="font-mono text-[11px] tracking-mono opacity-60">{stage.n}</span>
                  <span className="font-display text-[19px] tracking-display leading-tight">
                    {stage.title}
                  </span>
                  <span className="font-mono text-[10.5px] tracking-mono opacity-50 ml-auto">
                    {stage.weight}
                  </span>
                </div>
                <p className="text-[13.5px] leading-[1.55] opacity-85">{stage.happens}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/** FAQ as a native disclosure list: no JS, keyboard-accessible by default. */
function FaqBlock({ faqs }: { faqs: ServiceDetail["faqs"] }) {
  return (
    <section className="rule-b">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-12 sm:py-16">
          <div className="col-span-12 lg:col-span-3">
            <div className="font-mono text-[11px] tracking-mono opacity-60">QUESTIONS</div>
          </div>
          <div className="col-span-12 lg:col-span-9 mt-6 lg:mt-0 divide-y divide-black/15 border-t border-black/15">
            {faqs.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer items-start gap-3 list-none [&::-webkit-details-marker]:hidden">
                  <span
                    aria-hidden="true"
                    className="font-mono text-[13px] leading-[1.4] opacity-60 group-open:opacity-100 shrink-0 w-3"
                  >
                    +
                  </span>
                  <span className="font-display text-[17px] sm:text-[18px] tracking-display leading-snug">
                    {f.q}
                  </span>
                </summary>
                <p className="mt-3 pl-6 text-[15px] leading-[1.7] max-w-prose opacity-85">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ServiceDetailPage({ slug }: { slug: string }) {
  const { t } = useI18n();
  const service = getServiceDetail(slug);
  const division = service
    ? divisions.find((d) => d.flagshipSlugs.includes(service.slug) || d.id === "web")
    : undefined;

  /*
   * The title used the slug ("corporate website development") rather than the
   * service's name, so every one of the 40 flagship pages shipped a lowercase
   * keyword string as its title. The name comes from the catalogue; the tagline
   * is already the h1, so repeating it in the title only wastes the space.
   */
  const serviceName = getCatalogService(slug)?.title;

  useDocumentMeta({
    title: service
      ? `${serviceName ?? service.tagline.replace(/\.$/, "")} — Services — THE OFFICE 360`
      : "Service not found — THE OFFICE 360",
    description: service?.summary ?? "The service you were looking for is not in the archive.",
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
              href="/services"
              className="inline-block bg-black text-white px-5 py-3 font-mono text-[12px] tracking-mono font-semibold hover:bg-black/85 transition-colors"
            >
              ALL SERVICES →
            </a>
          </div>
        </main>
        <SiteFooter mode="page" />
      </div>
    );
  }

  const related = service.related
    .map(resolveRelated)
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  return (
    <div className="min-h-screen bg-paper text-charcoal flex flex-col">
      <SkipLink />
      <SiteHeader mode="page" />

      <main id="main" className="flex-1">
        {/* HERO */}
        <section className="rule-b">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-12 sm:py-20">
              <MarginRail
                sectionNum="S"
                sectionLabel={service.slug.replace(/-/g, " ").toUpperCase()}
                folio={division ? division.n : "SERVICES"}
                note={service.duration ? `Typical shape: ${service.duration}` : service.pricing}
              />
              <div className="col-span-12 lg:col-span-10">
                <MobileFolioStrip
                  sectionNum="S"
                  sectionLabel={service.slug.replace(/-/g, " ").toUpperCase()}
                  folio={division ? division.n : "SERVICES"}
                />

                <nav
                  aria-label="Breadcrumb"
                  className="font-mono text-[11px] tracking-mono opacity-60 mb-8 flex flex-wrap items-center gap-2"
                >
                  <a href="/services" className="hover:opacity-100 underline-offset-2 hover:underline">
                    SERVICES
                  </a>
                  <span aria-hidden="true">/</span>
                  {division && (
                    <>
                      <a
                        href={`/services/${division.id}`}
                        className="hover:opacity-100 underline-offset-2 hover:underline"
                      >
                        {division.title.toUpperCase()}
                      </a>
                      <span aria-hidden="true">/</span>
                    </>
                  )}
                  <span aria-current="page" className="opacity-100">
                    {service.slug.replace(/-/g, " ").toUpperCase()}
                  </span>
                </nav>

                <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
                  {division ? division.title.toUpperCase() : "SERVICE"}
                </div>
                <h1 className="font-display tracking-display text-[34px] sm:text-[52px] lg:text-[62px] leading-[1] font-light max-w-[22ch] mb-5">
                  {service.tagline}
                </h1>
                <p className="text-[17px] sm:text-[19px] leading-[1.6] max-w-prose opacity-90">
                  {service.summary}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href={`/#contact`}
                    className="bg-black text-white px-5 py-3 font-mono text-[12px] tracking-mono font-semibold hover:bg-black/85 transition-colors"
                  >
                    DISCUSS THIS →
                  </a>
                  <span className="font-mono text-[11px] tracking-mono opacity-60">
                    {service.pricing}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ProseBlock label={t("common.problem").toUpperCase()} paragraphs={[service.problem]} first />
        <ProseBlock label="OUR APPROACH" paragraphs={service.approach} />
        <ListBlock label={t("common.youGet").toUpperCase()} items={service.benefits} tint />
        <ListBlock label="WHAT IS INCLUDED" items={service.scope} />
        <ListBlock label={t("common.receive").toUpperCase()} items={service.deliverables} tint />
        <ListBlock label={t("common.whoFor").toUpperCase()} items={service.idealFor} numbered={false} />
        <ProcessBlock />

        {service.examples && service.examples.length > 0 && (
          <section className="rule-b bg-paper-tint">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
              <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-12 sm:py-16">
                <div className="col-span-12 lg:col-span-3">
                  <div className="font-mono text-[11px] tracking-mono opacity-60">WHAT IT LOOKS LIKE</div>
                  <p className="mt-2 font-mono text-[10.5px] tracking-mono uppercase opacity-50">
                    Illustrative, not client work
                  </p>
                </div>
                <ul className="col-span-12 lg:col-span-9 mt-4 lg:mt-0 space-y-5">
                  {service.examples.map((ex) => (
                    <li
                      key={ex}
                      className="text-[15px] leading-[1.65] max-w-prose border-l-2 border-black/30 pl-4 opacity-90"
                    >
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        <FaqBlock faqs={service.faqs} />

        {/* CTA */}
        <section className="bg-black text-white on-ink">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-16 sm:py-20">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10">
              <div className="col-span-12 lg:col-span-8">
                <h2 className="font-display tracking-display text-[30px] sm:text-[44px] leading-[1.02] font-light max-w-[22ch] mb-5">
                  Tell us what you are <span className="italic">trying to make happen</span>.
                </h2>
                <p className="text-[15.5px] leading-[1.7] max-w-prose opacity-85 mb-7">
                  A human reads every brief. We reply within two working days — including when the
                  answer is that we are not the right studio, in which case we will name someone who is.
                </p>
                <a
                  href="/#contact"
                  className="inline-block bg-white text-black px-5 py-3 font-mono text-[12px] tracking-mono font-semibold border border-white hover:bg-transparent hover:text-white transition-colors"
                >
                  {t("cta.requestAnalysis").toUpperCase()} →
                </a>
              </div>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="rule-b">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-12 sm:py-16">
              <div className="font-mono text-[11px] tracking-mono opacity-60 mb-6">
                RELATED SERVICES
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {related.map((r) => (
                  <a
                    key={r.slug}
                    href={r.href}
                    className="group flex flex-col gap-3 border border-black p-5 no-underline text-inherit transition-colors hover:bg-black hover:text-white"
                  >
                    <span className="font-display text-[18px] tracking-display leading-[1.2]">
                      {r.title}
                    </span>
                    <span className="font-mono text-[11px] tracking-mono opacity-70 mt-auto pt-3">
                      {r.href.includes("#") ? "PART OF A DIVISION" : t("common.readMore").toUpperCase()} →
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
