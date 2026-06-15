import { useState } from "react";
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

function getPorcentaje(anios: number): number {
  if (anios < 15) return 0;
  let pct = 50;
  const extra1 = Math.min(Math.max(anios - 15, 0), 10) * 2.52;
  const extra2 = Math.min(Math.max(anios - 25, 0), 12) * 2.28;
  pct += extra1 + extra2;
  return Math.min(pct, 100);
}

const PENSION_MAX = 3359.6;
const PENSION_MIN_65 = 936.2;

const T = {
  es: {
    title: "Calculadora de Pensión de Jubilación 2026",
    subtitle: "Estima tu pensión mensual de jubilación según los años cotizados y tu base reguladora. Calculadora orientativa basada en el sistema español.",
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
  },
  en: {
    title: "Spanish Retirement Pension Calculator 2026",
    subtitle: "Estimate your monthly retirement pension based on years contributed and your regulatory base. Indicative calculator based on the Spanish pension system.",
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
  },
};

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

  const aniosFull = 36.5;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Landmark className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
      </div>
      <p className="text-muted-foreground mb-8">{t.subtitle}</p>

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
        </Accordion>
      </section>
    </div>
  );
}
