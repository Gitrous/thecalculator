import { useState } from "react";
import { Link } from "wouter";
import { Clock, BookOpen, Search, X } from "lucide-react";
import { ARTICLES } from "@/lib/articles";
import { CATEGORIES } from "@/lib/calculators";
import { Seo } from "@/components/seo";
import { useLocale } from "@/lib/locale";

const CATEGORY_COLORS: Record<string, string> = {};
CATEGORIES.forEach((c) => { CATEGORY_COLORS[c.id] = c.color; });

export default function Blog() {
  const locale = useLocale();
  const isEn = locale === "en";
  const [query, setQuery] = useState("");

  const title = isEn ? "Health & Finance Blog" : "Blog de Salud y Finanzas";
  const description = isEn
    ? "Practical guides to help you understand the calculators and make better decisions about your health and finances."
    : "Guías prácticas para entender las calculadoras y tomar mejores decisiones sobre tu salud y finanzas.";
  const path = isEn ? "/en/blog" : "/blog";
  const alternatePath = isEn ? "/blog" : "/en/blog";
  const searchPlaceholder = isEn ? "Search articles…" : "Busca un artículo…";

  const q = query.toLowerCase().trim();
  const filtered = q
    ? ARTICLES.filter((a) => {
        const t = isEn ? a.enTitle : a.title;
        const d = isEn ? a.enDescription : a.description;
        return t.toLowerCase().includes(q) || d.toLowerCase().includes(q) || a.category.includes(q);
      })
    : ARTICLES;

  return (
    <div className="max-w-7xl mx-auto">
      <Seo
        title={isEn ? "Blog — thecalculator.tech" : "Blog — thecalculator.tech"}
        description={description}
        path={path}
        alternatePath={alternatePath}
      />

      {/* Hero + search */}
      <section className="text-center space-y-5 py-12 md:py-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
          <BookOpen className="w-3.5 h-3.5" />
          {isEn ? "Guides & Articles" : "Guías y artículos"}
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
          {title}
        </h1>
        <p className="text-xl text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
          {description}
        </p>

        {/* Search bar */}
        <div className="relative max-w-lg mx-auto pt-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-white/50 pointer-events-none" />
          <input
            type="search"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3.5 rounded-xl border border-gray-200 dark:border-white/20 bg-white dark:bg-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-base shadow-sm backdrop-blur-md transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-white/50 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {q && (
          <p className="text-sm text-muted-foreground">
            {filtered.length}{" "}
            {isEn
              ? filtered.length === 1 ? "result" : "results"
              : filtered.length === 1 ? "resultado" : "resultados"}
            {" "}
            {isEn ? `for "${query}"` : `para "${query}"`}
          </p>
        )}
      </section>

      {/* Articles grid */}
      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm py-12 text-center">
          {isEn ? "No articles found for your search." : "No se encontraron artículos para tu búsqueda."}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((article) => {
            const href = isEn ? `/en/blog/${article.enSlug}` : `/blog/${article.slug}`;
            const articleTitle = isEn ? article.enTitle : article.title;
            const articleDesc = isEn ? article.enDescription : article.description;
            const colorClass = CATEGORY_COLORS[article.category] ?? "text-gray-600 bg-gray-100";

            const dateObj = new Date(article.date);
            const dateLabel = dateObj.toLocaleDateString(isEn ? "en-GB" : "es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });

            return (
              <Link
                key={article.slug}
                href={href}
                className="group flex flex-col gap-3 p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-primary/40 dark:hover:border-primary/40 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}>
                    {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {article.readTime} {isEn ? "min read" : "min lectura"}
                  </span>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug mb-2 group-hover:text-primary transition-colors">
                    {articleTitle}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-3">{articleDesc}</p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/5">
                  <span className="text-xs text-muted-foreground">{dateLabel}</span>
                  <span className="text-xs font-semibold text-primary group-hover:underline">
                    {isEn ? "Read more →" : "Leer más →"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
