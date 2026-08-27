import MarginRail from "@/components/MarginRail";
import MobileFolioStrip from "@/components/MobileFolioStrip";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SkipLink from "@/components/SkipLink";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { CONTACT_EMAIL } from "@/lib/site";

export default function PrivacyPage() {
  useDocumentMeta({
    title: "Privacy notice — THE OFFICE",
    description:
      "How THE OFFICE collects, uses and stores personal data when you visit this site or submit a project brief. Plain language, no trackers, no ad networks.",
    path: "/privacy",
  });

  return (
    <div className="min-h-screen bg-paper text-charcoal flex flex-col">
      <SkipLink />
      <SiteHeader mode="page" />

      <main id="main" className="flex-1 py-14 sm:py-20" aria-labelledby="privacy-heading">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10">
            <MarginRail
              sectionNum="P"
              sectionLabel="PRIVACY NOTICE"
              folio="LEGAL I"
              note="Last reviewed: August 2026."
            />
            <div className="col-span-12 lg:col-span-10">
              <MobileFolioStrip sectionNum="P" sectionLabel="PRIVACY NOTICE" folio="LEGAL I" />
              <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
                LEGAL / PRIVACY
              </div>
              <h1
                id="privacy-heading"
                className="font-display tracking-display text-[36px] sm:text-[52px] lg:text-[68px] leading-[0.98] font-light max-w-[20ch] mb-10"
              >
                Privacy notice.
              </h1>

              <div className="max-w-prose space-y-8 text-[15.5px] leading-[1.7]">
                <section>
                  <h2 className="font-display text-[20px] tracking-display leading-tight mb-3">
                    1. What this notice covers
                  </h2>
                  <p>
                    This notice explains how THE OFFICE STUDIO collects, uses,
                    and stores personal data when you visit this site or submit
                    a project brief. It is written in plain language because
                    privacy notices should be readable.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-[20px] tracking-display leading-tight mb-3">
                    2. What we collect
                  </h2>
                  <p>
                    When you use the brief form, we collect your name, email
                    address, organisation, the services you selected, your
                    timeline, the shape of the work, an optional budget range,
                    how you found us, and the contents of your brief. The
                    submission is delivered to our inbox by Web3Forms, a form
                    delivery service. If we have configured a verified sending
                    domain, Resend may be used instead or in addition.
                  </p>
                  <p className="mt-3">
                    We do not store form submissions in a database on this site.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-[20px] tracking-display leading-tight mb-3">
                    3. Cookies and local storage
                  </h2>
                  <p>
                    This site sets no tracking cookies and loads no advertising
                    or analytics networks. The only thing written to your
                    browser is a single local-storage flag recording that you
                    dismissed the storage notice, so that it does not come back.
                    Clearing your browser data removes it.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-[20px] tracking-display leading-tight mb-3">
                    4. How we use your data
                  </h2>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>To respond to your brief or enquiry</li>
                    <li>To keep a record of our professional correspondence</li>
                    <li>To decide whether we are the right studio for the work</li>
                  </ul>
                  <p className="mt-3">
                    We do not sell your data. We do not share it with third
                    parties except as necessary to deliver the service — that
                    means the form delivery provider and, where used, the email
                    provider named above.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-[20px] tracking-display leading-tight mb-3">
                    5. How long we keep it
                  </h2>
                  <p>
                    Briefs and correspondence are retained for as long as
                    necessary to fulfil the purpose for which they were
                    collected, or for legal and professional record-keeping
                    requirements. Typically this means 3–6 years.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-[20px] tracking-display leading-tight mb-3">
                    6. Your rights
                  </h2>
                  <p>
                    You can ask us what data we hold about you, request
                    corrections, or ask us to delete it. Email{" "}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="border-b border-current">
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-[20px] tracking-display leading-tight mb-3">
                    7. Contact
                  </h2>
                  <p>
                    If you have questions about this notice, email us at{" "}
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
