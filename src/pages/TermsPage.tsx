import ManifestBar from "@/components/ManifestBar";
import MarginRail from "@/components/MarginRail";
import MobileFolioStrip from "@/components/MobileFolioStrip";

export default function TermsPage() {
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

      <main className="py-14 sm:py-20" aria-labelledby="terms-heading">
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
                  <h2 className="font-display text-[20px] tracking-display leading-tight mb-3">1. About these terms</h2>
                  <p>
                    These terms govern your use of theoffice.studio (the "Site"). They do not govern professional engagements, which are covered by separate agreements signed before work begins.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-[20px] tracking-display leading-tight mb-3">2. Intellectual property</h2>
                  <p>
                    All content on this site — text, design, code, and imagery — is the property of THE OFFICE STUDIO unless otherwise stated. You may not reproduce, distribute, or create derivative works without written permission.
                  </p>
                  <p className="mt-3">
                    Portfolio case studies are shared with client permission or are fully anonymised. Downloadable reports remain the property of their respective clients and are shared here as sample deliverables only.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-[20px] tracking-display leading-tight mb-3">3. No professional advice</h2>
                  <p>
                    Content on this site is for general information only. It does not constitute professional advice. Decisions based on site content are made at your own risk.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-[20px] tracking-display leading-tight mb-3">4. Limitation of liability</h2>
                  <p>
                    THE OFFICE STUDIO is not liable for any direct, indirect, incidental, or consequential damages arising from your use of the Site or any linked content. This includes but is not limited to loss of data, revenue, or business opportunity.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-[20px] tracking-display leading-tight mb-3">5. Links to other sites</h2>
                  <p>
                    The Site may contain links to third-party websites. We are not responsible for the content, privacy practices, or terms of those sites.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-[20px] tracking-display leading-tight mb-3">6. Changes to these terms</h2>
                  <p>
                    We may update these terms from time to time. The current version is always available at this URL. Continued use of the Site after changes constitutes acceptance.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-[20px] tracking-display leading-tight mb-3">7. Contact</h2>
                  <p>
                    Questions about these terms? Email <a href="mailto:theofficetechies@gmail.com" className="border-b border-black">theofficetechies@gmail.com</a>.
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
