import type { ServiceDetail } from "../serviceDetailTypes";

/**
 * Division D6 — Business Intelligence & Technology Consulting.
 *
 * Advisory work for organisations that suspect their systems or their process is
 * the constraint but cannot yet say where. Every page here is written so the
 * deliverable is a decision document, not a slide deck recommending more work.
 */
export const intelligenceServiceDetails: ServiceDetail[] = [
  {
    slug: "digital-transformation-consulting",
    tagline: "Decide what to change, in what order, before paying to change it.",
    summary:
      "Advisory work for a business that knows its systems are the constraint but not where the constraint actually is. We produce a sequenced plan — what to change, in what order, what it costs, and what gets switched off first.",
    problem:
      "Digital transformation fails for organisational reasons far more often than technical ones. Overlapping systems with no agreed owner of each fact, a roadmap written by a vendor with a product to sell, change programmes that never finish because everything is a dependency of everything else, and staff turnover that resets the effort every eighteen months. None of these are solved by buying a platform.",
    approach: [
      "We establish the facts first: what systems exist, who owns each, what data lives where, and which processes actually cross a boundary. Most disagreements about 'the system' turn out to be disagreements about ownership.",
      "We identify the constraint by observation, not by preference — where does work stop, get re-entered, or wait for a person? That is where the money is.",
      "The plan is sequenced by dependency so that each release stands alone. A transformation programme that can only succeed all at once will not succeed.",
      "We write down what to switch off, because most estates carry tools nobody can justify and the saving often funds the first phase.",
    ],
    benefits: [
      "A system-of-record map the whole organisation can agree on",
      "A sequenced plan where each phase delivers value independently",
      "Costed options rather than a single recommendation with a price attached",
      "A list of things to decommission, with the saving quantified",
    ],
    scope: [
      "System, data and ownership inventory",
      "Process observation and constraint identification",
      "System-of-record definition, reviewed with stakeholders",
      "Options analysis with cost and risk per option",
      "Sequenced roadmap with dependencies and decision gates",
      "Decommissioning list with savings",
      "Governance model: who decides, who owns, how change is approved",
    ],
    deliverables: [
      "A system-of-record map",
      "A sequenced transformation roadmap",
      "A costed options paper",
      "A decommissioning schedule",
      "A governance and decision model",
    ],
    idealFor: [
      "Organisations with several overlapping systems and no clear owner of each fact",
      "Businesses whose last transformation programme did not land",
      "Leadership that needs an independent view before committing budget",
      "Not for: a single clear system replacement — that is a procurement exercise with a different shape",
    ],
    related: ["business-technology-audits", "technology-stack-assessment", "digital-growth-roadmaps", "business-systems-integration"],
    faqs: [
      {
        q: "How long does this take?",
        a: "Typically four to eight weeks depending on the size of the estate and how available the people who run it are. The interviews are the long pole, and they cannot be compressed much without losing the findings.",
      },
      {
        q: "Do you have partners you recommend?",
        a: "We will name platforms where one genuinely fits, and we will say why. We do not take referral fees, and we are willing to recommend that you build something small yourself with a local developer.",
      },
      {
        q: "What if we disagree with the roadmap?",
        a: "The roadmap is written so the reasoning is visible and each decision can be argued with. Being argued with is what makes it useful — a plan nobody disagrees with is usually a plan nobody has read.",
      },
    ],
    pricing: "Request a quote. Fixed scope agreed before work begins.",
    duration: "4–8 weeks",
  },

  {
    slug: "business-technology-audits",
    tagline: "What you have, what it costs, and what is at risk.",
    summary:
      "A structured review of the systems a business runs on: cost, overlap, risk, security posture and the operational friction each one creates. Shorter and more specific than a transformation programme.",
    problem:
      "Technology estates accumulate: a CRM nobody fully uses, two tools that do the same job, a server whose certificate expires next month, a developer with root access who left last year. Each was a reasonable decision. Together they represent cost, risk and friction that nobody has overall visibility of, because no single person sees the whole estate.",
    approach: [
      "We inventory systems, users, owners, contracts and renewal dates, then cost the estate by category. Forgotten subscriptions surface here more reliably than in finance.",
      "Overlap is identified with evidence rather than by tool name. Two products doing the same job is a decision, and it may be a defensible one — but it should be a decision somebody makes knowingly and can explain, not one that simply accumulated because each purchase was approved by a different person.",
      "Risk is assessed concretely — access, patch level, backups actually tested, credential handling, single points of human dependency — rather than by a maturity score nobody can action.",
      "Findings are ranked by cost and risk together rather than by how interesting they are to a technologist. Each one names a specific owner and a next action, because a register of findings with no owners is a document that will be agreed with and then ignored.",
    ],
    benefits: [
      "A complete inventory with annual cost per system",
      "Overlapping tools identified with the decision made explicit",
      "Material risks with an owner and a remediation action",
      "A renewal calendar so decisions happen before auto-renewal",
    ],
    scope: [
      "System, user and contract inventory",
      "Cost analysis by category and renewal date",
      "Overlap and redundancy analysis",
      "Access and credential review",
      "Backup and recovery verification (tested, not assumed)",
      "Security posture review of the estate",
      "Ranked findings with owner and action",
    ],
    deliverables: [
      "An estate inventory with costs",
      "A risk register with owners",
      "A renewal calendar",
      "A prioritised action list",
    ],
    idealFor: [
      "Organisations that have never had a complete view of their estate",
      "Businesses preparing for due diligence or a security review",
      "Leadership teams surprised by renewal invoices",
      "Not for: an organisation with a well-run estate and a specific technical question — ask it directly",
    ],
    related: ["technology-stack-assessment", "technology-risk-assessment", "website-security-audits", "digital-transformation-consulting"],
    faqs: [
      {
        q: "Is this a security audit?",
        a: "It covers security posture and access as part of the estate review. A focused penetration test of an application is a different, deeper engagement, and we will say so if that is what you need.",
      },
      {
        q: "Do we need to give you access to everything?",
        a: "Read access to contracts and configuration is enough for most of it. Anything requiring deeper access is scoped explicitly and agreed in writing first.",
      },
    ],
    pricing: "Request a quote. Scaled by estate size.",
  },

  {
    slug: "business-intelligence-dashboards",
    tagline: "Numbers produced once, from data that is actually governed.",
    summary:
      "Reporting built from a defined source of truth, so the meeting and the system agree. The dashboard is the visible part; the work is deciding what each number means and where it comes from.",
    problem:
      "Most dashboard projects create a new place for numbers to disagree. Two teams export from the same system and arrive with different figures because they filtered differently, or counted a customer on a different date. The dashboard then gets blamed. The real problem predates it: no agreed definition of the metrics, and no defined system of record.",
    approach: [
      "We define the metrics first, in writing: what exactly is counted, from which system, over what period, and who owns the definition. This is the part that prevents every later argument.",
      "Data flows from the system of record, transformed once, with validation. If a number cannot be derived from a governed source, it is labelled as an estimate rather than presented as fact.",
      "The interface shows the few things that drive decisions, with the ability to drill into the rest. A dashboard with forty charts is a dashboard nobody reads.",
      "We build the refresh, the alerting on failed loads, and the definitions document that makes the whole thing maintainable.",
    ],
    benefits: [
      "One agreed figure per metric, so meetings spend their time on decisions",
      "Reporting assembled automatically rather than by hand",
      "Visibility when a data load fails instead of a stale dashboard",
      "Definitions documented, so new staff inherit the logic",
    ],
    scope: [
      "Metric definition workshops and a written definitions register",
      "Source-of-truth mapping per metric",
      "Data pipeline with validation and failure alerting",
      "Dashboard build focused on decision-driving metrics",
      "Access controls appropriate to the data",
      "Refresh scheduling and monitoring",
      "Documentation and a handover session",
    ],
    deliverables: [
      "A metrics definitions register",
      "A working dashboard with scheduled refresh",
      "Pipeline monitoring and alerting",
      "Documentation for whoever maintains it",
    ],
    idealFor: [
      "Organisations where two reports of the same thing never agree",
      "Teams assembling monthly reports by hand from several exports",
      "Leadership making decisions on figures nobody can trace",
      "Not for: a business with clean definitions and one data source — a saved query may be enough",
    ],
    related: ["data-analytics", "business-systems-integration", "publishing-analytics", "automated-reporting-systems"],
    faqs: [
      {
        q: "Which tool do you use?",
        a: "Whichever fits your stack and budget, and often the one you already pay for. The tool is the least interesting decision — definitions and a governed source matter far more, and without them any tool produces disagreements.",
      },
      {
        q: "Can you fix our data quality as part of this?",
        a: "Where it blocks the metrics in scope, yes. A full historical clean-up is usually a separate, larger piece and we will scope it honestly rather than absorb it silently.",
      },
      {
        q: "How do you handle privacy?",
        a: "Access control is part of the build, and any personal data in scope is minimised or aggregated. Where regulation applies, we will flag what needs a decision rather than assume.",
      },
    ],
    pricing: "Request a quote. Scoped by metric count and source systems.",
    duration: "6–12 weeks",
  },

  {
    slug: "technology-stack-assessment",
    tagline: "Is the stack the constraint, or the team around it?",
    summary:
      "A focused review of the technology a business runs on — versions, dependencies, maintainability, hosting cost and the skills needed to keep it alive — with a straight answer on whether to keep, consolidate or replace.",
    problem:
      "Two expensive mistakes are common and opposite. Replacing a stack that is fine because it is unfashionable, and continuing to invest in a stack nobody can hire for. Both are usually argued from preference rather than evidence, because nobody has assessed what the current system costs to own.",
    approach: [
      "We assess what the stack costs to own: hosting, licences, the availability of people who can work on it, and the effort each change requires. That cost, not its age, is what decides the question.",
      "Maintainability is checked concretely: test coverage, dependency health, documentation, and whether a competent developer outside the current team could be productive in it within a week.",
      "We look at the surrounding constraint too. Frequently the problem is deployment process, review practice or bus factor rather than the language.",
      "The output is a keep/consolidate/replace recommendation with the reasoning and a migration outline where relevant — not a rewrite proposal by default.",
    ],
    benefits: [
      "A justified position on keeping or replacing, with the cost basis stated",
      "Recruitment and bus-factor risks identified",
      "A realistic migration outline if replacement is warranted",
      "An honest answer when the answer is 'do not rebuild this'",
    ],
    scope: [
      "Stack inventory: frameworks, versions, dependencies, hosting",
      "Cost-to-own analysis",
      "Dependency and version health",
      "Maintainability and test coverage review",
      "Deployment and recovery process review",
      "Skills and bus-factor assessment",
      "Keep / consolidate / replace recommendation with outline",
    ],
    deliverables: [
      "An assessment document with evidence",
      "A cost-to-own calculation",
      "A recommendation with reasoning",
      "A migration outline where replacement is advised",
    ],
    idealFor: [
      "Businesses inheriting a codebase from a previous agency",
      "Teams unable to hire for their current stack",
      "Organisations deciding whether to rebuild or maintain",
      "Not for: a stack with a clear, current plan — we will confirm it and stop",
    ],
    related: ["business-technology-audits", "digital-transformation-consulting", "it-strategy-consulting", "technology-implementation-planning"],
    faqs: [
      {
        q: "Will you tell us to rebuild?",
        a: "Only if the cost-to-own evidence supports it, which is less often than rebuild proposals suggest. Rewrites are expensive, risky and frequently solve a problem that was really about process.",
      },
      {
        q: "Can you assess a codebase you did not write?",
        a: "Yes, and it is a common engagement. We ask for repository access and a read-only environment where possible.",
      },
    ],
    pricing: "Request a quote. Scaled by codebase size.",
  },

  {
    slug: "digital-growth-roadmaps",
    tagline: "An ordered plan for growth, sized to what can actually be executed.",
    summary:
      "A prioritised twelve-month plan across acquisition, conversion and operations, sequenced so each quarter stands on the previous one and sized to the team that has to deliver it.",
    problem:
      "Growth plans usually fail on sequencing rather than on ambition. Everything is prioritised as urgent, the plan assumes a team twice the size of the real one, and paid acquisition is funded before the site converts or the operations can cope. The result is spend that generates demand the business cannot serve, which is the most expensive way to learn that conversion is the constraint.",
    approach: [
      "We measure the current state across acquisition, conversion and retention, and identify which one is the binding constraint. Improving the other two while the constraint remains is wasted effort.",
      "Priorities are sequenced by dependency: a paid campaign requires a converting landing page and a response process that can handle the volume.",
      "The plan is sized to actual capacity. If there are two people, the plan is two people's worth, and we say what will not happen as a result.",
      "Each quarter has a stated outcome and a decision gate, so the plan can be changed on evidence rather than defended on principle.",
    ],
    benefits: [
      "Effort concentrated on the actual binding constraint",
      "Sequence that respects dependencies rather than wishful ordering",
      "A plan the team can deliver, with explicit exclusions",
      "Quarterly decision gates so the plan stays honest",
    ],
    scope: [
      "Current-state measurement across acquisition, conversion and retention",
      "Constraint identification with evidence",
      "Prioritised initiative list with dependencies",
      "Capacity assessment and a sized plan",
      "Quarterly outcomes and decision gates",
      "Measurement plan and reporting cadence",
      "Explicit exclusions with reasons",
    ],
    deliverables: [
      "A twelve-month roadmap with quarterly gates",
      "A constraint analysis",
      "A capacity-sized delivery plan",
      "A measurement and reporting plan",
    ],
    idealFor: [
      "Businesses spending on growth without a clear constraint",
      "Teams whose plan assumes more capacity than they have",
      "Leadership needing an ordered view across marketing, product and operations",
      "Not for: a business that has not yet found product-market fit — growth spend is premature",
    ],
    related: ["digital-marketing-strategy", "digital-transformation-consulting", "customer-acquisition-strategy", "digital-growth-consulting"],
    faqs: [
      {
        q: "Does this include execution?",
        a: "The roadmap is advisory. We can deliver parts of it — web, SEO, automation — and will be explicit about which parts we should do and which should go elsewhere.",
      },
      {
        q: "How do you handle a plan that has already started?",
        a: "We assess what is in flight, what it is producing, and whether it addresses the constraint. Recommending that existing work be stopped is a normal outcome of this engagement.",
      },
    ],
    pricing: "Request a quote. Fixed scope for the roadmap; delivery quoted separately.",
    duration: "4–6 weeks",
  },
];
