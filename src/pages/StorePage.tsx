import { useState } from "react";
import MarginRail from "@/components/MarginRail";
import MobileFolioStrip from "@/components/MobileFolioStrip";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SkipLink from "@/components/SkipLink";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useI18n, type Lang } from "@/lib/i18n";
import { products, getProduct } from "@/data/products";
import { CONTACT_EMAIL } from "@/lib/site";

const price = (p: { priceUsd: number }) => `$${p.priceUsd}`;

function BuyButton({ slug, label }: { slug: string; label: string }) {
  const [state, setState] = useState<"idle" | "busy" | "unconfigured" | "error">("idle");

  const buy = async () => {
    setState("busy");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setState(data.configured === false ? "unconfigured" : "error");
    } catch {
      setState("error");
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={buy}
        disabled={state === "busy"}
        className="inline-block bg-black text-white px-5 py-3 font-mono text-[12px] tracking-mono font-semibold hover:bg-black/85 transition-colors cursor-pointer disabled:opacity-60"
      >
        {state === "busy" ? "…" : `${label} →`}
      </button>
      {state === "unconfigured" && (
        <p className="mt-3 text-[13px] leading-[1.6] opacity-80 max-w-prose" role="status">
          Payments are being set up. To order now,{" "}
          <a className="underline" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Order: " + slug)}`}>
            email us
          </a>{" "}
          and we'll invoice you.
        </p>
      )}
      {state === "error" && (
        <p className="mt-3 text-[13px] leading-[1.6] opacity-80" role="status">
          Something went wrong starting checkout. Please try again or email us.
        </p>
      )}
    </div>
  );
}

