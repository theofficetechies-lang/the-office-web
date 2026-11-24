import { useCallback, useState } from "react";
import SkipLink from "../components/SkipLink";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useI18n } from "../lib/i18n";

/**
 * Lead list (Phase 4, D4).
 *
 * Deliberately a separate page from /admin, because the two are protected in
 * different ways and conflating them would weaken the stronger one:
 *
 *   • /admin is a store preview tool. Its passcode is a build variable, ships in the
 *     public bundle, and is documented as a door rather than a lock.
 *   • This page reads customer enquiries. Its passcode is a server-side secret
 *     checked by api/leads.ts, and the data never leaves the server without it.
 *
 * The page holds no data until the passcode has been accepted, and it says so in
 * plain words when either the passcode or the database is not configured — the same
 * rule as everywhere else here: nothing may look like it works until it does.
 */

const PASSCODE_KEY = "the-office:admin-passcode";

type Lead = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  org: string | null;
  interest: string | null;
  services: string | null;
  timeline: string | null;
  scope: string | null;
  budget: string | null;
  discovery: string | null;
  brief: string;
  source: string | null;
  stage: string;
};

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ready"; leads: Lead[]; total: number }
  | { kind: "error"; message: string; code?: string };

export default function AdminLeadsPage() {
  useDocumentMeta({
    title: "Leads — The Office 360",
    description: "Lead pipeline.",
    path: "/admin/leads",
    noindex: true,
  });
  const { t } = useI18n();

  /*
   * Read the remembered passcode during the first render rather than in an effect.
   *
   * Setting it from an effect body is a cascading render that the lint rules catch,
   * and it would also flash an empty field before filling it. Reading once in the
   * initialiser is both simpler and what the value actually is: state that does not
   * change on its own.
   */
  const [passcode, setPasscode] = useState(() => {
    try {
      return window.localStorage.getItem(PASSCODE_KEY) ?? "";
    } catch {
      return "";
    }
  });
  const [state, setState] = useState<State>({ kind: "idle" });
  const [open, setOpen] = useState<string | null>(null);

  /**
   * Fetch and store the result.
   *
   * No synchronous setState before the await: `setState({kind:"loading"})` at the
   * top of this function was what the lint rule flagged when called from an effect,
   * because it renders before the request even starts. The response is the only
   * thing that changes state here, which is what an async fetch should look like.
   */
  const load = useCallback(async (code: string) => {
    try {
      const res = await fetch("/api/leads?limit=200", {
        headers: { "X-Admin-Passcode": code },
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || body.success !== true) {
        setState({
          kind: "error",
          message:
            body?.code === "admin_not_configured"
              ? "This deployment has no ADMIN_PASSCODE set, so the lead list stays closed."
              : body?.code === "storage_not_configured"
                ? "No lead database is connected, so there is nothing to list yet."
                : res.status === 401
                  ? "That passcode was rejected."
                  : body?.error || `Could not read leads (HTTP ${res.status}).`,
          code: body?.code,
        });
        return;
      }
      setState({ kind: "ready", leads: body.leads ?? [], total: body.total ?? 0 });
    } catch {
      setState({ kind: "error", message: "Could not reach the lead API." });
    }
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      window.localStorage.setItem(PASSCODE_KEY, passcode);
    } catch {
      /* storage unavailable — the passcode still works for this session */
    }
    void load(passcode);
  };

  const signOut = () => {
    try {
      window.localStorage.removeItem(PASSCODE_KEY);
    } catch {
      /* ignore */
    }
    setPasscode("");
    setState({ kind: "idle" });
  };

  return (
    <div className="min-h-screen bg-paper text-charcoal flex flex-col">
      <SkipLink />
      <SiteHeader mode="page" />
      <main id="main" className="flex-1 rule-t">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6 py-14 sm:py-20">
          <div className="font-mono text-[11px] tracking-mono opacity-60 mb-3">ADMIN / LEADS</div>
          <h1 className="font-display tracking-display text-[34px] sm:text-[46px] leading-[1] font-light max-w-[22ch] mb-5">
            The pipeline
          </h1>
          <p className="text-[15px] leading-[1.65] opacity-80 max-w-prose mb-8">
            Every brief submitted through the site, newest first. Protected by a passcode that is
            checked on the server, not in this page.
          </p>

          <form onSubmit={submit} className="border border-black p-5 sm:p-6 max-w-xl mb-10">
            <label
              htmlFor="lead-passcode"
              className="block font-mono text-[10.5px] tracking-mono opacity-60 mb-2"
            >
              ADMIN PASSCODE
            </label>
            <div className="flex flex-wrap gap-3">
              <input
                id="lead-passcode"
                type="password"
                autoComplete="current-password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="flex-1 min-w-[200px] bg-white border border-black/40 px-3 py-2.5 text-[14px] outline-none focus:border-black"
              />
              <button
                type="submit"
                className="bg-black text-white px-5 py-2.5 font-mono text-[12px] tracking-mono font-semibold hover:bg-black/85 cursor-pointer"
              >
                UNLOCK
              </button>
              {state.kind !== "idle" && (
                <button
                  type="button"
                  onClick={signOut}
                  className="border border-black/40 px-4 py-2.5 font-mono text-[12px] tracking-mono opacity-70 hover:opacity-100 cursor-pointer"
                >
                  CLEAR
                </button>
              )}
            </div>
            <p className="mt-3 font-mono text-[10.5px] tracking-mono opacity-60">
              THE PASSCODE IS CHECKED BY THE SERVER. NOTHING LOADS UNTIL YOU UNLOCK.
            </p>
          </form>

          {state.kind === "loading" && (
            <p className="font-mono text-[12px] tracking-mono opacity-70">LOADING…</p>
          )}

          {state.kind === "error" && (
            <div className="border border-black p-5 bg-paper-tint max-w-2xl">
              <p className="text-[14px] leading-[1.6]">{state.message}</p>
            </div>
          )}

          {state.kind === "ready" && (
            <>
              <div className="flex items-baseline justify-between border-b border-black pb-3 mb-6">
                <div className="font-mono text-[11px] tracking-mono opacity-60">
                  {state.total} TOTAL · SHOWING {state.leads.length}
                </div>
              </div>

              {state.leads.length === 0 ? (
                <p className="text-[15px] leading-[1.65] opacity-80 max-w-prose">
                  No briefs yet. This is a real empty state, not a placeholder — the table exists
                  and nothing has been written to it.
                </p>
              ) : (
                <ul className="space-y-0">
                  {state.leads.map((lead) => (
                    <li key={lead.id} className="border-t border-black/20 py-4">
                      <button
                        type="button"
                        onClick={() => setOpen(open === lead.id ? null : lead.id)}
                        className="w-full text-left cursor-pointer"
                        aria-expanded={open === lead.id}
                      >
                        <div className="grid grid-cols-12 gap-x-4 gap-y-1 items-baseline">
                          <div className="col-span-12 sm:col-span-4">
                            <div className="font-display text-[19px] leading-tight">
                              {lead.name}
                              {lead.org ? <span className="opacity-50"> · {lead.org}</span> : null}
                            </div>
                            <div className="font-mono text-[11px] tracking-mono opacity-60">
                              {lead.email}
                            </div>
                          </div>
                          <div className="col-span-6 sm:col-span-2 font-mono text-[11px] tracking-mono opacity-70">
                            {lead.stage.replace(/_/g, " ").toUpperCase()}
                          </div>
                          <div className="col-span-6 sm:col-span-3 font-mono text-[11px] tracking-mono opacity-70">
                            {lead.interest ?? "—"}
                          </div>
                          <div className="col-span-12 sm:col-span-3 font-mono text-[11px] tracking-mono opacity-60 sm:text-right">
                            {new Date(lead.created_at).toISOString().slice(0, 16).replace("T", " ")}
                          </div>
                        </div>
                      </button>

                      {open === lead.id && (
                        <div className="mt-4 border-l-2 border-black pl-4 space-y-3 max-w-3xl">
                          <p className="text-[14.5px] leading-[1.7] whitespace-pre-wrap">{lead.brief}</p>
                          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 font-mono text-[10.5px] tracking-mono">
                            {[
                              ["SERVICES", lead.services],
                              ["TIMELINE", lead.timeline],
                              ["SCOPE", lead.scope],
                              ["BUDGET", lead.budget],
                              ["DISCOVERY", lead.discovery],
                              ["SOURCE", lead.source],
                            ].map(([k, v]) => (
                              <div key={k}>
                                <dt className="opacity-50">{k}</dt>
                                <dd className="opacity-90">{v ?? "—"}</dd>
                              </div>
                            ))}
                          </dl>
                          <a
                            href={`mailto:${lead.email}?subject=${encodeURIComponent("Re: your brief")}`}
                            className="inline-block font-mono text-[11px] tracking-mono font-semibold border-b border-black"
                          >
                            {t("common.readMore").toUpperCase()} → REPLY BY EMAIL
                          </a>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </main>
      <SiteFooter mode="page" />
    </div>
  );
}
