import type { ComponentType } from "react";
import { EN_TO_ES_CATEGORY, getCalculatorByEnSlug } from "@/lib/calculators";

/** Each calculator lives in its own chunk, so a page only downloads the code
 * of the tool it shows instead of all thirty (and recharts only travels with
 * the calculators that draw charts).
 *
 * Three callers resolve these chunks before rendering, because renderToString
 * is synchronous and a component that is still loading renders as nothing:
 * - the prerenderer awaits preloadAllCalculators() (see entry-server.tsx);
 * - the client entry awaits preloadCalculatorForPath() for the landing URL, so
 *   the prerendered page is not blanked while the chunk arrives (main.tsx);
 * - calculator-page.tsx loads the chunk on demand for in-app navigation.
 *
 * Importing a calculator module also runs its registerFaq() call, which is what
 * getFaqJsonLd() reads. That is another reason the page must not build its
 * JSON-LD before the module is loaded. */
type Loader = () => Promise<{ default: ComponentType }>;

/** Keyed by "categoria/slug" with the Spanish slug, like the rest of the code.
 * The file name travels with each import so the prerenderer can find the chunk
 * in Vite's manifest and preload it (see calculatorSourceFile). Keep both in
 * the same row: that is what stops them drifting apart. */
const CALCULATOR_CHUNKS: Record<string, [file: string, load: Loader]> = {
  "finanzas/hipoteca": ["hipoteca-avanzada", () => import("@/pages/hipoteca-avanzada")],
  "finanzas/prestamo-personal": ["prestamo-personal", () => import("@/pages/prestamo-personal")],
  "finanzas/porcentajes": ["porcentajes", () => import("@/pages/porcentajes")],
  "finanzas/iva": ["iva", () => import("@/pages/iva")],
  "finanzas/irpf": ["irpf", () => import("@/pages/irpf")],
  "finanzas/interes-compuesto": ["interes-compuesto", () => import("@/pages/interes-compuesto")],
  "finanzas/salario-neto": ["salario-neto", () => import("@/pages/salario-neto")],
  "finanzas/alquiler-vs-compra": ["alquiler-vs-compra", () => import("@/pages/alquiler-vs-compra")],
  "finanzas/amortizacion-anticipada": ["amortizacion-anticipada", () => import("@/pages/amortizacion-anticipada")],
  "finanzas/tae": ["tae", () => import("@/pages/tae")],
  "hogar/gasto-coche": ["gasto-coche", () => import("@/pages/gasto-coche")],
  "hogar/consumo-electrico": ["consumo-electrico", () => import("@/pages/consumo-electrico")],
  "hogar/reforma-hogar": ["reforma-hogar", () => import("@/pages/reforma-hogar")],
  "trabajo/finiquito": ["finiquito", () => import("@/pages/finiquito")],
  "trabajo/letra-dni": ["letra-dni", () => import("@/pages/letra-dni")],
  "trabajo/autonomos": ["autonomos", () => import("@/pages/autonomos")],
  "trabajo/dias-entre-fechas": ["dias-entre-fechas", () => import("@/pages/dias-entre-fechas")],
  "trabajo/horas-trabajadas": ["horas-trabajadas", () => import("@/pages/horas-trabajadas")],
  "trabajo/paro": ["paro", () => import("@/pages/paro")],
  "trabajo/pension": ["pension", () => import("@/pages/pension")],
  "educacion/pitagoras": ["pitagoras", () => import("@/pages/pitagoras")],
  "educacion/regla-de-tres": ["regla-de-tres", () => import("@/pages/regla-de-tres")],
  "educacion/nota-media": ["nota-media", () => import("@/pages/nota-media")],
  "educacion/mru": ["mru", () => import("@/pages/mru")],
  "educacion/mrua": ["mrua", () => import("@/pages/mrua")],
  "educacion/conversor-unidades": ["conversor-unidades", () => import("@/pages/conversor-unidades")],
  "salud/imc": ["imc", () => import("@/pages/imc")],
  "salud/calorias": ["calorias", () => import("@/pages/calorias")],
  "salud/frecuencia-cardiaca": ["frecuencia-cardiaca", () => import("@/pages/frecuencia-cardiaca")],
  "salud/agua-diaria": ["agua-diaria", () => import("@/pages/agua-diaria")],
};

const LOADERS: Record<string, Loader> = Object.fromEntries(
  Object.entries(CALCULATOR_CHUNKS).map(([key, [, load]]) => [key, load]),
);

const loaded = new Map<string, ComponentType>();
const pending = new Map<string, Promise<ComponentType | undefined>>();

export function hasCalculator(key: string): boolean {
  return key in LOADERS;
}

/** The component if its chunk has already been resolved, else undefined. */
export function getLoadedCalculator(key: string): ComponentType | undefined {
  return loaded.get(key);
}

export function loadCalculator(key: string): Promise<ComponentType | undefined> {
  const done = loaded.get(key);
  if (done) return Promise.resolve(done);
  const inFlight = pending.get(key);
  if (inFlight) return inFlight;
  const loader = LOADERS[key];
  if (!loader) return Promise.resolve(undefined);
  const p = loader().then((m) => {
    loaded.set(key, m.default);
    pending.delete(key);
    return m.default;
  });
  pending.set(key, p);
  return p;
}

export async function preloadAllCalculators(): Promise<void> {
  await Promise.all(Object.keys(LOADERS).map(loadCalculator));
}

/** "categoria/slug" (Spanish slug) for a calculator URL in either locale. */
export function calculatorKeyFromPath(pathname: string): string | undefined {
  const es = pathname.match(/^\/calculadoras\/([^/]+)\/([^/]+)/);
  if (es) return `${es[1]}/${es[2]}`;
  const en = pathname.match(/^\/en\/calculators\/([^/]+)\/([^/]+)/);
  if (en) {
    const cat = EN_TO_ES_CATEGORY[en[1]];
    const calc = cat ? getCalculatorByEnSlug(cat, en[2]) : undefined;
    if (calc) return `${calc.category}/${calc.slug}`;
  }
  return undefined;
}

export async function preloadCalculatorForPath(pathname: string): Promise<void> {
  const key = calculatorKeyFromPath(pathname);
  if (key) await loadCalculator(key);
}

/** Source path of a calculator's module, as Vite's manifest keys it. */
export function calculatorSourceFile(key: string): string | undefined {
  const row = CALCULATOR_CHUNKS[key];
  return row ? `src/pages/${row[0]}.tsx` : undefined;
}
