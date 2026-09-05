import { useState } from "react";
import { ReviewedNote } from "@/components/reviewed-note";
import { registerFaq } from "@/lib/faq-schema";
import { Landmark } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { useLocale } from "@/lib/locale";

function eur(n: number) {
  return n.toLocaleString("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });
}

/**
 * Escala del art. 210.1 LGSS: 50 % por los primeros 15 años cotizados y, a
 * partir del año 16, un 0,19 % por cada mes entre el 1 y el 248, y un 0,18 %
 * por cada mes posterior. Con esta escala el 100 % se alcanza justo a los
 * 37 años (264 meses sobre el mínimo). En 2026 la disposición transitoria
 * novena permite llegar al 100 % algo antes (36 años y 6 meses), por lo que
 * esta estimación es ligeramente conservadora para ese caso.
 */
const ANIOS_MINIMOS = 15;
const MESES_TRAMO_1 = 248; // meses al 0,19 %
const PCT_TRAMO_1 = 0.19;
const PCT_TRAMO_2 = 0.18;

function getPorcentaje(anios: number): number {
  if (anios < ANIOS_MINIMOS) return 0;
  const mesesExtra = (anios - ANIOS_MINIMOS) * 12;
  const tramo1 = Math.min(mesesExtra, MESES_TRAMO_1) * PCT_TRAMO_1;
  const tramo2 = Math.max(mesesExtra - MESES_TRAMO_1, 0) * PCT_TRAMO_2;
  return Math.min(50 + tramo1 + tramo2, 100);
}

/** Años cotizados necesarios para alcanzar el 100 % con la escala anterior. */
const ANIOS_PENSION_COMPLETA = 37;

const PENSION_MAX = 3359.6;
const PENSION_MIN_65 = 936.2;

const T = {
  es: {
    title: "Calculadora de Pensión de Jubilación 2026",
    subtitle: "Estima tu pensión mensual de jubilación según los años cotizados y tu base reguladora. Calculadora orientativa basada en el sistema español.",
    intro1: "La pensión contributiva de jubilación en España es el pilar del sistema público de previsión social para la vejez. Su cálculo depende de dos factores clave: el número de años cotizados (que determina el porcentaje de la base reguladora) y la base reguladora en sí, que en el régimen general vigente se obtiene a partir de la media de las bases de cotización de los últimos 25 años, un periodo de cómputo que las reformas han ido ampliando y que convive con reglas transitorias y opciones de descarte de los peores meses. A más años cotizados y mayor salario histórico, mayor pensión.",
    intro2: "Esta calculadora te permite estimar la pensión mensual bruta aproximada según tus años de cotización y tu base reguladora media. También te muestra cuántos años te faltan para alcanzar el 100% de la prestación y te compara con la pensión máxima y mínima vigentes en 2026. El resultado es orientativo pero útil para planificar el ahorro para la jubilación.",
    disclaimer: "Estimación orientativa. La pensión real la calcula la Seguridad Social con tus bases de cotización históricas exactas. Consulta tu informe de vida laboral.",
    cardTitle: "Tus datos",
    yearsLabel: "Años cotizados",
    baseLabel: "Base reguladora mensual (€)",
    baseNote: "(media últimos 25 años)",
    warning15: (<>Necesitas al menos <strong>15 años cotizados</strong> para acceder a la pensión contributiva de jubilación.</>),
    pctLabel: "Porcentaje aplicado",
    monthlyLabel: "Pensión mensual bruta",
    payments14: "14 pagas/año",
    annualLabel: "Pensión anual bruta",
    toFullLabel: "Para el 100% faltan",
    complete: "¡Completo!",
    yearsNeeded: (n: number) => `${n} años`,
    progressTitle: "Progreso hacia la pensión completa",
    progressReached: (pct: string) => `${pct}% alcanzado`,
    maxPension: "Pensión máxima (2026)",
    minPension: "Pensión mínima (≥ 65 años)",
    note: (<><strong>Nota:</strong> Esta es una estimación orientativa. La pensión real depende de las bases de cotización año a año (media de los últimos 300 meses), la edad de jubilación, posibles coeficientes reductores por jubilación anticipada y la normativa vigente en el momento del retiro.</>),
    faqTitle: "Preguntas frecuentes",
    q1: "¿A qué edad me puedo jubilar en España?",
    a1: (<>La edad ordinaria en 2026 es <strong>65 años</strong> si tienes 38 años y 3 meses o más cotizados, o <strong>66 años y 10 meses</strong> si cotizaste menos. Esta edad aumentará hasta 67 años en 2027. Existe jubilación anticipada voluntaria (2 años antes) e involuntaria (4 años antes) con coeficientes reductores.</>),
    q2: "¿Qué es la base reguladora?",
    a2: "Es la media de las bases de cotización de los últimos 25 años (300 mensualidades), actualizadas por el IPC excepto los 24 meses anteriores a la jubilación. Cuanto más alta sea tu base de cotización histórica, mayor será tu pensión.",
    q3: "¿Los autónomos tienen la misma pensión?",
    a3: "Los autónomos cotizan por la base elegida dentro de los tramos del RETA. Históricamente cotizaban por la mínima, lo que generaba pensiones bajas. Desde 2023 rige un sistema de cotización por ingresos reales (con tramos que se revisan cada año, también en 2026), que acerca la cotización a los ingresos reales y mejora la futura pensión de los nuevos autónomos.",
    q4: "¿Cuántos años hay que cotizar para cobrar el 100 %?",
    a4: "Con la escala general del artículo 210 de la Ley General de la Seguridad Social se necesitan 37 años de cotización para percibir el 100 % de la base reguladora, y es la que aplica esta calculadora. Durante los años de transición la disposición transitoria novena permite alcanzarlo algo antes —en 2026, con 36 años y 6 meses—, de modo que si estás cerca de ese umbral conviene contrastar tu caso con el simulador oficial. Con el mínimo de 15 años cotizados solo se accede al 50 % de la base. Entre ambos extremos la escala es progresiva: los primeros años tras el mínimo aportan un porcentaje mayor que los últimos, de modo que cotizar de 15 a 20 años sube bastante más el porcentaje que cotizar de 30 a 35. Además, al menos 2 de esos 15 años deben estar comprendidos dentro de los 15 anteriores a la jubilación.",
    q5: "¿Puedo jubilarme antes de la edad legal?",
    a5: "Sí, existen dos modalidades. La jubilación anticipada voluntaria permite adelantar hasta 2 años la edad ordinaria, siempre que se acrediten al menos 35 años cotizados, y aplica coeficientes reductores que oscilan aproximadamente entre el 2,81 % y el 21 % según los meses de adelanto y los años cotizados. La involuntaria, por causas ajenas al trabajador como un despido colectivo, permite adelantar hasta 4 años con 33 años cotizados y coeficientes algo más suaves. Conviene calcular bien el impacto: la reducción es vitalicia y se aplica sobre todas las pensiones futuras, no solo durante los años adelantados.",
    deepTitle: "Cómo se calcula la pensión de jubilación",
    deep: "El cálculo tiene dos componentes. El primero es la base reguladora, que se obtiene sumando las bases de cotización de los últimos años y dividiendo el resultado entre el número de meses correspondiente; el periodo de cómputo se ha ido ampliando con las sucesivas reformas hasta los 25 años, con la posibilidad de descartar los peores meses. El segundo componente es el porcentaje aplicable, que depende exclusivamente de los años cotizados según una escala progresiva: el 50 % con 15 años y, sumando un 0,19 % por cada mes cotizado de más hasta el mes 248 y un 0,18 % por los siguientes, el 100 % al alcanzar los 37 años. La pensión resultante es el producto de ambos y queda sujeta a un importe mínimo y a un tope máximo fijados anualmente.",
    exampleTitle: "Ejemplo resuelto",
    example: "Supongamos una base reguladora de 2.000 € mensuales y 30 años cotizados. Sobre el mínimo de 15 años hay 180 meses adicionales, que al 0,19 % suman 34,2 puntos: el porcentaje aplicable es del 84,2 %, de modo que la pensión sería 2.000 × 0,842 = 1.684 € mensuales en 14 pagas. Si esa misma persona cotizara 5 años más hasta alcanzar los 35, el porcentaje subiría al 95,6 % y la pensión pasaría a 1.912 €, es decir, 228 € más al mes. Ese cálculo es el que conviene hacer antes de decidir si compensa prolongar la vida laboral.",
    tableTitle: "Porcentaje de la base reguladora según años cotizados",
    tableCol1: "Años cotizados",
    tableCol2: "% de la base reguladora",
    interpretTitle: "Cómo interpretar el resultado",
    interpret: "La cifra obtenida es una estimación orientativa basada en la normativa vigente, que puede cambiar antes de tu jubilación. Ten presentes tres límites importantes. Primero, existe una pensión máxima fijada cada año, en torno a los 3.200 € mensuales, que actúa como tope aunque tu base reguladora sea superior. Segundo, la pensión tributa en el IRPF como rendimiento del trabajo, así que el importe neto que percibirás será menor que el bruto calculado. Y tercero, el cálculo asume que mantienes tus bases de cotización actuales hasta la jubilación: si tus ingresos varían de forma significativa, la base reguladora cambiará. Para un cálculo oficial, la Seguridad Social ofrece un simulador con tu vida laboral real.",
  },
  en: {
    title: "Spanish Retirement Pension Calculator 2026",
    subtitle: "Estimate your monthly retirement pension based on years contributed and your regulatory base. Indicative calculator based on the Spanish pension system.",
    intro1: "The contributory retirement pension in Spain is the pillar of the public social provision system for old age. Its calculation depends on two key factors: the number of years contributed (which determines the percentage of the regulatory base) and the regulatory base itself, which under the current general scheme is derived from the average of contribution bases over the last 25 years — a computation period that successive reforms have progressively extended and that coexists with transitional rules and options to discard the worst months. More years contributed and a higher historical salary mean a higher pension.",
    intro2: "This calculator lets you estimate the approximate gross monthly pension based on your years of contributions and your average regulatory base. It also shows how many more years you need to reach 100% of the benefit and compares it with the maximum and minimum pensions in force in 2026. The result is indicative but useful for planning retirement savings.",
    disclaimer: "Indicative estimate. The actual pension is calculated by Social Security using your exact historical contribution bases. Consult your Social Security contributions report.",
    cardTitle: "Your data",
    yearsLabel: "Years contributed",
    baseLabel: "Monthly regulatory base (€)",
    baseNote: "(average last 25 years)",
    warning15: (<>You need at least <strong>15 years of contributions</strong> to access the contributory retirement pension.</>),
    pctLabel: "Applied percentage",
    monthlyLabel: "Monthly gross pension",
    payments14: "14 payments/year",
    annualLabel: "Annual gross pension",
    toFullLabel: "To reach 100%",
    complete: "Complete!",
    yearsNeeded: (n: number) => `${n} years`,
    progressTitle: "Progress towards full pension",
    progressReached: (pct: string) => `${pct}% achieved`,
    maxPension: "Maximum pension (2026)",
    minPension: "Minimum pension (≥ 65 years)",
    note: (<><strong>Note:</strong> This is an indicative estimate. The actual pension depends on the contribution bases year by year (average of the last 300 months), the retirement age, possible reduction coefficients for early retirement and the regulations in force at the time of retirement.</>),
    faqTitle: "Frequently asked questions",
    q1: "At what age can I retire in Spain?",
    a1: (<>The ordinary age in 2026 is <strong>65 years</strong> if you have 38 years and 3 months or more contributed, or <strong>66 years and 10 months</strong> if you contributed less. This age will increase to 67 years in 2027. Voluntary early retirement (2 years before) and involuntary early retirement (4 years before) are available with reduction coefficients.</>),
    q2: "What is the regulatory base?",
    a2: "It is the average of the contribution bases over the last 25 years (300 monthly payments), updated by the CPI except for the 24 months prior to retirement. The higher your historical contribution base, the higher your pension.",
    q3: "Do the self-employed get the same pension?",
    a3: "The self-employed contribute on the chosen base within the RETA brackets. Historically they contributed at the minimum, which generated low pensions. Since 2023 a real-income contribution system has been in force (with brackets reviewed every year, including 2026), bringing contributions closer to real income and improving the future pension of new self-employed workers.",
    q4: "How many years must I contribute to get 100%?",
    a4: "Under the general scale of Article 210 of the Spanish Social Security Act you need 37 years of contributions to receive 100% of the regulatory base, and that is the scale this calculator applies. During the transitional years, the ninth transitional provision allows it to be reached slightly earlier — in 2026, with 36 years and 6 months — so if you are close to that threshold it is worth checking your case against the official simulator. With the minimum of 15 contributed years you only qualify for 50% of the base. Between those extremes the scale is progressive: the first years after the minimum add a larger percentage than the last ones, so contributing from 15 to 20 years raises the percentage considerably more than going from 30 to 35. In addition, at least 2 of those 15 years must fall within the 15 years preceding retirement.",
    q5: "Can I retire before the legal age?",
    a5: "Yes, there are two routes. Voluntary early retirement allows you to bring retirement forward by up to 2 years, provided you have at least 35 contributed years, and applies reduction coefficients ranging roughly between 2.81% and 21% depending on the months brought forward and years contributed. Involuntary early retirement, for reasons beyond the worker's control such as collective redundancy, allows up to 4 years early with 33 contributed years and somewhat gentler coefficients. It is worth calculating the impact carefully: the reduction is for life and applies to all future pension payments, not just the years brought forward.",
    deepTitle: "How the retirement pension is calculated",
    deep: "The calculation has two components. The first is the regulatory base, obtained by adding up the contribution bases of recent years and dividing by the corresponding number of months; the computation period has been progressively extended by successive reforms to 25 years, with the option of discarding the worst months. The second component is the applicable percentage, which depends exclusively on years contributed according to a progressive scale: 50% at 15 years and, adding 0.19% for each additional month contributed up to month 248 and 0.18% for those beyond, 100% on reaching 37 years. The resulting pension is the product of both and is subject to a minimum amount and a maximum cap set annually.",
    exampleTitle: "Worked example",
    example: "Take a regulatory base of €2,000 a month and 30 contributed years. Above the 15-year minimum there are 180 additional months, which at 0.19% add 34.2 points: the applicable percentage is 84.2%, so the pension would be 2,000 × 0.842 = €1,684 a month across 14 payments. If that same person contributed 5 more years to reach 35, the percentage would rise to 95.6% and the pension would become €1,912 — that is, €228 more per month. That is the calculation worth doing before deciding whether extending your working life pays off.",
    tableTitle: "Percentage of the regulatory base by years contributed",
    tableCol1: "Years contributed",
    tableCol2: "% of regulatory base",
    interpretTitle: "How to interpret the result",
    interpret: "The figure obtained is an indicative estimate based on current legislation, which may change before you retire. Keep three important limits in mind. First, there is a maximum pension set each year, around €3,200 a month, which acts as a cap even if your regulatory base is higher. Second, the pension is taxed as earned income, so the net amount you receive will be lower than the gross figure calculated. And third, the calculation assumes you maintain your current contribution bases until retirement: if your income changes significantly, the regulatory base will change too. For an official calculation, Social Security offers a simulator using your real contribution record.",
  },
};

// Derivada de getPorcentaje() para que tabla y cálculo no puedan divergir.
const PENSION_TABLE = [15, 20, 25, 30, 35, ANIOS_PENSION_COMPLETA].map((anios) => ({
  anios,
  es: `${anios} años`,
  en: `${anios} years`,
  pct: getPorcentaje(anios).toLocaleString("es-ES", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }) + " %",
}));

