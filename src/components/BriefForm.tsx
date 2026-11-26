import { useRef, useState } from "react";
import { submitBrief, ApiError } from "@/lib/api";
import { useToast } from "@/hooks/useToast";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/utils/cn";
import { CONTACT_EMAIL } from "@/lib/site";
import {
  BUDGET_CHOICES,
  DISCOVERY_CHOICES,
  SCOPE_CHOICES,
  SERVICE_CHOICES,
  TIMELINE_CHOICES,
} from "@/lib/site";
import { getInquiryType } from "@/data/inquiryTypes";

/* ------------------------------------------------------------------ */
/* Phase 11 — the inquiry experience                                   */
/* ------------------------------------------------------------------ */

type FormStatus = "idle" | "submitting" | "sent" | "error";

interface BriefFormState {
  name: string;
  email: string;
  org: string;
  services: string[];
  brief: string;
  timeline: string;
  scope: string;
  budget: string;
  discovery: string;
  company_website: string;
}

const initial: BriefFormState = {
  name: "",
  email: "",
  org: "",
  services: [],
  brief: "",
  timeline: "",
  scope: "",
  budget: "",
  discovery: "",
  company_website: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @param inquiryType  Optional pathway id from src/data/inquiryTypes.ts. When a
 *   visitor arrives from a specific pathway, the matching division is
 *   pre-selected so they do not have to re-state what the link already told us,
 *   and the pathway's hint is shown above the fields. The id travels with the
 *   lead as `interest`, which is what makes routing possible without parsing the
 *   free-text brief.
 */
export default function BriefForm({ inquiryType }: { inquiryType?: string }) {
  const { addToast } = useToast();
  const { t } = useI18n();
  const pathway = inquiryType ? getInquiryType(inquiryType) : undefined;

  /*
   * Pre-select the pathway's division, not its individual service: the form now
   * offers one box per division, and the divisions are what the visitor actually
   * recognises. A pathway with no division (general, proposal, brief) starts empty.
   */
  const fromPathway = (): BriefFormState => {
    const division = pathway?.division;
    if (!division) return initial;
    const match = SERVICE_CHOICES.find((c) => "division" in c && c.division === division);
    return match ? { ...initial, services: [match.value] } : initial;
  };

  const [data, setData] = useState<BriefFormState>(fromPathway);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const set = <K extends keyof BriefFormState>(field: K, value: BriefFormState[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as string];
        if (Object.keys(next).length === 0) {
          setStatus("idle");
          setErrorMsg("");
        }
        return next;
      });
    }
  };

  const toggleService = (value: string) => {
    set(
      "services",
      data.services.includes(value)
        ? data.services.filter((s) => s !== value)
        : [...data.services, value]
    );
  };

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    const name = data.name.trim();
    const email = data.email.trim();
    const brief = data.brief.trim();

    if (!name) next.name = "Please enter your name";
    else if (name.length > 100) next.name = "Name must be under 100 characters";

    if (!email) next.email = "Please enter your email address";
    else if (!EMAIL_RE.test(email)) next.email = "Please enter a valid email address";
    else if (email.length > 254) next.email = "That email address is too long";

    if (data.services.length === 0)
      next.services = "Select at least one service, or choose 'Not sure yet'";

    if (!brief) next.brief = "Please enter your brief";
    else if (brief.length < 5) next.brief = "Please enter at least a few words";
    else if (brief.length > 5000) next.brief = "Brief must be under 5,000 characters";

    if (!data.timeline) next.timeline = "Choose a rough timeline";
    if (!data.scope) next.scope = "Choose the shape of the work";

    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    const found = validate();
    setErrors(found);

    if (Object.keys(found).length > 0) {
      setStatus("error");
      setErrorMsg("PLEASE COMPLETE THE REQUIRED FIELDS");
      addToast("Please complete the required fields before submitting.", "error");
      const firstKey = Object.keys(found)[0];
      document.getElementById(firstKey)?.focus();
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    const serviceLabel = data.services
      .map((v) => SERVICE_CHOICES.find((c) => c.value === v)?.label ?? v)
      .join(", ");

    const payload = {
      name: data.name.trim(),
      email: data.email.trim(),
      org: data.org.trim(),
      service: serviceLabel,
      brief: data.brief.trim(),
      timeline: TIMELINE_CHOICES.find((c) => c.value === data.timeline)?.label ?? data.timeline,
      scope: SCOPE_CHOICES.find((c) => c.value === data.scope)?.label ?? data.scope,
      budget: BUDGET_CHOICES.find((c) => c.value === data.budget)?.label ?? "",
      discovery:
        DISCOVERY_CHOICES.find((c) => c.value === data.discovery)?.label ?? "",
      interest: pathway?.tag ?? "",
      company_website: data.company_website.trim(),
    };

    try {
      const response = await submitBrief(payload);
      setStatus("sent");
      addToast(
        response.message ?? "Brief received. We reply within two working days.",
        "success"
      );
      setData(fromPathway());
      setErrors({});
      window.setTimeout(() => setStatus("idle"), 8000);
    } catch (err) {
      let message = `Unable to send the brief automatically. Please email us directly at ${CONTACT_EMAIL}`;

      if (err instanceof ApiError) {
        if (err.status === 429) {
          message = "Too many attempts. Please wait 15 minutes before trying again.";
        } else if (err.status === 400 && err.issues) {
          const fieldErrors: Record<string, string> = {};
          err.issues.forEach((issue) => {
            fieldErrors[issue.path] = issue.message;
          });
          setErrors(fieldErrors);
          message = "Please correct the highlighted fields below.";
        } else if (err.message) {
          message = err.message;
        }
      }

      setStatus("error");
      setErrorMsg("DELIVERY ISSUE · PLEASE EMAIL US DIRECTLY");
      addToast(message, "error");
    }
  }

  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    data.name ? `Brief from ${data.name}` : "Project Brief"
  )}&body=${encodeURIComponent(
    [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Organisation: ${data.org}`,
      `Services: ${data.services.join(", ")}`,
      `Timeline: ${data.timeline}`,
      `Scope: ${data.scope}`,
      `Budget: ${data.budget}`,
      `Found you via: ${data.discovery}`,
      "",
      data.brief,
    ].join("\n")
  )}`;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="col-span-12 lg:col-span-8 grid grid-cols-2 gap-x-5 gap-y-6"
      aria-label="Project brief"
      noValidate
    >
      {pathway && pathway.id !== "project-brief" && (
        <div className="col-span-2 border border-white/25 px-4 py-3">
          <div className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-signal">
            {pathway.label}
          </div>
          <p className="text-[13px] leading-[1.55] opacity-85">{pathway.hint}</p>
        </div>
      )}

      <Field
        id="name"
        label={t("form.name").toUpperCase()}
        type="text"
        autoComplete="name"
        required
        value={data.name}
        onChange={(v) => set("name", v)}
        error={errors.name}
      />
      <Field
        id="email"
        label={t("form.email").toUpperCase()}
        type="email"
        autoComplete="email"
        required
        value={data.email}
        onChange={(v) => set("email", v)}
        error={errors.email}
      />
      <Field
        id="org"
        label={t("form.org").toUpperCase()}
        type="text"
        autoComplete="organization"
        value={data.org}
        onChange={(v) => set("org", v)}
        error={errors.org}
      />

      {/* Required services — multi-select */}
      <fieldset className="col-span-2" aria-describedby={errors.services ? "services-err" : undefined}>
        <legend className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.05em] text-white/55">
          {t("form.services")} <span className="opacity-60 ml-1">*</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {SERVICE_CHOICES.map((choice) => {
            const checked = data.services.includes(choice.value);
            return (
              <label
                key={choice.value}
                className={cn(
                  "inline-flex items-center gap-2 border px-3 py-2 text-[12px] font-medium cursor-pointer transition-colors select-none",
                  checked
                    ? "bg-white text-ink border-white"
                    : "border-white/30 text-white/80 hover:border-white/70 hover:text-white",
                  errors.services && !checked && "border-red-400/70"
                )}
              >
                <input
                  type="checkbox"
                  name="services"
                  value={choice.value}
                  checked={checked}
                  onChange={() => toggleService(choice.value)}
                  className="sr-only"
                />
                <span aria-hidden="true" className="w-2.5 text-[9px] text-signal">
                  {checked ? "●" : ""}
                </span>
                {choice.label}
              </label>
            );
          })}
        </div>
        {errors.services && <ErrLine id="services-err">{errors.services}</ErrLine>}
      </fieldset>

      <div className="col-span-2">
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="brief"
            className={cn(
              "block text-[11.5px] font-semibold uppercase tracking-[0.05em] transition-colors",
              errors.brief ? "text-red-400" : "text-white/55"
            )}
          >
            {t("form.brief").toUpperCase()} <span className="opacity-50 ml-1">*</span>
          </label>
          <span
            className={cn(
              "text-[11px] tabular-nums",
              data.brief.length > 5000 ? "text-red-400" : "text-white/35"
            )}
            aria-live="polite"
          >
            {data.brief.length > 0 ? `${data.brief.length} / 5000 characters` : ""}
          </span>
        </div>
        <textarea
          id="brief"
          name="brief"
          required
          rows={6}
          value={data.brief}
          onChange={(e) => set("brief", e.target.value)}
          placeholder="What you are trying to make happen. Where it is stuck. Who it is for. Anything you already know about the deadline."
          aria-invalid={Boolean(errors.brief) || undefined}
          aria-describedby={errors.brief ? "brief-err" : undefined}
          className={cn(
            "w-full bg-transparent border-b py-2 text-[15px] outline-none resize-y min-h-[120px] placeholder:opacity-40 transition-colors",
            errors.brief
              ? "border-red-400 focus:border-red-400 text-white"
              : "border-white/50 focus:border-white text-white"
          )}
        />
        {errors.brief && <ErrLine id="brief-err">{errors.brief}</ErrLine>}
      </div>

      <Select
        id="timeline"
        label={t("form.timeline").toUpperCase()}
        required
        value={data.timeline}
        onChange={(v) => set("timeline", v)}
        options={TIMELINE_CHOICES.map((c) => ({ value: c.value, label: c.label }))}
        placeholder="When does this need to happen?"
        error={errors.timeline}
      />
      <Select
        id="scope"
        label={t("form.scope").toUpperCase()}
        required
        value={data.scope}
        onChange={(v) => set("scope", v)}
        options={SCOPE_CHOICES.map((c) => ({ value: c.value, label: c.label }))}
        placeholder="How much of it do you need?"
        error={errors.scope}
      />
      <Select
        id="budget"
        label={t("form.budget").toUpperCase()}
        value={data.budget}
        onChange={(v) => set("budget", v)}
        options={BUDGET_CHOICES.map((c) => ({ value: c.value, label: c.label }))}
        placeholder="Prefer not to say"
        error={errors.budget}
      />
      <Select
        id="discovery"
        label={t("form.discovery").toUpperCase()}
        value={data.discovery}
        onChange={(v) => set("discovery", v)}
        options={DISCOVERY_CHOICES.map((c) => ({ value: c.value, label: c.label }))}
        placeholder="Select one"
        error={errors.discovery}
      />

      {/* Honeypot — hidden from users, screen readers and text selection. */}
      <div className="hidden" aria-hidden="true" style={{ display: "none" }}>
        <label htmlFor="company_website">Website</label>
        <input
          id="company_website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={data.company_website}
          onChange={(e) => set("company_website", e.target.value)}
        />
      </div>

      <div className="col-span-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        <div className="text-[12px] max-w-[46ch] text-white/60" aria-live="polite">
          {status === "error" && errorMsg ? (
            <span className="text-red-400">{errorMsg}</span>
          ) : status === "sent" ? (
            <span className="text-emerald-400">
              RECEIVED. WE REPLY WITHIN TWO WORKING DAYS.
            </span>
          ) : (
            <span className="opacity-60">
              {t("form.reply")}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {status === "error" && (
            <a
              href={mailtoHref}
              className="text-[11.5px] underline decoration-1 underline-offset-4 text-white/70 hover:text-white"
            >
              EMAIL US DIRECTLY →
            </a>
          )}
          <button
            type="submit"
            disabled={status === "submitting"}
            aria-busy={status === "submitting"}
            className="btn-inverse disabled:opacity-60 disabled:cursor-wait cursor-pointer whitespace-nowrap"
          >
            {status === "submitting"
              ? t("form.sending")
              : status === "sent"
                ? t("form.sent")
                : status === "error"
                  ? `${t("form.tryAgain")} →`
                  : `${t("form.submit")} →`}
          </button>
        </div>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Fields                                                              */
/* ------------------------------------------------------------------ */

function Field({
  id,
  label,
  type,
  required,
  autoComplete,
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  autoComplete?: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
}) {
  return (
    <div className="col-span-2 sm:col-span-1">
      <label
        htmlFor={id}
        className={cn(
          "block text-[11.5px] font-semibold uppercase tracking-[0.05em] transition-colors mb-2",
          error ? "text-red-400" : "text-white/55"
        )}
      >
        {label}
        {required && <span className="opacity-50 ml-1">*</span>}
      </label>
      <input
        id={id}
        name={id}
        required={required}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn(
          "w-full bg-transparent border-b py-2 text-[15px] text-white outline-none transition-colors",
          error
            ? "border-red-400 focus:border-red-400 text-white"
            : "border-white/50 focus:border-white text-white"
        )}
      />
      {error && <ErrLine id={`${id}-err`}>{error}</ErrLine>}
    </div>
  );
}

function Select({
  id,
  label,
  required,
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  id: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  error?: string;
}) {
  return (
    <div className="col-span-2 sm:col-span-1">
      <label
        htmlFor={id}
        className={cn(
          "block text-[11.5px] font-semibold uppercase tracking-[0.05em] transition-colors mb-2",
          error ? "text-red-400" : "text-white/55"
        )}
      >
        {label}
        {required && <span className="opacity-50 ml-1">*</span>}
      </label>
      <select
        id={id}
        name={id}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn(
          "w-full bg-transparent border-b py-2 text-[15px] outline-none transition-colors cursor-pointer",
          error
            ? "border-red-400 focus:border-red-400 text-white"
            : "border-white/50 focus:border-white text-white"
        )}
      >
        <option value="" disabled className="text-black">
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="text-black">
            {o.label}
          </option>
        ))}
      </select>
      {error && <ErrLine id={`${id}-err`}>{error}</ErrLine>}
    </div>
  );
}

function ErrLine({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <p
      id={id}
      role="alert"
      className="mt-1.5 text-[11.5px] text-red-400 flex items-center gap-1"
    >
      <span aria-hidden="true">↑</span>
      <span>{children}</span>
    </p>
  );
}
