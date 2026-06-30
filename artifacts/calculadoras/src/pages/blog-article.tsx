import { useState } from "react";
import { Link, useParams } from "wouter";
import {
  ChevronRight, Calculator, Lightbulb,
  ThumbsUp, ThumbsDown, CheckCircle2, Share2,
  TrendingUp, Heart, Briefcase, Home, GraduationCap, Zap,
} from "lucide-react";
import { getArticle, ARTICLES, ARTICLE_IMAGES, type ArticleSection } from "@/lib/articles";
import {
  getCalculator, calcPath, enCalcPath,
  getCalculatorsByCategory, CATEGORIES,
} from "@/lib/calculators";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { Seo } from "@/components/seo";
import NotFound from "@/pages/not-found";
import { useLocale } from "@/lib/locale";

const CATEGORY_GRADIENTS: Record<string, string> = {
  finanzas: "from-emerald-500 via-teal-600 to-emerald-800",
  salud: "from-sky-400 via-blue-500 to-indigo-700",
  trabajo: "from-violet-500 via-purple-600 to-purple-900",
  hogar: "from-orange-400 via-orange-500 to-amber-700",
  educacion: "from-indigo-400 via-blue-500 to-indigo-800",
};

const CATEGORY_ICONS: Record<string, typeof Zap> = {
  finanzas: TrendingUp,
  salud: Heart,
  trabajo: Briefcase,
  hogar: Home,
  educacion: GraduationCap,
};

const CATEGORY_LABELS: Record<string, { es: string; en: string }> = {};
CATEGORIES.forEach((c) => {
  CATEGORY_LABELS[c.id] = { es: c.name, en: c.enName };
});