export default function Pension() {
  const locale = useLocale();
  const t = T[locale];

  const [anios, setAnios] = useState("35");
  const [baseReg, setBaseReg] = useState("2000");

  const a = parseFloat(anios) || 0;
  const b = parseFloat(baseReg) || 0;
  const valid = a >= 15 && b > 0;

  const porcentaje = getPorcentaje(a);
  const pensionBruta = Math.min((b * porcentaje) / 100, PENSION_MAX);
  const pensionAnual = pensionBruta * 14;

  const aniosFull = ANIOS_PENSION_COMPLETA;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Landmark className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
      </div>
      <p className="text-muted-foreground mb-2">{t.subtitle}</p>
      <ReviewedNote date="05/09/2026" sources={[{ label: "Seguridad Social", href: "https://sede.seg-social.gob.es/" }]} className="mb-6" />
      <div className="mb-6 rounded-lg border border-amber-300/60 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
        <p>
          {locale === "en"
            ? "Simplified simulation. The official pension depends on your actual contribution bases and personal circumstances."
            : "Simulación simplificada. La pensión oficial depende de tus bases reales de cotización y de tus circunstancias personales."}
        </p>
        <p>
          {locale === "en"
            ? "The calculation methodology may vary depending on your retirement year and the rules applicable at that time: the computation period, the transitional arrangements and the applicable percentages have been amended by successive reforms and are still being phased in."
            : "La metodología de cálculo puede variar según el año de jubilación y la normativa aplicable: el periodo de cómputo, los regímenes transitorios y los porcentajes aplicables han cambiado con las sucesivas reformas y siguen en despliegue progresivo."}
        </p>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none mb-8 space-y-3 text-gray-700 dark:text-gray-300">
        <p>{t.intro1}</p>
        <p>{t.intro2}</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t.cardTitle}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="anios">{t.yearsLabel}</Label>
            <Input id="anios" type="number" min={0} max={50} value={anios} onChange={(e) => setAnios(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="baseReg">
              {t.baseLabel}
              <span className="ml-1 text-xs text-muted-foreground">{t.baseNote}</span>
            </Label>
            <Input id="baseReg" type="number" value={baseReg} onChange={(e) => setBaseReg(e.target.value)} className="mt-1" />
          </div>
        </CardContent>
      </Card>

      {a > 0 && a < 15 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6 text-sm text-amber-800 dark:text-amber-300">
          {t.warning15}
        </div>
      )}

      {valid && (
        <>
          <Card className="border-primary/30 bg-primary/5 mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">{t.pctLabel}</p>
                  <p className="text-3xl font-bold">{porcentaje.toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.monthlyLabel}</p>
                  <p className="text-3xl font-bold text-primary">{eur(pensionBruta)}</p>
                  <p className="text-xs text-muted-foreground">{t.payments14}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.annualLabel}</p>
                  <p className="text-2xl font-bold">{eur(pensionAnual)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.toFullLabel}</p>
                  <p className="text-2xl font-bold">
                    {porcentaje >= 100 ? t.complete : t.yearsNeeded(Math.max(aniosFull - a, 0))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t.progressTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>0%</span>
                <span className="font-semibold text-foreground">{t.progressReached(porcentaje.toFixed(1))}</span>
                <span>100%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-primary h-4 rounded-full transition-all"
                  style={{ width: `${Math.min(porcentaje, 100)}%` }}
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between border-b py-1">
                  <span className="text-muted-foreground">{t.maxPension}</span>
                  <span className="font-medium">{eur(PENSION_MAX)}/mes</span>
                </div>
                <div className="flex justify-between border-b py-1">
                  <span className="text-muted-foreground">{t.minPension}</span>
                  <span className="font-medium">{eur(PENSION_MIN_65)}/mes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8 text-sm text-blue-800 dark:text-blue-300">
        {t.note}
      </div>

      <p className="text-xs text-muted-foreground italic mt-4 mb-2">{t.disclaimer}</p>

      <section className="mt-12 prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t.deepTitle}</h2>
        <p>{t.deep}</p>
        <h3 className="text-base font-semibold mt-6 mb-2 text-gray-900 dark:text-white">{t.exampleTitle}</h3>
        <p>{t.example}</p>
      </section>

      <div className="mt-8 overflow-x-auto">
        <h3 className="text-base font-semibold mb-3 text-gray-900 dark:text-white">{t.tableTitle}</h3>
        <table className="w-full text-sm border-collapse max-w-lg">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10 text-left text-gray-500 dark:text-white/50">
              <th className="py-2 pr-4 font-medium">{t.tableCol1}</th>
              <th className="py-2 font-medium">{t.tableCol2}</th>
            </tr>
          </thead>
          <tbody>
            {PENSION_TABLE.map((row) => (
              <tr key={row.es} className="border-b border-gray-100 dark:border-white/5">
                <td className="py-2 pr-4 text-gray-900 dark:text-white">{locale === "en" ? row.en : row.es}</td>
                <td className="py-2 font-semibold text-primary whitespace-nowrap">{row.pct}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-8 prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t.interpretTitle}</h2>
        <p>{t.interpret}</p>
      </section>

      <AdUnit slot={AD_SLOTS.midContent} className="my-10" />

      <section className="mt-4">
        <h2 className="text-xl font-semibold mb-4">{t.faqTitle}</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="q1">
            <AccordionTrigger>{t.q1}</AccordionTrigger>
            <AccordionContent>{t.a1}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>{t.q2}</AccordionTrigger>
            <AccordionContent>{t.a2}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>{t.q3}</AccordionTrigger>
            <AccordionContent>{t.a3}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="q4">
            <AccordionTrigger>{t.q4}</AccordionTrigger>
            <AccordionContent>{t.a4}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="q5">
            <AccordionTrigger>{t.q5}</AccordionTrigger>
            <AccordionContent>{t.a5}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}

registerFaq("trabajo/pension", T);
