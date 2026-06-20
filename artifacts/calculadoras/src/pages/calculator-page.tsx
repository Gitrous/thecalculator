import { useEffect } from "react";
import { Link, useParams } from "wouter";
import type { ComponentType } from "react";
import { ChevronRight, ArrowRight } from "lucide-react";
import {
  getCalculator,
  getCategory,
  getCalculatorsByCategory,
  type CategoryId,
  EN_TO_ES_CATEGORY,
  EN_CATEGORY_SLUGS,
  calcPath,
  enCalcPath,
} from "@/lib/calculators";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { Seo } from "@/components/seo";
import NotFound from "@/pages/not-found";
import { useLocale } from "@/lib/locale";

import HipotecaAvanzada from "@/pages/hipoteca-avanzada";
import PrestamoPersonal from "@/pages/prestamo-personal";
import Porcentajes from "@/pages/porcentajes";
import Iva from "@/pages/iva";
import IRPF from "@/pages/irpf";
import InteresCompuesto from "@/pages/interes-compuesto";
import SalarioNeto from "@/pages/salario-neto";
import AlquilerVsCompra from "@/pages/alquiler-vs-compra";
import GastoCoche from "@/pages/gasto-coche";
import ConsumoElectrico from "@/pages/consumo-electrico";
import Finiquito from "@/pages/finiquito";
import LetraDni from "@/pages/letra-dni";
import Autonomos from "@/pages/autonomos";
import DiasEntreFechas from "@/pages/dias-entre-fechas";
import HorasTrabajadas from "@/pages/horas-trabajadas";
import ReglaDeTres from "@/pages/regla-de-tres";
import NotaMedia from "@/pages/nota-media";
import MRU from "@/pages/mru";
import MRUA from "@/pages/mrua";
import ConversorUnidades from "@/pages/conversor-unidades";
import Pitagoras from "@/pages/pitagoras";
import Imc from "@/pages/imc";
import Calorias from "@/pages/calorias";
import AmortizacionAnticipada from "@/pages/amortizacion-anticipada";
import Tae from "@/pages/tae";
import Paro from "@/pages/paro";
import Pension from "@/pages/pension";

const CATEGORY_APP_TYPE: Record<CategoryId, string> = {
  finanzas: "FinanceApplication",
  hogar: "UtilitiesApplication",
  trabajo: "BusinessApplication",
  educacion: "EducationApplication",
  salud: "HealthApplication",
};

/** Maps "categoria/slug" to the page component implementing the calculator. */
const REGISTRY: Record<string, ComponentType> = {
  "finanzas/hipoteca": HipotecaAvanzada,
  "finanzas/prestamo-personal": PrestamoPersonal,
  "finanzas/porcentajes": Porcentajes,
  "finanzas/iva": Iva,
  "finanzas/irpf": IRPF,
  "finanzas/interes-compuesto": InteresCompuesto,
  "finanzas/salario-neto": SalarioNeto,
  "finanzas/alquiler-vs-compra": AlquilerVsCompra,
  "hogar/gasto-coche": GastoCoche,
  "hogar/consumo-electrico": ConsumoElectrico,
  "trabajo/finiquito": Finiquito,
  "trabajo/letra-dni": LetraDni,
  "trabajo/autonomos": Autonomos,
  "trabajo/dias-entre-fechas": DiasEntreFechas,
  "trabajo/horas-trabajadas": HorasTrabajadas,
  "educacion/pitagoras": Pitagoras,
  "educacion/regla-de-tres": ReglaDeTres,
  "educacion/nota-media": NotaMedia,
  "educacion/mru": MRU,
  "educacion/mrua": MRUA,
  "educacion/conversor-unidades": ConversorUnidades,
  "salud/imc": Imc,
  "salud/calorias": Calorias,
  "finanzas/amortizacion-anticipada": AmortizacionAnticipada,
  "finanzas/tae": Tae,
  "trabajo/paro": Paro,
  "trabajo/pension": Pension,
};