export default function StorePage({ slug }: { slug?: string }) {
  const { t, lang } = useI18n();
  const L: Lang = lang === "pt" ? "pt" : "en";
  const product = slug ? getProduct(slug) : undefined;

  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<"all" | "digital" | "service">("all");

  useDocumentMeta({
    title: product
      ? `${product.name[L]} — The Office 360`
      : L === "pt"
        ? "Loja — The Office 360"
        : "Store — The Office 360",
    description: product?.blurb[L] ?? t("store.sub"),
    path: slug ? `/store/${slug}` : "/store",
    noindex: Boolean(slug) && !product,
  });

  const status =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("status") : null;

  // ---------------- product detail ----------------
  if (slug) {
    if (!product) {
      return (
        <div className="min-h-screen bg-paper text-charcoal flex flex-col">
          <SkipLink />
          <SiteHeader mode="page" />
          <main id="main" className="flex-1">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-20">
              <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">404 / STORE</div>
              <h1 className="font-display tracking-display text-[36px] sm:text-[56px] leading-[1] font-light max-w-[18ch] mb-6">
                That product is not in the store.
              </h1>
              <a href="/store" className="inline-block bg-black text-white px-5 py-3 font-mono text-[12px] tracking-mono font-semibold hover:bg-black/85 transition-colors">
                {t("store.back").toUpperCase()} →
              </a>
            </div>
          </main>
          <SiteFooter mode="page" />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-paper text-charcoal flex flex-col">
        <SkipLink />
        <SiteHeader mode="page" />
        <main id="main" className="flex-1 py-14 sm:py-20">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10">
              <MarginRail sectionNum="S" sectionLabel="STORE" folio="STORE" note={product.format[L]} />
              <div className="col-span-12 lg:col-span-10">
                <MobileFolioStrip sectionNum="S" sectionLabel="STORE" folio="STORE" />
                <a href="/store" className="inline-block font-mono text-[11px] tracking-mono opacity-60 hover:opacity-100 mb-8">
                  ← {t("store.back").toUpperCase()}
                </a>

                <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10">
                  <div className="col-span-12 md:col-span-5 mb-8 md:mb-0">
                    <img
                      src={product.image}
                      alt={`${product.name[L]} — cover`}
                      width={1024}
                      height={1536}
                      loading="lazy"
                      className="w-full border border-black object-cover aspect-[2/3]"
                    />
                  </div>
                  <div className="col-span-12 md:col-span-7">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="border border-black px-2.5 py-1 font-mono text-[10.5px] tracking-mono">
                        {product.format[L]}
                      </span>
                      <span className="border border-black px-2.5 py-1 font-mono text-[10.5px] tracking-mono opacity-70">
                        {product.kind === "digital" ? t("store.digital") : t("store.service")}
                      </span>
                    </div>
                    <h1 className="font-display tracking-display text-[30px] sm:text-[44px] leading-[1.02] font-light max-w-[20ch] mb-4">
                      {product.name[L]}
                    </h1>
                    <div className="font-mono text-[18px] tracking-mono font-semibold mb-5">{price(product)}</div>
                    <p className="text-[16px] leading-[1.65] max-w-prose opacity-90 mb-7">{product.blurb[L]}</p>

                    <div className="border border-black p-6 mb-6">
                      <div className="font-mono text-[10.5px] tracking-mono uppercase opacity-60 mb-3">
                        {t("store.includes")}
                      </div>
                      <ul className="space-y-2 text-[14.5px] leading-[1.6]">
                        {product.includes[L].map((inc) => (
                          <li key={inc} className="flex gap-2">
                            <span aria-hidden="true" className="opacity-50">—</span>
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <p className="font-mono text-[11px] tracking-mono opacity-70 mb-4">
                      {t("store.delivery").toUpperCase()}: {product.delivery[L]}
                    </p>
                    <BuyButton slug={product.slug} label={t("store.buy")} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <SiteFooter mode="page" />
      </div>
    );
  }

  // ---------------- catalog with search + filter ----------------
  const q = query.trim().toLowerCase();
  const filtered = products.filter((p) => {
    const inKind = kind === "all" || p.kind === kind;
    const inQuery =
      !q ||
      p.name.en.toLowerCase().includes(q) ||
      p.name.pt.toLowerCase().includes(q) ||
      p.blurb.en.toLowerCase().includes(q) ||
      p.format.en.toLowerCase().includes(q);
    return inKind && inQuery;
  });

  const filterBtn = (k: "all" | "digital" | "service", label: string) => (
    <button
      key={k}
      type="button"
      onClick={() => setKind(k)}
      aria-pressed={kind === k}
      className={
        "px-3 py-1.5 font-mono text-[11px] tracking-mono border cursor-pointer transition-colors " +
        (kind === k ? "bg-black text-white border-black" : "border-black/40 opacity-70 hover:opacity-100")
      }
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-paper text-charcoal flex flex-col">
      <SkipLink />
      <SiteHeader mode="page" />
      <main id="main" className="flex-1 py-14 sm:py-20" aria-labelledby="store-heading">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10">
            <MarginRail sectionNum="S" sectionLabel="STORE" folio="STORE" note={lang === "pt" ? "PDFs, modelos e serviços." : "PDF books, templates & services."} />
            <div className="col-span-12 lg:col-span-10">
              <MobileFolioStrip sectionNum="S" sectionLabel="STORE" folio="STORE" />
              <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">STORE</div>
              <h1 id="store-heading" className="font-display tracking-display text-[36px] sm:text-[52px] lg:text-[68px] leading-[0.98] font-light max-w-[20ch] mb-4">
                {t("store.title")}
              </h1>
              <p className="text-[16px] leading-[1.65] opacity-85 max-w-prose mb-8">{t("store.sub")}</p>

              {status === "success" && (
                <p className="mb-8 border border-black bg-paper-tint p-5 text-[14.5px] leading-[1.6] max-w-prose" role="status">
                  {t("store.success")}
                </p>
              )}
              {status === "cancelled" && (
                <p className="mb-8 border border-black/40 p-5 text-[14.5px] leading-[1.6] max-w-prose opacity-80" role="status">
                  {t("store.cancelled")}
                </p>
              )}

              {/* Search + filter */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                <div className="flex-1 max-w-md">
                  <label htmlFor="store-search" className="block font-mono text-[11px] tracking-mono opacity-60 mb-2">
                    {lang === "pt" ? "PESQUISAR NA LOJA" : "SEARCH THE STORE"}
                  </label>
                  <input
                    id="store-search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={lang === "pt" ? "posicionamento, auditoria, sessão…" : "positioning, audit, session…"}
                    className="w-full bg-transparent border-b border-black/50 focus:border-black py-2 text-[15px] outline-none transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2" role="group" aria-label="Filter">
                  {filterBtn("all", lang === "pt" ? "Tudo" : "All")}
                  {filterBtn("digital", lang === "pt" ? "Digitais" : "Digital")}
                  {filterBtn("service", lang === "pt" ? "Serviços" : "Services")}
                </div>
              </div>

              {filtered.length === 0 ? (
                <p className="text-[15px] leading-[1.6] opacity-70 border-t border-black pt-8">
                  {lang === "pt" ? "Nada encontrado para essa pesquisa." : "Nothing found for that search."}
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {filtered.map((p) => (
                    <a
                      key={p.slug}
                      href={`/store/${p.slug}`}
                      className="group flex flex-col border border-black no-underline text-inherit transition-colors hover:bg-black hover:text-white"
                    >
                      <div className="overflow-hidden border-b border-black">
                        <img
                          src={p.image}
                          alt={`${p.name[L]} — cover`}
                          width={1024}
                          height={1536}
                          loading="lazy"
                          className="w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="flex flex-col gap-2 p-5 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="font-mono text-[10px] tracking-mono opacity-60">{p.format[L]}</span>
                          <span className="font-mono text-[14px] tracking-mono font-semibold">{price(p)}</span>
                        </div>
                        <span className="font-display text-[20px] tracking-display leading-[1.15]">{p.name[L]}</span>
                        <span className="text-[13.5px] leading-[1.55] opacity-80">{p.blurb[L]}</span>
                        <span className="font-mono text-[11px] tracking-mono opacity-70 mt-auto pt-3">
                          {t("store.buy").toUpperCase()} →
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter mode="page" />
    </div>
  );
}