function renderSection(section: ArticleSection, idx: number) {
  switch (section.type) {
    case "h2":
      return (
        <h2 key={idx} className="text-xl font-bold text-gray-900 dark:text-white mt-10 mb-3">
          {section.text}
        </h2>
      );
    case "p":
      return (
        <p key={idx} className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {section.text}
        </p>
      );
    case "ul":
      return (
        <ul key={idx} className="space-y-2 list-none">
          {section.items?.map((item, i) => (
            <li key={i} className="flex gap-2 text-gray-700 dark:text-gray-300 leading-relaxed">
              <span className="text-primary mt-1 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "checklist":
      return (
        <ul key={idx} className="space-y-3 list-none">
          {section.items?.map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "tip":
      return (
        <div
          key={idx}
          className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-r-xl px-5 py-4 my-2"
        >
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase">
              Pro Tip
            </span>
          </div>
          <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">{section.text}</p>
        </div>
      );
    case "quote":
      return (
        <blockquote
          key={idx}
          className="border border-gray-200 dark:border-white/10 rounded-xl px-6 py-5 my-2 bg-gray-50 dark:bg-white/5"
        >
          <p className="text-gray-600 dark:text-gray-300 italic leading-relaxed text-sm">
            &ldquo;{section.text}&rdquo;
          </p>
        </blockquote>
      );
    case "callout":
      return (
        <div
          key={idx}
          className="rounded-xl border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-900/20 p-4 my-2"
        >
          <p className="text-sm text-amber-800 dark:text-amber-300 italic">{section.text}</p>
        </div>
      );
    default:
      return null;
  }
}

function HeroImage({ category, image }: { category: string; image?: string }) {
  const gradient = CATEGORY_GRADIENTS[category] ?? "from-gray-400 to-gray-600";
  const Icon = CATEGORY_ICONS[category];
  return (
    <div className={`relative w-full h-44 sm:h-56 rounded-2xl overflow-hidden bg-gradient-to-br ${gradient} mb-8`}>
      {image ? (
        <img
          src={image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      ) : Icon ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-40 h-40 text-white opacity-10" strokeWidth={1} />
        </div>
      ) : null}
    </div>
  );
}


function FeedbackWidget({ isEn }: { isEn: boolean }) {
  const [vote, setVote] = useState<"yes" | "no" | null>(null);
  return (
    <div className="mt-12 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-6 text-center">
      {vote ? (
        <p className="text-gray-700 dark:text-gray-300 font-medium">
          {isEn ? "Thanks for your feedback!" : "¡Gracias por tu opinión!"}
        </p>
      ) : (
        <>
          <p className="font-semibold text-gray-900 dark:text-white mb-1">
            {isEn ? "Was this guide helpful?" : "¿Te ha sido útil esta guía?"}
          </p>
          <p className="text-sm text-gray-500 dark:text-white/50 mb-4">
            {isEn
              ? "Your feedback helps us create better content."
              : "Tu feedback nos ayuda a crear mejor contenido financiero."}
          </p>
          <div className="flex justify-center gap-6">
            <button
              onClick={() => setVote("yes")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 hover:border-emerald-400 hover:text-emerald-600 text-gray-600 dark:text-gray-300 transition-all text-sm font-medium"
            >
              <ThumbsUp className="w-4 h-4" />
              {isEn ? "Yes" : "Sí"}
            </button>
            <button
              onClick={() => setVote("no")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 hover:border-red-400 hover:text-red-500 text-gray-600 dark:text-gray-300 transition-all text-sm font-medium"
            >
              <ThumbsDown className="w-4 h-4" />
              No
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function BlogArticle() {
  const { slug = "" } = useParams();
  const locale = useLocale();
  const isEn = locale === "en";

  const article = getArticle(slug);
  if (!article) return <NotFound />;

  const title = isEn ? article.enTitle : article.title;
  const description = isEn ? article.enDescription : article.description;
  const sections = isEn ? article.enSections : article.sections;
  const path = isEn ? `/en/blog/${article.enSlug}` : `/blog/${article.slug}`;
  const alternatePath = isEn ? `/blog/${article.slug}` : `/en/blog/${article.enSlug}`;

  const blogHref = isEn ? "/en/blog" : "/blog";
  const catLabel = CATEGORY_LABELS[article.category]?.[isEn ? "en" : "es"] ?? article.category;

  const dateLabel = new Date(article.date).toLocaleDateString(isEn ? "en-GB" : "es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const relatedCalc = getCalculator(article.relatedCalcCategory, article.relatedCalcSlug);
  const relatedCalcHref = relatedCalc
    ? isEn ? enCalcPath(relatedCalc) : calcPath(relatedCalc)
    : null;
  const relatedCalcLabel = relatedCalc
    ? isEn ? relatedCalc.enShortLabel : relatedCalc.shortLabel
    : null;

  // Sidebar: up to 3 calculators from same category (excluding the related one)
  const sidebarCalcs = getCalculatorsByCategory(article.relatedCalcCategory)
    .filter((c) => c.slug !== article.relatedCalcSlug)
    .slice(0, 2);

  // Popular topics: category tags
  const popularTags = ARTICLES.reduce<string[]>((acc, a) => {
    if (!acc.includes(a.category)) acc.push(a.category);
    return acc;
  }, []);

  const mid = Math.floor(sections.length / 2);
  const firstHalf = sections.slice(0, mid);
  const secondHalf = sections.slice(mid);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: article.date,
    dateModified: article.date,
    author: { "@type": "Organization", name: "thecalculator.tech" },
    publisher: {
      "@type": "Organization",
      name: "thecalculator.tech",
      url: "https://thecalculator.tech",
    },
    inLanguage: isEn ? "en" : "es",
    url: `https://thecalculator.tech${path}`,
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Seo
        title={`${title} — thecalculator.tech`}
        description={description}
        path={path}
        jsonLd={jsonLd}
        alternatePath={alternatePath}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href={blogHref} className="hover:text-primary transition-colors">Blog</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          href={`${blogHref}`}
          className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          {catLabel}
        </Link>
      </nav>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-5 leading-tight">
        {title}
      </h1>

      {/* Author bar */}
      <div className="flex items-center justify-between mb-8 pb-5 border-b border-gray-100 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary text-sm font-bold shrink-0">
            TC
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">thecalculator.tech</p>
            <p className="text-xs text-gray-500 dark:text-white/50">
              {dateLabel} · {article.readTime} {isEn ? "min read" : "min de lectura"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigator.share?.({ title, url: window.location.href })}
            className="p-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-primary hover:border-primary/40 transition-colors"
            aria-label="Compartir"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">
          {/* Hero image */}
          <HeroImage category={article.category} image={ARTICLE_IMAGES[article.slug]} />

          {/* Lead */}
          <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            {description}
          </p>

          {/* First half of content */}
          <div className="space-y-4">
            {firstHalf.map((section, idx) => renderSection(section, idx))}
          </div>

          <AdUnit slot={AD_SLOTS.midContent} className="my-10" />

          {/* Second half */}
          <div className="space-y-4">
            {secondHalf.map((section, idx) => renderSection(section, idx + firstHalf.length))}
          </div>

          {/* CTA to related calculator */}
          {relatedCalc && relatedCalcHref && (
            <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Calculator className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">
                  {isEn ? "Try the calculator" : "Prueba la calculadora"}
                </p>
                <p className="text-sm text-gray-500 dark:text-white/60">
                  {isEn
                    ? `Use the ${relatedCalcLabel} and get your personalised result in seconds.`
                    : `Usa la calculadora de ${relatedCalcLabel} y obtén tu resultado personalizado en segundos.`}
                </p>
              </div>
              <Link
                href={relatedCalcHref}
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                {isEn ? "Open calculator →" : "Abrir calculadora →"}
              </Link>
            </div>
          )}

          {/* Feedback */}
          <FeedbackWidget isEn={isEn} />

          <AdUnit slot={AD_SLOTS.belowFaq} className="mt-10" />
        </div>

        {/* ── Sidebar ── */}
        <aside className="lg:w-72 shrink-0 space-y-5 lg:sticky lg:top-24">
          {/* Herramientas Útiles */}
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                {isEn ? "Useful Tools" : "Herramientas Útiles"}
              </h3>
              <Calculator className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-3">
              {relatedCalc && relatedCalcHref && (
                <Link
                  href={relatedCalcHref}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Calculator className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      {isEn ? relatedCalc.enTitle : relatedCalc.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-white/50 line-clamp-2 mt-0.5">
                      {isEn ? relatedCalc.enSeoDescription : relatedCalc.seoDescription}
                    </p>
                  </div>
                </Link>
              )}
              {sidebarCalcs.map((calc) => {
                const href = isEn ? enCalcPath(calc) : calcPath(calc);
                return (
                  <Link
                    key={calc.slug}
                    href={href}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                      <Calculator className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                        {isEn ? calc.enTitle : calc.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-white/50 line-clamp-2 mt-0.5">
                        {isEn ? calc.enSeoDescription : calc.seoDescription}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Popular topics */}
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-5">
            <h3 className="text-xs font-bold text-gray-500 dark:text-white/50 uppercase tracking-widest mb-3">
              {isEn ? "Popular Topics" : "Temas Populares"}
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => {
                const label = CATEGORY_LABELS[tag]?.[isEn ? "en" : "es"] ?? tag;
                return (
                  <Link
                    key={tag}
                    href={blogHref}
                    className="px-3 py-1 rounded-full text-xs font-semibold border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    #{label}
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
