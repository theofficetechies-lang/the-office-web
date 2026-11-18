import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SkipLink from "@/components/SkipLink";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { getCatalog, saveCatalog, resetCatalog, blankProduct } from "@/lib/catalog";
import type { Product } from "@/data/products";

const ADMIN_KEY = "the-office360:admin";
const PASSCODE =
  (import.meta as { env?: Record<string, string> }).env?.VITE_ADMIN_PASSCODE ?? "admin123";

/**
 * No-code store admin.
 *
 * Sign in with the admin passcode (VITE_ADMIN_PASSCODE, default "admin123" for
 * preview). Edits are saved to this browser via the catalog module and apply to
 * the store immediately — no code, no redeploy. To share edits with every
 * visitor you'd attach a shared store (Vercel KV/Postgres); the catalog module
 * is the single swap point.
 */
export default function AdminPage() {
  useDocumentMeta({ title: "Admin — The Office 360", description: "Store admin.", path: "/admin", noindex: true });

  const [authed, setAuthed] = useState(() => {
    try {
      return window.localStorage.getItem(ADMIN_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  const [items, setItems] = useState<Product[]>(() => getCatalog());
  const [saved, setSaved] = useState(false);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === PASSCODE) {
      try {
        window.localStorage.setItem(ADMIN_KEY, "1");
      } catch {
        // storage unavailable
      }
      setAuthed(true);
    } else {
      setErr("Wrong passcode.");
    }
  };

  const update = (slug: string, patch: Partial<Product>) => {
    setSaved(false);
    setItems((prev) => prev.map((p) => (p.slug === slug ? { ...p, ...patch } : p)));
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-paper text-charcoal flex flex-col">
        <SkipLink />
        <SiteHeader mode="page" />
        <main id="main" className="flex-1 flex items-center">
          <div className="mx-auto max-w-md w-full px-4">
            <div className="font-mono text-[11px] tracking-mono opacity-60 mb-3">ADMIN</div>
            <h1 className="font-display tracking-display text-[32px] leading-tight font-light mb-6">Store admin</h1>
            <form onSubmit={login} className="border border-black p-6 bg-paper-tint">
              <label htmlFor="admin-code" className="block font-mono text-[11px] tracking-mono opacity-60 mb-2">
                Passcode
              </label>
              <input
                id="admin-code"
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-white border border-black/40 px-3 py-2 text-[14px] outline-none focus:border-black mb-3"
              />
              {err && <p className="text-[12px] text-red-600 mb-2">{err}</p>}
              <button type="submit" className="bg-black text-white px-4 py-2.5 font-mono text-[11px] tracking-mono font-semibold hover:bg-black/85 cursor-pointer">
                SIGN IN →
              </button>
              <p className="mt-4 text-[12px] leading-[1.6] opacity-70">
                Default preview passcode: <code className="font-mono">admin123</code>. Set
                <code className="font-mono"> VITE_ADMIN_PASSCODE</code> to change it.
              </p>
            </form>
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
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <div className="font-mono text-[11px] tracking-mono opacity-60 mb-3">ADMIN / STORE</div>
          <h1 className="font-display tracking-display text-[36px] sm:text-[48px] leading-[1] font-light max-w-[20ch] mb-6">
            Manage the store
          </h1>
          <p className="text-[15px] leading-[1.65] opacity-80 max-w-prose mb-8">
            Edit names, prices, formats and covers, add or remove products, then save. Changes apply to the store
            immediately in this browser — no code, no redeploy.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-8">
            <button
              type="button"
              onClick={() => {
                saveCatalog(items);
                setSaved(true);
              }}
              className="bg-black text-white px-5 py-3 font-mono text-[12px] tracking-mono font-semibold hover:bg-black/85 cursor-pointer"
            >
              SAVE CHANGES
            </button>
            <button
              type="button"
              onClick={() => {
                setItems((prev) => [...prev, blankProduct()]);
                setSaved(false);
              }}
              className="border border-black px-5 py-3 font-mono text-[12px] tracking-mono font-semibold hover:bg-black hover:text-white cursor-pointer"
            >
              + ADD PRODUCT
            </button>
            <button
              type="button"
              onClick={() => {
                resetCatalog();
                setItems(getCatalog());
                setSaved(false);
              }}
              className="border border-black/40 px-5 py-3 font-mono text-[12px] tracking-mono opacity-70 hover:opacity-100 cursor-pointer"
            >
              RESET TO DEFAULTS
            </button>
            {saved && <span className="font-mono text-[12px] tracking-mono text-emerald-700">SAVED ✓</span>}
          </div>

          <div className="space-y-6">
            {items.map((p) => (
              <div key={p.slug} className="border border-black p-5 grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-4">
                  <label htmlFor={`name-en-${p.slug}`} className="block font-mono text-[10px] tracking-mono opacity-60 mb-1">NAME (EN)</label>
                  <input id={`name-en-${p.slug}`} value={p.name.en} onChange={(e) => update(p.slug, { name: { ...p.name, en: e.target.value } })}
                    className="w-full bg-white border border-black/40 px-2 py-1.5 text-[13px] outline-none focus:border-black" />
                  <label htmlFor={`name-pt-${p.slug}`} className="block font-mono text-[10px] tracking-mono opacity-60 mb-1 mt-2">NAME (PT)</label>
                  <input id={`name-pt-${p.slug}`} value={p.name.pt} onChange={(e) => update(p.slug, { name: { ...p.name, pt: e.target.value } })}
                    className="w-full bg-white border border-black/40 px-2 py-1.5 text-[13px] outline-none focus:border-black" />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <label htmlFor={`price-${p.slug}`} className="block font-mono text-[10px] tracking-mono opacity-60 mb-1">PRICE (USD)</label>
                  <input id={`price-${p.slug}`} type="number" min={0} value={p.priceUsd}
                    onChange={(e) => update(p.slug, { priceUsd: Number(e.target.value) || 0 })}
                    className="w-full bg-white border border-black/40 px-2 py-1.5 text-[13px] outline-none focus:border-black" />
                  <label htmlFor={`kind-${p.slug}`} className="block font-mono text-[10px] tracking-mono opacity-60 mb-1 mt-2">KIND</label>
                  <select id={`kind-${p.slug}`} value={p.kind} onChange={(e) => update(p.slug, { kind: e.target.value as Product["kind"] })}
                    className="w-full bg-white border border-black/40 px-2 py-1.5 text-[13px] outline-none focus:border-black">
                    <option value="digital">digital</option>
                    <option value="service">service</option>
                  </select>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor={`fmt-${p.slug}`} className="block font-mono text-[10px] tracking-mono opacity-60 mb-1">FORMAT (EN)</label>
                  <input id={`fmt-${p.slug}`} value={p.format.en} onChange={(e) => update(p.slug, { format: { ...p.format, en: e.target.value } })}
                    className="w-full bg-white border border-black/40 px-2 py-1.5 text-[13px] outline-none focus:border-black" />
                  <label htmlFor={`img-${p.slug}`} className="block font-mono text-[10px] tracking-mono opacity-60 mb-1 mt-2">COVER URL</label>
                  <input id={`img-${p.slug}`} value={p.image} onChange={(e) => update(p.slug, { image: e.target.value })}
                    className="w-full bg-white border border-black/40 px-2 py-1.5 text-[12px] outline-none focus:border-black" />
                </div>
                <div className="col-span-12 sm:col-span-3 flex sm:flex-col items-start sm:items-end gap-2 sm:justify-center">
                  <img src={p.image} alt="" className="w-14 h-20 object-cover border border-black" />
                  <button
                    type="button"
                    onClick={() => {
                      setItems((prev) => prev.filter((x) => x.slug !== p.slug));
                      setSaved(false);
                    }}
                    className="font-mono text-[11px] tracking-mono text-red-700 underline cursor-pointer"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-[13px] leading-[1.6] opacity-70 max-w-prose">
            Payments use Paystack (Nigeria + global cards). Add <code className="font-mono">VITE_PAYSTACK_PUBLIC_KEY</code> and{" "}
            <code className="font-mono">PAYSTACK_SECRET_KEY</code> to go live; customers must sign in before paying.
          </p>
        </div>
      </main>
      <SiteFooter mode="page" />
    </div>
  );
}
