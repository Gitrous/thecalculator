import { Link, useParams } from "wouter";
import { Clock, ChevronRight, BookOpen, Calculator } from "lucide-react";
import { getArticle, type ArticleSection } from "@/lib/articles";
import { getCalculator, calcPath, enCalcPath } from "@/lib/calculators";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { Seo } from "@/components/seo";
import NotFound from "@/pages/not-found";
import { useLocale } from "@/lib/locale";

function renderSection(section: ArticleSection, isEn: boolean, idx: number) {
  switch (section.type) {
    case "h2":
      return (
        <h2 key={idx} className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">
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
    case "callout":
      return (
        <div key={idx} className="rounded-xl border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-900/20 p-4 mt-6">
          <p className="text-sm text-amber-800 dark:text-amber-300 italic">{section.text}</p>
        </div>
      );
    default:
      return null;
  }
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
  const blogLabel = isEn ? "Blog" : "Blog";
  const homeHref = isEn ? "/en" : "/";
  const homeLabel = isEn ? "Home" : "Inicio";

  const dateObj = new Date(article.date);
  const dateLabel = dateObj.toLocaleDateString(isEn ? "en-GB" : "es-ES", {
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

  // Split sections around midpoint for mid-article ad
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
    <div className="max-w-3xl mx-auto">
      <Seo
        title={`${title} — thecalculator.tech`}
        description={description}
        path={path}
        jsonLd={jsonLd}
        alternatePath={alternatePath}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href={homeHref} className="hover:text-primary transition-colors">{homeLabel}</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href={blogHref} className="hover:text-primary transition-colors">{blogLabel}</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 dark:text-gray-200 truncate max-w-[200px]">{title}</span>
      </nav>

      {/* Category + meta */}
      <div className="flex items-center gap-3 mb-4">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
          <BookOpen className="w-3 h-3" />
          {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {article.readTime} {isEn ? "min read" : "min lectura"}
        </span>
        <span className="text-xs text-muted-foreground">{dateLabel}</span>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4 leading-tight">
        {title}
      </h1>

      {/* Lead */}
      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{description}</p>

      {/* First half of content */}
      <div className="space-y-4">
        {firstHalf.map((section, idx) => renderSection(section, isEn, idx))}
      </div>

      <AdUnit slot={AD_SLOTS.midContent} className="my-10" />

      {/* Second half of content */}
      <div className="space-y-4">
        {secondHalf.map((section, idx) => renderSection(section, isEn, idx + firstHalf.length))}
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
            <p className="text-sm text-muted-foreground">
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

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-10" />
    </div>
  );
}
