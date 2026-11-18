import type { ServiceDetail } from "../serviceDetailTypes";

/**
 * Division D3 — Digital Marketing & Business Growth.
 *
 * Two pages in this division (AI search and generative engine optimisation) are
 * the easiest place on the whole site to write something unfalsifiable. They are
 * written here as: what is observable now, what we will not promise, and what we
 * will measure. No ranking guarantees anywhere.
 */
export const growthServiceDetails: ServiceDetail[] = [
  {
    slug: "search-engine-optimization-seo",
    tagline: "Compounding visibility, measured against a baseline you set first.",
    summary:
      "Search work that starts with what you currently rank for and what that traffic is worth, then changes one thing at a time and reports what moved. Slow, unglamorous, and the only kind that holds.",
    problem:
      "SEO has a credibility problem earned honestly: agencies report impressions instead of revenue, claim credit for traffic that arrived anyway, and rebuild the site every eighteen months so the previous quarter's work cannot be assessed. Meanwhile the actual opportunity — a set of queries you are nearly ranking for — often goes unaddressed because it is invisible without a baseline.",
    approach: [
      "We establish a baseline before touching anything: current positions, current organic traffic, current conversion from organic, and the commercial value of each page. Without that, no later claim is checkable.",
      "We prioritise by distance-to-ranking and commercial intent — queries where you are on page two for something worth winning beat queries you will never rank for.",
      "Technical blockers are fixed first when they gate everything else, because content published onto an unindexable site is wasted.",
      "Reporting is written, dated, and tied to specific actions. It includes what did not change, because a report where everything improved is a report nobody checked.",
    ],
    benefits: [
      "A defensible baseline, so improvement can be proved rather than asserted",
      "Effort concentrated where the gap to ranking is smallest and the intent is commercial",
      "Technical blockers removed so content can actually be found",
      "Reports legible to someone who is not an SEO",
    ],
    scope: [
      "Baseline: positions, organic traffic, organic conversion, page-level value",
      "Technical audit: crawl, indexation, structure, speed, internal linking",
      "Keyword and intent mapping to existing and planned pages",
      "On-page work: titles, headings, structure, internal links",
      "Content recommendations with briefs, prioritised",
      "Monthly written reporting with interpretation",
      "Quarterly review of what to stop doing",
    ],
    deliverables: [
      "A documented baseline with the measurement method",
      "A prioritised action list with rationale per item",
      "Implemented on-page and technical fixes",
      "Scheduled written reports tied to actions taken",
    ],
    idealFor: [
      "Businesses whose organic traffic is unmeasured or plateaued",
      "Sites that have been 'SEO'd' before with no evidence of result",
      "Companies with content worth ranking and no structure to surface it",
      "Not for: a new site with no content — build the content first",
    ],
    related: ["technical-seo", "content-strategy", "local-seo", "conversion-rate-optimization"],
    faqs: [
      {
        q: "How long before results?",
        a: "Technical fixes can show within weeks. Content and authority work typically takes three to six months to be measurable, and anyone quoting less is either optimising for a trivial query or guessing.",
      },
      {
        q: "Do you guarantee first-page rankings?",
        a: "No. Nobody who understands search does, because the ranking system is not under our control. We commit to specific work, a measurement method and honest reporting.",
      },
      {
        q: "What do you need from us?",
        a: "Access to analytics and search console, decisions on content, and a technical contact who can deploy. Without deployment, recommendations are a document.",
      },
    ],
    pricing: "Request a quote. Fixed monthly scope, or a fixed-price audit where that is the better fit.",
    duration: "Ongoing, with a review at three months",
  },

  {
    slug: "technical-seo",
    tagline: "If it cannot be crawled, indexed and rendered, nothing else counts.",
    summary:
      "A focused engineering engagement: crawl budget, indexation, rendering, structured data, canonicalisation and internal linking — the layer where content silently fails to appear.",
    problem:
      "Sites lose visibility without losing quality. A stray noindex in staging propagates to production, a JavaScript-rendered page is crawled as an empty shell, canonical tags point at a preview domain, pagination splits authority, and the sitemap lists URLs that 404. None of these are visible in a browser and all of them suppress ranking.",
    approach: [
      "We crawl the site as a search engine would and compare that view against what your analytics and search console believe. Discrepancies are where the problems live.",
      "Rendering is checked explicitly: what is present in the HTML, what requires JavaScript, and what a crawler that does not execute scripts actually sees.",
      "Indexation is audited end to end: canonical tags, robots directives, hreflang, sitemap accuracy and status codes on URLs that should and should not exist.",
      "Everything is fixed with the engineering team and then verified by re-crawl, so the change is evidenced rather than assumed. A fix nobody re-tested is a hypothesis, and technical SEO attracts a lot of those.",
    ],
    benefits: [
      "Content that exists becomes findable",
      "A sitemap and canonical set you can trust",
      "Structured data that is valid and describes the page accurately",
      "Internal linking that distributes authority deliberately",
    ],
    scope: [
      "Full crawl with a rendering comparison",
      "Indexation and canonicalisation audit",
      "Robots, sitemap and status-code hygiene",
      "Structured data implementation and validation",
      "Internal linking and pagination structure",
      "Core Web Vitals review tied to crawlability",
      "Re-crawl verification after fixes",
    ],
    deliverables: [
      "A technical findings document with evidence per issue",
      "Implemented fixes or precise engineering tickets",
      "A re-crawl verification report",
      "A pre-release checklist so regressions are caught",
    ],
    idealFor: [
      "Sites with significant content that is not ranking",
      "Single-page applications and JavaScript-heavy builds",
      "Businesses that have migrated domains or platforms recently",
      "Not for: a five-page site with no content problem",
    ],
    related: ["search-engine-optimization-seo", "website-performance-optimization", "website-migration", "headless-cms-development"],
    faqs: [
      {
        q: "Can you work with our developers?",
        a: "Yes, and that is usually fastest. We produce precise tickets with reproduction evidence, or implement directly if you prefer.",
      },
      {
        q: "Is this the same as a site audit?",
        a: "A technical SEO engagement goes deeper on crawlability, indexation and rendering. A broader marketing audit also covers content, competition and conversion. We will point you to whichever you need.",
      },
    ],
    pricing: "Request a quote. Fixed price per property.",
    duration: "2–5 weeks",
  },

  {
    slug: "local-seo",
    tagline: "Be the answer when someone searches for what is nearby.",
    summary:
      "For businesses with a physical presence or a service area: profile accuracy, location pages that are genuinely distinct, review practice and consistent business data across the places customers check.",
    problem:
      "Local visibility fails on consistency and on thin pages. The same business appears with three phone numbers across directories, the location page for each branch is the same text with the town name swapped, and reviews are collected sporadically if at all. Search engines resolve that ambiguity by choosing someone else.",
    approach: [
      "We audit the business data everywhere it appears and consolidate to one canonical set: name, address, phone, hours, categories. Inconsistency is the most common local blocker and the cheapest to fix.",
      "Location pages are built with local substance: the staff who work there, the services actually offered at that branch, transit and parking, opening hours that are true, and real photographs rather than stock. Templated location pages are not merely ineffective — they are the pattern that gets a multi-location site treated as low value overall.",
      "Review practice is designed as a routine rather than a campaign: who asks, at what point in the job, by what method, and who responds to what comes back. A burst of requests after a bad quarter reads as a campaign to both customers and platforms.",
      "Measurement is tied to the things that represent a customer: calls, direction requests, and form submissions, broken down per location. Impressions are recorded but never reported as the outcome, because a rise in impressions with no change in calls is not progress.",
    ],
    benefits: [
      "One accurate business record across every place customers look",
      "Location pages that are genuinely different and rank accordingly",
      "A repeatable review routine rather than sporadic bursts",
      "Enquiry volume measured by location",
    ],
    scope: [
      "Business data audit and consolidation",
      "Google Business Profile optimisation and category strategy",
      "Location page content strategy and copy",
      "Local citation consistency pass",
      "Review collection routine and response guidance",
      "Local structured data implementation",
      "Conversion tracking by location",
    ],
    deliverables: [
      "A canonical business data record",
      "Optimised profiles and consistent citations",
      "Distinct location pages",
      "A review routine the team can run",
    ],
    idealFor: [
      "Multi-branch retail, clinics, practices, studios and restaurants",
      "Service businesses covering defined geographic areas",
      "Businesses with reviews but no system for collecting them",
      "Not for: a single-location business with an accurate profile and no competition — the work is small",
    ],
    related: ["search-engine-optimization-seo", "reputation-management", "corporate-website-development", "content-strategy"],
    faqs: [
      {
        q: "Do you manage our reviews?",
        a: "We design the routine and the response guidance, and we can respond on your behalf if that is the arrangement. We will not write reviews or ask staff and family to post them — it breaches the platform rules and it does not work.",
      },
      {
        q: "How many location pages do we need?",
        a: "One per genuinely distinct location or service area, and no more. Fifty templated town pages is the pattern search engines penalise.",
      },
    ],
    pricing: "Request a quote. Scaled by the number of locations.",
  },

  {
    slug: "ai-search-optimization",
    tagline: "Be the source an AI answer cites, where that is achievable.",
    summary:
      "Answer engines increasingly summarise instead of linking. This engagement prepares a site to be a source those systems can read, quote and attribute — grounded in observable practice, not in claims about how a specific model works.",
    problem:
      "AI-generated answers reduce clicks for informational queries, and a business that was the top link can find itself unmentioned in the summary that replaced it. What those systems select is not disclosed, but the observable pattern is consistent: clear structure, explicit and checkable claims, identifiable authorship and organisation, and content that answers a question directly rather than building to it.",
    approach: [
      "We start by auditing what is observable: whether the site's key pages are fetchable and parseable, whether claims are attributable, and whether organisational identity is unambiguous across the web.",
      "Structure is made machine-legible — direct answers, proper headings, tables where comparison is the point — because summarisation needs extractable statements, not narrative flourishes.",
      "We strengthen entity clarity: consistent organisation details, author identity where expertise is claimed, and structured data that matches what is on the page.",
      "Measurement is indirect and we say so plainly: referral traffic from assistant surfaces where it appears, brand-query volume, and citation appearances where they can be observed. We will not claim to have moved a model's output.",
    ],
    benefits: [
      "Content structured so a summariser can extract and attribute it",
      "Clear organisational and authorial identity, which supports attribution",
      "Direct answers to the questions customers actually ask",
      "A measurement approach that does not rest on invented metrics",
    ],
    scope: [
      "Fetchability and parseability audit for key pages",
      "Content restructuring toward extractable, direct answers",
      "Claim attribution and sourcing review",
      "Organisation and author entity consistency",
      "Structured data aligned to page content",
      "Indirect measurement setup: assistant referrals, brand queries, citations",
      "A written statement of what cannot be measured and why",
    ],
    deliverables: [
      "An audit of current extractability and entity clarity",
      "Restructured key pages",
      "A measurement plan with honest limitations",
      "Editorial guidance for future content",
    ],
    idealFor: [
      "Publishers, research firms and businesses whose expertise is summarised away",
      "Sites already strong in traditional search",
      "Teams wanting an evidence-based approach rather than a speculative one",
      "Not for: anyone expecting a guaranteed position in a generated answer",
    ],
    related: ["generative-engine-optimization-geo", "search-engine-optimization-seo", "technical-seo", "content-strategy"],
    faqs: [
      {
        q: "Can you get us cited by ChatGPT or Google's AI overviews?",
        a: "No one can guarantee that, and we will not pretend otherwise — the selection logic is undisclosed and changes. What we can do is make the content legible, well-structured and attributable, which is the part under our control, and set up measurement so any effect is visible.",
      },
      {
        q: "Should we block AI crawlers?",
        a: "That is a business decision, not a technical one. Blocking reduces the chance of being summarised and may reduce referral traffic; allowing it may reduce clicks while increasing attribution. We will set out the trade-off for your situation rather than choosing for you.",
      },
      {
        q: "How is this different from SEO?",
        a: "It overlaps heavily. The difference is emphasis: extractable structure, explicit claims and entity clarity matter more, and the measurement is more indirect.",
      },
    ],
    pricing: "Request a quote. Fixed scope, with the measurement window stated.",
  },

  {
    slug: "generative-engine-optimization-geo",
    tagline: "A defensible position on a field full of confident nonsense.",
    summary:
      "GEO is a young term for an old discipline: making a business legible to automated systems that answer questions. We treat it as measured experimentation with published assumptions, not as a set of guarantees.",
    problem:
      "The market for 'generative engine optimisation' is currently full of services that promise placement in AI answers without any ability to verify the claim, because the systems are closed. Buyers are being asked to pay for outcomes nobody can audit, and the advice ranges from the sensible to the fabricated.",
    approach: [
      "We write down our assumptions explicitly and mark each as observable or speculative. That distinction is the whole value: it keeps a client from paying for a guess dressed as a method.",
      "We work on the parts with a defensible causal story — clear structure, verifiable claims, strong entity signals, consistent factual presentation across the web — because those help human readers and traditional search regardless of what any model does.",
      "We run controlled experiments where possible: structure changes on comparable pages, measured against referral patterns and brand queries, with results reported honestly including null results.",
      "We publish what we find, including when a change appears to do nothing at all. A null result is a real result when the alternative is spending the next budget cycle on a technique that was never working.",
    ],
    benefits: [
      "Work that improves traditional search whether or not AI summarisation matters to you",
      "Explicit assumptions, so you know what is evidenced and what is inference",
      "Controlled experiments rather than anecdote",
      "No spend on claims that cannot be tested",
    ],
    scope: [
      "Assumption register: observable vs speculative, reviewed with you",
      "Content structure and claim substantiation work",
      "Entity consistency across owned and third-party properties",
      "Structured data and factual alignment",
      "Controlled experiment design on comparable page groups",
      "Measurement: assistant referrals, brand query volume, citation tracking where observable",
      "Written findings, including null results",
    ],
    deliverables: [
      "An assumption register with the evidence status of each item",
      "Implemented structural and entity work",
      "Experiment results with interpretation",
      "A briefing document for your team on what to keep doing",
    ],
    idealFor: [
      "Organisations being sold GEO without verification",
      "Businesses with a content operation able to run controlled changes",
      "Teams who want the honest version before committing budget",
      "Not for: anyone requiring a guarantee of inclusion in generated answers",
    ],
    related: ["ai-search-optimization", "search-engine-optimization-seo", "content-strategy", "digital-marketing-audits"],
    faqs: [
      {
        q: "Is GEO a real discipline?",
        a: "The underlying work — structure, clarity, verifiable claims, entity consistency — is real and old. The label is new and currently used to sell unverifiable outcomes. We do the real part and are explicit about the limit.",
      },
      {
        q: "What can actually be measured?",
        a: "Referral traffic from assistant surfaces where the referrer is passed, brand query volume, and citation appearances you can observe manually. What cannot be measured is why a specific model produced a specific answer. We build reporting around the first set and say so about the second.",
      },
      {
        q: "How is this priced?",
        a: "As a fixed-scope engagement with a stated measurement window, because open-ended work on an unverifiable outcome is not a fair arrangement for either side.",
      },
    ],
    pricing: "Request a quote. Fixed scope with a stated measurement window.",
  },

  {
    slug: "conversion-rate-optimization",
    tagline: "Find the step that loses the customer, then fix that one.",
    summary:
      "Conversion work is measurement plus removal of friction. We instrument the actual journey, find where people leave, and change the smallest thing that might fix it — testing one variable rather than redesigning the page.",
    problem:
      "Most conversion projects begin with a redesign, which changes twenty variables at once and therefore teaches nothing. When numbers move, nobody knows which change did it, or whether the improvement was real. Meanwhile the actual leak is often a single form field, a shipping cost revealed late, or a required account creation that nobody questioned.",
    approach: [
      "We establish the funnel with real numbers: where visitors enter, where they leave, and what the abandoned step costs you. Without this the work is opinion.",
      "We identify the highest-value drop-off and form a hypothesis with a mechanism — why would this change reduce abandonment? A change without a mechanism is a coin flip.",
      "We test one variable at a time where traffic allows, and say so when it does not. Low-traffic sites need ordered changes with before-and-after windows, not fake A/B tests that cannot reach significance.",
      "Every change is logged with its date, its hypothesis and its result, so the record accumulates rather than restarting with each agency.",
    ],
    benefits: [
      "The leak identified and quantified before anything is redesigned",
      "Changes with a stated mechanism, so learning accumulates",
      "Honest statistical handling on low-traffic sites",
      "A conversion record that survives staff turnover",
    ],
    scope: [
      "Funnel instrumentation and baseline",
      "Drop-off analysis with revenue or enquiry impact per step",
      "Hypothesis backlog ordered by expected value",
      "Test implementation, or ordered changes where volume is too low to test",
      "Form and checkout friction review",
      "Results report per change, including inconclusive outcomes",
      "Documented change log",
    ],
    deliverables: [
      "A funnel baseline with the leak quantified",
      "An ordered hypothesis backlog with reasoning",
      "Implemented changes and test results",
      "A permanent change log",
    ],
    idealFor: [
      "Sites with meaningful traffic and disappointing conversion",
      "E-commerce and lead-generation flows with a measurable step",
      "Teams who have redesigned before and could not say what worked",
      "Not for: a site with too little traffic to measure — fix the obvious friction instead and stop",
    ],
    related: ["website-conversion-optimization", "search-engine-optimization-seo", "e-commerce-development", "website-performance-optimization"],
    faqs: [
      {
        q: "How much traffic do we need?",
        a: "For genuine A/B tests on a specific step, meaningfully more than most small business sites have. Below that we run ordered changes with before-and-after windows and tell you the confidence is lower. We will not present a statistically meaningless test as a result.",
      },
      {
        q: "Will you redesign our site?",
        a: "Only if the evidence says the design is the problem, which is less often than a redesign agency will suggest. Most conversion gains come from removing or reordering things.",
      },
      {
        q: "What about privacy and consent?",
        a: "Instrumentation follows the consent posture of the site. Where consent limits measurement, we say what can and cannot be concluded rather than inferring past the data.",
      },
    ],
    pricing: "Request a quote. Scoped by funnel complexity and traffic volume.",
  },

  {
    slug: "digital-marketing-audits",
    tagline: "An honest read of what your marketing is actually doing.",
    summary:
      "A fixed-scope audit across search, paid, content, tracking and conversion. We tell you what is working, what is spending without returning, and what cannot be assessed because measurement is missing.",
    problem:
      "Marketing budgets accumulate commitments — a retainer here, an ad account there, a newsletter nobody measures — and after two years nobody can say which parts produce customers. The purpose of an audit is not to produce a list of recommendations; it is to establish what is knowable.",
    approach: [
      "We inventory every channel, every spend and every tool, including the ones nobody thought to mention in the briefing. The forgotten line item is frequently the one with no measurable return, and it is usually a subscription renewing quietly.",
      "For each channel we attempt to trace cost to outcome. Where tracking does not permit that, we say so explicitly rather than estimating a number that looks authoritative.",
      "We assess the fundamentals under the channels: whether the site converts, whether search is technically sound, whether content matches intent.",
      "The output is ordered by money recoverable rather than by effort, and it includes an explicit list of things to stop. A strategy that only adds activity is how the marketing estate got into this state to begin with.",
    ],
    benefits: [
      "A clear view of which spend returns and which does not",
      "Explicit gaps in measurement, with the cheapest way to close each",
      "An ordered plan for the next quarter",
      "Things to stop paying for",
    ],
    scope: [
      "Channel, spend and tool inventory",
      "Search visibility and technical review",
      "Paid account structure and efficiency review",
      "Content and landing-page assessment against intent",
      "Analytics and tracking integrity review",
      "Conversion path assessment",
      "Prioritised findings with cost-to-fix",
    ],
    deliverables: [
      "An audit document with findings and evidence",
      "A recoverable-spend estimate where it can be supported",
      "A measurement gap list with remediation",
      "A prioritised 90-day plan",
    ],
    idealFor: [
      "Businesses with several years of accumulated marketing commitments",
      "Teams preparing a budget review",
      "Organisations who suspect waste but cannot locate it",
      "Not for: a business that has never run marketing — a strategy engagement is the better starting point",
    ],
    related: ["digital-marketing-strategy", "competitor-analysis", "audience-research", "digital-growth-consulting"],
    faqs: [
      {
        q: "How long does it take?",
        a: "Two to four weeks depending on the number of channels and how much access you can grant.",
      },
      {
        q: "Do we have to buy the implementation from you?",
        a: "No, and the audit is written to be actionable without us. We will quote implementation separately where it makes sense.",
      },
      {
        q: "What if we have no analytics?",
        a: "Then that is the first finding, and the audit will say so. Some sections become unassessable, and inventing a figure for them would defeat the point.",
      },
    ],
    pricing: "Fixed price, quoted after a short call to establish scope.",
    duration: "2–4 weeks",
  },

  {
    slug: "content-strategy",
    tagline: "Decide what to publish, why, and what it must do.",
    summary:
      "A content plan tied to commercial intent and to someone's capacity to produce it. Most content strategies fail because they describe an internet's worth of publishing and no one can write it.",
    problem:
      "Content strategies usually arrive as a 60-page keyword list with a posting calendar nobody keeps. They fail for a predictable reason: they are built on demand data alone, without reference to who will write the material, what the business can credibly say, or what the reader does next. The result is content published to satisfy a schedule and read by nobody.",
    approach: [
      "We map intent against credibility: which questions can this business answer better than the available alternatives? Publishing on a topic you cannot add to is how content becomes noise.",
      "We plan against capacity honestly. Six pieces a quarter that get maintained beat thirty that decay, and the plan is sized to the person who has to write them.",
      "Every piece has a job — rank for a query, answer an objection on a sales call, support an existing page internally — and a measure.",
      "We include a maintenance rule with an owner and a review interval, because content that is never revisited becomes inaccurate and then actively harmful — a stale guide that ranks well is worse than no guide at all, since it is the one people act on.",
    ],
    benefits: [
      "A plan that reflects what the business can actually produce",
      "Each piece tied to a commercial purpose and a measure",
      "Fewer, better pieces that get maintained",
      "A clear owner per piece before it is commissioned",
    ],
    scope: [
      "Audit of existing content: performance, accuracy, decay",
      "Intent and credibility mapping",
      "Topic clusters and internal linking plan",
      "Capacity assessment and a realistic publishing calendar",
      "Briefs for the first quarter of pieces",
      "Editorial standards and a review cycle",
      "Measurement per piece against its stated job",
    ],
    deliverables: [
      "A content strategy document with the reasoning",
      "A sized publishing calendar",
      "Briefs for the first quarter",
      "A review and retirement rule",
    ],
    idealFor: [
      "Businesses with a blog full of pieces that do nothing",
      "Teams planning to hire a writer and needing to know what for",
      "Publishers and research organisations with deep material and no structure",
      "Not for: a business with no capacity to produce content — strategy without a writer is a document",
    ],
    related: ["search-engine-optimization-seo", "audience-research", "keyword-research", "digital-marketing-strategy"],
    faqs: [
      {
        q: "Will you write the content?",
        a: "We can, and often do for the first pieces while standards are established. The plan is written so an in-house writer can carry it, because a strategy that requires an agency forever is a dependency, not a strategy.",
      },
      {
        q: "How do you handle content that is already published?",
        a: "Audited: keep and improve, consolidate, or retire. Consolidating six thin pieces into one substantial one usually outperforms writing a seventh.",
      },
    ],
    pricing: "Request a quote. Fixed scope for strategy; writing quoted separately.",
  },
];
