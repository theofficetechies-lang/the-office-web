import type { ServiceDetail } from "../serviceDetailTypes";

/**
 * Division D2 — AI, Automation & Intelligent Business Systems.
 *
 * The brief is explicit: do not exaggerate AI capabilities, and clearly
 * distinguish AI-powered systems from conventional automation. That distinction
 * is the spine of these eight pages. Most of what removes recurring work is not
 * AI at all, and saying so is more useful to a buyer than a model name.
 */
export const aiServiceDetails: ServiceDetail[] = [
  {
    slug: "ai-business-automation",
    tagline: "Automate the work, and be honest about which half needs a model.",
    summary:
      "An engagement that finds the recurring work in your business, works out what each piece actually needs, and implements the cheapest thing that removes it — a rule, an integration, or a model where the rule genuinely cannot cope.",
    problem:
      "Automation projects fail in two opposite ways. Some buy an AI platform for a task that a scheduled script would have done correctly for a fraction of the cost. Others hard-code a rule for a task whose inputs never look the same twice, and the rule breaks quietly every few weeks until someone stops trusting it. The distinction that decides the outcome is not 'AI or not AI' — it is whether the input is predictable, and almost nobody checks before choosing.",
    approach: [
      "We start with a workflow inventory, not a technology choice. For each recurring task we record the trigger, the input variance, the volume, the cost when it goes wrong, and who currently does it.",
      "Every task is then classified: deterministic (a rule or integration will do), variable but bounded (a model can help, with validation), or genuinely judgement-based (leave it with a human and give them better tools).",
      "We implement in that order, cheapest first. A surprising proportion of engagements finish with no model in them at all, and we will say so in the proposal rather than supplying one.",
      "Anything using a model gets a measured evaluation set, a confidence threshold and a defined human fallback — because an automation nobody trusts is more expensive than the manual work it replaced.",
    ],
    benefits: [
      "Recurring work removed instead of shifted onto someone else",
      "A written decision per process on why it is automated, and why that way",
      "Fewer tools than you started with, not more",
      "The team can see what the system did and why, which is what makes them use it",
    ],
    scope: [
      "Workflow inventory with volume, variance and failure cost per task",
      "Per-task classification: rule, bounded model, or human",
      "Implementation of the agreed automations, cheapest viable approach first",
      "Evaluation set and confidence thresholds for any model-backed step",
      "Human fallback and escalation path",
      "Monitoring, logging and an alert when a step starts failing",
      "Documentation and handover for the team who will run it",
    ],
    deliverables: [
      "Working automations in production",
      "A written classification of every process in scope, including the ones we chose not to automate",
      "Evaluation results for any model-backed step",
      "A runbook covering failure modes and who to contact",
    ],
    idealFor: [
      "Businesses where a growing share of the week is spent on repeatable work",
      "Teams who have bought an automation tool and still do the work manually",
      "Operations leaders who need a defensible answer to 'should this be AI?'",
      "Not for: a single repetitive task — a small integration may be all you need, and we will quote that instead",
    ],
    related: ["automation-opportunity-assessment", "business-process-automation", "crm-automation", "ai-integration-consulting"],
    faqs: [
      {
        q: "How much of this is actually AI?",
        a: "Usually less than the buyer expects. Rules and integrations handle most recurring business work correctly and cheaply. Models earn their place where input is genuinely variable — free-text messages, scanned documents, unstructured enquiries — and even then they need validation around them.",
      },
      {
        q: "What happens when the automation gets something wrong?",
        a: "Every automation we ship has a defined failure behaviour: a confidence threshold below which the item goes to a person, a log of what was decided, and an alert when the failure rate moves. Silent failure is the one outcome we design against.",
      },
      {
        q: "Do we need to replace our existing tools?",
        a: "Usually not, and we would rather connect what you have. Replacing systems is the most expensive way to automate and the one most likely to be abandoned halfway.",
      },
      {
        q: "Can you start with a small piece?",
        a: "Yes, and it is the better shape. One workflow, implemented and measured, tells you more about whether the rest is worth doing than any amount of planning.",
      },
    ],
    examples: [
      "Illustrative: an enquiries inbox is triaged by a rule set first — known senders, known subjects — and only the genuinely ambiguous messages reach a model for classification, cutting both cost and error rate.",
      "Illustrative: a weekly report assembled by hand from three systems is generated by a scheduled job with a validation step, and a human signs it off rather than compiling it.",
    ],
    pricing: "Request a quote. Scoped by the number of workflows and their integration surface.",
    duration: "4–10 weeks",
  },

  {
    slug: "automation-opportunity-assessment",
    tagline: "Find out what is worth automating before paying to automate it.",
    summary:
      "A short, fixed-scope assessment that inventories the recurring work in a business, prices the cost of doing it manually, and returns a ranked list of what to automate, what not to, and what it would take.",
    problem:
      "Automation spending usually starts with a vendor demonstration rather than an inventory, so the first thing automated is whatever was demoed rather than whatever costs the most. Meanwhile the genuinely expensive manual work — the report nobody wants to compile, the re-keying between two systems — carries on untouched because nobody has costed it.",
    approach: [
      "We interview the people doing the work, not only the people managing it. The expensive manual steps are rarely the ones in the process diagram.",
      "Each candidate is costed: hours per month, error rate, cost of an error, and the effort to automate. That produces a payback estimate per candidate rather than an opinion.",
      "We rank by payback and risk together, and we include the candidates we recommend leaving alone with the reason — automating a task that happens twice a quarter is a maintenance liability, not a saving.",
      "You get the assessment whether or not you engage us to implement any of it, and it is written to be handed to another team without us present — numbers, ranking, exclusions and the reasoning behind each.",
    ],
    benefits: [
      "A costed inventory rather than a list of possibilities",
      "A defensible order of work, so the first project is the one with the clearest return",
      "An explicit list of what not to automate, which is usually the more valuable half",
      "Evidence for a budget conversation",
    ],
    scope: [
      "Structured interviews across the teams that do the work",
      "Time-and-volume costing per recurring task",
      "Error rate and failure-cost estimation",
      "Effort-to-automate estimate per candidate",
      "Ranked recommendation with payback estimates",
      "Written exclusions with reasons",
    ],
    deliverables: [
      "An assessment document: inventory, costs, ranking, exclusions",
      "A one-page summary suitable for a board or budget discussion",
      "A suggested sequence if more than one candidate is worth doing",
    ],
    idealFor: [
      "Businesses being sold automation without knowing where to start",
      "Teams who suspect the manual overhead but cannot quantify it",
      "Organisations needing to justify an automation budget internally",
      "Not for: a single known workflow — assess that one directly instead",
    ],
    related: ["ai-business-automation", "business-process-automation", "business-technology-audits", "digital-readiness-assessment"],
    faqs: [
      {
        q: "How long does it take?",
        a: "Usually one to two weeks, depending on how many teams are involved and how available they are. The interviews are the work.",
      },
      {
        q: "Do we have to implement with you?",
        a: "No. The assessment stands on its own and is written so another team can act on it. We will quote implementation separately if you want it.",
      },
      {
        q: "What if nothing is worth automating?",
        a: "Then we will say that, and you will have saved the cost of finding out the expensive way. It has happened.",
      },
    ],
    pricing: "Fixed price, quoted after a short call to establish scope.",
    duration: "1–2 weeks",
  },

  {
    slug: "crm-automation",
    tagline: "Make the CRM the record, not a second job.",
    summary:
      "We make the customer record trustworthy and then remove the manual steps around it — routing, reminders, follow-up, and the reporting nobody currently does because it means exporting to a spreadsheet first.",
    problem:
      "A CRM fails for a boring reason: updating it costs the sales team time and benefits someone else. So the data decays, the pipeline becomes decorative, and the team reverts to memory and inbox. Buying a better CRM does not fix this — the incentive problem travels with it.",
    approach: [
      "We start by making the CRM useful to the person updating it: less data entry, automatic capture where the information already exists, and a view of their own pipeline that answers a question they actually have.",
      "Then we remove the manual steps around it — lead routing, reminder generation, follow-up drafting, stage-change notifications — so the system acts rather than waits.",
      "Reporting is built from the record, so nobody re-keys figures into a spreadsheet and the numbers in the meeting match the numbers in the system.",
      "We define what a stage means operationally, in writing. Most pipeline ambiguity is a definition problem masquerading as a software problem.",
    ],
    benefits: [
      "A pipeline people trust because updating it costs them nothing",
      "Follow-ups that happen because the system raised them, not because someone remembered",
      "Reporting produced from the record rather than reconstructed monthly",
      "Clear stage definitions, so forecasts mean the same thing to everyone",
    ],
    scope: [
      "Current-state audit: fields, stages, who updates what and why they avoid it",
      "Stage and field redesign, with written definitions",
      "Lead routing and assignment rules",
      "Automated reminders and follow-up sequencing",
      "Reporting views and a defined reporting cadence",
      "Data hygiene pass on the existing record",
      "Team training and a short operations guide",
    ],
    deliverables: [
      "A configured CRM with documented stages and fields",
      "Working automations for routing, reminders and follow-up",
      "A reporting view that updates itself",
      "A written definition of each pipeline stage",
    ],
    idealFor: [
      "Teams who own a CRM that nobody trusts",
      "Sales operations where follow-up depends on individual discipline",
      "Businesses whose monthly reporting consumes a person for two days",
      "Not for: a business with no repeatable sales process yet — define the process first",
    ],
    related: ["sales-pipeline-automation", "automated-lead-generation", "customer-relationship-automation", "business-intelligence-dashboards"],
    faqs: [
      {
        q: "Do you work with our existing CRM?",
        a: "Usually, yes — the main platforms have adequate APIs and the problem is configuration and habit rather than capability. If the platform genuinely cannot do what is needed, we will say so before quoting work on it.",
      },
      {
        q: "Will this fix our data quality?",
        a: "Partly, by reducing the entry burden and validating at the point of capture. Historical data needs a separate clean-up pass, which is in scope when you want it.",
      },
      {
        q: "How do you get the sales team to use it?",
        a: "By making it the fastest way to do their job rather than an obligation. Capture that happens automatically, a pipeline view that answers their question, and no field that exists only for a report nobody reads.",
      },
    ],
    pricing: "Request a quote. Scoped by user count, integrations and data volume.",
    duration: "4–8 weeks",
  },

  {
    slug: "document-processing-automation",
    tagline: "Turn a pile of documents into structured records.",
    summary:
      "Invoices, forms, contracts, certificates and applications arrive as files and leave as data entry. We build the extraction pipeline that reads them, validates what it read, and routes only the uncertain ones to a human.",
    problem:
      "Document-heavy processes scale badly because the work is linear: more submissions means more people re-keying. Automation is possible but the naive version is worse than the manual process — it produces confident wrong values that nobody catches, and trust collapses the first time it costs money.",
    approach: [
      "We inventory the real documents rather than the template. Variance is the whole problem, so we look at the outliers: the scanned fax, the rotated photo, the vendor who formats differently.",
      "Extraction is built with validation around it — arithmetic checks, cross-field consistency, known-value matching — so the pipeline can tell when it is unsure rather than guessing.",
      "Anything below the confidence threshold goes to a review queue with the document and the suspect field side by side. The reviewer confirms rather than re-keys.",
      "We measure straight-through rate and field-level accuracy from the first batch, because that is the number that decides whether this was worth building.",
    ],
    benefits: [
      "Submissions processed without proportional headcount",
      "A measurable accuracy figure rather than an assurance",
      "Uncertain documents surfaced for review instead of silently wrong",
      "Structured data at the end, so downstream systems stop needing a person in between",
    ],
    scope: [
      "Document inventory and variance analysis",
      "Extraction pipeline for each document type in scope",
      "Validation rules: arithmetic, cross-field, reference data",
      "Confidence thresholds and a human review queue",
      "Integration with the downstream system of record",
      "Accuracy measurement and a straight-through-rate report",
      "Retention and deletion behaviour for source files",
    ],
    deliverables: [
      "A working pipeline with a documented accuracy baseline",
      "A review interface for low-confidence documents",
      "Extraction schema documentation",
      "A report of straight-through rate and field-level accuracy",
    ],
    idealFor: [
      "Finance teams re-keying invoices or expenses",
      "Operations handling applications, claims or compliance documents",
      "Organisations whose volume grew until the manual process broke",
      "Not for: a handful of documents a month — the build will not repay itself",
    ],
    related: ["ai-powered-data-processing", "business-process-automation", "intelligent-internal-tools", "intelligent-customer-onboarding"],
    faqs: [
      {
        q: "How accurate is extraction?",
        a: "It depends entirely on document variance, which is why we measure on your documents before promising anything. We report a field-level accuracy baseline and a straight-through rate, and we design the review queue so that imperfection is handled rather than ignored.",
      },
      {
        q: "Does this require AI?",
        a: "Often partly. Templated documents from known suppliers can be parsed deterministically and cheaply. Scanned or highly variable documents usually need a model. We use the cheapest approach that reaches the accuracy you need.",
      },
      {
        q: "What about sensitive documents?",
        a: "Retention, access and deletion are designed with the pipeline, not after it. Where data must not leave an approved boundary, that constrains the approach and we will say so up front.",
      },
    ],
    pricing: "Request a quote. Scoped by document types and monthly volume.",
  },

  {
    slug: "ai-powered-knowledge-bases",
    tagline: "Answers from your own documents, with the source attached.",
    summary:
      "A retrieval system that answers questions using your organisation's own material — policies, manuals, past proposals, archive — and shows the passage it drew the answer from, so a person can check it.",
    problem:
      "Institutional knowledge is usually findable in principle and not in practice. Search returns documents rather than answers, and the person who knows where things are becomes a bottleneck. A general-purpose chatbot placed on top of the same documents makes it worse: it answers confidently, cites nothing, and is wrong often enough that nobody uses it twice.",
    approach: [
      "We start with the corpus: what exists, what is current, what contradicts what, and who is allowed to see each part. Retrieval over bad documents produces confident nonsense.",
      "Answers are grounded — generated only from retrieved passages — and every answer carries its sources. If the material does not contain the answer, the system says so rather than improvising.",
      "Access control is applied at retrieval, not at the interface, so a user cannot surface a document they are not entitled to read.",
      "We build an evaluation set of real questions with known correct answers, and use it to measure the system before anyone relies on it.",
    ],
    benefits: [
      "Staff find answers in seconds instead of asking the person who knows",
      "Every answer is checkable because the source passage is shown",
      "Onboarding gets faster because the knowledge is retrievable rather than tribal",
      "A measured accuracy figure before the system is trusted",
    ],
    scope: [
      "Corpus audit: coverage, currency, contradiction and access boundaries",
      "Ingestion pipeline with versioning and re-indexing on change",
      "Retrieval configuration tuned per question type",
      "Grounded answer generation with inline source references",
      "Retrieval-level access control",
      "Evaluation set and a measured accuracy baseline",
      "Feedback capture so bad answers are visible and fixable",
    ],
    deliverables: [
      "A deployed knowledge system with source-cited answers",
      "An evaluation set and its results",
      "Ingestion documentation so new material can be added",
      "An access-control model documented for review",
    ],
    idealFor: [
      "Organisations whose expertise lives in documents and in a few people's heads",
      "Support and operations teams answering the same questions repeatedly",
      "Publishers and archives with content nobody can navigate",
      "Not for: a corpus too small or too out of date to answer anything — fix the documents first",
    ],
    related: ["ai-powered-business-search", "ai-research-workflows", "internal-business-automation", "publishing-analytics"],
    faqs: [
      {
        q: "Will it make things up?",
        a: "The design goal is that it cannot: answers are grounded in retrieved passages and cite them, and it declines when the corpus does not contain an answer. That is not a guarantee of perfection, which is why we build an evaluation set and show the sources.",
      },
      {
        q: "How do you stop it exposing confidential documents?",
        a: "Access control is enforced during retrieval, per user, using your existing permissions model. Filtering afterwards in the interface is not sufficient, and we do not do it that way.",
      },
      {
        q: "What does it cost to run?",
        a: "It depends on volume and corpus size, and we estimate it before building. Where a cheaper deterministic search would answer the majority of questions, we will recommend that and use the model only for the residue.",
      },
    ],
    pricing: "Request a quote. Scoped by corpus size, access model and evaluation requirements.",
    duration: "6–12 weeks",
  },

  {
    slug: "whatsapp-business-automation",
    tagline: "Answer on the channel customers already use — within its rules.",
    summary:
      "WhatsApp is where a large share of enquiries actually arrive, and it is the channel most businesses handle worst. We build structured intake, routing and response on the official Business Platform, inside its template and opt-in rules.",
    problem:
      "Customer messages arrive on WhatsApp because that is where people are, then wait in a phone that one person holds. Replies depend on who is on shift. Meanwhile unapproved tooling gets accounts restricted, because the platform is strict about automation, templates and opt-in — and those rules are not optional.",
    approach: [
      "We map the message types actually received and what each deserves: an instant answer, a structured intake flow, or a person. Most volume turns out to be a small number of predictable intents.",
      "Everything is built on the official Business Platform with proper message templates and recorded opt-in, so the number stays healthy and the account is not at risk.",
      "Routing sends conversations to the right person with context attached, and outcomes are logged so the channel becomes measurable rather than anecdotal.",
      "Where a model is used to interpret free text, its output is a classification with a confidence, and low confidence routes to a human rather than guessing.",
    ],
    benefits: [
      "Enquiries answered in minutes rather than whenever someone checks the phone",
      "A record of every conversation, in a system rather than a handset",
      "Compliance with template and opt-in rules, so the number is not restricted",
      "Volume and response time become visible for the first time",
    ],
    scope: [
      "Message inventory and intent classification",
      "Official Business Platform setup and verification support",
      "Approved template design and opt-in capture",
      "Automated intake flows for the top intents",
      "Routing to people, with context and assignment",
      "Conversation logging and reporting",
      "Human handover rules and escalation",
    ],
    deliverables: [
      "A working WhatsApp channel with approved templates",
      "Intake flows for the intents in scope",
      "A conversation log integrated with your systems",
      "A response-time and volume report",
    ],
    idealFor: [
      "Businesses whose enquiries concentrate on WhatsApp",
      "Retail, services and logistics operations handling order or delivery questions",
      "Teams using personal handsets for business conversations",
      "Not for: a channel with very low volume — a shared inbox may be enough",
    ],
    related: ["ai-chatbot-development", "ai-customer-support-systems", "automated-customer-follow-up", "crm-automation"],
    faqs: [
      {
        q: "Do we need a new number?",
        a: "Often yes, and it is usually cleaner: a number currently on a personal WhatsApp cannot simply be moved to the Business Platform without losing history. We will map the migration options before anything is changed.",
      },
      {
        q: "Will customers know they are talking to a system?",
        a: "They should, and we recommend stating it plainly in the first message. Automation that pretends to be a person damages trust more than it saves time.",
      },
      {
        q: "Can it hand over to a human mid-conversation?",
        a: "Yes, and it is designed in from the start. A request for a person, a low-confidence classification or an angry message should all reach someone quickly.",
      },
    ],
    pricing: "Request a quote. Scoped by intents and integration depth.",
    duration: "3–8 weeks",
  },

  {
    slug: "ai-chatbot-development",
    tagline: "A chatbot that knows when to stop being one.",
    summary:
      "Conversational support built on your own material, with a measured accuracy baseline and a handover to a human that works — rather than a widget that answers three questions and frustrates people on the fourth.",
    problem:
      "Most business chatbots are installed to reduce support load and instead increase it: they mis-answer, cannot escalate, and leave the customer to start again with a person. The failure is rarely the language model. It is that nobody defined what the bot is responsible for, what it must not attempt, or how it hands over.",
    approach: [
      "We define the scope explicitly: the intents the bot owns, the intents it must decline, and the point at which a conversation becomes a human's. That definition is the most valuable artefact of the project.",
      "Answers are grounded in your material with sources, and the bot declines rather than improvising when the material does not cover the question.",
      "Handover is a first-class path, not an error state: context travels with the conversation so the customer does not repeat themselves.",
      "We measure containment, escalation rate and satisfaction on an evaluation set before launch, and continue measuring after.",
    ],
    benefits: [
      "A measurable share of conversations resolved without a person",
      "Escalations that arrive with context, so the human starts informed",
      "Answers consistent with your published policy rather than a model's guess",
      "A clear boundary of responsibility you can defend internally",
    ],
    scope: [
      "Intent inventory and explicit responsibility boundary",
      "Corpus preparation and grounding",
      "Conversation design, including decline and handover language",
      "Integration with live chat, CRM or ticketing",
      "Evaluation set with containment and escalation measurement",
      "Accessibility and consent handling",
      "Ongoing quality review cadence",
    ],
    deliverables: [
      "A deployed assistant with documented scope and boundaries",
      "Evaluation results: containment, escalation, accuracy",
      "Conversation transcripts for the first period, for review",
      "A maintained intent and answer owner inside your team",
    ],
    idealFor: [
      "Support teams answering a bounded set of repeatable questions",
      "Businesses whose out-of-hours enquiries go unanswered",
      "Organisations replacing a chatbot that created more work than it saved",
      "Not for: complex casework where every conversation is genuinely different",
    ],
    related: ["ai-customer-support-systems", "ai-powered-knowledge-bases", "whatsapp-business-automation", "ai-virtual-assistants"],
    faqs: [
      {
        q: "How do you measure whether it is working?",
        a: "Containment rate, escalation rate, and accuracy against a set of real questions with known answers. We establish the baseline before launch so the comparison is honest.",
      },
      {
        q: "What happens when it does not know?",
        a: "It says so and offers a human. A confident wrong answer costs more than an honest handover, both in support time and in trust.",
      },
      {
        q: "Can it be trained on our tone?",
        a: "It can be constrained to your tone and to approved language. We would rather it sound like a careful member of your team than like a brand personality.",
      },
    ],
    pricing: "Request a quote. Scoped by intent count and integrations.",
    duration: "4–10 weeks",
  },

  {
    slug: "custom-ai-agent-development",
    tagline: "An agent that does a bounded job, and can be checked.",
    summary:
      "For the small number of workflows where steps genuinely cannot be predetermined, we build an agent with a narrow remit, a defined set of permitted actions, and a log of everything it did — so it can be reviewed rather than trusted.",
    problem:
      "Agents are the most oversold thing in software. Given an open remit and unrestricted tools they are unpredictable, expensive and difficult to audit; the failure is not that they cannot act, it is that nobody can say afterwards why they did. For most business processes an agent is the wrong instrument, and a script is the right one.",
    approach: [
      "We first try hard to solve the problem deterministically. If a rule or a fixed sequence works, it is cheaper, faster, auditable and does not drift. An agent has to earn its place.",
      "Where it does, the remit is narrow and the tools are enumerated: a specific set of actions, each with its own permission and its own log entry.",
      "Every run produces a trace — what was observed, what was decided, what was done. Actions with real consequences require a human approval step.",
      "We set a cost and step budget per run so that a confused agent stops rather than looping expensively, and a full run trace is retained so the failure can be diagnosed afterwards rather than guessed at from a bill.",
    ],
    benefits: [
      "Automation for work that genuinely resists a fixed rule",
      "A complete trace of every decision and action",
      "Enumerated permissions rather than an open toolbelt",
      "Approval gates wherever an action is hard to reverse",
    ],
    scope: [
      "Feasibility assessment, including a deterministic alternative",
      "Narrow remit definition and permitted-action enumeration",
      "Tool implementation with per-action permissions",
      "Run tracing: observations, decisions, actions",
      "Human approval gates for consequential actions",
      "Cost and step budgets with automatic stop",
      "Evaluation against a set of realistic scenarios",
    ],
    deliverables: [
      "A deployed agent with a documented remit and permission set",
      "Run traces retained for review",
      "An evaluation report across realistic scenarios",
      "An operations guide: what to do when it stops or asks",
    ],
    idealFor: [
      "Processes with genuine variability that still need an end-to-end result",
      "Research and analysis workflows with bounded source material",
      "Teams willing to review traces rather than assume correctness",
      "Not for: anything a deterministic workflow can do — and that is most things",
    ],
    related: ["ai-business-automation", "ai-research-workflows", "intelligent-internal-tools", "ai-integration-consulting"],
    faqs: [
      {
        q: "Is an agent the right answer for my process?",
        a: "Probably not, and we will tell you. Most processes described as needing an agent are better served by a workflow with a model inside one or two steps. Agents are for the residue where the sequence really cannot be fixed.",
      },
      {
        q: "How do you control cost?",
        a: "A step and spend budget per run with a hard stop, plus a review of traces to find wasteful patterns. Unbounded agents are an unbounded invoice.",
      },
      {
        q: "Can it take real actions, like sending email or issuing refunds?",
        a: "It can be permitted specific actions. Anything with financial or reputational consequence gets a human approval step — we will not build a system that can commit you to something unreviewed.",
      },
    ],
    pricing: "Request a quote. Scoped by action set and evaluation requirements.",
    duration: "8–14 weeks",
  },
];
