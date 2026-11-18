/**
 * Content integrity tests for the service catalogue.
 *
 * The expansion brief asks for breadth but forbids "empty, duplicate or
 * superficial service pages" and "doorway pages". Those two requirements pull in
 * opposite directions the moment you write 40 pages in one sitting, so the rule
 * is enforced here rather than promised in a document:
 *
 *   • every flagship slug has a written entry
 *   • no entry is a stub
 *   • no two entries share a sentence — the real test for duplicated filler
 *   • every related slug resolves, so no dead links ship
 *   • every slug has a stable, URL-safe form
 *
 *   npm run test:content
 */
import { readFileSync } from "node:fs";
import { serviceDetails } from "../src/data/serviceDetailIndex.ts";
import { serviceCatalog, PUBLISHED_SERVICES } from "../src/data/serviceCatalog.ts";
import { divisions } from "../src/data/divisions.ts";
import { industries } from "../src/data/industries.ts";
import { inquiryTypes } from "../src/data/inquiryTypes.ts";
import { resolveRelated } from "../src/data/serviceDetailIndex.ts";

let failures = 0;
function check(label: string, ok: boolean, detail = "") {
  if (ok) console.log(`  ✓ ${label}`);
  else {
    failures++;
    console.error(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

const flagship = serviceCatalog.filter((s) => s.tier === "flagship");
const bySlug = new Map(serviceDetails.map((d) => [d.slug, d]));

console.log(`Service catalogue: ${serviceCatalog.length} services across ${divisions.length} divisions`);
console.log(`${flagship.length} flagship (own page), ${serviceCatalog.length - flagship.length} catalogue (anchored)\n`);

/* ---------------------------------------------------------------- coverage */
console.log("Coverage:");
{
  const missing = flagship.filter((f) => !bySlug.has(f.slug)).map((f) => f.slug);
  check(
    `all ${flagship.length} flagship services have written content`,
    missing.length === 0,
    missing.length ? `${missing.length} missing: ${missing.slice(0, 6).join(", ")}${missing.length > 6 ? "…" : ""}` : ""
  );

  const orphan = serviceDetails.filter(
    (d) => !serviceCatalog.some((c) => c.slug === d.slug)
  ).map((d) => d.slug);
  check(
    "no detail exists for a slug that is not in the catalogue",
    orphan.length === 0,
    orphan.join(", ")
  );
}

/* ----------------------------------------------------------------- substance */
console.log("\nSubstance (no stubs):");
{
  const MIN_PARAGRAPH = 120;
  const problems: string[] = [];

  for (const d of serviceDetails) {
    if (d.summary.length < 140) problems.push(`${d.slug}: thin summary (${d.summary.length})`);
    if (d.problem.length < 240) problems.push(`${d.slug}: thin problem (${d.problem.length})`);
    if (d.approach.length < 3) problems.push(`${d.slug}: ${d.approach.length} approach paragraphs (need 3)`);
    if (d.benefits.length < 3) problems.push(`${d.slug}: ${d.benefits.length} benefits (need 3)`);
    if (d.scope.length < 5) problems.push(`${d.slug}: ${d.scope.length} scope items (need 5)`);
    if (d.deliverables.length < 3) problems.push(`${d.slug}: ${d.deliverables.length} deliverables (need 3)`);
    if (d.idealFor.length < 2) problems.push(`${d.slug}: ${d.idealFor.length} audience lines (need 2)`);
    if (d.faqs.length < 2) problems.push(`${d.slug}: ${d.faqs.length} FAQs (need 2)`);
    if (!d.pricing.trim()) problems.push(`${d.slug}: no pricing framing`);
    for (const p of d.approach) {
      if (p.length < MIN_PARAGRAPH) problems.push(`${d.slug}: short approach paragraph (${p.length})`);
    }
    for (const f of d.faqs) {
      if (f.a.length < 80) problems.push(`${d.slug}: thin FAQ answer (${f.a.length})`);
    }
  }
  check("every entry is substantive", problems.length === 0, problems.slice(0, 5).join("; "));
}

/* --------------------------------------------------- duplication (the core) */
console.log("\nDuplication (no template filler):");
{
  /** Normalise a sentence so cosmetic differences do not hide a copy. */
  const norm = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();

  const sentences = new Map<string, string[]>();

  const addSentences = (slug: string, text: string) => {
    for (const raw of text.split(/(?<=[.!?])\s+/)) {
      const n = norm(raw);
      // Short connective sentences are not meaningful duplicates.
      if (n.split(" ").length < 6) continue;
      const list = sentences.get(n) ?? [];
      list.push(slug);
      sentences.set(n, list);
    }
  };

  for (const d of serviceDetails) {
    addSentences(d.slug, d.tagline);
    addSentences(d.slug, d.summary);
    addSentences(d.slug, d.problem);
    d.approach.forEach((p) => addSentences(d.slug, p));
  }

  const dupes = [...sentences.entries()].filter(([, slugs]) => new Set(slugs).size > 1);
  check(
    "no sentence is reused across two service pages",
    dupes.length === 0,
    dupes
      .slice(0, 3)
      .map(([s, slugs]) => `"${s.slice(0, 60)}…" in ${[...new Set(slugs)].join(" & ")}`)
      .join(" | ")
  );

  // Also catch a whole section pasted between pages.
  const dupArrays = new Map<string, string[]>();
  const addList = (slug: string, items: string[]) => {
    const key = items.map(norm).join("|");
    const list = dupArrays.get(key) ?? [];
    list.push(slug);
    dupArrays.set(key, list);
  };
  for (const d of serviceDetails) {
    addList(d.slug, d.scope);
    addList(d.slug, d.benefits);
    addList(d.slug, d.deliverables);
  }
  const arrayDupes = [...dupArrays.entries()].filter(([, s]) => s.length > 1);
  check(
    "no scope/benefits/deliverables list is shared between pages",
    arrayDupes.length === 0,
    arrayDupes.map(([, s]) => s.join(" & ")).join(", ")
  );
}

/* -------------------------------------------------------------- related links */
console.log("\nLinks:");
{
  const dangling: string[] = [];
  for (const d of serviceDetails) {
    for (const rel of d.related) {
      if (!resolveRelated(rel)) dangling.push(`${d.slug} → ${rel}`);
    }
  }
  check("every related-service slug resolves", dangling.length === 0, dangling.join(", "));

  const selfReferential = serviceDetails.filter((d) => d.related.includes(d.slug));
  check(
    "no page lists itself as a related service",
    selfReferential.length === 0,
    selfReferential.map((d) => d.slug).join(", ")
  );
}

/* -------------------------------------------------------------------- slugs */
console.log("\nSlugs and taxonomy:");
{
  const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  const badSlug = serviceCatalog.filter((s) => !SLUG.test(s.slug)).map((s) => s.slug);
  check("every catalogue slug is URL-safe", badSlug.length === 0, badSlug.join(", "));

  const dupSlugs = serviceCatalog
    .map((s) => s.slug)
    .filter((s, i, a) => a.indexOf(s) !== i);
  check("no duplicate catalogue slugs", dupSlugs.length === 0, [...new Set(dupSlugs)].join(", "));

  const publishedCollision = serviceCatalog
    .filter((s) => (PUBLISHED_SERVICES as readonly string[]).includes(s.slug))
    .map((s) => s.slug);
  check(
    "the five published service URLs are not shadowed by the catalogue",
    publishedCollision.length === 0,
    publishedCollision.join(", ")
  );

  const unknownDivision = serviceCatalog.filter(
    (s) => !divisions.some((d) => d.id === s.division)
  ).map((s) => `${s.slug}:${s.division}`);
  check("every service belongs to a real division", unknownDivision.length === 0, unknownDivision.join(", "));

  // Flagship slugs declared on a division must exist in the catalogue, and the
  // two sources must agree about which services are flagship.
  const mismatches: string[] = [];
  for (const div of divisions) {
    for (const slug of div.flagshipSlugs) {
      const entry = serviceCatalog.find((s) => s.slug === slug);
      if (!entry) mismatches.push(`${div.id}: ${slug} not in catalogue`);
      else if (entry.division !== div.id) mismatches.push(`${div.id}: ${slug} is in ${entry.division}`);
      else if (entry.tier !== "flagship") mismatches.push(`${div.id}: ${slug} is tier ${entry.tier}`);
    }
  }
  check("division flagship lists agree with the catalogue", mismatches.length === 0, mismatches.join(", "));
}

/* ---------------------------------------------------------------- industries */
console.log("\nIndustries:");
{
  const bad = industries.filter((i) => i.services.some((s) => !resolveRelated(s)));
  check(`all ${industries.length} industries reference resolvable services`, bad.length === 0, bad.map((i) => i.slug).join(", "));

  const thin = industries.filter(
    (i) => i.challenges.length < 3 || i.opportunities.length < 3 || i.scenarios.length < 1
  );
  check("every industry has challenges, opportunities and a scenario", thin.length === 0, thin.map((i) => i.slug).join(", "));

  const dupIndustrySlugs = industries.map((i) => i.slug).filter((s, i, a) => a.indexOf(s) !== i);
  check("no duplicate industry slugs", dupIndustrySlugs.length === 0, dupIndustrySlugs.join(", "));
}

/* ------------------------------------------------------------ lead pathways */
/*
 * The brief form is the only place a visitor can convert, so drift between it and
 * the catalogue is a revenue defect, not a tidiness one. It previously offered the
 * five published publishing services and nothing else while the site advertised
 * six divisions — a visitor wanting a website had no honest option.
 */
console.log("\nLead pathways:");
{
  // SERVICE_CHOICES is a `as const` array in a .tsx-free module, so read it as text.
  const siteSrc = readFileSync(new URL("../src/lib/site.ts", import.meta.url), "utf8");
  const block = siteSrc.split("SERVICE_CHOICES")[1]?.split("] as const")[0] ?? "";
  const choices = [...block.matchAll(/value:\s*"([^"]+)"[^}]*?division:\s*"([^"]*)"/g)].map((m) => ({
    value: m[1],
    division: m[2],
  }));

  const uncovered = divisions
    .filter((d) => !choices.some((c) => c.division === d.id))
    .map((d) => d.id);
  check(
    "every division has a service choice in the brief form",
    uncovered.length === 0,
    `no box for: ${uncovered.join(", ")}`
  );

  const ghostDivisions = choices
    .filter((c) => c.division && !divisions.some((d) => d.id === c.division))
    .map((c) => `${c.value}:${c.division}`);
  check("no service choice names a division that does not exist", ghostDivisions.length === 0, ghostDivisions.join(", "));

  const dupValues = choices.map((c) => c.value).filter((v, i, a) => a.indexOf(v) !== i);
  check("no duplicate service choice values", dupValues.length === 0, dupValues.join(", "));

  // Every pathway tag must be unique and non-empty: tags are what leads carry.
  const missingTag = inquiryTypes.filter((t) => !t.tag || !t.tag.trim()).map((t) => t.id);
  check("every inquiry pathway has a routing tag", missingTag.length === 0, missingTag.join(", "));

  const dupTags = inquiryTypes.map((t) => t.tag).filter((t, i, a) => a.indexOf(t) !== i);
  check("no two inquiry pathways share a routing tag", dupTags.length === 0, dupTags.join(", "));

  /*
   * A pathway may preselect a division, and that division must (a) exist and
   * (b) have a box in the form. The old `services` field named individual form
   * labels that were renamed twice; this catches the same drift before it ships.
   */
  const ghostPathwayDivisions = inquiryTypes
    .filter((t) => t.division)
    .filter((t) => !divisions.some((d) => d.id === t.division))
    .map((t) => `${t.id}:${t.division}`);
  check(
    "every pathway's preselected division exists",
    ghostPathwayDivisions.length === 0,
    ghostPathwayDivisions.join(", ")
  );

  const unselectable = inquiryTypes
    .filter((t) => t.division)
    .filter((t) => !choices.some((c) => c.division === t.division))
    .map((t) => `${t.id}:${t.division}`);
  check(
    "every pathway's division can actually be preselected in the form",
    unselectable.length === 0,
    unselectable.join(", ")
  );
}

if (failures > 0) {
  console.error(`\n${failures} content check(s) failed.`);
  process.exit(1);
}
console.log("\nAll content checks passed.");
