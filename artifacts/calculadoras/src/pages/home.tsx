import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { Search, X, ArrowRight, ChevronRight, Clock } from "lucide-react";
import {
  CATEGORIES,
  CALCULATORS,
  getCalculatorsByCategory,
  type CalculatorMeta,
  type Category,
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
      .map((k) => { const [cat, slug] = k.split("/"); return CALCULATORS.find((c) => c.category === cat && c.slug === slug); })
      .filter(Boolean) as CalculatorMeta[];
  } catch { return []; }
}

const CAT_BG: Record<string, string> = {
  finanzas:  "bg-blue-50   dark:bg-blue-950/30  border-blue-100  dark:border-blue-900/50",
  hogar:     "bg-amber-50  dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/50",
  trabajo:   "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900/50",
  educacion: "bg-violet-50 dark:bg-violet-950/30 border-violet-100 dark:border-violet-900/50",
  salud:     "bg-teal-50   dark:bg-teal-950/30  border-teal-100  dark:border-teal-900/50",
};
const CAT_BADGE: Record<string, string> = {
  finanzas:  "text-blue-700   bg-blue-100   dark:text-blue-300   dark:bg-blue-900/50",
  hogar:     "text-amber-700  bg-amber-100  dark:text-amber-300  dark:bg-amber-900/50",
  trabajo:   "text-indigo-700 bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-900/50",
  educacion: "text-violet-700 bg-violet-100 dark:text-violet-300 dark:bg-violet-900/50",
  salud:     "text-teal-700   bg-teal-100   dark:text-teal-300   dark:bg-teal-900/50",
};
const CAT_LINK: Record<string, string> = {
  finanzas:  "text-blue-600   hover:text-blue-800",
  hogar:     "text-amber-600  hover:text-amber-800",
  trabajo:   "text-indigo-600 hover:text-indigo-800",
  educacion: "text-violet-600 hover:text-violet-800",
  salud:     "text-teal-600   hover:text-teal-800",
};

function CategoryFeaturedCard({ cat, isEn }: { cat: Category; isEn: boolean }) {
  const Icon = cat.icon;
  const calcs = getCalculatorsByCategory(cat.id);
  const catHref = isEn ? `/en/calculators/${EN_CATEGORY_SLUGS[cat.id]}` : `/calculadoras/${cat.id}`;
  const bg   = CAT_BG[cat.id]    ?? "bg-gray-50 border-gray-200";
  const badge = CAT_BADGE[cat.id] ?? "text-gray-600 bg-gray-100";
  const link  = CAT_LINK[cat.id]  ?? "text-gray-600";

  return (
    <Link href={catHref}>
      <div className={`h-full rounded-2xl border p-6 md:p-8 hover:shadow-lg transition-all cursor-pointer group ${bg}`}>
        <div className="flex items-start justify-between mb-6">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cat.color}`}>
            <Icon className="w-6 h-6" />
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${badge}`}>
            {calcs.length}+ {isEn ? "TOOLS" : "CALC."}
          </span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {isEn ? cat.enName : cat.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
          {isEn ? cat.enDescription : cat.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {calcs.slice(0, 5).map((calc) => (
            <span key={calc.slug}
              className="px-3 py-1.5 rounded-lg bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/20 text-xs font-medium text-gray-700 dark:text-gray-300">
              {isEn ? calc.enShortLabel : calc.shortLabel}
            </span>
          ))}
        </div>
        <span className={`text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all ${link}`}>
          {isEn ? `EXPLORE ${cat.enName.toUpperCase()} →` : `EXPLORAR ${cat.name.toUpperCase()} →`}
        </span>
      </div>
    </Link>
  );
}

