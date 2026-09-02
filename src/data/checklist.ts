/**
 * The backlist-audit checklist, shared by the printable checklist page and the
 * interactive self-audit demo. EN + PT.
 */
export interface ChecklistItem {
  en: string;
  pt: string;
  /** The service that addresses a "no" answer. */
  service: string;
}

export const checklistItems: ChecklistItem[] = [
  { en: "Title and subtitle state the reader and the promise — no keyword stuffing.", pt: "Título e subtítulo indicam o leitor e a promessa — sem enchimento de palavras-chave.", service: "discoverability" },
  { en: "The 7 backend keyword fields avoid repeating words already in the title.", pt: "Os 7 campos de palavras-chave evitam repetir palavras já no título.", service: "discoverability" },
  { en: "Backend fields capture latent intent: comp authors, settings, reader queries.", pt: "Os campos capturam intenção latente: autores comparáveis, cenários, perguntas de leitores.", service: "discoverability" },
  { en: "The book sits in granular browse nodes, not only a crowded top-level category.", pt: "O livro está em nós de navegação granulares, não só numa categoria de topo sobrelotada.", service: "discoverability" },
  { en: "The description front-loads the hook in the first two lines.", pt: "A descrição apresenta o gancho nas duas primeiras linhas.", service: "book-positioning" },
  { en: "Cover reads at thumbnail size and matches the shelf's genre signals.", pt: "A capa lê-se em miniatura e corresponde aos sinais de género da prateleira.", service: "book-positioning" },
  { en: "Reviews are answered and the most helpful critical review is addressed.", pt: "As avaliações são respondidas e a crítica mais útil é abordada.", service: "author-authority" },
  { en: "Price is coherent with the comp set and the category's expectations.", pt: "O preço é coerente com os comparáveis e as expectativas da categoria.", service: "book-positioning" },
  { en: "A+ / enhanced content exists and leads with the strongest proof.", pt: "Existe conteúdo A+ / melhorado, a abrir com a prova mais forte.", service: "author-authority" },
  { en: "You know your grade and visibility trend over the last 8 weeks.", pt: "Conhece a sua nota e a tendência de visibilidade das últimas 8 semanas.", service: "analytics-reporting" },
];
