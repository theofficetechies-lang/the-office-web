/**
 * Store catalog — digital products & services (no physical fulfillment yet).
 *
 * Prices live here and are used by api/checkout.ts to build a Stripe Checkout
 * session with ad-hoc `price_data`, so no Stripe Price objects need to exist in
 * advance. Adjust `priceUsd` freely; it is a business decision, not code.
 */
export interface Product {
  slug: string;
  name: { en: string; pt: string };
  blurb: { en: string; pt: string };
  priceUsd: number;
  kind: "digital" | "service";
  /** Cover art shown on the store. */
  image: string;
  /** What the buyer receives, e.g. PDF book, template, live session. */
  format: { en: string; pt: string };
  includes: { en: string[]; pt: string[] };
  delivery: { en: string; pt: string };
}

export const products: Product[] = [
  {
    slug: "backlist-audit-pack",
    image: "/products/backlist-audit-pack.jpg",
    format: { en: "PDF book + templates", pt: "Livro PDF + modelos" },
    name: { en: "The Backlist Audit Pack", pt: "Pacote de Auditoria de Backlist" },
    blurb: {
      en: "The full Amazon SEO report, the interactive audit, and the correction-list template — everything we use to take a title from invisible to discoverable.",
      pt: "O relatório completo de SEO na Amazon, a auditoria interativa e o modelo de lista de correções — tudo o que usamos para levar um título de invisível a descobrível.",
    },
    priceUsd: 49,
    kind: "digital",
    includes: {
      en: ["The 13-page Amazon SEO report (PDF)", "The 10-point correction-list template", "The interactive self-audit, explained"],
      pt: ["O relatório de SEO na Amazon (13 págs., PDF)", "O modelo de lista de correções (10 pontos)", "A auto-auditoria interativa, explicada"],
    },
    delivery: { en: "Instant download after payment.", pt: "Download imediato após o pagamento." },
  },
  {
    slug: "positioning-template",
    image: "/products/positioning-template.jpg",
    format: { en: "PDF template", pt: "Modelo PDF" },
    name: { en: "Positioning One-Page Template", pt: "Modelo de Posicionamento (1 página)" },
    blurb: {
      en: "The exact one-page structure we use to place a book: the shelf, the comp set, the positioning line, and what not to claim.",
      pt: "A estrutura de uma página que usamos para posicionar um livro: a prateleira, os comparáveis, a linha de posicionamento e o que não reivindicar.",
    },
    priceUsd: 29,
    kind: "digital",
    includes: {
      en: ["The one-page positioning template", "A worked example", "Guidance on comps and the shelf"],
      pt: ["O modelo de posicionamento de uma página", "Um exemplo preenchido", "Orientação sobre comparáveis e prateleira"],
    },
    delivery: { en: "Instant download after payment.", pt: "Download imediato após o pagamento." },
  },
  {
    slug: "launch-timeline-template",
    image: "/products/launch-timeline-template.jpg",
    format: { en: "PDF template", pt: "Modelo PDF" },
    name: { en: "Launch Timeline Template", pt: "Modelo de Cronograma de Lançamento" },
    blurb: {
      en: "A launch built backward from the date: staged milestones, channels with budgets and expected outputs, and an advance-review pipeline.",
      pt: "Um lançamento construído de trás para a frente a partir da data: marcos faseados, canais com orçamentos e resultados esperados, e um pipeline de avaliações antecipadas.",
    },
    priceUsd: 29,
    kind: "digital",
    includes: {
      en: ["The backward-sequenced timeline", "Channel plan with budget ranges", "Advance-review program outline"],
      pt: ["O cronograma sequenciado de trás para a frente", "Plano de canais com intervalos de orçamento", "Esboço do programa de avaliações antecipadas"],
    },
    delivery: { en: "Instant download after payment.", pt: "Download imediato após o pagamento." },
  },
  {
    slug: "the-diagnostic",
    image: "/products/the-diagnostic.jpg",
    format: { en: "Fixed-price service", pt: "Serviço de preço fixo" },
    name: { en: "The Diagnostic (fixed-price analysis)", pt: "O Diagnóstico (análise de preço fixo)" },
    blurb: {
      en: "A fixed-fee, standalone analysis of your book(s): positioning, audience, competitive, search and asset audits. The deliverable is yours to keep whether or not we proceed.",
      pt: "Uma análise autónoma de preço fixo do(s) seu(s) livro(s): auditorias de posicionamento, público, concorrência, pesquisa e ativos. O entregável é seu, com ou sem continuidade.",
    },
    priceUsd: 950,
    kind: "service",
    includes: {
      en: ["Written findings document (yours to keep)", "A staged implementation proposal", "One working call to walk through it"],
      pt: ["Documento de conclusões (seu, para guardar)", "Uma proposta de implementação faseada", "Uma chamada de trabalho para o percorrer"],
    },
    delivery: { en: "Delivered in 2–3 weeks, date in writing.", pt: "Entregue em 2–3 semanas, data por escrito." },
  },
  {
    slug: "working-session",
    image: "/products/working-session.jpg",
    format: { en: "Live session", pt: "Sessão ao vivo" },
    name: { en: "60-Minute Working Session", pt: "Sessão de Trabalho de 60 Minutos" },
    blurb: {
      en: "A focused hour on one specific question — a positioning review, an IA critique, an automation feasibility pass. Not a sales call; a working discussion.",
      pt: "Uma hora focada numa questão específica — revisão de posicionamento, crítica de IA de site, avaliação de automação. Não é uma chamada de vendas; é uma discussão de trabalho.",
    },
    priceUsd: 250,
    kind: "service",
    includes: {
      en: ["60 minutes with the relevant principal", "A short written read afterwards", "A go/no-go view on next steps"],
      pt: ["60 minutos com o principal relevante", "Uma breve leitura escrita depois", "Uma visão go/no-go sobre os próximos passos"],
    },
    delivery: { en: "Scheduled within a week of purchase.", pt: "Agendada até uma semana após a compra." },
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