function CategorySmallCard({ cat, isEn }: { cat: Category; isEn: boolean }) {
  const Icon = cat.icon;
  const catHref = isEn ? `/en/calculators/${EN_CATEGORY_SLUGS[cat.id]}` : `/calculadoras/${cat.id}`;
  const bg   = CAT_BG[cat.id]   ?? "bg-gray-50 border-gray-200";
  const link = CAT_LINK[cat.id] ?? "text-gray-600";

  return (
    <Link href={catHref}>
      <div className={`rounded-2xl border p-5 hover:shadow-md transition-all cursor-pointer group h-full ${bg}`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${cat.color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
          {isEn ? cat.enName : cat.name}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-xs mb-4 leading-relaxed line-clamp-2">
          {isEn ? cat.enDescription : cat.description}
        </p>
        <span className={`text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all ${link}`}>
          {isEn ? "EXPLORE →" : "EXPLORAR →"}
        </span>
      </div>
    </Link>
  );
}

function MockInput({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{label}</span>
      <div className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200">
        {value}
      </div>
    </div>
  );
}

function PopularCard({ calc, isEn, preview }: { calc: CalculatorMeta; isEn: boolean; preview: React.ReactNode }) {
  const href  = isEn ? enCalcPath(calc) : calcPath(calc);
  const title = isEn ? calc.enTitle : calc.title;
  const badge = CAT_BADGE[calc.category] ?? "text-gray-600 bg-gray-100";
  const catLabels: Record<string, { es: string; en: string }> = {
    finanzas:  { es: "FINANZAS", en: "FINANCE"   },
    hogar:     { es: "HOGAR",    en: "HOME"       },
    trabajo:   { es: "TRABAJO",  en: "WORK"       },
    educacion: { es: "EDUCACIÓN",en: "EDUCATION"  },
    salud:     { es: "SALUD",    en: "HEALTH"     },
  };
  const label = isEn ? catLabels[calc.category]?.en : catLabels[calc.category]?.es;

  return (
    <Link href={href}>
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer h-full flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${badge}`}>{label}</span>
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white text-base mb-4">{title}</h3>
        <div className="flex-1 space-y-2">{preview}</div>
      </div>
    </Link>
  );
}

export default function Home() {
  const locale = useLocale();
  const isEn = locale === "en";
  const [query, setQuery]   = useState("");
  const [recent, setRecent] = useState<CalculatorMeta[]>([]);

  useEffect(() => { setRecent(getRecentCalcs()); }, []);

  const normalized    = query.toLowerCase().trim();
  const searchResults = normalized
    ? CALCULATORS.filter((c) =>
        (isEn ? c.enTitle : c.title).toLowerCase().includes(normalized) ||
        (isEn ? c.enDescription : c.description).toLowerCase().includes(normalized) ||
        (isEn ? c.enShortLabel : c.shortLabel).toLowerCase().includes(normalized))
    : [];
  const isSearching = normalized.length > 0;

  const finanzas  = CATEGORIES.find((c) => c.id === "finanzas")!;
  const salud     = CATEGORIES.find((c) => c.id === "salud")!;
  const educacion = CATEGORIES.find((c) => c.id === "educacion")!;
  const trabajo   = CATEGORIES.find((c) => c.id === "trabajo")!;
  const hogar     = CATEGORIES.find((c) => c.id === "hogar")!;

  const hipoteca = CALCULATORS.find((c) => c.slug === "hipoteca")!;
  const irpf     = CALCULATORS.find((c) => c.slug === "irpf")!;
  const imc      = CALCULATORS.find((c) => c.slug === "imc")!;

  const hipotecaPreview = (
    <>
      <MockInput label={isEn ? "Amount" : "Importe"} value="250.000 €" />
      <MockInput label={isEn ? "Rate" : "TIN"} value="3,2%" />
      <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">
          {isEn ? "Monthly payment" : "Cuota mensual"}
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">1.081,25 €</div>
      </div>
    </>
  );

  const irpfPreview = (
    <>
      <MockInput label={isEn ? "Gross" : "Bruto anual"} value="45.000 €" />
      <MockInput label={isEn ? "Region" : "Comunidad"} value="Madrid" />
      <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-end">
        <div>
          <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">
            {isEn ? "Net monthly" : "Neto mensual"}
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">2.845,50 €</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">
            {isEn ? "Retention" : "Retención"}
          </div>
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">21,4%</div>
        </div>
      </div>
    </>
  );

  const imcPreview = (
    <div className="space-y-3">
      <div className="flex justify-center py-1">
        <div className="w-20 h-20 rounded-full border-4 border-teal-200 dark:border-teal-800 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">23.4</div>
            <div className="text-[9px] text-gray-400 font-medium">{isEn ? "Normal" : "Normal"}</div>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-8 text-center">
        <div>
          <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{isEn ? "Weight" : "Peso"}</div>
          <div className="font-bold text-gray-800 dark:text-gray-200 text-sm">74 kg</div>
        </div>
        <div>
          <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{isEn ? "Height" : "Altura"}</div>
          <div className="font-bold text-gray-800 dark:text-gray-200 text-sm">178 cm</div>
        </div>
      </div>
    </div>
  );

  return (
    // Break out of layout's container padding to achieve full-bleed sections
    <div className="-mx-4 -mt-8 -mb-8">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-gray-50 dark:bg-gray-950 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold tracking-wide">
            🔢 {isEn ? "OVER 25 FREE CALCULATORS" : "MÁS DE 25 CALCULADORAS GRATUITAS"}
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
            {isEn
              ? <><span className="text-gradient">Precision</span> in Every Calculation.<br />Confidence in Every Decision.</>
              : <>Calcula con <span className="text-gradient">Precisión</span>.<br />Decide con Confianza.</>}
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {isEn
              ? "Free tools for finance, home, work, education and health. Fast results, no registration."
              : "Herramientas gratuitas para finanzas, hogar, trabajo, educación y salud. Sin registro."}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <Link href={isEn ? `/en/calculators/${EN_CATEGORY_SLUGS["finanzas"]}` : "/calculadoras/finanzas"}>
              <div className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors cursor-pointer shadow-sm">
                {isEn ? "Explore Directory" : "Explorar Calculadoras"} <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
            <Link href={isEn ? "/en/blog" : "/blog"}>
              <div className="inline-flex items-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 px-6 py-3 rounded-xl font-semibold transition-colors cursor-pointer">
                {isEn ? "Read the Blog" : "Ver el Blog"}
              </div>
            </Link>
          </div>

          {/* Search */}
          <div className="relative max-w-lg mx-auto pt-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="search"
              placeholder={isEn ? "Search a calculator…" : "Busca una calculadora…"}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm shadow-sm transition-all"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Search results ──────────────────────────────────────── */}
      {isSearching && (
        <section className="bg-white dark:bg-gray-900 py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {searchResults.length} {isEn ? (searchResults.length === 1 ? "result" : "results") : (searchResults.length === 1 ? "resultado" : "resultados")}{" "}
              {isEn ? "for" : "para"} <span className="font-semibold text-gray-900 dark:text-white">"{query}"</span>
            </p>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {searchResults.map((calc) => <CalculatorCard key={calcPath(calc)} calc={calc} />)}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-16">
                {isEn ? `No calculators found for "${query}"` : `No se encontraron calculadoras para "${query}"`}
              </p>
            )}
          </div>
        </section>
      )}

      {!isSearching && (
        <>
          {/* ── Recent ──────────────────────────────────────────── */}
          {recent.length > 0 && (
            <section className="bg-white dark:bg-gray-900 py-6 px-4 border-b border-gray-100 dark:border-gray-800">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    {isEn ? "Recently used" : "Usadas recientemente"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recent.slice(0, 6).map((calc) => (
                    <Link key={calc.slug} href={isEn ? enCalcPath(calc) : calcPath(calc)}>
                      <span className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600 transition-colors cursor-pointer">
                        {isEn ? calc.enShortLabel : calc.shortLabel}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── Tools Directory ─────────────────────────────────── */}
          <section className="bg-white dark:bg-gray-900 py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isEn ? "Tools Directory" : "Directorio de Calculadoras"}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {isEn ? "Browse our comprehensive collection of calculators."
                           : "Explora todas nuestras calculadoras por categoría."}
                  </p>
                </div>
                <Link href={isEn ? "/en" : "/"}>
                  <span className="hidden sm:flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                    {isEn ? "View All Categories" : "Ver todas"} <ChevronRight className="w-4 h-4" />
                  </span>
                </Link>
              </div>

              {/* Row 1: finanzas (big) + salud & educacion (stacked) */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
                <div className="lg:col-span-3">
                  <CategoryFeaturedCard cat={finanzas} isEn={isEn} />
                </div>
                <div className="lg:col-span-2 flex flex-col gap-4">
                  <CategorySmallCard cat={salud} isEn={isEn} />
                  <CategorySmallCard cat={educacion} isEn={isEn} />
                </div>
              </div>

              {/* Row 2: trabajo + hogar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CategorySmallCard cat={trabajo} isEn={isEn} />
                <CategorySmallCard cat={hogar} isEn={isEn} />
              </div>
            </div>
          </section>

          {/* ── Popular This Week ────────────────────────────────── */}
          <section className="bg-gray-50 dark:bg-gray-950 py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isEn ? "Popular This Week" : "Más Populares"}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  {isEn ? "Fast, precise calculators — no loading screens, just results."
                         : "Calculadoras rápidas y precisas. Sin pantallas de carga, solo resultados."}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PopularCard calc={hipoteca} isEn={isEn} preview={hipotecaPreview} />
                <PopularCard calc={irpf}     isEn={isEn} preview={irpfPreview} />
                <PopularCard calc={imc}      isEn={isEn} preview={imcPreview} />
              </div>
            </div>
          </section>

          {/* Ad */}
          <div className="bg-white dark:bg-gray-900 px-4 py-6">
            <div className="max-w-6xl mx-auto">
              <AdUnit slot={AD_SLOTS.midContent} />
            </div>
          </div>

          {/* ── Newsletter CTA ───────────────────────────────────── */}
          <section className="bg-[#0F1E3C] py-20 px-4 text-center">
            <div className="max-w-xl mx-auto space-y-5">
              <h2 className="text-3xl font-extrabold text-white">
                {isEn ? "Stay Ahead of the Numbers" : "Mantente al Día con los Números"}
              </h2>
              <p className="text-blue-300 text-sm leading-relaxed">
                {isEn
                  ? "Monthly precision guides, tool updates, and economic insights. No spam, just math."
                  : "Guías mensuales, actualizaciones de herramientas y análisis económico. Sin spam, solo datos."}
              </p>
              <div className="flex gap-2 max-w-sm mx-auto">
                <input
                  type="email"
                  placeholder={isEn ? "Enter your email" : "Tu correo electrónico"}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-blue-300/60 focus:outline-none focus:border-blue-400 text-sm"
                />
                <button className="bg-blue-500 hover:bg-blue-400 text-white px-5 py-3 rounded-xl font-semibold transition-colors text-sm whitespace-nowrap">
                  {isEn ? "Join" : "Suscribirme"}
                </button>
              </div>
              <p className="text-blue-400/60 text-xs">
                {isEn ? "JOIN 5,000+ PROFESSIONALS & STUDENTS" : "ÚNETE A MÁS DE 5.000 USUARIOS"}
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
