import type { ServiceDetail } from "../serviceDetailTypes";

/**
 * Division D5 — Publishing, Book Discoverability & Author Solutions.
 *
 * The studio's original discipline, and the one where the widest gap exists
 * between what is sold to authors and what can actually be evidenced. These six
 * pages stay inside what is observable: metadata, search presence, the reader
 * path, and the mechanics of a launch. No promised chart positions, no invented
 * sales figures, no implied publisher relationships.
 */
export const publishingServiceDetails: ServiceDetail[] = [
  {
    slug: "book-discoverability-strategy",
    tagline: "Make the book findable by the reader who is already looking.",
    summary:
      "A discoverability programme for a title or a list: where demand already exists, how the book currently surfaces against it, and the dated corrections that would change that. The studio's original service, applied deliberately.",
    problem:
      "A book that is not discoverable is not judged — it is never seen. The usual response is promotion aimed at strangers, which is expensive and forgettable. The alternative is less glamorous and measurably larger: find the queries and categories where readers already express intent, and make sure the book is capable of appearing there. Most titles lose discoverability to a cluster of small correctable things, not to a marketing budget.",
    approach: [
      "We establish how the title currently surfaces: which queries it appears for, which categories it sits in, and what the reader path looks like from query to purchase.",
      "We read the book, or enough of it to represent it honestly, because metadata derived from a blurb alone tends to describe what the author hoped the book was.",
      "Corrections are prioritised by expected effect and listed with dates against each item, so the programme can be assessed afterwards rather than believed at the time. That list is the difference between a strategy and an assertion.",
      "We set the measurement window before any work starts, agree what would count as a change, and report against it afterwards — including the items that did not move. A programme assessed only on what improved is not being assessed at all.",
    ],
    benefits: [
      "Corrections that are specific, dated and checkable",
      "A reader path that stops breaking between query and purchase",
      "Metadata that describes the book accurately rather than aspirationally",
      "A measured read of what changed over a defined window",
    ],
    scope: [
      "Baseline: search presence, category placement, referral traffic",
      "Reader-intent mapping for the title's genuine subject matter",
      "Title, subtitle and description architecture review",
      "Category and keyword recommendations per retailer where controllable",
      "Reader path repair: author presence, series links, retail linking",
      "A dated correction list with priority per item",
      "Before-and-after measurement over a stated window",
    ],
    deliverables: [
      "A documented baseline",
      "A prioritised, dated correction list",
      "Implemented metadata and category changes where you authorise them",
      "A written before-and-after report over the measurement window",
    ],
    idealFor: [
      "Backlist titles with no discoverability work ever done",
      "Independent authors and small presses without a marketing department",
      "Publishers wanting a repeatable programme across a list",
      "Not for: a book in a category with no search demand — we will say so rather than sell a programme",
    ],
    related: ["book-seo", "book-metadata-optimization", "book-marketing-strategy", "discoverability"],
    faqs: [
      {
        q: "Do you guarantee rankings?",
        a: "No. We commit to specific, dated work and a measurement method, and we report what moved and what did not. Retailer algorithms are not under our control and anyone promising a position is guessing.",
      },
      {
        q: "How long is the measurement window?",
        a: "Typically eight to twelve weeks after the corrections are live. Shorter than that and you are measuring noise, not effect.",
      },
      {
        q: "Does this work for a book that has not launched yet?",
        a: "Yes, and it is more effective. Discovering before publication means category and metadata decisions are made before they are locked in, rather than corrected afterwards.",
      },
    ],
    pricing: "Fixed scope per title, quoted in writing with the measurement window stated.",
    duration: "8–12 weeks including the measurement window",
  },

  {
    slug: "book-seo",
    tagline: "The indexing layer between your book and its reader.",
    summary:
      "Retailer search and web search treated as the two distinct systems they are: backend keyword fields, category placement and browse nodes on one side; an author presence that ranks on the other.",
    problem:
      "Book SEO is usually either ignored or done as keyword stuffing in the seven backend fields. Both fail. Repeating words already in the title wastes scarce character space, an overcrowded top-level category earns no visibility badges, and the author's own site does not rank for the subject of their own book. These are separate problems with separate fixes, and conflating them wastes the effort.",
    approach: [
      "We separate the two surfaces and work them independently. Retailer indexing rewards intent coverage and category specificity; web search rewards a site with genuine content about the subject.",
      "Backend fields are treated as an allocation problem: what intent is not already covered by the title and subtitle, and what is the most valuable use of each remaining character.",
      "Category placement is researched rather than assumed. A targeted subcategory where the title can rank beats a broad one where it cannot.",
      "On the author side, the fix is content and structure: pages that answer the questions the book addresses, and internal linking that makes the relationship between them legible.",
    ],
    benefits: [
      "Backend fields used on intent not covered elsewhere",
      "Category placement chosen for achievable visibility",
      "An author site capable of ranking for the book's subject",
      "Both surfaces measured rather than assumed",
    ],
    scope: [
      "Retailer index audit: title, subtitle, backend fields, browse nodes",
      "Keyword and intent gap analysis",
      "Category and browse-node recommendations",
      "Description architecture review",
      "Author-site technical and content review",
      "Subject-matter content plan for the author site",
      "Baseline and follow-up measurement for both surfaces",
    ],
    deliverables: [
      "A retailer metadata specification",
      "Category placement recommendations with rationale",
      "An author-site content plan",
      "Measurement reports for both surfaces",
    ],
    idealFor: [
      "Self-published authors controlling their own metadata",
      "Small presses managing several titles",
      "Authors whose site does not rank for their own subject",
      "Not for: a title with metadata already optimised and an established author site — an audit will confirm it and cost less",
    ],
    related: ["discoverability", "book-metadata-optimization", "amazon-author-profile-optimization", "search-engine-optimization-seo"],
    faqs: [
      {
        q: "Can you change metadata in retailer systems for us?",
        a: "Where you have the access, yes — we will do it or specify exactly what to change. Through an aggregator or publisher, we produce the specification and you submit it.",
      },
      {
        q: "Is keyword stuffing ever justified?",
        a: "No. It wastes character allocation on words already indexed from the title, and on some platforms it suppresses rather than helps. The fields are for intent the title does not already carry.",
      },
    ],
    pricing: "Request a quote. Fixed scope per title.",
  },

  {
    slug: "author-website-development",
    tagline: "A site for the reader who has just found you.",
    summary:
      "An author site built for the moment after a review, a podcast or a recommendation sends a stranger to your name — not a digital CV listing awards they have never heard of.",
    problem:
      "Most author sites greet a new reader with a biography, a headshot and an abandoned blog. That reader arrived with one question: which of these books should I read first? The site does not answer it. Meanwhile the person who already knows the work finds nothing to subscribe to, and neither visitor converts.",
    approach: [
      "We design for the two visitors who actually arrive: the stranger deciding whether to try a book, and the reader who has finished one and wants more. Both get a clear path; the biography serves them, not the reverse.",
      "Every book gets a page written as an entry point — what it is, who it is for, where to start — rather than as a product listing.",
      "The email list is the only reader asset that survives a platform change, so the signup is designed as a genuine exchange rather than a popup.",
      "The build is deliberately small and maintainable. An author should be able to add a book, correct a blurb or publish a note without a developer, because an author site that requires a retainer to stay current will stop being current within a year.",
    ],
    benefits: [
      "A stranger can choose a first book in under a minute",
      "A reader who finished one book has somewhere to go next",
      "An email list that belongs to the author, not a platform",
      "Pages that rank for the author's name and subject",
    ],
    scope: [
      "Reader-path and entry-point design",
      "Per-book pages with distinct positioning",
      "Email capture and welcome sequence",
      "Author bio and press assets",
      "Technical SEO and structured data (Person, Book)",
      "Performance and accessibility passes",
      "CMS setup so the author can publish independently",
    ],
    deliverables: [
      "A live author site with per-book pages",
      "An email capture flow and welcome sequence",
      "A press and media page",
      "A short guide to publishing a new book page without help",
    ],
    idealFor: [
      "Authors with several titles and no coherent entry point",
      "Debut authors preparing for publication",
      "Nonfiction and technical authors whose name carries professional weight",
      "Not for: an author with one book and no further plans — a landing page is the right size",
    ],
    related: ["author-branding", "book-landing-pages", "book-seo", "author-email-marketing"],
    faqs: [
      {
        q: "Do you design the covers too?",
        a: "We do not produce covers — that is a specialist discipline and a different supplier. We build the site the covers live on, and we will work to whatever cover assets exist.",
      },
      {
        q: "Can it sell books directly?",
        a: "It can, though for most authors the right answer is to send readers to the retailer with the best conversion rather than build fulfilment. Where direct sales make sense — signed copies, bundles — we will build it.",
      },
      {
        q: "What about the author newsletter?",
        a: "Set up as part of the build: capture, welcome sequence, and a template the author can use. The list is the durable asset and it should not depend on any platform's algorithm.",
      },
    ],
    pricing: "Request a quote. Fixed scope by page count.",
    duration: "4–8 weeks",
  },

  {
    slug: "author-branding",
    tagline: "The name and the book, aligned without being conflated.",
    summary:
      "Identity work for authors whose professional standing and writing identity both matter — technical authors, academics, consultants, practitioners — where the two must reinforce each other without merging.",
    problem:
      "An author with a professional reputation has two audiences that need different things from the same name. Merging them is the usual mistake: the book page becomes a consultancy site, or the professional bio disappears and the writer loses the authority that made the book credible. Separating them entirely is the equal and opposite error: two presences, neither aware of the other.",
    approach: [
      "We map the two identities and how they relate: what the professional standing lends to the book, what the book adds to the standing, and what must stay distinct.",
      "We decide the primary frame for the name and keep the other available — usually one clear positioning with the second as a linked but separate surface.",
      "Visual and verbal identity follows: a system that works on a book jacket and on a professional profile without looking borrowed from either.",
      "Everything is applied consistently across the owned properties, because inconsistent identity is what makes readers uncertain whether it is the same person.",
    ],
    benefits: [
      "One name that reads consistently across professional and writing contexts",
      "Authority that compounds instead of splitting",
      "Clear rules for what goes where",
      "A coherent public presence for a book's subject",
    ],
    scope: [
      "Identity mapping: professional and authorial",
      "Positioning statement for the name",
      "Visual identity applied across web, print and profile surfaces",
      "Verbal identity and biography versions by context",
      "Owned-property consistency audit",
      "Application to the primary surfaces in scope",
      "Guidance for future contexts",
    ],
    deliverables: [
      "An identity map and positioning statement",
      "Applied identity across the owned surfaces",
      "Biography versions for each context",
      "Usage guidance",
    ],
    idealFor: [
      "Technical, academic and professional authors with a first or second book",
      "Consultants whose book is a credential and whose practice is the business",
      "Authors whose web presence predates their writing",
      "Not for: a first-time author with no separate professional identity — start with the author site",
    ],
    related: ["brand-strategy", "author-website-development", "author-authority", "author-digital-presence-management"],
    faqs: [
      {
        q: "Should the book and the business share a website?",
        a: "Usually not, and we will recommend against it where it weakens both. The book needs a reader path; the practice needs a client path. They can live on one domain with clear separation if that is the preference.",
      },
      {
        q: "How is this different from a standard identity project?",
        a: "The starting condition — two audiences already attached to one name — changes the work. A general identity project assumes a single audience; this one has to hold two without diluting either.",
      },
    ],
    pricing: "Request a quote. Scoped by the number of surfaces.",
  },

  {
    slug: "book-launch-campaigns",
    tagline: "A launch built backward from the date.",
    summary:
      "Pre-publication planning sequenced from the launch date: reader targeting, advance-review programmes, community seeding and channel selection with budgets and expected outputs stated per channel.",
    problem:
      "Most launches are a burst of activity that starts too late. Reviews take weeks to place, communities dislike being marketed to on first contact, and retail algorithms respond to early velocity that has to be organised before publication, not after. A launch plan assembled two weeks out is a list of things being done in the wrong order.",
    approach: [
      "We work backward from the publication date and mark the dependencies: what must be arranged six weeks out, what has to be in place a fortnight before, what happens on the day.",
      "Channels are selected per book rather than by habit, with an honest cost and expected output for each. A genre with an active community warrants different channels from a technical monograph.",
      "Advance readers are recruited and briefed early, because review velocity at launch is the one thing that cannot be bought later.",
      "We state explicitly what will not be done and why. A launch plan that includes every available channel is a plan with no decisions in it, and it will consume the budget in proportion to how anxious everyone is rather than to what works.",
    ],
    benefits: [
      "A dated plan with dependencies and owners rather than a list of tactics",
      "Channels justified per book, with budgets and expected outputs",
      "An advance-review pipeline stood up before launch",
      "Outputs stated per channel, so the debrief is factual",
    ],
    scope: [
      "Reader segmentation and community mapping",
      "Competitive launch review in the genre",
      "Dated plan with dependencies, owners and gates",
      "Advance-reader recruitment and briefing",
      "Channel plan with budget range and expected output per channel",
      "Pre-order and publication-week sequencing",
      "Post-launch debrief against the stated outputs",
    ],
    deliverables: [
      "A dated launch plan with owners",
      "A channel plan with budgets and expected outputs",
      "An advance-review pipeline",
      "A post-launch debrief",
    ],
    idealFor: [
      "Independent authors and small presses launching a title with a fixed date",
      "Authors whose previous launch was a scatter of activity",
      "Publishers running several launches a year and wanting a repeatable shape",
      "Not for: a title with no publication date yet — start with positioning",
    ],
    related: ["launch-strategy", "reader-acquisition-funnels", "book-marketing-strategy", "author-email-marketing"],
    faqs: [
      {
        q: "How far ahead should we start?",
        a: "Twelve weeks is comfortable; eight is workable; four is a salvage operation. The constraint is review placement, which cannot be compressed.",
      },
      {
        q: "Do you guarantee first-week sales?",
        a: "No. We set expected outputs per channel, run the plan, and report against them. Anyone guaranteeing sales numbers is inventing them.",
      },
      {
        q: "What if the book has already launched?",
        a: "Then the work is discoverability and backlist rather than launch, which is a different engagement. We will tell you which applies rather than selling a launch to a launched book.",
      },
    ],
    pricing: "Request a quote. Fixed price for a fixed plan, agreed before launch work begins.",
  },

  {
    slug: "publishing-automation",
    tagline: "Take the recurring work off a small publishing team.",
    summary:
      "Automation for the operational side of publishing: metadata propagation, ONIX handling, rights and royalty reconciliation, review monitoring and the reporting nobody has time to compile.",
    problem:
      "Small presses and independent publishers run on a handful of people, and much of their week is repeatable administration: re-entering the same metadata across retailers, reconciling royalty statements, chasing review coverage, assembling a monthly report. None of it is the work they started the press to do, and it scales linearly with the list.",
    approach: [
      "We inventory the recurring administrative work and cost it by hours and error rate. Metadata propagation and royalty reconciliation usually top the list.",
      "Deterministic work is automated deterministically: feeds, transformations, scheduled jobs. Publishing metadata is structured, which means it does not need a model — it needs a reliable pipeline.",
      "Anything handling money gets a reconciliation step with an exception report, so a mismatch is visible rather than absorbed.",
      "We build in a way the team can operate: documented jobs, alerting on failure, and no dependency on a dashboard somebody has to remember to open.",
    ],
    benefits: [
      "Metadata entered once and propagated rather than re-typed per retailer",
      "Royalty reconciliation with an exception report instead of a manual trawl",
      "Monthly reporting generated rather than compiled",
      "Alerting when a feed or a job fails, before a retailer shows stale data",
    ],
    scope: [
      "Administrative workflow inventory with hours and error cost",
      "Metadata pipeline design and implementation",
      "ONIX or feed generation where required",
      "Royalty and sales reconciliation with exceptions",
      "Review and coverage monitoring",
      "Generated reporting on a schedule",
      "Job monitoring, alerting and documentation",
    ],
    deliverables: [
      "Working automated pipelines for the processes in scope",
      "Exception reports where money is involved",
      "Scheduled reporting",
      "Documentation and an alerting setup the team can run",
    ],
    idealFor: [
      "Small presses managing a growing list with a fixed team",
      "Independent publishers re-entering metadata manually",
      "Publishing operations where reporting consumes a person each month",
      "Not for: a single-title author — the operational overhead does not exist yet",
    ],
    related: ["book-metadata-optimization", "publishing-analytics", "publisher-websites", "business-process-automation"],
    faqs: [
      {
        q: "Will this replace our publishing system?",
        a: "No. It connects to what you have. Replacing a title management system is a much larger project and usually not the constraint — the manual glue between systems is.",
      },
      {
        q: "Can you work with ONIX?",
        a: "Yes. Where a feed already exists we improve it; where it does not, we generate one from your source data with validation so a malformed record is caught before a retailer rejects it.",
      },
      {
        q: "Does this need AI?",
        a: "Mostly not, and that is the point. Publishing metadata is structured data with strict formats — deterministic pipelines are more reliable and cheaper than a model, and we will build it that way.",
      },
    ],
    pricing: "Request a quote. Scoped by the number of processes and feeds.",
  },
];
