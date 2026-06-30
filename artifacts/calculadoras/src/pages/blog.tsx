import { useState } from "react";
import { Link } from "wouter";
import {
  Search, X, ArrowRight, TrendingUp, Heart,
  Briefcase, Home, GraduationCap, Zap,
} from "lucide-react";
import { ARTICLES, type Article } from "@/lib/articles";
import { CATEGORIES } from "@/lib/calculators";
import { Seo } from "@/components/seo";
import { useLocale } from "@/lib/locale";

const CATEGORY_COLORS: Record<string, string> = {};
const CATEGORY_LABELS: Record<string, { es: string; en: string }> = {};
CATEGORIES.forEach((c) => {
  CATEGORY_COLORS[c.id] = c.color;
  CATEGORY_LABELS[c.id] = { es: c.name, en: c.enName };
});

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

const ARTICLE_CATEGORIES = [...new Set(ARTICLES.map((a) => a.category))];

function ArticleImage({ category, className }: { category: string; className?: string }) {
  const gradient = CATEGORY_GRADIENTS[category] ?? "from-gray-400 to-gray-600";
  const Icon = CATEGORY_ICONS[category];
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${className ?? ""}`}>
      {Icon && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-28 h-28 text-white opacity-10" strokeWidth={1} />
        </div>
      )}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
    </div>
  );
}

interface CardProps {
  article: Article;
  isEn: boolean;
  href: string;
  catLabel: string;
  dateStr: string;
}

function FeaturedCard({ article, isEn, href, catLabel }: Omit<CardProps, "dateStr">) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:shadow-xl transition-all"
    >
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-[58%] relative min-h-[260px] lg:min-h-[340px]">
          <ArticleImage category={article.category} className="absolute inset-0 w-full h-full" />
          <div className="absolute top-5 left-5">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/30">
              {catLabel} {isEn ? "Highlighted" : "Destacadas"}
            </span>
          </div>
        </div>
        <div className="lg:w-[42%] p-7 lg:p-10 flex flex-col justify-between">
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${CATEGORY_COLORS[article.category] ?? "bg-gray-100 text-gray-600"}`}>
              {catLabel} {isEn ? "Highlighted" : "Destacadas"}
            </span>
            <h2 className="mt-4 text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-snug group-hover:text-primary transition-colors">
              {isEn ? article.enTitle : article.title}
            </h2>
            <p className="mt-3 text-gray-500 dark:text-white/60 leading-relaxed line-clamp-3 text-sm lg:text-base">
              {isEn ? article.enDescription : article.description}
            </p>
          </div>
          <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-100 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                TC
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">thecalculator.tech</p>
                <p className="text-xs text-gray-500 dark:text-white/50">
                  {article.readTime} {isEn ? "min read" : "min de lectura"}
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all shrink-0">
              {isEn ? "Read more" : "Leer más"} <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function MediumCard({ article, isEn, href, catLabel, dateStr }: CardProps) {
  const Icon = CATEGORY_ICONS[article.category] ?? Zap;
  return (
    <Link
      href={href}
      className="group block rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:shadow-md hover:border-primary/30 dark:hover:border-primary/40 transition-all"
    >
      <div className="relative h-52 overflow-hidden">
        <ArticleImage category={article.category} className="absolute inset-0 w-full h-full" />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-white/25 backdrop-blur-sm text-white">
            {catLabel}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-gray-900 dark:text-white leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {isEn ? article.enTitle : article.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-white/50 mt-2 line-clamp-2">
          {isEn ? article.enDescription : article.description}
        </p>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-white/5">
          <span className="text-xs text-gray-400 dark:text-white/40">
            {dateStr} · {article.readTime} {isEn ? "min read" : "min lectura"}
          </span>
          <Icon className="w-4 h-4 text-gray-300 dark:text-white/30" />
        </div>
      </div>
    </Link>
  );
}

function SmallCard({ article, isEn, href, catLabel }: Omit<CardProps, "dateStr">) {
  const Icon = CATEGORY_ICONS[article.category] ?? Zap;
  return (
    <Link
      href={href}
      className="group block rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:shadow-md hover:border-primary/30 dark:hover:border-primary/40 transition-all"
    >
      <div className="relative h-40 overflow-hidden">
        <ArticleImage category={article.category} className="absolute inset-0 w-full h-full" />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-white/25 backdrop-blur-sm text-white">
            {catLabel}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white leading-snug group-hover:text-primary transition-colors line-clamp-2 text-sm">
          {isEn ? article.enTitle : article.title}
        </h3>
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-white/5">
          <span className="text-xs text-gray-400 dark:text-white/40">
            {article.readTime} {isEn ? "min read" : "min lectura"}
          </span>
          <Icon className="w-3.5 h-3.5 text-gray-300 dark:text-white/30" />
        </div>
      </div>
    </Link>
  );
}

export default function Blog() {
  const locale = useLocale();
  const isEn = locale === "en";
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const pageTitle = isEn ? "The Calculator Blog" : "Blog de thecalculator.tech";
  const subtitle = isEn
    ? "Learn to master your finances, optimize your home and boost your professional career with our expert guides."
    : "Aprende a dominar tus finanzas, optimizar tu hogar y potenciar tu carrera profesional con nuestras guías expertas.";
  const description = isEn
    ? "Practical guides to help you understand the calculators and make better decisions about your health and finances."
    : "Guías prácticas para entender las calculadoras y tomar mejores decisiones sobre tu salud y finanzas.";
  const path = isEn ? "/en/blog" : "/blog";
  const alternatePath = isEn ? "/blog" : "/en/blog";

  const q = query.toLowerCase().trim();
  const filtered = ARTICLES.filter((a) => {
    const t = isEn ? a.enTitle : a.title;
    const d = isEn ? a.enDescription : a.description;
    const sections = isEn ? a.enSections : a.sections;
    const sectionText = sections
      .flatMap((s) => [s.text ?? "", ...(s.items ?? [])])
      .join(" ")
      .toLowerCase();
    const matchesQuery =
      !q ||
      t.toLowerCase().includes(q) ||
      d.toLowerCase().includes(q) ||
      a.category.includes(q) ||
      sectionText.includes(q);
    const matchesCategory = !activeCategory || a.category === activeCategory;
    return matchesQuery && matchesCategory;
  });

  const hasFilters = q || activeCategory;
  const featured = !hasFilters && filtered.length > 0 ? filtered[0] : null;
  const secondaryRow = !hasFilters ? filtered.slice(1, 3) : [];
  const gridArticles = !hasFilters ? filtered.slice(3) : filtered;

  function getHref(article: Article) {
    return isEn ? `/en/blog/${article.enSlug}` : `/blog/${article.slug}`;
  }

  function getCatLabel(cat: string) {
    return CATEGORY_LABELS[cat]?.[isEn ? "en" : "es"] ?? cat;
  }

  function shortDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString(isEn ? "en-GB" : "es-ES", {
      day: "numeric",
      month: "short",
    });
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Seo
        title="Blog — thecalculator.tech"
        description={description}
        path={path}
        alternatePath={alternatePath}
      />

      {/* ── Hero ── */}
      <section className="text-center space-y-5 py-10 md:py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
          {pageTitle}
        </h1>
        <p className="text-lg text-gray-500 dark:text-white/60 max-w-2xl mx-auto">
          {subtitle}
        </p>

        {/* Search bar */}
        <div className="relative max-w-xl mx-auto pt-2">
          <div className="flex items-center rounded-full border border-gray-200 dark:border-white/20 bg-white dark:bg-white/10 shadow-sm pl-5 pr-2 py-2">
            <Search className="w-4 h-4 text-gray-400 dark:text-white/40 shrink-0 mr-3" />
            <input
              type="search"
              placeholder={isEn ? "What do you want to calculate or learn today?" : "¿Qué quieres calcular o aprender hoy?"}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 min-w-0 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 focus:outline-none text-sm"
            />
            {query && (
              <button onClick={() => setQuery("")} className="mr-2 text-gray-400 hover:text-gray-600 shrink-0">
                <X className="w-4 h-4" />
              </button>
            )}
            <button className="px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold shrink-0 hover:bg-primary/90 transition-colors">
              {isEn ? "Search" : "Buscar"}
            </button>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 pt-1">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
              !activeCategory
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-primary/50 hover:text-primary"
            }`}
          >
            {isEn ? "All" : "Todos"}
          </button>
          {ARTICLE_CATEGORIES.map((cat) => {
            const label = getCatLabel(cat);
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(isActive ? null : cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                  isActive
                    ? `${CATEGORY_COLORS[cat] ?? ""} border-transparent shadow-sm`
                    : "bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-primary/50 hover:text-primary"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {hasFilters && (
          <p className="text-sm text-muted-foreground">
            {filtered.length}{" "}
            {isEn
              ? filtered.length === 1 ? "result" : "results"
              : filtered.length === 1 ? "resultado" : "resultados"}
            {q ? (isEn ? ` for "${query}"` : ` para "${query}"`) : ""}
          </p>
        )}
      </section>

      {/* ── Articles ── */}
      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm py-12 text-center">
          {isEn ? "No articles found." : "No se encontraron artículos."}
        </p>
      ) : hasFilters ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <SmallCard
              key={a.slug}
              article={a}
              isEn={isEn}
              href={getHref(a)}
              catLabel={getCatLabel(a.category)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Featured article */}
          {featured && (
            <FeaturedCard
              article={featured}
              isEn={isEn}
              href={getHref(featured)}
              catLabel={getCatLabel(featured.category)}
            />
          )}

          {/* Row of 2 */}
          {secondaryRow.length > 0 && (
            <div className={`grid gap-5 ${secondaryRow.length > 1 ? "sm:grid-cols-2" : ""}`}>
              {secondaryRow.map((a) => (
                <MediumCard
                  key={a.slug}
                  article={a}
                  isEn={isEn}
                  href={getHref(a)}
                  catLabel={getCatLabel(a.category)}
                  dateStr={shortDate(a.date)}
                />
              ))}
            </div>
          )}

          {/* Remaining in 3-col grid */}
          {gridArticles.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {gridArticles.map((a) => (
                <SmallCard
                  key={a.slug}
                  article={a}
                  isEn={isEn}
                  href={getHref(a)}
                  catLabel={getCatLabel(a.category)}
                />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
