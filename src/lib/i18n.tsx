import { createContext, useContext, useEffect, useState } from "react";

/**
 * Lightweight i18n: English + Portuguese.
 *
 * Long-form editorial (notes, engagement write-ups, team notes) is published in
 * English only; the interface, headings, CTAs, forms, FAQ and pricing are
 * translated. When PT is active a small notice makes that clear rather than
 * pretending to a full translation.
 */
export type Lang = "en" | "pt";

const en = {
  "nav.services": "Services",
  "nav.work": "Work",
  "nav.approach": "Approach",
  "nav.why": "Why",
  "nav.about": "About",
  "nav.notes": "Notes",
  "nav.contact": "Contact",
  "nav.demos": "Proof",
  "nav.faq": "FAQ",
  "nav.startBrief": "Start a brief",
  "nav.menu": "Menu",
  "nav.close": "Close",
  "nav.brief": "Brief",

  "hero.kicker1": "A small studio.",
  "hero.kicker2": "Four people.",
  "hero.kicker3": "Est. 2021.",
  "hero.kicker4": "Lisbon & New York.",
  "hero.title1": "We do the work",
  "hero.title2": "behind the book, the",
  "hero.title3": "site, and the automation.",
  "hero.sub":
    "THE OFFICE 360 is a four-person studio for authors, publishers, and the people who run literary businesses. We write the positioning, build the site, ship the automation, and run the research. We do not pitch, decorate, or staff your project with juniors.",
  "hero.reading": "Currently reading on the brief:",
  "hero.cta": "Send a brief",

  "section.services": "Services",
  "section.servicesTitle": "Five services. One analytical method.",
  "section.work": "Work",
  "section.workTitle": "What the work looks like when it is done properly.",
  "section.approach": "Approach",
  "section.approachTitle": "Six stages. Then we bend them to fit the brief.",
  "section.why": "Why the Office",
  "section.whyTitle": "Eight things that are true about how we work.",
  "section.about": "About",
  "section.aboutTitle": "A studio of four, by design.",
  "section.contact": "Contact",
  "section.contactTitle1": "Send us the",
  "section.contactTitle2": "actual",
  "section.contactTitle3": "brief.",
  "section.faq": "FAQ",
  "section.faqTitle": "Questions we actually get.",
  "section.pricing": "How we price",
  "section.pricingTitle": "Three shapes of engagement.",
  "section.reviews": "Reviews",
  "section.reviewsTitle": "What clients say, in their words.",

  "common.whoFor": "Who it is for",
  "common.problem": "The problem",
  "common.youGet": "You end up with",
  "common.howItRuns": "How it runs",
  "common.readMore": "Read",
  "common.back": "Back",
  "common.requestFullBook": "Request the full book",
  "common.sendBrief": "Send a brief",
  "common.startBrief": "Start a brief",
  "common.duration": "Duration",

  "form.name": "Your name",
  "form.email": "Email",
  "form.org": "Company / publisher / none",
  "form.services": "What do you need from us?",
  "form.brief": "The brief",
  "form.timeline": "Timeline",
  "form.scope": "Shape of the work",
  "form.budget": "Budget range (optional)",
  "form.discovery": "How did you find us? (optional)",
  "form.submit": "Send brief",
  "form.sending": "Sending…",
  "form.sent": "Received ✓",
  "form.tryAgain": "Try again",
  "form.reply": "We reply within two working days. We turn down briefs when we are not the right fit.",

  "footer.statement": "A four-person studio for books, the web, automation, and research.",
  "footer.navigate": "Navigate",
  "footer.services": "Services",
  "footer.reply": "Reply window",
  "footer.replyDetail": "Mon–Thu, within 2 working days",

  "cta.requestAnalysis": "Request an analysis",
  "section.methodology": "Methodology",
  "section.methodologyTitle": "Six stages. Evidence in, strategy out.",
  "home.positioning": "The Office 360 builds long-term discoverability and authority for authors and publishers through analysis-driven strategy.",
  "home.audience": "Who we help",
  "home.problem": "The problem we solve",
  "common.analyze": "What we analyze",
  "common.actions": "Actions performed",
  "common.receive": "What you receive",
  "common.measured": "How it is measured",
  "common.pricing": "Pricing",
  "cs.problem": "Problem",
  "cs.strategy": "Strategy",
  "cs.execution": "Execution",
  "cs.measurement": "Measurement",
  "cs.learning": "Learning",

  "nav.store": "Store",
  "store.title": "The store.",
  "store.sub": "Tools and templates we actually use, plus fixed-price ways to work with us. Digital items deliver instantly; services are scheduled.",
  "store.buy": "Buy",
  "store.digital": "Digital · instant delivery",
  "store.service": "Service · scheduled",
  "store.includes": "What's included",
  "store.delivery": "Delivery",
  "store.notConfigured": "Payments are being set up. To order now, email us and we'll invoice you.",
  "store.success": "Payment received — thank you. Your receipt and download links are in your email.",
  "store.cancelled": "Checkout cancelled — nothing was charged.",
  "store.back": "All products",

  "lang.note":
    "Long-form notes and engagement write-ups are published in English; the interface is fully translated.",
} as const;

export type TKey = keyof typeof en;

