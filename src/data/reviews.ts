/**
 * Reviews / testimonials — verified-only.
 *
 * Nothing is invented. Add a review by filling `quote`, `name`, `role` and
 * setting `verified: true`; the section renders it automatically. Until then
 * the section shows the honest statement plus a references-on-request route,
 * so the studio never displays a fabricated testimonial.
 *
 * `sources` can hold links to real, public review profiles (Google, LinkedIn).
 * Leave empty until you have URLs you own.
 */
export interface Review {
  quote: string;
  name: string;
  role: string;
  verified: boolean;
}

export const reviews: Review[] = [];

export const reviewSources: { label: string; href: string }[] = [];

export const reviewsStatement = {
  en: "We do not publish testimonials we cannot stand behind. Ask us for references and we will give you the names of people we have worked with — directly, not as a quote on a website.",
  pt: "Não publicamos testemunhos que não possamos sustentar. Peça-nos referências e damos-lhe os nomes de pessoas com quem trabalhámos — diretamente, não como uma citação num site.",
};

/**
 * Part 2 §6 — published communication standards. Publishing your service
 * standards and then meeting them is the cheapest durable trust mechanism.
 */
export const communicationStandards = {
  en: [
    "A substantive reply within two working days.",
    "A named point of contact for every engagement.",
    "Scheduled written reports with interpretation, on the agreed cadence.",
    "Plain-language reporting — no dashboard dumped without a reading.",
  ],
  pt: [
    "Uma resposta substantiva em dois dias úteis.",
    "Um contacto nomeado para cada projeto.",
    "Relatórios escritos agendados, com interpretação, na cadência acordada.",
    "Relatórios em linguagem simples — nunca um painel sem leitura.",
  ],
};

/** Real LinkedIn profiles; add URLs when supplied. Rendered only when present. */
export const linkedinProfiles: { name: string; href: string }[] = [];

/** A real business address; add when supplied. Rendered only when present. */
export const businessAddress = "";
