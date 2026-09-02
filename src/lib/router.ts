import { useEffect, useState } from "react";

/**
 * Minimal pathname router. The site is static; every route below is also
 * rewritten to /index.html in vercel.json so a hard load resolves here.
 */
export type Route =
  | { kind: "home" }
  | { kind: "privacy" }
  | { kind: "terms" }
  | { kind: "notesIndex" }
  | { kind: "note"; slug: string }
  | { kind: "work"; slug: string }
  | { kind: "service"; slug: string }
  | { kind: "press" }
  | { kind: "glossary" }
  | { kind: "checklist" }
  | { kind: "methodology" }
  | { kind: "demos" }
  | { kind: "notfound"; path: string };

const SLUG = /^([a-z0-9]+(?:-[a-z0-9]+)*)$/;

export function matchRoute(pathname: string): Route {
  const p = pathname.length > 1 ? pathname.replace(/\/+$/, "") : "/";

  if (p === "/" || p === "") return { kind: "home" };
  if (p === "/privacy") return { kind: "privacy" };
  if (p === "/terms") return { kind: "terms" };
  if (p === "/notes") return { kind: "notesIndex" };
  if (p === "/press") return { kind: "press" };
  if (p === "/glossary") return { kind: "glossary" };
  if (p === "/resources/backlist-audit-checklist") return { kind: "checklist" };
  if (p === "/methodology") return { kind: "methodology" };
  if (p === "/demos") return { kind: "demos" };

  const note = p.match(/^\/notes\/(.+)$/);
  if (note && SLUG.test(note[1])) return { kind: "note", slug: note[1] };

  const work = p.match(/^\/work\/(.+)$/);
  if (work && SLUG.test(work[1])) return { kind: "work", slug: work[1] };

  const service = p.match(/^\/services\/(.+)$/);
  if (service && SLUG.test(service[1])) return { kind: "service", slug: service[1] };

  return { kind: "notfound", path: p };
}

export function routeKey(route: Route): string {
  return "slug" in route ? `${route.kind}:${route.slug}` : route.kind;
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() =>
    matchRoute(typeof window === "undefined" ? "/" : window.location.pathname)
  );

  useEffect(() => {
    const onPop = () => setRoute(matchRoute(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return route;
}
