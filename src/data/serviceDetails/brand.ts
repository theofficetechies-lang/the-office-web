import type { ServiceDetail } from "../serviceDetailTypes";

/**
 * Division D4 — Branding, Design & Creative Services.
 *
 * The thread through these five: a brand is a set of decisions other people have
 * to apply without you in the room. Every page is written from that constraint.
 */
export const brandServiceDetails: ServiceDetail[] = [
  {
    slug: "brand-identity-design",
    tagline: "An identity that still works when someone else applies it.",
    summary:
      "The mark, the type, the palette and the rules that make a hundred future pieces look like they came from one place — built to survive being used by people who were not in the meetings.",
    problem:
      "Most identity projects are judged on a presentation and then handed to people who must apply them under deadline. The logo survives; the system does not. Six months later there are four shades of the same colour, three versions of the mark on a dark background, and every document looks slightly different. The identity did not fail aesthetically — it failed operationally.",
    approach: [
      "We start with the constraint the identity must operate in: who applies it, with what tools, at what speed, and what they will realistically do when they are in a hurry.",
      "The system is kept deliberately small — type pairing, palette, mark behaviour, one layout logic — because a system with forty rules is a system nobody reads.",
      "Every asset is built and tested in the places it will actually appear: a phone screen, a printed invoice, a van, a slide at 11pm the night before.",
      "We deliver in the formats people use, not the formats designers prefer, with the rules in plain language and an explicit set of things that are always allowed.",
    ],
    benefits: [
      "Consistent application without a designer in the loop",
      "Fewer decisions for anyone producing material",
      "Assets that work across print, screen and physical environments",
      "A documented system a new hire can follow in an afternoon",
    ],
    scope: [
      "Discovery: positioning, audience, competitive and category review",
      "Mark design with versioning for light, dark and single-colour use",
      "Type selection and licensing guidance",
      "Colour system with documented values and accessible pairings",
      "Layout logic and grid",
      "Asset production across the formats in scope",
      "A short, usable set of guidelines",
    ],
    deliverables: [
      "Primary and secondary marks in all required formats",
      "Colour and type specification with accessible combinations",
      "Templates for the documents and channels in scope",
      "Guidelines document, short enough to be read",
    ],
    idealFor: [
      "Businesses whose visual identity has drifted through improvisation",
      "Organisations preparing to hire a marketing team who will apply it",
      "Companies whose mark is fine but whose system is unusable",
      "Not for: a business needing only a logo file — that is a smaller piece of work and we will quote it that way",
    ],
    related: ["brand-guidelines", "brand-strategy", "ui-ux-design", "graphic-design"],
    faqs: [
      {
        q: "How many concepts do we see?",
        a: "One developed direction with a documented rationale, presented alongside the exploration that led to it. Multiple competing concepts invite a vote on personal taste, which is the wrong way to choose a system.",
      },
      {
        q: "Do we own the artwork?",
        a: "Yes, with full rights transferred on final payment. Type licences are separate — we specify what to buy and in whose name, so the licence sits with you.",
      },
      {
        q: "What if we already have a logo we like?",
        a: "Then a brand refresh is probably the right engagement rather than a new identity: keep the mark, build the system around it, and fix what is broken rather than starting again.",
      },
    ],
    pricing: "Request a quote. Fixed scope by deliverable set.",
    duration: "6–10 weeks",
  },

  {
    slug: "brand-strategy",
    tagline: "Decide what you are before deciding what you look like.",
    summary:
      "The positioning work underneath an identity: who you are for, what you are not, and the language that follows from both. Design without this is decoration.",
    problem:
      "Brand projects often start with mood boards because the underlying questions are uncomfortable: which customers are you deliberately not for, what claim can you actually defend, and what does the business say no to? Those questions are commercial, not aesthetic, and skipping them produces a beautiful identity around a message nobody can repeat.",
    approach: [
      "We interview the people who sell, deliver and receive the service — including customers where possible — rather than only the leadership team. The real positioning usually contradicts something in the deck.",
      "We establish the competitive frame from the buyer's side: what alternatives do they actually consider, including doing nothing and doing it internally?",
      "We write the position as a set of statements that can be tested against a real decision: which prospect to decline, which service to lead with, which claim to drop. A positioning that does not change a decision is a paragraph, not a strategy.",
      "Language follows the position: a tone of voice with worked examples on both sides — this, not that — written so a writer can apply it without an interpreter and a reviewer can point at the rule rather than at taste.",
    ],
    benefits: [
      "A position a whole team can repeat without a script",
      "Clear exclusions, which is what makes positioning useful",
      "Language that shortens the sales conversation",
      "A foundation for design, content and pricing decisions",
    ],
    scope: [
      "Stakeholder and customer interviews",
      "Competitive and alternative review from the buyer's perspective",
      "Positioning statement with supporting rationale",
      "Offer architecture and what to lead with",
      "Tone of voice with worked examples",
      "Messaging hierarchy for the primary audiences",
      "A one-page summary for internal alignment",
    ],
    deliverables: [
      "A positioning document with evidence and reasoning",
      "Tone of voice guidance with examples",
      "Messaging hierarchy",
      "A one-page internal summary",
    ],
    idealFor: [
      "Businesses whose site describes capabilities rather than a position",
      "Companies entering a new market or launching a new offer",
      "Teams where the leadership and the sales floor describe the business differently",
      "Not for: an organisation that has a clear position and needs it applied — start with the design or the content",
    ],
    related: ["brand-identity-design", "content-strategy", "business-website-design", "digital-growth-roadmaps"],
    faqs: [
      {
        q: "Is this the same as marketing strategy?",
        a: "It is the layer beneath it. Positioning decides what claim you are making and to whom; marketing strategy decides which channels carry it. This engagement does the first and deliberately stops there.",
      },
      {
        q: "What if leadership disagrees with the findings?",
        a: "Then we put the evidence in front of them rather than a preference. The deliverable is written to be argued with — that is what makes it useful, and the argument is usually the point.",
      },
    ],
    pricing: "Fixed price, quoted after scoping interviews.",
    duration: "4–8 weeks",
  },

  {
    slug: "brand-guidelines",
    tagline: "Rules short enough that people actually follow them.",
    summary:
      "A guidelines document written for the person under deadline: what is always allowed, what is never allowed, and the small number of decisions that keep everything consistent.",
    problem:
      "Brand guidelines are typically 90 pages of do's and don'ts that nobody opens, because the person making a slide at midnight needs one page. When the document is unusable, people improvise — reasonably — and the drift begins. Length is not rigour; it is usually the absence of decisions.",
    approach: [
      "We write the short version first: the one page that covers ninety percent of what anyone produces. Everything else is an appendix.",
      "Rules are phrased as decisions with consequences rather than preferences: state what breaks if the rule is ignored, and why that matters commercially. A rule justified only by taste gets discarded by the first person under pressure.",
      "We include what is always allowed, because a document containing only prohibitions gets ignored by people who have a job to do.",
      "Examples are real where possible: the actual deck, the actual invoice, the actual social post from last month. An abstract example does not survive contact with a real deadline, and a rule nobody has seen applied is a rule nobody will apply.",
    ],
    benefits: [
      "Consistency maintained by non-designers",
      "Fewer approval requests for routine material",
      "Faster production of everyday documents",
      "A defensible standard when something looks wrong",
    ],
    scope: [
      "Inventory of the material actually produced and by whom",
      "One-page core rules",
      "Mark usage, spacing and forbidden treatments",
      "Colour and type specification with accessible pairings",
      "Layout guidance for the document types in scope",
      "Tone of voice with worked examples",
      "Templates for common formats",
      "A review of one existing piece per type against the rules",
    ],
    deliverables: [
      "A one-page core rules sheet",
      "The full guidelines document",
      "Editable templates",
      "A short training session for whoever produces material",
    ],
    idealFor: [
      "Brands with an identity but no usable rules",
      "Organisations where several teams produce material independently",
      "Companies growing past the point where one person approves everything",
      "Not for: a business with no established identity to document — that is an identity project first",
    ],
    related: ["brand-identity-design", "brand-refresh-services", "graphic-design", "business-documents-design"],
    faqs: [
      {
        q: "How long should guidelines be?",
        a: "As short as the decisions allow. In our experience that is one to three pages of rules plus examples — not because the system is simple, but because everything beyond that is reference material people consult only when they have a specific question.",
      },
      {
        q: "Can you document a brand we did not create?",
        a: "Yes, and we often do. It starts with an audit of what actually exists across your material, because the real system is usually discoverable in what people have already been doing.",
      },
    ],
    pricing: "Request a quote. Scoped by the number of document types covered.",
  },

  {
    slug: "ui-ux-design",
    tagline: "Interfaces designed against the task, not the mood board.",
    summary:
      "Interaction and interface design for products, portals and sites — where the structure is decided by what the user is trying to finish, and every state is designed rather than discovered in production.",
    problem:
      "Interfaces are commonly designed as a happy path: one screenshot of the ideal case, and the empty, loading, error and permission-denied states left to whoever builds it. Those states are most of the experience in practice, and they are where users abandon. The design looked finished because only the finished case was drawn.",
    approach: [
      "We start from the tasks users must complete and the frequency with which they do them, then design the structure around the frequent path — not the most impressive one.",
      "Every component is designed across its real states: empty, loading, partial, error, and no-permission. That is more work up front and far less rework later.",
      "We design with real content at realistic lengths, in both languages where the product is bilingual, because placeholder text hides layout failures.",
      "Accessibility is part of the design, not a later pass: focus order, contrast, targets, and keyboard behaviour are specified per component.",
    ],
    benefits: [
      "Fewer abandoned tasks because the failure states are designed",
      "A component set the engineering team can build once",
      "Accessibility specified rather than retrofitted",
      "Less rework between design and build",
    ],
    scope: [
      "Task analysis and information architecture",
      "Wireframes and flows including failure paths",
      "Component design across all states",
      "Interaction specification: focus, keyboard, motion",
      "Content design for realistic lengths",
      "Accessibility annotation per component",
      "Prototype for testing where useful",
      "Handover with a component inventory",
    ],
    deliverables: [
      "Flows and wireframes",
      "A component library with defined states",
      "Interaction and accessibility specification",
      "A component inventory tied to implementation",
    ],
    idealFor: [
      "Products or portals where users must complete a task under pressure",
      "Teams rebuilding an interface that users describe as confusing",
      "Organisations needing accessible interfaces by obligation",
      "Not for: a marketing site with no interaction complexity — that is interface design for pages, quoted differently",
    ],
    related: ["website-interface-design", "mobile-app-interface-design", "website-accessibility-improvement", "brand-guidelines"],
    faqs: [
      {
        q: "Do you build it as well?",
        a: "We can. Many clients take design into their own engineering team, which works well when the component inventory and state specification are complete. We will quote design and build separately so you can choose.",
      },
      {
        q: "How do you validate the design?",
        a: "Where possible, with a small usability test on the tasks that matter — five participants on the critical flow finds most of the serious problems. It is cheaper than discovering them after launch.",
      },
    ],
    pricing: "Request a quote. Scoped by screens, components and flows.",
  },

  {
    slug: "motion-graphics",
    tagline: "Movement that explains something, and stops.",
    summary:
      "Short animated pieces — explainers, product sequences, title work — used where motion communicates faster than a static frame. Not decoration for its own sake.",
    problem:
      "Motion is expensive and easy to produce badly. The common failure is animation used to make a static idea feel dynamic: nothing is explained, the file is heavy, it competes with the content, and it costs more than the copy that would have done the job. Motion earns its place when it shows a sequence, a relationship or a change that a still cannot.",
    approach: [
      "We start with what must be understood, and decide whether motion is the right instrument at all. Sometimes the answer is a better static diagram, and we will say so before drawing anything.",
      "The piece is scripted before it is designed: what the viewer knows at each beat, and what has changed by the end. Most weak motion work is a weak script with competent animation on top, which is why it looks expensive and explains nothing.",
      "We design to the delivery constraint — file size, autoplay policies, reduced-motion requirements — from the beginning rather than compressing at the end.",
      "Motion respects the reduced-motion preference with a static alternative that still makes the point, rather than a frozen first frame. Accessibility here is not a fallback bolted on at export — it is designed into the piece from the storyboard.",
    ],
    benefits: [
      "An explanation that lands in thirty seconds",
      "Pieces built to the size and format constraints of where they live",
      "An accessible static alternative, not a broken experience",
      "Reusable component animations where a system is needed",
    ],
    scope: [
      "Concept and script",
      "Storyboard and design frames",
      "Animation and sound design where in scope",
      "Export in required formats and sizes",
      "Captions and transcripts",
      "Static fallback for reduced-motion contexts",
      "Source files handed over",
    ],
    deliverables: [
      "Master animation file",
      "Exports for each channel in scope",
      "Captions and transcript",
      "Static fallback frames",
    ],
    idealFor: [
      "Products whose value is hard to convey in a static image",
      "Organisations needing a repeatable explainer for sales use",
      "Brands with a motion system to establish, not just one video",
      "Not for: a piece where the message is a sentence — write the sentence",
    ],
    related: ["explainer-videos", "video-editing", "brand-identity-design", "advertising-creative-design"],
    faqs: [
      {
        q: "How long does an explainer take?",
        a: "Four to eight weeks for a two-minute piece, with the script and storyboard taking longer than clients expect. That is the stage where the value is created.",
      },
      {
        q: "Do you handle sound?",
        a: "Voiceover direction and music selection are in scope; original composition is not. We will specify what is needed and manage licensing so the rights sit with you.",
      },
    ],
    pricing: "Request a quote. Scoped by duration, style and channel count.",
  },
];
