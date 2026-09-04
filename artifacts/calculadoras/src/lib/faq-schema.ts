/**
 * FAQ structured-data (schema.org FAQPage) support.
 *
 * Each calculator page keeps its questions and answers in a module-level `T`
 * object shaped as `{ es: { q1, a1, q2, a2, ... }, en: { ... } }`. Instead of
 * duplicating that copy here (which would drift), every calculator registers
 * its own `T` at import time via `registerFaq`. Because `calculator-page.tsx`
 * statically imports all calculator components, every registration has run
 * before the page renders, so `getFaqJsonLd` can build the FAQPage node that is
 * merged into the page's JSON-LD `@graph`.
 *
 * Only string answers are included; a few pages have rich (JSX) answers, which
 * cannot be serialized and are skipped automatically.
 */

type LangFaq = Record<string, unknown>;
type Translations = { es?: LangFaq; en?: LangFaq } & Record<string, unknown>;

const REGISTRY: Record<string, Translations> = {};

/** Called at module load by each calculator, keyed by "categoria/slug". */
export function registerFaq(key: string, translations: Translations): void {
  REGISTRY[key] = translations;
}

/** Highest FAQ index any page uses (q1..q8 in the current content). */
const MAX_FAQ = 8;

/**
 * Build the schema.org FAQPage node for a calculator, or null when it has fewer
 * than two plain-text Q&A pairs (Google requires a non-trivial list). The node
 * has no `@context`; it is meant to live inside a page-level `@graph`.
 */
export function getFaqJsonLd(key: string, lang: "es" | "en"): Record<string, unknown> | null {
  const translations = REGISTRY[key];
  const langObj = translations?.[lang];
  if (!langObj) return null;

  const mainEntity: Record<string, unknown>[] = [];
  for (let i = 1; i <= MAX_FAQ; i++) {
    const q = (langObj as LangFaq)[`q${i}`];
    const a = (langObj as LangFaq)[`a${i}`];
    if (typeof q === "string" && typeof a === "string" && q.trim() && a.trim()) {
      mainEntity.push({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      });
    }
  }

  if (mainEntity.length < 2) return null;
  return { "@type": "FAQPage", mainEntity };
}
