import MarginRail from "@/components/MarginRail";
import MobileFolioStrip from "@/components/MobileFolioStrip";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SkipLink from "@/components/SkipLink";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { CONTACT_EMAIL } from "@/lib/site";

export default function TermsPage() {
  useDocumentMeta({
    title: "Terms of service — THE OFFICE",
    description:
      "The terms that govern use of the THE OFFICE website. Professional engagements are covered by separate agreements signed before work begins.",
    path: "/terms",
  });

  return (
    <div className="min-h-screen bg-paper text-charcoal flex flex-col">
      <SkipLink />
      <SiteHeader mode="page" />

      <main id="main" className="flex-1 py-14 sm:py-20" aria-labelledby="terms-heading">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10">
            <MarginRail
              sectionNum="T"
              sectionLabel="TERMS OF SERVICE"
              folio="LEGAL II"
              note="These terms govern use of the site. Engagement terms are agreed separately."
            />
            <div className="col-span-12 lg:col-span-10">
              <MobileFolioStrip sectionNum="T" sectionLabel="TERMS OF SERVICE" folio="LEGAL II" />
              <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
                LEGAL / TERMS
              </div>
              <h1
                id="terms-heading"
                className="font-display tracking-display text-[36px] sm:text-[52px] lg:text-[68px] leading-[0.98] font-light max-w-[20ch] mb-10"
              >
                Terms of service.
              </h1>

              <div className="max-w-prose space-y-8 text-[15.5px] leading-[1.7]">
                <section>
                  <h2 className="font-display text-[20px] tracking-display leading-tight mb-3">
                    1. About these terms
                  </h2>
                  <p>
                    These terms govern your use of this website (the "Site"),
                    operated by THE OFFICE STUDIO. They do not govern
                    professional engagements, which are covered by separate
                    agreements signed before work begins.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-[20px] tracking-display leading-tight mb-3">
                    2. Intellectual property
                  </h2>
                  <p>
                    All content on this site — text, design, code, and imagery —
                    is the property of THE OFFICE STUDIO unless otherwise
                    stated. You may not reproduce, distribute, or create
                    derivative works without written permission.
                  </p>
                  <p className="mt-3">
                    The engagements described on this site are written as
                    generalised patterns: no client is identified and no result
                    is claimed. Downloadable reports remain the property of
                    their respective clients and are shared here as sample
                    deliverables only.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-[20px] tracking-display leading-tight mb-3">
                    3. No professional advice
                  </h2>
                  <p>
                    Content on this site, including the notes we publish, is for
                    general information only. It does not constitute professional
                    advice. Decisions based on site content are made at your own
                    risk.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-[20px] tracking-display leading-tight mb-3">
                    4. Limitation of liability
                  </h2>
                  <p>
                    THE OFFICE STUDIO is not liable for any direct, indirect,
                    incidental, or consequential damages arising from your use
                    of the Site or any linked content. This includes but is not
                    limited to loss of data, revenue, or business opportunity.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-[20px] tracking-display leading-tight mb-3">
                    5. Links to other sites
                  </h2>
                  <p>
                    The Site may contain links to third-party websites. We are
                    not responsible for the content, privacy practices, or terms
                    of those sites.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-[20px] tracking-display leading-tight mb-3">
                    6. Changes to these terms
                  </h2>
                  <p>
                    We may update these terms from time to time. The current
                    version is always available at this URL. Continued use of
                    the Site after changes constitutes acceptance.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-[20px] tracking-display leading-tight mb-3">
                    7. Contact
                  </h2>
                  <p>
                    Questions about these terms? Email{" "}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="border-b border-current">
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter mode="page" />
    </div>
  );
}
