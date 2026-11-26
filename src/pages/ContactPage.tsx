import { useState } from "react";
import SkipLink from "../components/SkipLink";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import BriefForm from "../components/BriefForm";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { customerQuestions } from "../data/positioning";
import { CONTACT_EMAIL } from "../lib/site";

/**
 * /contact — a real page, because the brief lists it in the main navigation and
 * three other pages already point at "#contact".
 *
 * The form is the same component the homepage uses, so there is one brief pipeline
 * rather than two that can disagree. The page adds what a contact page owes a
 * visitor: what happens next, how long it takes, and what we need from them — plus
 * the four alternative requests the brief names (consultation, proposal, audit).
 */
export default function ContactPage() {
  useDocumentMeta({
    title: "Contact — THE OFFICE 360",
    description:
      "Send a brief, book a free consultation, request a proposal or ask for a website audit. THE OFFICE 360 replies within two working days.",
    path: "/contact",
  });

  /*
   * Each choice maps to a real inquiry pathway id, not a local string. The form
   * uses these to preselect a division and to tag the lead, so inventing a
   * front-end-only id would silently break attribution.
   */
  const modes = [
    { id: "project-brief", label: "Send a brief", hint: "Tell us what you are trying to do." },
    { id: "general", label: "Book a consultation", hint: "30 minutes, no charge, no pitch deck." },
    { id: "request-proposal", label: "Request a proposal", hint: "You have a defined scope and need a cost." },
    { id: "website-audit", label: "Request a website audit", hint: "You want to know what is wrong first." },
  ] as const;

  const [mode, setMode] = useState<string>(modes[0].id);
  const modeLabel =
    modes.find((m) => m.id === mode)?.label.toUpperCase() ?? "PROJECT BRIEF";

  return (
    <div className="min-h-screen bg-paper text-charcoal flex flex-col">
      <SkipLink />
      <SiteHeader mode="page" />

      <main id="main" className="flex-1">
        <section className="rule-b" aria-labelledby="contact-heading">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 py-10 sm:py-16 lg:py-20">
            <div className="grid grid-cols-12 gap-x-6 gap-y-10">
              <div className="col-span-12 lg:col-span-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-mute mb-3">
                  CONTACT / START
                </div>
                <h1
                  id="contact-heading"
                  className="display-xl text-[40px] leading-[1.0] sm:text-[58px] sm:leading-[0.98] lg:text-[76px] lg:leading-[0.96] max-w-[16ch]"
                >
                  Ready to build a smarter digital business?
                </h1>
                <p className="mt-6 text-[16.5px] leading-[1.7] max-w-prose opacity-90">
                  Four ways in, all reaching the same four people. Choose the one that matches
                  where you are — a rough idea, a defined scope, or a system you suspect is
                  costing you more than it should.
                </p>

                <div className="mt-8 space-y-3">
                  {modes.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMode(m.id)}
                      aria-pressed={mode === m.id}
                      className={[
                        "w-full text-left border px-4 py-3 transition-colors cursor-pointer",
                        mode === m.id
                          ? "border-black bg-black text-white"
                          : "border-black/30 hover:border-black",
                      ].join(" ")}
                    >
                      <div className="text-[11.5px] font-semibold">
                        {m.label.toUpperCase()}
                      </div>
                      <div
                        className={[
                          "text-[13px] leading-[1.5] mt-0.5",
                          mode === m.id ? "opacity-80" : "opacity-65",
                        ].join(" ")}
                      >
                        {m.hint}
                      </div>
                    </button>
                  ))}
                </div>

                <dl className="mt-10 border-t border-ink">
                  {[
                    ["EMAIL", CONTACT_EMAIL],
                    ["REPLY TIME", "Within two working days"],
                    ["HOURS", "Mon–Fri, 09:00–18:00 WET"],
                    ["BASED", "Lisbon & New York"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex flex-wrap items-baseline justify-between gap-2 border-b border-faint/20 py-2.5"
                    >
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-mute">{k}</dt>
                      <dd className="text-[11.5px] tabular-nums">
                        {k === "EMAIL" ? (
                          <a href={`mailto:${v}`} className="border-b border-faint">
                            {v}
                          </a>
                        ) : (
                          v
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="col-span-12 lg:col-span-6 lg:col-start-7">
                <div className="border border-ink p-5 sm:p-8">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-mute mb-4">
                    {modeLabel}
                  </div>
                  {/* Keyed on the pathway so switching mode remounts with a fresh
                      preselection instead of leaving the previous one applied. */}
                  <BriefForm key={mode} inquiryType={mode} />
                </div>

                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.06em] text-mute leading-relaxed">
                  YOUR DETAILS ARE STORED ON OUR OWN DATABASE AND NEVER SOLD. SEE THE{" "}
                  <a href="/privacy" className="border-b border-faint">
                    PRIVACY NOTICE
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT HAPPENS NEXT */}
        <section className="rule-b" aria-labelledby="next-heading">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 py-14 sm:py-20">
            <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-mute mb-3">
              WHAT HAPPENS NEXT
            </div>
            <h2
              id="next-heading"
              className="display-xl text-[30px] sm:text-[42px] max-w-[24ch] mb-10"
            >
              Three steps, no sales sequence.
            </h2>
            <ol className="grid grid-cols-12 gap-x-6 gap-y-8">
              {[
                {
                  n: "01",
                  t: "We read it",
                  b: "A principal reads every brief — not an assistant, not a form router. You get a reply within two working days, even if the answer is that we are not the right studio for this.",
                },
                {
                  n: "02",
                  t: "A conversation",
                  b: "Thirty minutes, free. We ask about the business, the constraints and what has already been tried. You leave with our honest read on whether the work is worth doing.",
                },
                {
                  n: "03",
                  t: "A written scope",
                  b: "If it is a fit, you get a scope with deliverables, timeline, cost and stated exclusions — before any invoice exists.",
                },
              ].map((s) => (
                <li key={s.n} className="col-span-12 sm:col-span-4">
                  <div className="border-t border-ink pt-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-mute mb-2">
                      {s.n}
                    </div>
                    <h3 className="font-display text-[21px] leading-[1.2] mb-2">{s.t}</h3>
                    <p className="text-[14.5px] leading-[1.65] opacity-85">{s.b}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* THE FIVE QUESTIONS */}
        <section aria-labelledby="questions-heading">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 py-14 sm:py-20">
            <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-mute mb-3">
              BEFORE YOU WRITE
            </div>
            <h2
              id="questions-heading"
              className="display-xl text-[30px] sm:text-[42px] max-w-[24ch] mb-10"
            >
              Five questions, answered without a call.
            </h2>
            <dl className="border-t border-ink">
              {customerQuestions.map((q) => (
                <div key={q.question} className="border-b border-faint/20 py-5">
                  <dt className="font-display text-[19px] leading-[1.25] mb-1.5">{q.question}</dt>
                  <dd className="text-[14.5px] leading-[1.65] opacity-85 max-w-prose">
                    {q.answer}{" "}
                    <a href={q.where} className="border-b border-faint text-[11.5px] font-medium">
                      MORE →
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      <SiteFooter mode="page" />
    </div>
  );
}
