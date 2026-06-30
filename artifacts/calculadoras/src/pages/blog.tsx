import { Link } from "wouter";
import { Clock, BookOpen } from "lucide-react";
import { ARTICLES } from "@/lib/articles";
import { CATEGORIES } from "@/lib/calculators";
import { Seo } from "@/components/seo";
import { useLocale } from "@/lib/locale";

const CATEGORY_COLORS: Record<string, string> = {};
CATEGORIES.forEach((c) => { CATEGORY_COLORS[c.id] = c.color; });

export default function Blog() {
  const locale = useLocale();
  const isEn = locale === "en";

  const title = isEn ? "Health & Finance Blog" : "Blog de Salud y Finanzas";
  const description = isEn
    ? "Practical guides to help you understand the calculators and make better decisions about your health and finances."
    : "Guías prácticas para entender las calculadoras y tomar mejores decisiones sobre tu salud y finanzas.";
  const path = isEn ? "/en/blog" : "/blog";
  const alternatePath = isEn ? "/blog" : "/en/blog";

  return (
    <div className="max-w-4xl mx-auto">
      <Seo
        title={isEn ? "Blog — thecalculator.tech" : "Blog — thecalculator.tech"}
        description={description}
        path={path}
        alternatePath={alternatePath}
      />

      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          {isEn ? "Guides & Articles" : "Guías y artículos"}
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {ARTICLES.map((article) => {
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
              className="group flex flex-col gap-4 p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-primary/40 dark:hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}>
                  {isEn ? article.category : article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {article.readTime} {isEn ? "min read" : "min lectura"}
                </span>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white leading-snug mb-2 group-hover:text-primary transition-colors">
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
    </div>
  );
}
