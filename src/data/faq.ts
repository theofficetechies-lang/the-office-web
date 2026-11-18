/**
 * FAQ — real questions the studio gets, answered plainly, in EN + PT.
 */
export interface FaqItem {
  q: { en: string; pt: string };
  a: { en: string; pt: string };
}

export const faq: FaqItem[] = [
  {
    q: {
      en: "Do you work with first-time authors?",
      pt: "Trabalham com autores estreantes?",
    },
    a: {
      en: "Yes. A first book usually needs more positioning work and less launch machinery, so we scope it that way. We will tell you honestly if the manuscript is not ready for strategy yet.",
      pt: "Sim. Um primeiro livro precisa geralmente de mais trabalho de posicionamento e de menos maquinaria de lançamento, por isso dimensionamos assim. Dizemos-lhe honestamente se o manuscrito ainda não estiver pronto para estratégia.",
    },
  },
  {
    q: {
      en: "Who actually does the work?",
      pt: "Quem faz realmente o trabalho?",
    },
    a: {
      en: "The four of us. No subcontractors, no juniors, no AI in the byline. The person on your kickoff call is the person doing the work.",
      pt: "Os quatro. Sem subcontratados, sem estagiários, sem IA na assinatura. A pessoa na reunião inicial é a pessoa que faz o trabalho.",
    },
  },
  {
    q: {
      en: "Who owns the site, the code and the documents?",
      pt: "Quem é dono do site, do código e dos documentos?",
    },
    a: {
      en: "You do. We build on stacks you can run in five years, hand over the source and documentation, and leave you able to run it without us.",
      pt: "Você. Construímos em stacks que pode usar daqui a cinco anos, entregamos o código e a documentação, e deixamo-lo capaz de funcionar sem nós.",
    },
  },
  {
    q: {
      en: "How fast can we start?",
      pt: "Quão depressa podemos começar?",
    },
    a: {
      en: "We take a small number of engagements each quarter and turn down more than we take. Reply within two working days, and if we are a fit we will give you a realistic start date rather than a promise.",
      pt: "Aceitamos poucos projetos por trimestre e recusamos mais do que aceitamos. Respondemos em dois dias úteis e, se houver encaixe, damos-lhe uma data de início realista em vez de uma promessa.",
    },
  },
  {
    q: {
      en: "Do you use AI?",
      pt: "Usam IA?",
    },
    a: {
      en: "Where it is useful and measured — mostly in automation work for clients. Never as a substitute for the judgment, writing or design you are paying us for, and never in the byline.",
      pt: "Onde é útil e medida — sobretudo em automação para clientes. Nunca como substituto do juízo, da escrita ou do design que nos paga, e nunca na assinatura.",
    },
  },
  {
    q: {
      en: "What if you are not the right studio for us?",
      pt: "E se não forem o estúdio certo para nós?",
    },
    a: {
      en: "We will say so and name someone who is. Referring work away costs us nothing and saves you a quarter.",
      pt: "Diremos e indicamos quem é. Encaminhar trabalho não nos custa nada e poupa-lhe um trimestre.",
    },
  },
];