const pt: Record<TKey, string> = {
  "nav.services": "Serviços",
  "nav.work": "Trabalho",
  "nav.approach": "Método",
  "nav.why": "Porquê",
  "nav.about": "Sobre",
  "nav.notes": "Notas",
  "nav.contact": "Contacto",
  "nav.demos": "Proof",
  "nav.faq": "FAQ",
  "nav.startBrief": "Iniciar um brief",
  "nav.menu": "Menu",
  "nav.close": "Fechar",
  "nav.brief": "Brief",

  "hero.kicker1": "Um estúdio pequeno.",
  "hero.kicker2": "Quatro pessoas.",
  "hero.kicker3": "Desde 2021.",
  "hero.kicker4": "Lisboa e Nova Iorque.",
  "hero.title1": "Fazemos o trabalho",
  "hero.title2": "por trás do livro, do",
  "hero.title3": "site e da automação.",
  "hero.sub":
    "THE OFFICE 360 é um estúdio de quatro pessoas para autores, editoras e quem gere negócios literários. Escrevemos o posicionamento, construímos o site, entregamos a automação e fazemos a investigação. Não fazemos pitches, não decoramos, não entregamos o seu projeto a estagiários.",
  "hero.reading": "A ler neste momento:",
  "hero.cta": "Enviar um brief",

  "section.services": "Serviços",
  "section.servicesTitle": "Cinco serviços. Um método analítico.",
  "section.work": "Trabalho",
  "section.workTitle": "Como é o trabalho quando é bem feito.",
  "section.approach": "Método",
  "section.approachTitle": "Seis etapas. Depois adaptamo-las ao brief.",
  "section.why": "Porquê o Office",
  "section.whyTitle": "Oito coisas verdadeiras sobre como trabalhamos.",
  "section.about": "Sobre",
  "section.aboutTitle": "Um estúdio de quatro, por decisão.",
  "section.contact": "Contacto",
  "section.contactTitle1": "Envie-nos o",
  "section.contactTitle2": "verdadeiro",
  "section.contactTitle3": "brief.",
  "section.faq": "FAQ",
  "section.faqTitle": "Perguntas que realmente recebemos.",
  "section.pricing": "Como cobramos",
  "section.pricingTitle": "Três formatos de colaboração.",
  "section.reviews": "Avaliações",
  "section.reviewsTitle": "O que os clientes dizem, pelas suas palavras.",

  "common.whoFor": "Para quem é",
  "common.problem": "O problema",
  "common.youGet": "No final recebe",
  "common.howItRuns": "Como corre",
  "common.readMore": "Ler",
  "common.back": "Voltar",
  "common.requestFullBook": "Pedir o portefólio completo",
  "common.sendBrief": "Enviar um brief",
  "common.startBrief": "Iniciar um brief",
  "common.duration": "Duração",

  "form.name": "O seu nome",
  "form.email": "Email",
  "form.org": "Empresa / editora / nenhuma",
  "form.services": "De que precisa de nós?",
  "form.brief": "O brief",
  "form.timeline": "Prazo",
  "form.scope": "Formato do trabalho",
  "form.budget": "Orçamento (opcional)",
  "form.discovery": "Como nos encontrou? (opcional)",
  "form.submit": "Enviar brief",
  "form.sending": "A enviar…",
  "form.sent": "Recebido ✓",
  "form.tryAgain": "Tentar novamente",
  "form.reply": "Respondemos em dois dias úteis. Recusamos briefs quando não somos a escolha certa.",

  "footer.statement": "Um estúdio de quatro pessoas para livros, web, automação e investigação.",
  "footer.navigate": "Navegar",
  "footer.services": "Serviços",
  "footer.reply": "Janela de resposta",
  "footer.replyDetail": "Seg–Qui, em 2 dias úteis",

  "cta.requestAnalysis": "Pedir uma análise",
  "section.methodology": "Metodologia",
  "section.methodologyTitle": "Seis etapas. Evidência entra, estratégia sai.",
  "home.positioning": "The Office 360 constrói descobribilidade e autoridade de longo prazo para autores e editoras através de estratégia baseada em análise.",
  "home.audience": "Quem ajudamos",
  "home.problem": "O problema que resolvemos",
  "common.analyze": "O que analisamos",
  "common.actions": "Ações realizadas",
  "common.receive": "O que recebe",
  "common.measured": "Como é medido",
  "common.pricing": "Preço",
  "cs.problem": "Problema",
  "cs.strategy": "Estratégia",
  "cs.execution": "Execução",
  "cs.measurement": "Medição",
  "cs.learning": "Aprendizagem",

  "nav.store": "Loja",
  "store.title": "A loja.",
  "store.sub": "Ferramentas e modelos que realmente usamos, além de formas de preço fixo de trabalhar connosco. Os digitais entregam de imediato; os serviços são agendados.",
  "store.buy": "Comprar",
  "store.digital": "Digital · entrega imediata",
  "store.service": "Serviço · agendado",
  "store.includes": "O que está incluído",
  "store.delivery": "Entrega",
  "store.notConfigured": "Os pagamentos estão a ser configurados. Para encomendar já, escreva-nos e emitimos fatura.",
  "store.success": "Pagamento recebido — obrigado. O recibo e os links estão no seu email.",
  "store.cancelled": "Checkout cancelado — nada foi cobrado.",
  "store.back": "Todos os produtos",

  "lang.note":
    "As notas longas e os estudos de caso são publicados em inglês; a interface está totalmente traduzida.",
};

const dictionaries: Record<Lang, Record<TKey, string>> = { en, pt };

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: TKey) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    try {
      return window.localStorage.getItem("the-office:lang") === "pt" ? "pt" : "en";
    } catch {
      return "en";
    }
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem("the-office:lang", l);
    } catch {
      // storage unavailable
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (k: TKey) => dictionaries[lang][k] ?? dictionaries.en[k] ?? k;

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
