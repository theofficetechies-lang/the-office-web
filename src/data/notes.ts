export interface NoteItem {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  category: string;
  excerpt: string;
  paragraphs: string[];
  keyTakeaway: string;
}

export const notesData: NoteItem[] = [
  {
    slug: "what-book-positioning-actually-means",
    title: "What book positioning actually means",
    date: "August 2026",
    readTime: "4 min read",
    category: "Book Strategy",
    excerpt:
      "Most authors think positioning is a tagline or a clever subhead. It is not. Positioning is the answer to a single question: what shelf does this book belong on, and why would someone who walks past every other title on that shelf stop for this one?",
    paragraphs: [
      "In trade publishing, books do not succeed because their prose is flawless; they succeed because a reader instantly understands where the book lives in their mental universe. When an author sits down to write a proposal or reposition a backlist title, the most dangerous impulse is aspirational comparison. You are not 'for readers of Elena Ferrante, Malcolm Gladwell, and Stephen King.' To be for everyone is to be stocked by no one.",
      "Positioning is the deliberate act of establishing cognitive boundaries. It defines the shelf, the comp set, and the specific emotional or intellectual transaction between the book and its purchaser. An effective comp title is not an assertion of artistic kinship—it is a commercial proof-of-concept. It tells the bookseller, the commissioning editor, and the prospective reader: 'If you bought X, here is the exact itch that Y will scratch next.'",
      "When we audit a manuscript's positioning, we examine three structural questions: First, who is the actual paying buyer—not the imagined ideal reader, but the person who routinely parts with $28 for hardcover non-fiction or $18 for a trade paperback in this genre? Second, what is the competing comp set doing that this title renders obsolete or complements? Third, why does this book belong in the cultural conversation this specific season rather than three years ago?",
      "Get the positioning right, and every downstream execution becomes ten times easier: the jacket design communicates the right genre signals, the advance pitch secures immediate interest from target imprints, and the reader feels understood rather than marketed to.",
    ],
    keyTakeaway:
      "Positioning is not marketing decoration; it is category architecture. Clarify the shelf before you pitch the book.",
  },
  {
    slug: "why-most-author-websites-fail",
    title: "Why most author websites fail",
    date: "July 2026",
    readTime: "5 min read",
    category: "Digital Craft",
    excerpt:
      "The typical author site is a digital CV: bio, headshot, list of awards, and an abandoned blog. It treats every visitor as someone who already knows who the author is. The problem is that most visitors do not.",
    paragraphs: [
      "When an author achieves a breakthrough—a featured review, a viral essay, or a podcast appearance—hundreds of inquisitive readers visit their digital home. What do they encounter? Ninety percent of author websites are built like dusty institutional archives: three paragraphs of accolades, five jacket covers in low resolution, an unstyled contact form, and a template from 2018 running twelve sluggish WordPress plugins.",
      "This represents a fundamental misunderstanding of reader intent. A visitor landing on an author's site after reading an essay is in a state of high curiosity. They do not want your resume; they want to answer two simple questions: 'What should I read next?' and 'How do I stay connected with this voice?'",
      "A high-performing author website operates as an editorial flagship. It prioritizes typographic clarity, instantaneous mobile loading, and a single dominant conversion pathway—usually an impeccably written direct newsletter or a curated reading order. It treats white space and layout rhythm with the same reverence as the typesetting of a fine literary edition.",
      "Furthermore, authors must own their platform. Renting your audience on social networks leaves you vulnerable to algorithmic whims and platform decay. A clean, independent, custom front-end running on lightweight modern code ensures that in five or ten years, your digital archive remains as pristine and authoritative as the day it was launched.",
    ],
    keyTakeaway:
      "An author's website should be an editorial experience, not an online resume. Design for the reader who just found you.",
  },
  {
    slug: "how-to-audit-your-own-amazon-listing",
    title: "How to audit your own Amazon listing",
    date: "June 2026",
    readTime: "6 min read",
    category: "Search & Systems",
    excerpt:
      "Amazon is not a bookstore; it is a search engine with a shopping cart attached. If your metadata, browse nodes, and backend keyword hierarchy are weak, your book is algorithmically invisible.",
    paragraphs: [
      "Traditional publishing treats Amazon as a catalogue listing: ISBN, jacket blurb, list price, publication date. But Amazon's A9 algorithm does not browse jacket art like a casual bookstore patron. It functions on relevance signals: indexing priority, keyword co-occurrence, conversion velocity, and categorical browse density.",
      "If you want to understand why a backlist title has flatlined, start with your 7 backend search fields. Most self-published authors and small presses commit the classic mistake of keyword stuffing or repeating words already in the book's title and subtitle. Amazon's engine automatically indexes every word in your title; repeating 'mystery' in your backend fields wastes precious character allocation that could capture latent intent—such as comp author names, specific setting themes, or reader demographic queries.",
      "The second lever is category browse nodes. A book stuck in an overcrowded top-level category like 'Literature & Fiction' with a sales rank of #85,000 earns zero algorithmic badges. By mapping relevant, granular subcategories through rigorous audit, that same title can achieve a Top 10 rank in a targeted sub-genre, unlocking Amazon's recommendation carousels and 'Customers Also Bought' algorithms.",
      "In our recent client case studies (such as the Amazon SEO Performance Audit for backlist titles), systematic metadata restructuring and external citation indexing drove grade movements from Grade E (algorithmic obscurity) to Grade B (sustained organic visibility)—delivering a +45 point lift in visibility signals within eight weeks.",
    ],
    keyTakeaway:
      "Treat Amazon as an index to be optimized rather than a shelf to be stocked. Metadata discipline drives organic discovery.",
  },
];

export function getNote(slug: string): NoteItem | undefined {
  return notesData.find((n) => n.slug === slug);
}

export function getAdjacentNotes(slug: string): {
  prev?: NoteItem;
  next?: NoteItem;
} {
  const i = notesData.findIndex((n) => n.slug === slug);
  if (i === -1) return {};
  return { prev: notesData[i - 1], next: notesData[i + 1] };
}
