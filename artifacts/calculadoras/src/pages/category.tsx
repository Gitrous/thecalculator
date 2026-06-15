import { Link, useParams } from "wouter";
import { ChevronRight } from "lucide-react";
import {
  getCategory,
  getCalculatorsByCategory,
  EN_TO_ES_CATEGORY,
  EN_CATEGORY_SLUGS,
} from "@/lib/calculators";
import { CalculatorCard } from "@/components/calculator-card";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { Seo } from "@/components/seo";
import NotFound from "@/pages/not-found";
import { useLocale } from "@/lib/locale";

export default function Category() {
  const { categoria = "" } = useParams();
  const locale = useLocale();
  const isEn = locale === "en";

  // Resolve the Spanish category ID whether we came from /en/ or /calculadoras/
  const categoryId = isEn ? EN_TO_ES_CATEGORY[categoria] : categoria;
  const category = getCategory(categoryId ?? categoria);

  if (!category) return <NotFound />;

  const calcs = getCalculatorsByCategory(category.id);
  const Icon = category.icon;

  const displayName = isEn ? category.enName : category.name;
  const displayDesc = isEn ? category.enDescription : category.description;
  const seoPath = isEn
    ? `/en/calculators/${EN_CATEGORY_SLUGS[category.id]}`
    : `/calculadoras/${category.id}`;
  const alternatePath = isEn
    ? `/calculadoras/${category.id}`
    : `/en/calculators/${EN_CATEGORY_SLUGS[category.id]}`;
  const homeHref = isEn ? "/en" : "/";
  const homeLabel = isEn ? "Home" : "Inicio";
  const pageTitle = isEn
    ? `${displayName} Calculators`
    : `Calculadoras de ${displayName}`;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Seo
        title={pageTitle}
        description={displayDesc}
        path={seoPath}
        alternatePath={alternatePath}
      />

      <nav className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
        <Link href={homeHref} className="hover:text-primary transition-colors">
          {homeLabel}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 dark:text-gray-200">{displayName}</span>
      </nav>

      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${category.color}`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
            {pageTitle}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {displayDesc}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {calcs.map((calc) => (
          <CalculatorCard key={calc.slug} calc={calc} />
        ))}
      </div>

      <AdUnit slot={AD_SLOTS.afterResult} className="mt-10" />
    </div>
  );
}