export default function CalculatorPage() {
  const { categoria = "", slug = "" } = useParams();
  const locale = useLocale();
  const isEn = locale === "en";

  // Resolve the Spanish category ID whether we came from /en/ or /calculadoras/
  const categoryId: string = isEn
    ? (EN_TO_ES_CATEGORY[categoria] ?? categoria)
    : categoria;

  const calc = getCalculator(categoryId, slug);
  const category = getCategory(categoryId);
  const Component = REGISTRY[`${categoryId}/${slug}`];

  useEffect(() => {
    if (!calc) return;
    try {
      const key = `${categoryId}/${slug}`;
      const current: string[] = JSON.parse(localStorage.getItem("calc_recent") ?? "[]");
      const updated = [key, ...current.filter((k) => k !== key)].slice(0, 5);
      localStorage.setItem("calc_recent", JSON.stringify(updated));
    } catch {}
  }, [categoryId, slug, calc]);

  if (!calc || !category || !Component) return <NotFound />;

  const seoTitle = isEn ? calc.enSeoTitle : calc.seoTitle;
  const seoDescription = isEn ? calc.enSeoDescription : calc.seoDescription;
  const seoPath = isEn ? enCalcPath(calc) : calcPath(calc);
  const alternatePath = isEn ? calcPath(calc) : enCalcPath(calc);
  const categoryName = isEn ? category.enName : category.name;
  const shortLabel = isEn ? calc.enShortLabel : calc.shortLabel;
  const homeHref = isEn ? "/en" : "/";
  const homeLabel = isEn ? "Home" : "Inicio";
  const categoryHref = isEn
    ? `/en/calculators/${EN_CATEGORY_SLUGS[category.id]}`
    : `/calculadoras/${category.id}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: seoTitle,
    url: `https://thecalculator.tech${seoPath}`,
    description: seoDescription,
    applicationCategory: CATEGORY_APP_TYPE[category.id as CategoryId],
    operatingSystem: "Web",
    inLanguage: isEn ? "en" : "es",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Seo
        title={seoTitle}
        description={seoDescription}
        path={seoPath}
        jsonLd={jsonLd}
        alternatePath={alternatePath}
      />

      <nav className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href={homeHref} className="hover:text-primary transition-colors">
          {homeLabel}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link
          href={categoryHref}
          className="hover:text-primary transition-colors"
        >
          {categoryName}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 dark:text-gray-200">{shortLabel}</span>
      </nav>

      {/* Category chip */}
      {(() => {
        const CatIcon = category.icon;
        return (
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4 ${category.color}`}>
            <CatIcon className="w-3.5 h-3.5" />
            {isEn ? category.enName : category.name}
          </div>
        );
      })()}

      <Component />
      <AdUnit slot={AD_SLOTS.afterResult} className="mt-10" />

      {/* Related calculators */}
      {(() => {
        const siblings = getCalculatorsByCategory(categoryId).filter((c) => c.slug !== slug).slice(0, 5);
        if (siblings.length === 0) return null;
        const label = isEn
          ? `Other ${category.enName} calculators`
          : `Otras calculadoras de ${category.name.toLowerCase()}`;
        const seeAllLabel = isEn ? "See all" : "Ver todas";
        const catHref = isEn
          ? `/en/calculators/${EN_CATEGORY_SLUGS[category.id]}`
          : `/calculadoras/${category.id}`;
        return (
          <section className="mt-12 pt-8 border-t border-gray-200 dark:border-white/10">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">{label}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {siblings.map((c) => {
                const href = isEn ? enCalcPath(c) : calcPath(c);
                const title = isEn ? c.enShortLabel : c.shortLabel;
                const desc = isEn ? c.enDescription : c.description;
                const CalcIcon = c.icon;
                return (
                  <Link
                    key={c.slug}
                    href={href}
                    className="flex flex-col gap-3 p-5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-primary/50 dark:hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${category.color}`}>
                      <CalcIcon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{title}</span>
                      <span className="text-xs text-gray-500 dark:text-white/50 line-clamp-2">{desc}</span>
                    </div>
                  </Link>
                );
              })}
              {/* Ver todas */}
              <Link
                href={catHref}
                className="flex flex-col items-center justify-center gap-3 p-5 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-white/10 group-hover:bg-primary/10 transition-colors">
                  <ArrowRight className="w-5 h-5 text-gray-400 dark:text-white/40 group-hover:text-primary transition-colors" />
                </div>
                <span className="text-sm font-semibold text-gray-500 dark:text-white/40 group-hover:text-primary transition-colors">
                  {seeAllLabel}
                </span>
              </Link>
            </div>
          </section>
        );
      })()}
    </div>
  );
}
