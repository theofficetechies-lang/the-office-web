/**
 * A publishing & studio glossary — useful to clients, good for authority,
 * honest (definitions, not claims). EN + PT.
 */
export interface GlossaryTerm {
  term: { en: string; pt: string };
  def: { en: string; pt: string };
}

export const glossary: GlossaryTerm[] = [
  {
    term: { en: "Positioning", pt: "Posicionamento" },
    def: {
      en: "The answer to one question: which shelf does this book belong on, and why would someone browsing that shelf stop for this one? Not a tagline — category architecture.",
      pt: "A resposta a uma pergunta: em que prateleira cabe este livro, e porque haveria alguém que a percorre de parar neste? Não é um slogan — é arquitetura de categoria.",
    },
  },
  {
    term: { en: "Comp set / comp titles", pt: "Conjunto de comparáveis" },
    def: {
      en: "The comparable titles used to prove a book's commercial case. A good comp is a proof-of-concept, not an assertion of artistic kinship.",
      pt: "Os títulos comparáveis usados para provar o caso comercial de um livro. Um bom comparável é uma prova de conceito, não uma afirmação de parentesco artístico.",
    },
  },
  {
    term: { en: "Backlist", pt: "Catálogo (backlist)" },
    def: {
      en: "Every title a publisher has already published, as opposed to the new season's list. Often the most valuable, most neglected asset in publishing.",
      pt: "Todos os títulos que uma editora já publicou, por oposição às novidades da estação. É muitas vezes o ativo mais valioso e mais negligenciado da edição.",
    },
  },
  {
    term: { en: "Browse node", pt: "Nó de navegação" },
    def: {
      en: "Amazon's category tree. Choosing the right granular node can move a title from invisible to Top-10 in a targeted sub-genre.",
      pt: "A árvore de categorias da Amazon. Escolher o nó granular certo pode levar um título de invisível a Top-10 num subgénero específico.",
    },
  },
  {
    term: { en: "Information architecture (IA)", pt: "Arquitetura de informação" },
    def: {
      en: "The structure of a site — what exists, what it's called, and how it relates — decided before any visual design. Structure before surface.",
      pt: "A estrutura de um site — o que existe, como se chama e como se relaciona — decidida antes de qualquer design visual. Estrutura antes da superfície.",
    },
  },
  {
    term: { en: "Retrieval (RAG)", pt: "Recuperação (RAG)" },
    def: {
      en: "Letting a system answer from your own documents by retrieving the relevant passages first. The honest way to put AI over your archive.",
      pt: "Permitir que um sistema responda a partir dos seus documentos, recuperando primeiro as passagens relevantes. A forma honesta de pôr IA sobre o seu arquivo.",
    },
  },
  {
    term: { en: "Editorial front-end", pt: "Front-end editorial" },
    def: {
      en: "A website built with the care of a piece of editorial design — typographic clarity, rhythm and a single clear conversion path.",
      pt: "Um site construído com o cuidado de uma peça de design editorial — clareza tipográfica, ritmo e um caminho de conversão claro.",
    },
  },
  {
    term: { en: "Launch architecture", pt: "Arquitetura de lançamento" },
    def: {
      en: "The sequenced plan for taking a book to market: outlets, partnerships and dates with dependencies, assembled from evidence rather than habit.",
      pt: "O plano sequenciado para levar um livro ao mercado: meios, parcerias e datas com dependências, montado a partir de evidência e não de hábito.",
    },
  },
];
