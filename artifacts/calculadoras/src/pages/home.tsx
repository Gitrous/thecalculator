import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { Search, X, Clock } from "lucide-react";
import {
  CATEGORIES,
  CALCULATORS,
  getCalculatorsByCategory,
  type CalculatorMeta,
  calcPath,
  enCalcPath,
  EN_CATEGORY_SLUGS,
} from "@/lib/calculators";
import { CalculatorCard } from "@/components/calculator-card";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { useLocale } from "@/lib/locale";

const RECENT_KEY = "calc_recent";

function getRecentCalcs(): CalculatorMeta[] {
  try {
    const keys: string[] = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
    return keys
      .map((k) => {
        const [cat, slug] = k.split("/");
        return CALCULATORS.find((c) => c.category === cat && c.slug === slug);
      })
      .filter(Boolean) as CalculatorMeta[];
  } catch {
    return [];
  }
}

// Bento layout: col-span per category (3-column grid)
const BENTO_SPAN: Record<string, string> = {
  finanzas:  "lg:col-span-3",
  trabajo:   "lg:col-span-2",
  educacion: "lg:col-span-1",
  hogar:     "lg:col-span-1",
  salud:     "lg:col-span-2",
};

// Glow orb colour per category
const GLOW_COLOR: Record<string, string> = {
  finanzas:  "bg-emerald-500/20 group-hover:bg-emerald-500/30",
  trabajo:   "bg-blue-500/20   group-hover:bg-blue-500/30",
  educacion: "bg-orange-500/20 group-hover:bg-orange-500/30",
  hogar:     "bg-purple-500/20 group-hover:bg-purple-500/30",
  salud:     "bg-rose-500/20   group-hover:bg-rose-500/30",
};

// Inner-grid class for the calculator links inside each bento card
const INNER_GRID: Record<string, string> = {
  finanzas:  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
  trabajo:   "grid grid-cols-1 sm:grid-cols-2 gap-4",
  educacion: "flex flex-col gap-3",
  hogar:     "flex flex-col gap-3",
  salud:     "grid grid-cols-1 sm:grid-cols-2 gap-4",
};

// Whether calc links use the compact (list) or card style
const IS_COMPACT: Record<string, boolean> = {
  finanzas:  false,
  trabajo:   false,
  educacion: false,
  hogar:     false,
  salud:     false,
};

function BentoCalcLink({ calc, isEn, compact }: { calc: CalculatorMeta; isEn: boolean; compact: boolean }) {
  const href = isEn ? enCalcPath(calc) : calcPath(calc);
  const title = isEn ? calc.enShortLabel : calc.shortLabel;
  const desc  = isEn ? calc.enDescription : calc.description;

  if (compact) {
    return (
      <Link href={href}>
        <div className="flex flex-col gap-1 p-3 rounded-lg border border-transparent hover:bg-white/5 dark:hover:bg-white/5 hover:border-white/10 transition-colors cursor-pointer">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{title}</span>
          <span className="text-xs text-gray-500 dark:text-white/50 line-clamp-1">{desc}</span>
        </div>
      </Link>
    );
  }
  return (
    <Link href={href}>
      <div className="flex flex-col gap-2 p-4 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5 transition-colors cursor-pointer">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">{title}</span>
        <span className="text-xs text-gray-500 dark:text-white/60 line-clamp-2">{desc}</span>
      </div>
    </Link>
  );
}

