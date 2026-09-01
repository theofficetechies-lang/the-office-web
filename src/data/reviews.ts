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
