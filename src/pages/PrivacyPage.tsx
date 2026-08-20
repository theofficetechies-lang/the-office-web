import ManifestBar from "@/components/ManifestBar";
import MarginRail from "@/components/MarginRail";
import MobileFolioStrip from "@/components/MobileFolioStrip";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <ManifestBar />
      <header className="rule-b">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-4 flex items-center gap-6">
          <a
            href="/"
            className="font-display text-[20px] sm:text-[22px] tracking-display-tight font-semibold"
            aria-label="THE OFFICE — home"
          >
            THE&nbsp;OFFICE
            <span className="font-mono text-[10px] tracking-mono align-top ml-1 opacity-60">®</span>
          </a>
          <nav className="ml-auto hidden md:flex items-center gap-7 font-mono text-[12px] tracking-mono">
            <a href="/" className="hover:opacity-60">HOME</a>
          </nav>
        </div>
      </header>

      <main className="py-14 sm:py-20" aria-labelledby="privacy-heading">
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
                  <h2 className="font-display text-[20px] tracking-display leading-tight mb-3">1. What this notice covers</h2>
                  <p>
                    This notice explains how THE OFFICE STUDIO collects, uses, and stores personal data when you visit this site or submit a project brief. It is written in plain language because privacy notices should be readable.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-[20px] tracking-display leading-tight mb-3">2. What we collect</h2>
                  <p>
                    When you use the contact form, we collect your name, email address, organisation, and the contents of your brief. This is sent via our form handler and emailed to us through Resend. We do not store form submissions in a database.
                  </p>
                  <p className="mt-3">
                    We do not use cookies for tracking by default. If analytics cookies are enabled, you will see a notice and can dismiss it. Analytics are opt-in, not opt-out.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-[20px] tracking-display leading-tight mb-3">3. How we use your data</h2>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>To respond to your brief or enquiry</li>
                    <li>To keep a record of our professional correspondence</li>
                    <li>To improve the site based on aggregate usage patterns (only if analytics are enabled)</li>
                  </ul>
                  <p className="mt-3">
                    We do not sell your data. We do not share it with third parties except as necessary to deliver the service (e.g., Resend for email delivery).
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-[20px] tracking-display leading-tight mb-3">4. How long we keep it</h2>
                  <p>
                    Briefs and correspondence are retained for as long as necessary to fulfil the purpose for which they were collected, or for legal and professional record-keeping requirements. Typically this means 3–6 years.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-[20px] tracking-display leading-tight mb-3">5. Your rights</h2>
                  <p>
                    You can ask us what data we hold about you, request corrections, or ask us to delete it. Email <a href="mailto:theofficetechies@gmail.com" className="border-b border-black">theofficetechies@gmail.com</a>.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-[20px] tracking-display leading-tight mb-3">6. Contact</h2>
                  <p>
                    If you have questions about this notice, email us at <a href="mailto:theofficetechies@gmail.com" className="border-b border-black">theofficetechies@gmail.com</a>.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-black/20">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-6 flex flex-col gap-3 font-mono text-[11px] tracking-mono opacity-80 sm:flex-row sm:items-center">
          <div>© {new Date().getFullYear()} THE OFFICE STUDIO.</div>
          <div className="hidden sm:block opacity-50">/</div>
          <nav className="flex items-center gap-4">
            <a href="/privacy" className="hover:opacity-100 opacity-80 underline-offset-2 hover:underline">PRIVACY</a>
            <a href="/terms" className="hover:opacity-100 opacity-80 underline-offset-2 hover:underline">TERMS</a>
          </nav>
          <div className="sm:ml-auto">
            <a href="/" className="hover:opacity-100 opacity-80">← BACK TO HOME</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
