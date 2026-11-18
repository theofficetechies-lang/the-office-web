import { useEffect } from "react";
import MarginRail from "@/components/MarginRail";
import MobileFolioStrip from "@/components/MobileFolioStrip";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SkipLink from "@/components/SkipLink";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useI18n, type Lang } from "@/lib/i18n";
import { getProject, projects, workNote, attributionPolicy, referencesLine } from "@/data/projects";

function Part({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <section className="rule-b">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-10 sm:py-14">
          <div className="col-span-12 lg:col-span-3">
            <div className="font-mono text-[11px] tracking-mono opacity-60">
              {`${num} / ${title.toUpperCase()}`}
            </div>
          </div>
          <div className="col-span-12 lg:col-span-9 mt-3 lg:mt-0">{children}</div>
        </div>
      </div>
    </section>
  );
}

/**
 * Part 2 §4 — the five-part case study: Problem, Strategy, Execution,
 * Measurement, Learning. Unverified patterns state method, not invented numbers;
 * attribution policy and a references line are stated plainly.
 */
export default function CaseStudyPage({ slug }: { slug: string }) {
  const { t, lang } = useI18n();
  const L: Lang = lang === "pt" ? "pt" : "en";
  const project = getProject(slug);

  useDocumentMeta({
    title: project ? `${project.title} — THE OFFICE 360` : "Case study not found — THE OFFICE 360",
    description: project?.summary ?? "The case study you were looking for is not in the archive.",
    path: `/work/${slug}`,
    noindex: !project,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen bg-paper text-charcoal flex flex-col">
        <SkipLink />
        <SiteHeader mode="page" />
        <main id="main" className="flex-1">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-20">
            <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">404 / CASE STUDY</div>
            <h1 className="font-display tracking-display text-[36px] sm:text-[56px] leading-[1] font-light max-w-[18ch] mb-6">
              That case study is not in the archive.
            </h1>
            <a
              href="/#work"
              className="inline-block bg-black text-white px-5 py-3 font-mono text-[12px] tracking-mono font-semibold hover:bg-black/85 transition-colors"
            >
              {t("section.work").toUpperCase()} →
            </a>
          </div>
        </main>
        <SiteFooter mode="page" />
      </div>
    );
  }

  const others = projects.filter((p) => p.slug !== project.slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-paper text-charcoal flex flex-col">
      <SkipLink />
      <SiteHeader mode="page" />

      <main id="main" className="flex-1">
        <section className="rule-b">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-12 sm:py-20">
              <MarginRail
                sectionNum={project.n.replace("P/", "")}
                sectionLabel={project.sector.toUpperCase()}
                folio={`WORK / ${project.n}`}
                note={project.duration}
              />
              <div className="col-span-12 lg:col-span-10">
                <MobileFolioStrip
                  sectionNum={project.n.replace("P/", "")}
                  sectionLabel={project.sector.toUpperCase()}
                  folio={`WORK / ${project.n}`}
                />
                <a href="/#work" className="inline-block font-mono text-[11px] tracking-mono opacity-60 hover:opacity-100 mb-8">
                  ← {t("section.work").toUpperCase()}
                </a>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] tracking-mono opacity-70 mb-5">
                  <span>{project.n}</span>
                  <span aria-hidden="true">·</span>
                  <span>{project.year}</span>
                  <span aria-hidden="true">·</span>
                  <span>{project.services.join(" / ")}</span>
                </div>
                <h1 className="font-display tracking-display text-[34px] sm:text-[52px] lg:text-[64px] leading-[1] font-light max-w-[20ch] mb-6">
                  {project.title}
                </h1>
                <p className="text-[17px] sm:text-[19px] leading-[1.6] max-w-prose opacity-90 mb-8">{project.summary}</p>

                {!project.verified && (
                  <p className="border border-black/25 bg-paper-tint p-5 text-[13px] leading-[1.65] max-w-prose opacity-90">
                    <span className="font-mono text-[10.5px] tracking-mono uppercase opacity-70 block mb-2">
                      {L === "pt" ? "Padrão de engagement" : "Engagement pattern"}
                    </span>
                    {attributionPolicy}
                  </p>
                )}
                {project.verified && project.client && (
                  <p className="border border-black p-5 text-[13px] leading-[1.65] max-w-prose">
                    <span className="font-mono text-[10.5px] tracking-mono uppercase opacity-70 block mb-2">
                      Verified engagement
                    </span>
                    Client: {project.client}
                    {project.result ? ` — ${project.result}` : ""}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <Part num="1" title={t("cs.problem")}>
          <p className="text-[16px] leading-[1.7] max-w-prose">{project.problem}</p>
        </Part>

        <Part num="2" title={t("cs.strategy")}>
          <p className="text-[16px] leading-[1.7] max-w-prose">{project.strategy}</p>
        </Part>

        <Part num="3" title={t("cs.execution")}>
          <ol className="space-y-5">
            {project.approach.map((step, i) => (
              <li key={step} className="flex gap-5 border-t border-black pt-4">
                <span className="font-mono text-[11px] tracking-mono opacity-50 pt-1 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[16px] leading-[1.7] max-w-prose">{step}</p>
              </li>
            ))}
          </ol>
        </Part>

        <Part num="4" title={t("cs.measurement")}>
          <p className="text-[16px] leading-[1.7] max-w-prose">{project.measurement}</p>
          {project.slug === "discoverability-backlist-audit" && (
            <a
              href="/downloads/amazon-seo-sample-report.pdf"
              download="Amazon-SEO-Sample-Report-The-Office.pdf"
              className="mt-6 inline-flex items-center gap-3 bg-black text-white px-5 py-3 font-mono text-[12px] tracking-mono font-semibold hover:bg-black/85 transition-colors"
            >
              <span>↓ Download the full report (PDF)</span>
              <span className="opacity-60 text-[10px]">13 PAGES · REAL AUDIT</span>
            </a>
          )}
        </Part>

        <Part num="5" title={t("cs.learning")}>
          <p className="text-[16px] leading-[1.7] max-w-prose">{project.learning}</p>
        </Part>

        <section className="rule-b bg-paper-tint">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-12 sm:py-16">
              <div className="col-span-12 lg:col-span-3">
                <div className="font-mono text-[11px] tracking-mono opacity-60">{t("common.receive").toUpperCase()}</div>
              </div>
              <ul className="col-span-12 lg:col-span-9 mt-4 lg:mt-0 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
                {project.deliverables.map((d) => (
                  <li key={d} className="flex gap-3 text-[15.5px] leading-[1.6]">
                    <span aria-hidden="true" className="opacity-50">—</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="rule-b">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-12 sm:py-16">
            <p className="text-[14px] leading-[1.7] max-w-prose opacity-80">{workNote}</p>
            <p className="mt-5 text-[14px] leading-[1.7] max-w-prose opacity-80">{referencesLine}</p>
            <a href="/#contact" className="mt-6 inline-block bg-black text-white px-5 py-3 font-mono text-[12px] tracking-mono font-semibold hover:bg-black/85 transition-colors">
              {t("cta.requestAnalysis").toUpperCase()} →
            </a>
          </div>
        </section>

        {others.length > 0 && (
          <section className="rule-b">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-12 sm:py-16">
              <div className="font-mono text-[11px] tracking-mono opacity-60 mb-6">MORE CASE STUDIES</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {others.map((p) => (
                  <a
                    key={p.slug}
                    href={`/work/${p.slug}`}
                    className="group flex flex-col gap-3 border border-black p-6 no-underline text-inherit transition-colors hover:bg-black hover:text-white"
                  >
                    <span className="font-mono text-[10.5px] tracking-mono opacity-60">{p.n} · {p.sector}</span>
                    <span className="font-display text-[20px] sm:text-[22px] tracking-display leading-[1.15]">{p.title}</span>
                    <span className="font-mono text-[11px] tracking-mono opacity-70 mt-auto pt-3">READ →</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="bg-black text-white on-ink">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-16 sm:py-20">
            <h2 className="font-display tracking-display text-[32px] sm:text-[48px] leading-[1] font-light max-w-[18ch] mb-5">
              Something like this on your desk?
            </h2>
            <a
              href="/#contact"
              className="inline-block bg-white text-black px-5 py-3 font-mono text-[12px] tracking-mono font-semibold border border-white hover:bg-transparent hover:text-white transition-colors"
            >
              {t("cta.requestAnalysis").toUpperCase()} →
            </a>
          </div>
        </section>
      </main>

      <SiteFooter mode="page" />
    </div>
  );
}
