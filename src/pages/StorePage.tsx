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

function price(p: { priceUsd: number }) {
  return `$${p.priceUsd}`;
}

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
      if (data.configured === false) setState("unconfigured");
      else setState("error");
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

  useDocumentMeta({
    title: product
      ? `${product.name[L]} — The Office 360`
      : L === "pt"
        ? "Loja — The Office 360"
        : "Store — The Office 360",
    description: product?.blurb[L] ?? (L === "pt" ? t("store.sub") : t("store.sub")),
    path: slug ? `/store/${slug}` : "/store",
    noindex: Boolean(slug) && !product,
  });

  const status = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("status") : null;

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
              <MarginRail
                sectionNum="S"
                sectionLabel="STORE"
                folio="STORE"
                note={product.kind === "digital" ? t("store.digital") : t("store.service")}
              />
              <div className="col-span-12 lg:col-span-10">
                <MobileFolioStrip sectionNum="S" sectionLabel="STORE" folio="STORE" />
                <a href="/store" className="inline-block font-mono text-[11px] tracking-mono opacity-60 hover:opacity-100 mb-8">
                  ← {t("store.back").toUpperCase()}
                </a>
                <div className="font-mono text-[11px] tracking-mono opacity-60 mb-3">
                  {product.kind === "digital" ? t("store.digital").toUpperCase() : t("store.service").toUpperCase()}
                </div>
                <h1 className="font-display tracking-display text-[34px] sm:text-[52px] leading-[1] font-light max-w-[20ch] mb-4">
                  {product.name[L]}
                </h1>
                <div className="font-mono text-[16px] tracking-mono font-semibold mb-6">{price(product)}</div>
                <p className="text-[16.5px] leading-[1.65] max-w-prose opacity-90 mb-8">{product.blurb[L]}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="border border-black p-6">
                    <div className="font-mono text-[10.5px] tracking-mono uppercase opacity-60 mb-3">{t("store.includes")}</div>
                    <ul className="space-y-2 text-[14.5px] leading-[1.6]">
                      {product.includes[L].map((inc) => (
                        <li key={inc} className="flex gap-2">
                          <span aria-hidden="true" className="opacity-50">—</span>
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border border-black p-6">
                    <div className="font-mono text-[10.5px] tracking-mono uppercase opacity-60 mb-3">{t("store.delivery")}</div>
                    <p className="text-[14.5px] leading-[1.6]">{product.delivery[L]}</p>
                    <div className="mt-5">
                      <BuyButton slug={product.slug} label={t("store.buy")} />
                    </div>
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

  // ---------------- catalog ----------------
  return (
    <div className="min-h-screen bg-paper text-charcoal flex flex-col">
      <SkipLink />
      <SiteHeader mode="page" />
      <main id="main" className="flex-1 py-14 sm:py-20" aria-labelledby="store-heading">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10">
            <MarginRail sectionNum="S" sectionLabel="STORE" folio="STORE" note={lang === "pt" ? "Digitais e serviços." : "Digital & services."} />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {products.map((p) => (
                  <a
                    key={p.slug}
                    href={`/store/${p.slug}`}
                    className="group flex flex-col gap-3 border border-black p-6 no-underline text-inherit transition-colors hover:bg-black hover:text-white"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-mono text-[10.5px] tracking-mono opacity-60">
                        {p.kind === "digital" ? t("store.digital") : t("store.service")}
                      </span>
                      <span className="font-mono text-[14px] tracking-mono font-semibold">{price(p)}</span>
                    </div>
                    <span className="font-display text-[22px] tracking-display leading-[1.15]">{p.name[L]}</span>
                    <span className="text-[14px] leading-[1.6] opacity-80">{p.blurb[L]}</span>
                    <span className="font-mono text-[11px] tracking-mono opacity-70 mt-auto pt-3">
                      {t("store.buy").toUpperCase()} →
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter mode="page" />
    </div>
  );
}
