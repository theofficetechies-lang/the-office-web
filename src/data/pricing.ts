/**
 * How we price — the three engagement shapes the brief form offers.
 * Deliberately models, not fake numbers: each states what it includes and the
 * honest constraint behind it.
 */
export interface PricingTier {
  key: string;
  name: { en: string; pt: string };
  blurb: { en: string; pt: string };
  includes: { en: string[]; pt: string[] };
  cadence: { en: string; pt: string };
}

export const pricingTiers: PricingTier[] = [
  {
    key: "advisory",
    name: { en: "Advisory", pt: "Consultoria" },
    blurb: {
      en: "A few days of senior time on a specific question — a positioning review, an IA critique, an automation feasibility pass.",
      pt: "Alguns dias de tempo sénior numa questão específica — uma revisão de posicionamento, uma crítica de IA, uma avaliação de automação.",
    },
    includes: {
      en: ["A written read of the problem", "One working session", "A short list of what to do next, in order"],
      pt: ["Uma leitura escrita do problema", "Uma sessão de trabalho", "Uma lista curta do que fazer a seguir, por ordem"],
    },
    cadence: { en: "Days, not weeks", pt: "Dias, não semanas" },
  },
  {
    key: "single-deliverable",
    name: { en: "Single deliverable", pt: "Entregável único" },
    blurb: {
      en: "One thing, done properly: a positioning document, a site, a research pack, or one automation.",
      pt: "Uma coisa, bem feita: um documento de posicionamento, um site, um pacote de investigação ou uma automação.",
    },
    includes: {
      en: ["Scoped against the brief in writing", "The deliverable plus its documentation", "A handover you can run without us"],
      pt: ["Âmbito definido por escrito", "O entregável e a sua documentação", "Uma entrega que funciona sem nós"],
    },
    cadence: { en: "Weeks", pt: "Semanas" },
  },
  {
    key: "full-engagement",
    name: { en: "Full engagement", pt: "Projeto completo" },
    blurb: {
      en: "Strategy through build: positioning, research, design and implementation on one brief, one team, one accountable thread.",
      pt: "Da estratégia à construção: posicionamento, investigação, design e implementação num só brief, uma equipa, um responsável.",
    },
    includes: {
      en: ["The six-stage method", "A small team, no subcontractors", "Measured against the thing we agreed in Define"],
      pt: ["O método de seis etapas", "Uma equipa pequena, sem subcontratados", "Medido contra o que acordámos em Definir"],
    },
    cadence: { en: "6–14 weeks", pt: "6–14 semanas" },
  },
];

export const pricingNote = {
  en: "We quote a fixed price for a fixed scope, in writing, after a short call. If the scope changes, the price changes with it — in the open, never as a surprise.",
  pt: "Damos um preço fixo para um âmbito fixo, por escrito, após uma breve chamada. Se o âmbito mudar, o preço muda com ele — às claras, nunca como surpresa.",
};
