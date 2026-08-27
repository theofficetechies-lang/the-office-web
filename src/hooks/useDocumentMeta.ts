import { useEffect } from "react";
import { SITE_URL, STUDIO_NAME } from "@/lib/site";

interface MetaArgs {
  title: string;
  description: string;
  /** Path only, e.g. "/notes/why-most-author-websites-fail". */
  path: string;
  noindex?: boolean;
}

function setMeta(attr: "name" | "property", key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

/**
 * Phase 16 — per-route metadata. The static index.html carries the homepage's
 * tags; every other route rewrites title, description, canonical and the OG /
 * Twitter pair on mount so shared and crawled URLs describe the right page.
 */
export function useDocumentMeta({ title, description, path, noindex = false }: MetaArgs) {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;

    document.title = title;
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:type", path === "/" ? "website" : "article");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta(
      "name",
      "robots",
      noindex ? "noindex, follow" : "index, follow, max-image-preview:large"
    );

    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = url;

    const ogSite = document.head.querySelector<HTMLMetaElement>('meta[property="og:site_name"]');
    if (ogSite) ogSite.setAttribute("content", STUDIO_NAME);
  }, [title, description, path, noindex]);
}
