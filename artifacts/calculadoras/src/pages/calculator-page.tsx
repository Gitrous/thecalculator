import { Link, useParams } from "wouter";
import type { ComponentType } from "react";
import { ChevronRight } from "lucide-react";
import { getCalculator, getCategory, type CategoryId } from "@/lib/calculators";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { Seo } from "@/components/seo";
import NotFound from "@/pages/not-found";

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
  const calc = getCalculator(categoria, slug);
  const category = getCategory(categoria);
  const Component = REGISTRY[`${categoria}/${slug}`];

  if (!calc || !category || !Component) return <NotFound />;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: calc.seoTitle,
    url: `https://thecalculator.tech/calculadoras/${categoria}/${slug}`,
    description: calc.seoDescription,
    applicationCategory: CATEGORY_APP_TYPE[category.id as CategoryId],
    operatingSystem: "Web",
    inLanguage: "es",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Seo
        title={calc.seoTitle}
        description={calc.seoDescription}
        path={`/calculadoras/${categoria}/${slug}`}
        jsonLd={jsonLd}
      />

      <nav className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          Inicio
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link
          href={`/calculadoras/${category.id}`}
          className="hover:text-primary transition-colors"
        >
          {category.name}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 dark:text-gray-200">{calc.shortLabel}</span>
      </nav>

      <Component />
      <AdUnit slot={AD_SLOTS.afterResult} className="mt-10" />
    </div>
  );
}
