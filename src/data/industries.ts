/**
 * Industry solutions — 20 sectors, framed honestly.
 *
 * IMPORTANT: this studio has not published named clients in these sectors, and
 * the site's standing rule (see src/data/reviews.ts and the homepage "no
 * fabricated credentials" commitment) is that nothing here claims experience we
 * cannot evidence. Each industry page therefore states:
 *
 *   • the operational challenges that are characteristic of the sector,
 *   • where digital work typically changes them,
 *   • which of our services apply, and
 *   • one or two illustrative implementation scenarios.
 *
 * "Illustrative" means exactly that. No client, no result, no award is implied,
 * and no sector page should ever be edited to suggest otherwise without a real,
 * attributable engagement behind it.
 */
export interface Industry {
  slug: string;
  title: string;
  /** One line shown on cards and in the industries index. */
  summary: string;
  /** Sector-specific pressures. Written as conditions, not as claims about clients. */
  challenges: string[];
  /** Where digital work typically moves the needle in this sector. */
  opportunities: string[];
  /** Catalog slugs from src/data/serviceCatalog.ts that apply most directly. */
  services: string[];
  /** A concrete, plausible scenario — labelled illustrative in the UI. */
  scenarios: string[];
}

export const industries: Industry[] = [
  {
    slug: "real-estate",
    title: "Real Estate",
    summary: "Listing systems, enquiry routing and the paperwork between them.",
    challenges: [
      "Listings live in several places and the master version is a spreadsheet",
      "Enquiries arrive by phone, WhatsApp and portal email with no single owner",
      "Viewing scheduling consumes staff time and produces no record",
      "Property documents are exchanged as scans over email",
    ],
    opportunities: [
      "One source of truth for listings that feeds the website and the portals",
      "Enquiry intake into a pipeline with assignment and response-time tracking",
      "Self-service viewing slots that write to a calendar",
      "Document collection with a per-property audit trail",
    ],
    services: ["corporate-website-development", "crm-automation", "booking-and-reservation-systems", "document-processing-automation"],
    scenarios: [
      "A regional agency replaces three listing spreadsheets with one intake form and a website that reads from it, so the site can never show a withdrawn property.",
      "An enquiry form assigns each lead to an agent by area, logs first response time, and escalates anything unanswered after four working hours.",
    ],
  },
  {
    slug: "healthcare",
    title: "Healthcare",
    summary: "Appointment flow, patient intake and the limits of automation in a regulated setting.",
    challenges: [
      "Appointment books are managed per practitioner with no shared view",
      "Intake forms are completed on paper and re-typed",
      "Reminders are manual, so no-shows are discovered rather than prevented",
      "Patient data cannot be put in arbitrary third-party tools",
    ],
    opportunities: [
      "Scheduling that respects practitioner availability and appointment types",
      "Digital intake that validates before it reaches a human",
      "Automated reminders with an auditable delivery record",
      "Systems designed around data-minimisation rather than convenience",
    ],
    services: ["booking-and-reservation-systems", "appointment-scheduling-automation", "ai-customer-support-systems", "business-technology-audits"],
    scenarios: [
      "A multi-practitioner clinic replaces phone-only booking with online slots, cutting the front desk's call volume while keeping urgent cases on a phone line.",
      "Intake forms are completed online, validated at the point of entry, and arrive structured rather than as a PDF to be re-keyed.",
    ],
  },
  {
    slug: "education",
    title: "Education",
    summary: "Enrolment, learning content and the systems schools actually maintain.",
    challenges: [
      "Enrolment runs through PDFs, email threads and a payment reference",
      "Course content is scattered across drives with no version control",
      "Parents, students and staff need different views of the same information",
      "Budget cycles make large platforms hard to justify",
    ],
    opportunities: [
      "Structured enrolment with a real application state, not an inbox",
      "A content library with ownership and revision history",
      "Role-scoped portals so each audience sees only what applies to it",
      "Systems that can be maintained by existing staff",
    ],
    services: ["educational-website-development", "membership-website-development", "custom-portal-development", "headless-cms-development"],
    scenarios: [
      "A school replaces its enrolment inbox with an application portal that tracks state, notifies on missing documents, and exports a term roster.",
      "A training provider publishes courses from a headless CMS so the same content serves the website, a members' area and a printable prospectus.",
    ],
  },
  {
    slug: "professional-services",
    title: "Professional Services",
    summary: "Positioning, proposals and the pipeline that feeds them.",
    challenges: [
      "The website describes capabilities rather than outcomes",
      "Proposals are rebuilt from scratch for every enquiry",
      "Pipeline visibility depends on one person's memory",
      "Referrals arrive informally and are never tracked back to their source",
    ],
    opportunities: [
      "Positioning that makes the right client self-select",
      "A proposal generator drawing on a fixed scope library",
      "Enquiry-to-engagement pipeline with stages and follow-up reminders",
      "Source attribution for referrals",
    ],
    services: ["business-website-design", "brand-strategy", "crm-automation", "sales-pipeline-automation"],
    scenarios: [
      "A consultancy replaces a brochure site with a service architecture that answers scope and pricing-shape questions before the first call.",
      "Proposal templates and a documented scope library cut proposal turnaround from days to hours without changing the firm's terms.",
    ],
  },
  {
    slug: "financial-services",
    title: "Financial Services",
    summary: "Onboarding, document handling and compliance-shaped workflows.",
    challenges: [
      "Client onboarding involves repeated document requests",
      "Identity and compliance checks are tracked in email",
      "Advisers spend time on data entry rather than advice",
      "Regulated communications limit which tools are permissible",
    ],
    opportunities: [
      "Onboarding checklists with per-item status and chase automation",
      "Document collection with versioning and retention rules",
      "Internal tools that keep data inside approved boundaries",
      "Reporting generated from the system of record rather than re-keyed",
    ],
    services: ["document-processing-automation", "intelligent-customer-onboarding", "business-technology-audits", "technology-risk-assessment"],
    scenarios: [
      "An advisory firm moves onboarding to a checklist that chases outstanding documents automatically and shows progress to both sides.",
      "A monthly client report is generated from the CRM and portfolio data, with a human review step before it is sent.",
    ],
  },
  {
    slug: "hospitality",
    title: "Hospitality",
    summary: "Direct bookings, seasonal demand and the cost of every intermediary.",
    challenges: [
      "Third-party platforms take a percentage of every booking",
      "Availability is duplicated across channels and drifts out of sync",
      "Enquiries outside booking platforms go unanswered overnight",
      "Menus, rates and seasonal offers are hard to update quickly",
    ],
    opportunities: [
      "A direct booking path that is genuinely faster than the intermediary",
      "A single availability source feeding every channel",
      "Enquiry handling with an after-hours response",
      "Content that staff can update without a developer",
    ],
    services: ["booking-and-reservation-systems", "e-commerce-development", "local-seo", "headless-cms-development"],
    scenarios: [
      "A guesthouse moves direct bookings onto its own site with real-time availability, reducing reliance on commission-bearing channels.",
      "Seasonal rate changes are made once in the CMS and appear on the site, the booking page and Google Business Profile together.",
    ],
  },
  {
    slug: "retail",
    title: "Retail",
    summary: "Product data, stock accuracy and conversion at the shelf edge.",
    challenges: [
      "Product information exists in several formats and none is complete",
      "Stock levels shown online disagree with the shop floor",
      "The online catalogue does not reflect what is actually available",
      "Seasonal campaigns are run manually from spreadsheets",
    ],
    opportunities: [
      "One product master feeding the site, marketplaces and in-store systems",
      "Structured product data that both people and search engines can read",
      "Campaign pages assembled from existing content",
      "Conversion measurement tied to real inventory",
    ],
    services: ["e-commerce-development", "e-commerce-seo", "conversion-rate-optimization", "api-integration"],
    scenarios: [
      "A retailer standardises product data once and publishes to its own store and two marketplaces from the same source.",
      "Out-of-stock items show an accurate back-in-stock date drawn from the inventory system instead of a generic message.",
    ],
  },
  {
    slug: "e-commerce",
    title: "E-commerce",
    summary: "Store performance, search visibility and the checkout that leaks.",
    challenges: [
      "Traffic arrives but carts are abandoned at a specific step",
      "Category pages are generated without product-specific content",
      "Site speed degrades as the catalogue and app list grow",
      "Paid spend compensates for organic visibility that was never built",
    ],
    opportunities: [
      "Checkout instrumentation that shows where abandonment actually happens",
      "Category and product copy written for intent, not for keywords",
      "Performance budgets with measured enforcement",
      "A measurement baseline before any spend increases",
    ],
    services: ["e-commerce-development", "conversion-rate-optimization", "technical-seo", "website-performance-optimization"],
    scenarios: [
      "A store identifies a single form field on the payment step causing most abandonment and removes it, beating a full redesign to the same outcome.",
      "Category pages gain buying-guide content and internal links, and organic entry to those pages is measured before and after.",
    ],
  },
  {
    slug: "manufacturing",
    title: "Manufacturing",
    summary: "Specification publishing, distributor access and quoting.",
    challenges: [
      "Product specifications are published as PDFs that go stale",
      "Distributors request the same documents repeatedly",
      "Quotations are assembled manually from component costs",
      "Website content is owned by whoever last edited it",
    ],
    opportunities: [
      "Structured specification data with a single published source",
      "A distributor area with scoped access and download logging",
      "Quote configuration for standard product lines",
      "Change control so a specification update propagates everywhere",
    ],
    services: ["corporate-website-development", "custom-portal-development", "intelligent-internal-tools", "business-systems-integration"],
    scenarios: [
      "A manufacturer replaces a PDF catalogue with structured data that generates downloadable datasheets on demand, always current.",
      "Distributors log in to a portal that shows current stock, pricing tiers and approved marketing assets for their region.",
    ],
  },
  {
    slug: "logistics",
    title: "Logistics",
    summary: "Tracking, exception handling and the cost of a phone call.",
    challenges: [
      "Customers phone to ask where a shipment is",
      "Exceptions are discovered by the customer, not by the operator",
      "Driver and depot communication runs on personal messaging apps",
      "Reporting is assembled manually at month end",
    ],
    opportunities: [
      "Self-service tracking that reduces inbound calls",
      "Exception alerting before the delivery window closes",
      "Structured handover records instead of chat history",
      "Operational dashboards built from existing systems",
    ],
    services: ["api-integration", "intelligent-internal-tools", "business-intelligence-dashboards", "workflow-integration"],
    scenarios: [
      "A courier exposes shipment status on its own site, and inbound 'where is my parcel' calls fall measurably in the first quarter.",
      "Delayed shipments raise an alert to the operator's queue when the projected arrival slips past the promised window.",
    ],
  },
  {
    slug: "construction",
    title: "Construction",
    summary: "Tender documents, site records and project visibility.",
    challenges: [
      "Tender packs are assembled by hand for every bid",
      "Site records live in photographs and message threads",
      "Clients ask for progress updates that require manual assembly",
      "Subcontractor documents expire unnoticed",
    ],
    opportunities: [
      "A reusable bid library with version history",
      "Structured site records attached to a project",
      "Client-facing progress views drawn from the project record",
      "Document expiry tracking with advance warnings",
    ],
    services: ["custom-business-platforms", "custom-portal-development", "document-processing-automation", "it-project-management"],
    scenarios: [
      "A contractor keeps a bid library of approved method statements and certificates, reducing bid assembly time per tender.",
      "Subcontractor insurance certificates are tracked, and the system flags any that lapse before they expire.",
    ],
  },
  {
    slug: "legal-services",
    title: "Legal Services",
    summary: "Intake, document review and the billable cost of re-keying.",
    challenges: [
      "Client intake gathers the same information repeatedly",
      "Document review is manual and difficult to evidence",
      "Matter status requires a human to check several systems",
      "Confidentiality rules restrict which tools may hold client data",
    ],
    opportunities: [
      "Structured intake with conflict-checkable data",
      "Review tooling that produces an auditable trail",
      "Matter dashboards assembled from existing systems",
      "Deployments that keep data inside approved boundaries",
    ],
    services: ["document-processing-automation", "intelligent-internal-tools", "business-technology-audits", "data-analytics"],
    scenarios: [
      "A firm standardises intake so the same client information is captured once and reused across engagement letters and matter records.",
      "Contract review produces a structured summary of deviations against a standard position, for a qualified person to approve.",
    ],
  },
  {
    slug: "nonprofit-organizations",
    title: "Nonprofit Organizations",
    summary: "Donations, volunteer coordination and reporting to funders.",
    challenges: [
      "Donations arrive across several channels and are reconciled manually",
      "Volunteer rosters are managed by one coordinator in a spreadsheet",
      "Funder reporting is reconstructed after the fact",
      "Small teams need systems they can run without a specialist",
    ],
    opportunities: [
      "One donation record across channels",
      "Volunteer scheduling with confirmation and reminders",
      "Impact data collected continuously rather than at reporting time",
      "Low-maintenance tooling sized to the team",
    ],
    services: ["membership-website-development", "crm-automation", "appointment-scheduling-automation", "business-intelligence-dashboards"],
    scenarios: [
      "A charity consolidates donation channels into one ledger view, cutting month-end reconciliation from days to hours.",
      "Volunteer shifts are published with self-service sign-up and automatic reminders, replacing a coordinator's phone tree.",
    ],
  },
  {
    slug: "religious-organizations",
    title: "Religious Organizations",
    summary: "Congregation communication, giving and event logistics.",
    challenges: [
      "Announcements are duplicated across several messaging channels",
      "Giving records are kept in incompatible systems",
      "Event logistics rely on volunteers with no shared view",
      "Websites are maintained by volunteers who rotate",
    ],
    opportunities: [
      "One publishing point that fans out to every channel",
      "Consistent giving records with clear reporting",
      "Event sign-up and volunteer scheduling in one place",
      "A site simple enough to hand over",
    ],
    services: ["membership-website-development", "marketing-automation", "appointment-scheduling-automation", "headless-cms-development"],
    scenarios: [
      "A congregation publishes a weekly notice once and it appears on the site, in the newsletter and on the noticeboard screen.",
      "Event volunteers sign up for roles online, with automatic reminders and a single roster everyone can see.",
    ],
  },
  {
    slug: "publishing",
    title: "Publishing",
    summary: "The studio's original discipline: metadata, discoverability and launch.",
    challenges: [
      "Metadata is completed at the end of the process, when it cannot inform the cover",
      "Backlist titles have no discoverability at all and nobody assigned to fix it",
      "Launch activity is a list of channels rather than a sequenced plan",
      "Rights, royalties and reporting live in separate spreadsheets",
    ],
    opportunities: [
      "Metadata treated as a design input, not a filing task",
      "A dated backlist correction programme with measurement",
      "Launch sequencing owned by one accountable person",
      "One reporting view across titles and channels",
    ],
    services: ["book-seo", "book-discoverability-strategy", "book-launch-campaigns", "publishing-automation"],
    scenarios: [
      "A press runs a quarter of discoverability work across its backlist and reports ranking movement per title rather than in aggregate.",
      "A launch plan is built backward from publication date with channel budgets and expected outputs stated per channel.",
    ],
  },
  {
    slug: "media-companies",
    title: "Media Companies",
    summary: "Publishing velocity, archives and the value locked in old content.",
    challenges: [
      "Editorial workflow crosses several tools with manual steps between them",
      "Archives are large, unstructured and effectively invisible",
      "Search on the site does not understand what the archive contains",
      "Advertising and subscription data are reported separately",
    ],
    opportunities: [
      "An editorial pipeline that reduces the manual steps per article",
      "Archive retrieval that answers questions rather than matching strings",
      "On-site search that understands entities and topics",
      "A combined commercial dashboard",
    ],
    services: ["headless-cms-development", "ai-powered-business-search", "ai-powered-knowledge-bases", "business-intelligence-dashboards"],
    scenarios: [
      "A publisher makes twenty years of archive searchable by topic and person, creating a subscriber-only research feature from content it already owned.",
      "An editorial tool suggests related archive pieces per new article, increasing internal links without manual effort.",
    ],
  },
  {
    slug: "startups",
    title: "Startups",
    summary: "Ship the smallest thing that answers the question, then measure it.",
    challenges: [
      "Scope expands faster than evidence accumulates",
      "The first site is built to look funded rather than to test demand",
      "Instrumentation arrives after launch, if at all",
      "Technical debt is taken on before the problem is understood",
    ],
    opportunities: [
      "A landing page that tests the proposition before the product exists",
      "Measurement built into the first release",
      "Architecture sized to a small team",
      "Clear criteria for what would make this worth building further",
    ],
    services: ["landing-page-development", "custom-website-development", "conversion-rate-optimization", "digital-growth-roadmaps"],
    scenarios: [
      "A founder tests two positionings on one landing page and chooses the build from measured response, not opinion.",
      "The first release ships with event tracking so the second release is informed by evidence.",
    ],
  },
  {
    slug: "small-and-medium-enterprises",
    title: "Small and Medium Enterprises",
    summary: "The unglamorous work: one system, fewer spreadsheets, less re-keying.",
    challenges: [
      "Critical processes run in spreadsheets only one person understands",
      "The website is out of date because updating it needs a developer",
      "Customer records are split between email, spreadsheets and a CRM nobody trusts",
      "Every new tool adds an integration nobody maintains",
    ],
    opportunities: [
      "Replace the load-bearing spreadsheet with a small, owned system",
      "Content staff can update themselves",
      "One customer record with a clear owner",
      "Reduce tool count rather than add to it",
    ],
    services: ["business-website-design", "internal-business-automation", "crm-automation", "automation-opportunity-assessment"],
    scenarios: [
      "A business replaces its load-bearing quoting spreadsheet with a small web app that the team owns and can change without a specialist.",
      "An automation assessment identifies three workflows worth automating and two that are cheaper to leave alone.",
    ],
  },
  {
    slug: "enterprise-organizations",
    title: "Enterprise Organizations",
    summary: "Integration, governance and making a large estate legible.",
    challenges: [
      "Overlapping systems with no authoritative source",
      "Change requires coordination across several owners",
      "Reporting consumes analysts' time before it produces insight",
      "Procurement cycles outlast the technology chosen",
    ],
    opportunities: [
      "A system-of-record map before any new purchase",
      "Integration layers with documented contracts",
      "Dashboards built once, from governed data",
      "Sequenced roadmaps that survive staff turnover",
    ],
    services: ["digital-transformation-consulting", "business-systems-integration", "technology-stack-assessment", "enterprise-workflow-optimization"],
    scenarios: [
      "An organisation documents which system owns which data, resolving a month of disagreement about why two reports differ.",
      "A roadmap sequences integrations by dependency so each release stands alone.",
    ],
  },
  {
    slug: "consulting-companies",
    title: "Consulting Companies",
    summary: "Positioning, proposal economics and the knowledge that walks out the door.",
    challenges: [
      "Expertise is concentrated in a few senior people",
      "Proposals are bespoke and slow to produce",
      "Methodology is undocumented and therefore inconsistently delivered",
      "Marketing produces activity rather than qualified enquiries",
    ],
    opportunities: [
      "A published methodology that qualifies before the first call",
      "A scope and proposal library",
      "Internal knowledge retrieval over past engagements",
      "Content that demonstrates method rather than asserting expertise",
    ],
    services: ["brand-strategy", "content-strategy", "intelligent-internal-tools", "ai-powered-knowledge-bases"],
    scenarios: [
      "A firm publishes its method as a public page, and prospective clients arrive already understanding how an engagement runs.",
      "Past proposals become searchable internal knowledge, so a new proposal starts from precedent rather than a blank page.",
    ],
  },
];

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}
