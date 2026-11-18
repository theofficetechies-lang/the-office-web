import type { ServiceDetail } from "../serviceDetailTypes";

/**
 * Division D1 — Web Development & Digital Architecture.
 *
 * Eight flagship services. Each one is written to be distinguishable from its
 * neighbours: a corporate site, an e-commerce build, an application and a portal
 * fail in different ways, and the pages should say so rather than repeating a
 * template with the nouns swapped.
 *
 * No metrics, clients or credentials are claimed. Where a page would benefit
 * from an example, it is labelled illustrative.
 */
export const webServiceDetails: ServiceDetail[] = [
  {
    slug: "corporate-website-development",
    tagline: "A site that answers the questions that lose you the deal.",
    summary:
      "A corporate site is not a brochure; it is the place a serious buyer checks before they reply to you. We build the version that states what the company does, for whom, at what shape of engagement — and can be maintained by the people who work there.",
    problem:
      "Most corporate sites describe a company's capabilities in the language of its own industry, then bury the three facts a buyer actually needs: what you do, who you do it for, and what working with you looks like. The result reads well to the people who wrote it and generates polite silence from everyone else. The site is also usually unmaintainable, so it drifts out of date within two quarters and the drift is invisible until someone senior reads it by accident.",
    approach: [
      "We start from the buying conversation, not the org chart. What does a qualified prospect need to know before they will take a call, and what do they need to see to rule you out early so neither side wastes a month?",
      "Information architecture comes before visual design. We decide the pages, their order and the path between them, then write the copy that fills them — because most corporate site problems are editorial problems wearing a design costume.",
      "The build is deliberately conservative: a stack your team can hire for, a CMS the marketing hire can use without a developer, and no dependency on a framework that will be abandoned before the site is.",
      "We hand over with documentation and a walkthrough, and we measure whether the thing did its job afterwards rather than declaring victory at launch.",
    ],
    benefits: [
      "A prospect can tell in ninety seconds whether you are a fit, which shortens the qualification call",
      "Marketing can publish a case study or a vacancy without booking developer time",
      "The site loads quickly and works on the phones your visitors actually use",
      "Structure that survives being handed to a new agency or an internal team",
    ],
    scope: [
      "Stakeholder interviews and a written brief before any design",
      "Information architecture, page inventory and navigation",
      "Editorial copywriting for every page in scope",
      "Custom front-end build with a content model, not hard-coded pages",
      "CMS configuration and a writing guide for the in-house team",
      "Performance and accessibility passes before launch",
      "Analytics and consent configuration",
      "Handover session, documentation and a 30-day fix window",
    ],
    deliverables: [
      "A live site with a content model the team controls",
      "The source repository in your own account",
      "A short operations guide: how to publish, how to add a page, who to call",
      "A prioritised list of what we would do next and what we would leave alone",
    ],
    idealFor: [
      "Companies whose site was built to look credible rather than to qualify enquiries",
      "Teams where every content change currently goes through an agency retainer",
      "Organisations preparing for a raise, a rebrand or a market entry where the site will be checked",
      "Not for: a one-page teaser with no content behind it — a landing page is cheaper and this is not it",
    ],
    related: ["business-website-design", "website-architecture-planning", "headless-cms-development", "technical-seo"],
    faqs: [
      {
        q: "Can you work with our existing site rather than replacing it?",
        a: "Often, yes — and we will say so if that is the better use of the budget. If the content model and architecture are sound and the problem is the front end or the messaging, we scope that instead of a rebuild.",
      },
      {
        q: "Do we own the code?",
        a: "Yes. The repository is yours, in your account, from the first commit. There is no proprietary platform underneath and no hosting lock-in we benefit from.",
      },
      {
        q: "Who writes the copy?",
        a: "We do, from stakeholder interviews, unless you have a writer we should work with. Copy is in scope by default because a corporate site with weak copy is an expensive way to be ignored.",
      },
      {
        q: "How long does it take?",
        a: "Typically 6–12 weeks for a site of five to fifteen pages, gated by how quickly decisions and copy sign-off happen on your side — that is usually the real constraint, not the build.",
      },
    ],
    examples: [
      "Illustrative: a professional-services firm replaces a capabilities brochure with six pages organised around the questions buyers ask in the first call, and the enquiry form asks for the same information the qualification call used to.",
      "Illustrative: a manufacturer's site is rebuilt around product families so a distributor can find a specification sheet in two clicks instead of emailing for the PDF.",
    ],
    pricing: "Request a quote. Fixed scope and fixed price, agreed in writing after Discovery.",
    duration: "6–12 weeks, depending on page count and sign-off speed",
  },

  {
    slug: "e-commerce-development",
    tagline: "A store built around the checkout, not the catalogue.",
    summary:
      "Most e-commerce projects spend their budget on how products look and discover the problems at the payment step. We build the store around the transaction — stock accuracy, shipping reality, and a checkout that survives a distracted buyer on a slow connection.",
    problem:
      "A store that looks finished can still lose most of its margin in three places: stock that disagrees with the warehouse, shipping costs revealed at the final step, and a payment flow that fails on the devices most of the traffic uses. Each is invisible in a design review and obvious in the abandonment data nobody has instrumented.",
    approach: [
      "Before designing anything we map the transaction end to end: what the customer sees, what the inventory system believes, what the courier can actually do, and where money changes hands.",
      "If you already sell on marketplaces we decide deliberately what lives on your own store and what stays on the marketplace. Often the honest answer is not 'everything' — the marketplace brings traffic you have not paid for, and moving those listings can cost more than the commission saves.",
      "We build against your real product data rather than sample data. The catalogue is where most store projects quietly fail: a hundred variations with inconsistent names, images at seven aspect ratios, and shipping rules that only exist in one person's head.",
      "Checkout gets the most scrutiny and the least decoration in the whole build. Every field has to justify the abandonment risk it introduces, and the ones that cannot are removed or moved earlier where they cost less.",
    ],
    benefits: [
      "Stock and pricing that come from one source, so the store cannot contradict the warehouse",
      "A checkout that states total cost including delivery before the customer commits",
      "Product and category pages structured so search engines can read them",
      "Order data that reconciles without a monthly spreadsheet exercise",
    ],
    scope: [
      "Catalogue and product-data audit before build",
      "Storefront design and build, including category and product templates",
      "Payments integration with the provider your market actually uses",
      "Shipping rules, tax configuration and fulfilment handover",
      "Checkout instrumentation so abandonment is measurable and attributable",
      "Transactional email: confirmation, receipt, despatch",
      "Migration of existing products, customers and order history where required",
    ],
    deliverables: [
      "A live store with catalogue, checkout and order management",
      "Documented payment and shipping configuration",
      "A checkout funnel report from day one, with a baseline",
      "An operations runbook for adding products and processing refunds",
    ],
    idealFor: [
      "Retailers whose store and stock system disagree",
      "Businesses paying marketplace commission on sales they could take directly",
      "Stores where checkout completion is unknown rather than measured",
      "Not for: a single product with a payment link — that does not need a store",
    ],
    related: ["e-commerce-seo", "conversion-rate-optimization", "api-integration", "website-performance-optimization"],
    faqs: [
      {
        q: "Which platform do you build on?",
        a: "It depends on the catalogue and the operational reality, and we will tell you if a hosted platform is the right answer rather than a custom build. We are not tied to one, and we will not sell you a rebuild where configuration would do.",
      },
      {
        q: "Can you take payments in more than one currency?",
        a: "Yes, with caveats that matter: your settlement currency, your provider's supported currencies and your accounting all have to agree. We will map that before quoting rather than after.",
      },
      {
        q: "What about our existing orders and customers?",
        a: "Migrated as part of scope, with a reconciliation report at the end so you can see what moved and what did not.",
      },
    ],
    pricing: "Request a quote. Scoped against the catalogue size and the integrations involved.",
    duration: "8–16 weeks for a custom build; less if a hosted platform is the right fit",
  },

  {
    slug: "web-application-development",
    tagline: "Software for the workflow a spreadsheet has been carrying.",
    summary:
      "When a business process lives in a spreadsheet that one person understands, the risk is not the spreadsheet — it is that the person eventually leaves. We build the small, specific application that replaces it, and build it so it can be changed without us.",
    problem:
      "The load-bearing spreadsheet is a genuine success story: it was cheap, it worked, and it let the business grow. It becomes a problem when it holds state other systems need, when access has to be controlled, when two people need to edit it at once, or when the person who maintains it is a single point of failure. At that point a full ERP is overkill and a bigger spreadsheet accelerates the problem.",
    approach: [
      "We scope to the workflow, not the department. One process, end to end, with the edges documented — what comes in, what goes out, who can see it.",
      "Data model first. Most applications that become painful had an unresolved question about what the primary entity was, and that question resurfaces every six months.",
      "We build the smallest thing that removes the manual work, ship it to real users early, and extend it against what they actually do rather than what the requirements meeting imagined.",
      "Authentication, permissions and audit trail are day-one features, not phase two. Retrofitting them is how internal tools become security incidents.",
    ],
    benefits: [
      "A process that no longer depends on one person's memory",
      "Real access control instead of a shared file and good intentions",
      "Structured data you can report on without exporting to a spreadsheet first",
      "Software small enough that the team can own it",
    ],
    scope: [
      "Workflow discovery, including the exceptions people handle manually today",
      "Data model and permission design, reviewed with the people who will use it",
      "Iterative build with working software at each review rather than slideware",
      "Authentication, roles and audit logging",
      "Integration with the systems it must talk to",
      "Deployment, monitoring and a documented rollback path",
      "Training and handover documentation",
    ],
    deliverables: [
      "A deployed application with the source in your repository",
      "A data model document you can hand to any future developer",
      "An operations guide: backups, deploys, who has access and why",
      "A prioritised list of what we deliberately left out of v1",
    ],
    idealFor: [
      "Operations carried by a spreadsheet, a shared mailbox, or a tool stretched past its purpose",
      "Teams who have been quoted an enterprise platform for a problem that does not need one",
      "Businesses whose internal tool was built years ago and cannot be changed safely",
      "Not for: a problem a configured off-the-shelf product genuinely solves — we will recommend that instead",
    ],
    related: ["custom-business-platforms", "workflow-based-web-applications", "intelligent-internal-tools", "api-integration"],
    faqs: [
      {
        q: "Will we be able to change it without you?",
        a: "That is the design goal. Conventional stack, documented data model, no clever abstractions only we understand, and the repository in your account. We would rather hand over cleanly than hold a retainer by obscurity.",
      },
      {
        q: "How do you stop scope growing?",
        a: "By scoping to one workflow and writing down explicitly what is not in v1. Growth is fine — it is priced and scheduled openly rather than absorbed into an open-ended build.",
      },
      {
        q: "What about data we already have?",
        a: "Imported as part of the build, with a reconciliation count at the end. Skewed or duplicated source data is normal; we resolve it in the open rather than silently.",
      },
    ],
    pricing: "Request a quote. Estimated from the number of entities, roles and integrations.",
    duration: "6–14 weeks for a first release",
  },

  {
    slug: "custom-portal-development",
    tagline: "One login, the right view, nothing that is not yours.",
    summary:
      "A portal is an access-control problem that happens to have an interface. We build customer, partner, member or distributor portals where the hard part — who can see what — is settled before the first screen is designed.",
    problem:
      "Portals fail in two directions. Either they expose too much, because permissions were added late and nobody can prove who sees what; or they are so locked down that users phone support to do anything. The underlying cause is the same: the permission model was never designed, it accumulated.",
    approach: [
      "We model the actors and the objects first: who logs in, what each of them is entitled to, and what must never appear in the same view. That model is reviewed and written down before any design work begins, because a permission model reconstructed from a prototype is a permission model nobody can prove.",
      "Every role gets a defined set of permitted actions, and the server enforces it — not the interface. Hiding a button is not access control: the request behind it is still reachable, and that is the test we run before launch.",
      "We design for the three states portals usually ignore: the new user with nothing to show yet, the user whose request failed at the worst moment, and the user whose access changed yesterday and who cannot tell why. Those states are where support tickets come from, and they are cheaper to design than to debug in production.",
      "Audit logging is included from the first release, so 'who downloaded that, and when' has an answer without an engineering exercise. Access that cannot be evidenced is access nobody can defend in a review.",
    ],
    benefits: [
      "Clients or partners self-serve instead of emailing for documents",
      "Provable separation between accounts, rather than assumed separation",
      "Reduced support load on routine requests",
      "A record of access that satisfies a security review",
    ],
    scope: [
      "Actor and permission model, reviewed in writing before build",
      "Authentication design, including invitation, reset and offboarding",
      "Role-scoped views and server-side authorisation on every route",
      "Document delivery or upload with access logging",
      "Notifications and activity history",
      "Security review, including an authorisation test pass across roles",
    ],
    deliverables: [
      "A portal with documented roles and permissions",
      "An authorisation matrix you can hand to a security reviewer",
      "Offboarding procedure so access does not outlive the relationship",
      "Source code and deployment documentation",
    ],
    idealFor: [
      "Businesses emailing documents that should be behind a login",
      "Partners or distributors who need scoped access to the same materials",
      "Membership or subscription relationships currently managed by spreadsheet",
      "Not for: a handful of trusted users — a shared drive with access control may genuinely be enough",
    ],
    related: ["membership-website-development", "intelligent-customer-onboarding", "corporate-intranet-development", "website-security-audits"],
    faqs: [
      {
        q: "Can you add a portal to our existing site?",
        a: "Usually. It is often the right answer — the marketing site stays where it is and the portal is a separately authenticated area. It depends on the stack and how the current authentication works.",
      },
      {
        q: "How do you test that clients cannot see each other's data?",
        a: "By attempting it, role by role, route by route, as an explicit test pass before launch. Authorisation bugs are found by trying, not by reading code and hoping.",
      },
      {
        q: "Do users need to remember another password?",
        a: "We can support single sign-on or passwordless email links if your users already have identities elsewhere. That is a scoping decision, not a default.",
      },
    ],
    pricing: "Request a quote. Driven by role count and the integrations behind it.",
    duration: "8–16 weeks",
  },

  {
    slug: "headless-cms-development",
    tagline: "One content model, every surface it has to reach.",
    summary:
      "Publishing the same content to a website, a members' area, an app and a print prospectus is a duplication problem until it is a modelling problem. We build the content model once and serve every surface from it.",
    problem:
      "Content that lives inside one presentation layer cannot be reused without copying it, and copies diverge. The visible symptom is a page that contradicts a PDF; the invisible one is an editorial team that maintains the same facts three times and trusts none of them.",
    approach: [
      "We model content as structured data — entities, relationships and required fields — rather than as pages. That is the decision that determines whether reuse is possible at all.",
      "Editors get a writing interface that enforces the structure without making writing miserable. This is not a nicety: if the CMS is unpleasant to use, the model is abandoned within a quarter, content drifts back into email and Word documents, and the system of record quietly stops being one.",
      "Surfaces are consumers, not owners: the site, the app and any export read the same source and therefore cannot disagree with each other. When a fact changes, it changes once, and every surface picks it up on the next render.",
      "Preview and scheduling work properly, because editorial teams need to see a piece before it is live and publish it when they said they would.",
    ],
    benefits: [
      "One source of truth for facts that appear in several places",
      "A new surface — app, kiosk, partner feed — without re-entering content",
      "Editors publish without developer involvement and without fear",
      "Content that outlives the current website",
    ],
    scope: [
      "Content audit and entity modelling",
      "Schema design with required fields, validation and relationships",
      "Editor experience configuration, including roles and workflow",
      "Front-end build consuming the API, or integration with your existing front end",
      "Preview, scheduling and publishing workflow",
      "Migration of existing content with a field-by-field mapping report",
      "Training for editors, and documentation for developers",
    ],
    deliverables: [
      "A documented content model",
      "The configured CMS with roles and workflow",
      "Migrated content with a reconciliation report",
      "An integration guide for any future surface",
    ],
    idealFor: [
      "Publishers, media organisations and multi-brand groups",
      "Businesses maintaining the same facts across web, app and print",
      "Teams whose CMS is the reason they cannot change their site",
      "Not for: a five-page site with no reuse requirement — a conventional CMS is simpler and cheaper",
    ],
    related: ["corporate-website-development", "api-integration", "digital-book-catalogues", "educational-website-development"],
    faqs: [
      {
        q: "Is headless slower to build than a conventional CMS?",
        a: "The first build is usually somewhat slower, because modelling takes real thought. You get that time back the first time you need a second surface or a redesign that does not touch content.",
      },
      {
        q: "Can editors still preview a page?",
        a: "Yes, and we treat preview as a requirement rather than a nice-to-have. Draft preview that shows the real presentation is what makes the workflow usable.",
      },
      {
        q: "What happens to our existing content?",
        a: "Migrated against a field mapping, with a count of what moved, what was dropped and what needs a human decision. Nothing disappears silently.",
      },
    ],
    pricing: "Request a quote. Scoped by content types, surfaces and migration volume.",
    duration: "8–16 weeks",
  },

  {
    slug: "website-performance-optimization",
    tagline: "Measure first, then remove what is actually slow.",
    summary:
      "Performance work fails when it starts from a checklist instead of a measurement. We instrument the real page on real devices, find the specific things costing time, and fix those in order of measured impact.",
    problem:
      "A site can pass every generic audit and still be slow for its actual visitors, because the audits measure a synthetic environment nobody uses. Meanwhile the usual list of recommended fixes — image formats, bundling, caching — may contain none of the things that actually cost this site its seconds. Performance work without a baseline is guesswork that sometimes helps.",
    approach: [
      "We establish a baseline on the pages that matter, on mid-range mobile hardware and realistic network conditions, and agree what number would count as fixed.",
      "We attribute the cost: which request, which script, which render-blocking resource, and who added it. That attribution is what makes the fix survive the next release.",
      "Fixes are ordered by measured gain rather than by convention, and we say plainly when a fashionable optimisation would not help here. Replacing one image format across a site that is actually blocked by a single synchronous analytics script is activity, not improvement.",
      "We install a performance budget and a check that runs with the build, so the problem does not silently return the next time a marketing tag is added. Regression is the normal state of a page nobody is guarding; the guard is the deliverable that lasts.",
    ],
    benefits: [
      "Faster pages for the devices your visitors actually use",
      "A measured before-and-after you can show a stakeholder",
      "A guard against regression, rather than a one-off clean-up",
      "Better search performance as a side effect of a faster site",
    ],
    scope: [
      "Baseline measurement across key page templates and devices",
      "Request-level attribution of load cost",
      "Image, font and script remediation",
      "Caching, compression and delivery configuration",
      "Third-party script audit, with a recommendation per script",
      "Performance budget and a check wired into the build or CI",
      "Re-measurement after fixes, reported against the baseline",
    ],
    deliverables: [
      "A written performance report with before-and-after figures",
      "The implemented fixes, in your repository",
      "A documented performance budget",
      "A list of third-party scripts with the cost and the business case for each",
    ],
    idealFor: [
      "Sites that pass audits but feel slow to use",
      "E-commerce and content sites where speed affects revenue or ranking",
      "Teams whose page weight grows with every campaign",
      "Not for: a site that has never been measured — start with an audit rather than an engagement",
    ],
    related: ["technical-seo", "conversion-rate-optimization", "website-security-audits", "web-application-development"],
    faqs: [
      {
        q: "Do you guarantee a score?",
        a: "No, and be wary of anyone who does. Scores depend on the test environment and can be raised without making the site faster for users. We commit to a measured improvement on the pages that matter, on realistic conditions.",
      },
      {
        q: "How long does it take?",
        a: "The measurement and first round of fixes usually fit in two to four weeks. The regression guard is the durable part of the work.",
      },
      {
        q: "Will this break the design?",
        a: "It should not, and preserving the existing UI is a constraint we work under. Where a change would alter appearance, we quantify the gain first and let you decide.",
      },
    ],
    pricing: "Request a quote. Fixed scope per site, with a stated measurement window.",
    duration: "2–4 weeks for the initial pass",
  },

  {
    slug: "website-security-audits",
    tagline: "Find what an attacker would find, and say so plainly.",
    summary:
      "A security audit that produces a 90-page scanner export is not a security audit. We review the application the way a competent attacker would prioritise it, and deliver a short, ordered list of what matters and what it would cost to fix.",
    problem:
      "Most small and mid-sized sites are not attacked by sophisticated adversaries; they are compromised through an unpatched dependency, a form that accepts too much, an admin panel with a default credential, or an authorisation check that only exists in the interface. Those are findable by careful review, and they are the findings that actually get exploited.",
    approach: [
      "We start with an inventory: what is deployed, what versions, what is exposed to the internet, and what credentials exist. A surprising number of findings are 'someone left this open'.",
      "Then the review: authentication and authorisation, input handling, dependency health, secret management, headers and transport, and the access model of any admin surface.",
      "Every finding is rated by exploitability and business impact, not by scanner severity. A hard-to-reach theoretical flaw and a public default password do not belong on the same list without that context.",
      "You get fixes we can implement, or precise instructions your developers can. We do not withhold the remediation to sell a retainer.",
    ],
    benefits: [
      "A short, prioritised list instead of an unreadable export",
      "Default credentials and exposed admin surfaces found before someone else does",
      "Dependency and secret problems identified with a remediation path",
      "Evidence you can show a client or a procurement process",
    ],
    scope: [
      "Asset and exposure inventory",
      "Authentication and authorisation review, including a role-by-role access test",
      "Input validation and output handling review across forms and parameters",
      "Dependency and patch-level assessment",
      "Secret and credential management review",
      "Transport, headers and cookie configuration",
      "Prioritised findings with reproduction steps and remediation guidance",
      "Retest of remediated findings",
    ],
    deliverables: [
      "A written findings report, ordered by exploitability and impact",
      "Reproduction steps for each finding",
      "A remediation plan with effort estimates",
      "A retest confirmation once fixes are in",
    ],
    idealFor: [
      "Sites with an admin panel, a login or a payment flow",
      "Businesses that must evidence security to a client or procurement team",
      "Teams that have inherited a codebase and do not know its exposure",
      "Not for: a static brochure site with no forms, no logins and no user data — the exposure is genuinely small",
    ],
    related: ["website-maintenance", "custom-portal-development", "technology-risk-assessment", "business-technology-audits"],
    faqs: [
      {
        q: "Is this a penetration test?",
        a: "It is a focused security review of the application and its configuration, which is what most business sites need. If you require a formal penetration test — often for compliance — we will say so and you should commission one from an accredited tester. We will tell you rather than blur the distinction.",
      },
      {
        q: "What if you find something serious?",
        a: "You hear about it immediately, ahead of the report, with the practical steps to reduce exposure while a fix is prepared.",
      },
      {
        q: "Do you fix what you find?",
        a: "Usually, yes — remediation is a separate, smaller piece of work. Retesting is included so the finding is closed on evidence rather than on assertion.",
      },
    ],
    pricing: "Request a quote. Scoped by the size of the surface and the number of roles.",
    duration: "1–3 weeks for the review; remediation scoped separately",
  },

  {
    slug: "website-accessibility-improvement",
    tagline: "Usable by keyboard, screen reader and the person in a hurry.",
    summary:
      "Accessibility work is usually approached as a compliance exercise and delivered as a list of attributes. We approach it as usability testing with the tools real people rely on, and fix the things that stop someone completing a task.",
    problem:
      "An automated scan can flag a missing label and cannot tell you that the checkout is unusable on a keyboard, that a focus ring is invisible on a dark section, or that an error message is announced after the field has already been read. The failures that actually exclude people are interaction failures, and they need a human operating the site.",
    approach: [
      "We test the real journeys — enquire, buy, sign in, find a page — with keyboard only and with a screen reader, recording where the task breaks.",
      "Contrast and semantics are measured rather than eyeballed. Small type at reduced opacity is the most common silent failure we find, and it is measurable.",
      "Fixes are made in the existing design language, not bolted on. Accessibility work should not require a visual redesign, and if a design decision genuinely blocks it, we say which one and why.",
      "We leave behind the checks your team runs per release — a short list, not a framework — so the improvement holds after we are gone. Accessibility that is not guarded degrades with every new component, usually invisibly.",
    ],
    benefits: [
      "People using assistive technology can complete the tasks the site exists for",
      "Keyboard users can reach and see everything, including on dark sections",
      "A defensible position if accessibility is raised by a client or a regulator",
      "Better legibility for everyone, not only those who use assistive technology",
    ],
    scope: [
      "Journey-based testing with keyboard and screen reader",
      "Measured contrast review across the type scale",
      "Semantic structure and heading audit",
      "Form labelling, error association and live-region review",
      "Motion and focus management review, including reduced-motion behaviour",
      "Remediation in the existing design system",
      "A per-release checklist for your team",
    ],
    deliverables: [
      "A findings report organised by journey, not by WCAG clause number",
      "The implemented fixes",
      "A per-release accessibility checklist",
      "A short guide for whoever writes content next",
    ],
    idealFor: [
      "Public-sector, education, healthcare and financial services sites with legal obligations",
      "Any site with a form that people must complete to become a customer",
      "Teams who have run a scanner, fixed the output, and still have complaints",
      "Not for: a site that has never been tested with a keyboard — start there, it takes an hour",
    ],
    related: ["website-performance-optimization", "ui-ux-design", "website-maintenance", "corporate-website-development"],
    faqs: [
      {
        q: "Do you guarantee WCAG conformance?",
        a: "We will not claim certification we cannot substantiate. We test against WCAG 2.2 AA criteria through the journeys that matter and report precisely what we found and fixed. Formal conformance statements should be made by an accredited auditor if you need one.",
      },
      {
        q: "Will fixes change how the site looks?",
        a: "Mostly not. The largest wins — labelling, error association, focus visibility, contrast within the existing palette — are invisible to most visitors. Where a visual change is unavoidable, we show it before making it.",
      },
    ],
    pricing: "Request a quote. Scoped by the number of templates and journeys.",
    duration: "2–4 weeks including remediation",
  },
];