export default function Home() {
  const locale = useLocale();
  const isEn = locale === "en";
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<CalculatorMeta[]>([]);

  useEffect(() => {
    setRecent(getRecentCalcs());
  }, []);

  const normalized = query.toLowerCase().trim();
  const searchResults = normalized
    ? CALCULATORS.filter(
        (c) =>
          (isEn ? c.enTitle : c.title).toLowerCase().includes(normalized) ||
          (isEn ? c.enDescription : c.description).toLowerCase().includes(normalized) ||
          (isEn ? c.enShortLabel : c.shortLabel).toLowerCase().includes(normalized),
      )
    : [];
  const isSearching = normalized.length > 0;

  const heroGradientWord = isEn ? "Precision" : "Precisión";
  const heroLine1 = isEn
    ? <>Calculate with <span className="text-gradient">{heroGradientWord}</span>.</>
    : <>Calcula con <span className="text-gradient">{heroGradientWord}</span>.</>;
  const heroLine2 = isEn ? "Plan with Confidence." : "Decide con Confianza.";
  const heroSubtitle = isEn
    ? "Over 25 free tools for finance, home, work, education and health. No registration required."
    : "Más de 25 herramientas gratuitas para finanzas, hogar, trabajo, educación y salud. Sin registro.";
  const searchPlaceholder = isEn ? "Search a calculator…" : "Busca una calculadora…";
  const recentLabel = isEn ? "Recently used" : "Usadas recientemente";
  const aboutText = isEn
    ? "Every calculator runs entirely in your browser—no registration, no subscription, nothing to install—and shows the calculation method alongside the result so you understand how each figure is reached. Tax brackets, Social Security rates and labour regulations are updated every year to reflect current legislation."
    : "Todas las calculadoras funcionan en el navegador —sin registro, sin suscripción, sin instalar nada— y muestran el procedimiento junto con el resultado para que entiendas cómo se llega a cada cifra. Los datos fiscales, de cotización y laborales se actualizan cada año para reflejar la legislación vigente.";

  const featuredCategories = CATEGORIES.filter((c) => c.featuredOnHome);
  const allCategories = CATEGORIES;

  return (
    <div className="max-w-6xl mx-auto space-y-12">

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="text-center space-y-5 py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
          {heroLine1}<br />{heroLine2}
        </h1>
        <p className="text-xl text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
          {heroSubtitle}
        </p>

        {/* Search */}
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

        {/* Category pills */}
        {!isSearching && (
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            {featuredCategories.map((cat) => {
              const Icon = cat.icon;
              const href = isEn
                ? `/en/calculators/${EN_CATEGORY_SLUGS[cat.id]}`
                : `/calculadoras/${cat.id}`;
              return (
                <Link key={cat.id} href={href}>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-opacity hover:opacity-80 ${cat.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {isEn ? cat.enName : cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ── About ──────────────────────────────────────────────────────────── */}
      {!isSearching && (
        <p className="text-gray-600 dark:text-white/60 leading-relaxed max-w-3xl mx-auto text-center -mt-4">
          {aboutText}
        </p>
      )}

      {/* ── Search results ─────────────────────────────────────────────────── */}
      {isSearching && (
        <section>
          <p className="text-sm text-muted-foreground mb-6">
            {searchResults.length}{" "}
            {isEn
              ? searchResults.length === 1 ? "result" : "results"
              : searchResults.length === 1 ? "resultado" : "resultados"
            }{" "}
            {isEn ? "for" : "para"}{" "}
            <span className="font-medium text-foreground dark:text-white">"{query}"</span>
          </p>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {searchResults.map((calc) => (
                <CalculatorCard key={calcPath(calc)} calc={calc} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-16">
              {isEn
                ? `No calculators found for "${query}"`
                : `No se encontraron calculadoras para "${query}"`}
            </p>
          )}
        </section>
      )}

      {/* ── Recent calculators ─────────────────────────────────────────────── */}
      {!isSearching && recent.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {recentLabel}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recent.map((calc) => (
              <CalculatorCard key={calcPath(calc)} calc={calc} />
            ))}
          </div>
        </section>
      )}

      {/* ── Bento grid ─────────────────────────────────────────────────────── */}
      {!isSearching && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCategories.map((cat, index) => {
            const Icon = cat.icon;
            const calcs = getCalculatorsByCategory(cat.id);
            const colSpan = BENTO_SPAN[cat.id] ?? "lg:col-span-1";
            const glowColor = GLOW_COLOR[cat.id] ?? "bg-blue-500/20";
            const innerGrid = INNER_GRID[cat.id] ?? "flex flex-col gap-3";
            const compact = IS_COMPACT[cat.id] ?? false;
            const catHref = isEn
              ? `/en/calculators/${EN_CATEGORY_SLUGS[cat.id]}`
              : `/calculadoras/${cat.id}`;

            return (
              <React.Fragment key={cat.id}>
                <div className={`${colSpan} glass-card rounded-2xl p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden group`}>
                  {/* Glow orb */}
                  <div className={`absolute -right-12 -top-12 w-48 h-48 rounded-full blur-3xl transition-all duration-500 ${glowColor}`} />

                  {/* Category header */}
                  <Link href={catHref}>
                    <div className="flex items-center gap-3 cursor-pointer">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${cat.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-primary dark:hover:text-blue-300 transition-colors">
                          {isEn ? cat.enName : cat.name}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-white/50">
                          {isEn ? cat.enDescription : cat.description}
                        </p>
                      </div>
                    </div>
                  </Link>

                  {/* Calculator links */}
                  <div className={innerGrid}>
                    {calcs.map((calc) => (
                      <BentoCalcLink key={calc.slug} calc={calc} isEn={isEn} compact={compact} />
                    ))}
                  </div>
                </div>
                {index === 2 && <AdUnit slot={AD_SLOTS.midContent} className="lg:col-span-3 my-2" />}
              </React.Fragment>
            );
          })}
        </section>
      )}
    </div>
  );
}
