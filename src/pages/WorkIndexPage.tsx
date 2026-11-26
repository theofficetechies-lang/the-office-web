import SkipLink from "../components/SkipLink";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { projects, workNote } from "../data/projects";

/**
 * /work — the portfolio index.
 *
 * The brief asks for a portfolio with client names and results. Every entry here is
 * `verified: false` — engagement patterns, not client case studies — so the index
 * says that at the top rather than in a footnote. The alternative, presenting the
 * patterns as completed client work, would be the single most damaging thing this
 * site could do, because it is the one claim a prospective client can disprove with
 * a phone call.
 */
export default function WorkIndexPage() {
  useDocumentMeta({
    title: "Work — THE OFFICE 360",
    description:
      "Engagement patterns from the studio's practice: publishing repositioning, discoverability audits, platform builds. Client identities are never claimed unless verified.",
    path: "/work",
  });

  const verified = projects.filter((p) => p.verified).length;

  return (
    <div className="min-h-screen bg-paper text-charcoal flex flex-col">
      <SkipLink />
      <SiteHeader mode="page" />

      <main id="main" className="flex-1">
        <section className="rule-b" aria-labelledby="work-heading">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 py-10 sm:py-16 lg:py-20">
            <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-mute mb-3">
              WORK / ENGAGEMENT PATTERNS
            </div>
            <h1
              id="work-heading"
              className="display-xl text-[40px] leading-[1.0] sm:text-[60px] sm:leading-[0.98] lg:text-[84px] lg:leading-[0.96] max-w-[16ch]"
            >
              The shape of the work.
            </h1>
            <p className="mt-6 text-[16.5px] leading-[1.7] max-w-prose opacity-90">
              {workNote}
            </p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-mute">
              <span>{projects.length} PUBLISHED PATTERNS</span>
              <span>{verified} CLIENT-VERIFIED</span>
              <span>{projects.length - verified} PATTERNS, NO CLIENT CLAIMED</span>
            </div>
          </div>
        </section>

        <section aria-labelledby="patterns-heading">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 pb-14 sm:pb-20">
            <h2 id="patterns-heading" className="sr-only">
              Engagement patterns
            </h2>
            <ul className="border-t border-ink">
              {projects.map((p, i) => (
                <li key={p.slug} className="border-b border-faint/20">
                  <a
                    href={`/work/${p.slug}`}
                    className="group grid grid-cols-12 gap-x-6 gap-y-3 py-6 sm:py-8 items-baseline"
                  >
                    <div className="col-span-12 sm:col-span-1 text-[10.5px] font-medium text-mute">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="col-span-12 sm:col-span-6">
                      <h3 className="font-display text-[23px] sm:text-[28px] leading-[1.15] group-hover:underline decoration-1 underline-offset-4">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-[14px] leading-[1.6] opacity-75 max-w-prose">
                        {p.summary}
                      </p>
                    </div>
                    <div className="col-span-6 sm:col-span-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-mute">
                      {p.sector.toUpperCase()}
                    </div>
                    <div className="col-span-6 sm:col-span-3 text-[10.5px] font-medium sm:text-right">
                      <span
                        className={
                          p.verified
                            ? "border border-ink px-2 py-0.5"
                            : "opacity-55"
                        }
                      >
                        {p.verified ? "CLIENT-VERIFIED" : "ENGAGEMENT PATTERN"}
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-10 border border-ink p-5 sm:p-6 bg-paper-tint max-w-3xl">
              <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-mute mb-2">
                WHY NOTHING HERE NAMES A CLIENT
              </div>
              <p className="text-[14.5px] leading-[1.7]">
                Publishing engagements are confidential by default: a novel's repositioning is
                commercially sensitive until the house announces it. We could write a page that
                implied otherwise, and it would be worth nothing the moment somebody checked.
                Where a client has agreed to be named, the entry will say so — verified, with
                their written consent on file. Until then, these describe how we work, not who we
                have worked for.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="work-cta">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 py-14 sm:py-20">
            <h2
              id="work-cta"
              className="display-xl text-[30px] sm:text-[46px] max-w-[22ch] mb-6"
            >
              Ask us for references instead.
            </h2>
            <p className="text-[16px] leading-[1.7] max-w-prose opacity-85 mb-6">
              We will put you in touch with clients who have agreed to speak to prospective
              clients, rather than publish their names on a website without asking.
            </p>
            <a
              href="/contact"
              className="inline-block btn-primary"
            >
              ASK FOR REFERENCES →
            </a>
          </div>
        </section>
      </main>

      <SiteFooter mode="page" />
    </div>
  );
}
