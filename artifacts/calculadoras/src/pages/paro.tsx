import { useState } from "react";
import { Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

// IPREM mensual 2026 (congelado desde 2022, Ley 31/2022) (€/mes)
const IPREM = 600;

// Duración de la prestación según días cotizados
const DURACION_TABLE: { min: number; dias: number }[] = [
  { min: 360, dias: 120 },
  { min: 540, dias: 180 },
  { min: 720, dias: 240 },
  { min: 900, dias: 300 },
  { min: 1080, dias: 360 },
  { min: 1260, dias: 420 },
  { min: 1440, dias: 480 },
  { min: 1620, dias: 540 },
  { min: 1800, dias: 600 },
  { min: 1980, dias: 660 },
  { min: 2160, dias: 720 },
];

function getDuracion(diasCotizados: number): number {
  const row = [...DURACION_TABLE].reverse().find((r) => diasCotizados >= r.min);
  return row?.dias ?? 0;
}

const T = {
  es: {
    title: "Calculadora de Prestación por Desempleo (Paro) 2026",
    subtitle: "Calcula cuánto cobrarás de paro, durante cuánto tiempo y el total de la prestación según tu salario y los meses cotizados.",
    cardTitle: "Tus datos",
    salaryLabel: "Salario bruto mensual (€)",
    monthsLabel: "Meses cotizados (últimos 6 años)",
    childrenLabel: "Hijos a cargo",
    noChildren: "Sin hijos",
    oneChild: "1 hijo",
    twoChildren: "2 o más hijos",
    warning: (
      <>Necesitas al menos <strong>360 días cotizados</strong> (12 meses) en los últimos 6 años para tener derecho a la prestación contributiva.</>
    ),
    durationLabel: "Duración total",
    months: (n: number) => `(${n} meses)`,
    days: (n: number) => `${n} días`,
    first6Label: "Primeros 6 meses",
    pct70: "70% base reguladora",
    from7Label: "A partir del 7.º mes",
    pct50: "50% base reguladora",
    totalLabel: "Total estimado bruto",
    detailTitle: "Detalle del cálculo",
    baseReg: "Base reguladora",
    diasCotizados: "Días cotizados",
    maxApplicable: "Máximo aplicable",
    minApplicable: "Mínimo aplicable",
    breakdown: (m70: number, prest70: string, m50: number, prest50: string) =>
      `${m70} meses × ${prest70} + ${m50} meses × ${prest50}`,
    breakdownLabel: "Desglose temporal",
    note: (<><strong>Nota:</strong> Las cantidades son brutas. El SEPE descuenta las cotizaciones a la Seguridad Social (4,7%) y aplica retención de IRPF. La base reguladora real es la media de las bases de cotización por desempleo de los últimos 180 días.</>),
    faqTitle: "Preguntas frecuentes",
    q1: "¿Cuánto tiempo tengo para solicitar el paro?",
    a1: (<>Tienes <strong>15 días hábiles</strong> desde el día siguiente al de la situación legal de desempleo (fin de contrato, despido, etc.). Si lo solicitas después, pierdes días de prestación.</>),
    q2: "¿Qué es la base reguladora?",
    a2: "Es la media de las bases de cotización por desempleo de los últimos 180 días trabajados. Se calcula dividiendo el total cotizado en ese período entre 180. Para simplificar, esta calculadora usa el salario bruto mensual como aproximación.",
    q3: "¿Se puede cobrar el paro siendo autónomo?",
    a3: "Sí, desde 2019 los autónomos que hayan cotizado por cese de actividad pueden acceder a la prestación por desempleo. Los requisitos son distintos a los de los trabajadores por cuenta ajena.",
    q4: "¿Se puede cobrar el paro y trabajar a la vez?",
    a4: (<>En algunos casos sí, mediante la <strong>compatibilización</strong> del paro con un trabajo a tiempo parcial, o capitalizando el paro como autónomo. En general, un trabajo a jornada completa suspende o extingue la prestación.</>),
  },
  en: {
    title: "Spanish Unemployment Benefit Calculator 2026",
    subtitle: "Calculate how much unemployment benefit you will receive, for how long, and the total amount based on your salary and contributions.",
    cardTitle: "Your data",
    salaryLabel: "Monthly gross salary (€)",
    monthsLabel: "Months contributed (last 6 years)",
    childrenLabel: "Dependent children",
    noChildren: "No children",
    oneChild: "1 child",
    twoChildren: "2 or more children",
    warning: (
      <>You need at least <strong>360 contributed days</strong> (12 months) in the last 6 years to be entitled to contributory unemployment benefit.</>
    ),
    durationLabel: "Total duration",
    months: (n: number) => `(${n} months)`,
    days: (n: number) => `${n} days`,
    first6Label: "First 6 months",
    pct70: "70% regulatory base",
    from7Label: "From month 7",
    pct50: "50% regulatory base",
    totalLabel: "Estimated gross total",
    detailTitle: "Calculation details",
    baseReg: "Regulatory base",
    diasCotizados: "Days contributed",
    maxApplicable: "Maximum applicable",
    minApplicable: "Minimum applicable",
    breakdown: (m70: number, prest70: string, m50: number, prest50: string) =>
      `${m70} months × ${prest70} + ${m50} months × ${prest50}`,
    breakdownLabel: "Time breakdown",
    note: (<><strong>Note:</strong> Amounts are gross. The SEPE deducts Social Security contributions (4.7%) and applies income tax (IRPF) withholding. The actual regulatory base is the average of unemployment contribution bases over the last 180 days.</>),
    faqTitle: "Frequently asked questions",
    q1: "How long do I have to apply for unemployment benefit?",
    a1: (<>You have <strong>15 working days</strong> from the day after the legal unemployment situation (end of contract, dismissal, etc.). If you apply later, you lose benefit days.</>),
    q2: "What is the regulatory base?",
    a2: "It is the average of the unemployment contribution bases over the last 180 days worked. It is calculated by dividing the total contributed in that period by 180. For simplicity, this calculator uses the monthly gross salary as an approximation.",
    q3: "Can the self-employed receive unemployment benefit?",
    a3: "Yes, since 2019 the self-employed who have contributed for cessation of activity can access unemployment benefit. The requirements differ from those for employed workers.",
    q4: "Can I receive unemployment benefit and work at the same time?",
    a4: (<>In some cases yes, by <strong>combining</strong> benefits with part-time work, or by capitalising the benefit as a self-employed person. In general, full-time employment suspends or terminates the benefit.</>),
  },
};

export default function Paro() {
  const locale = useLocale();
  const t = T[locale];

  const [salario, setSalario] = useState("1800");
  const [meses, setMeses] = useState("24");
  const [hijos, setHijos] = useState("0");

  const s = parseFloat(salario) || 0;
  const m = parseFloat(meses) || 0;
  const h = parseInt(hijos);
  const diasCotizados = m * 30;
  const duracion = getDuracion(diasCotizados);
  const valid = duracion > 0;

  const baseReg = s;

  const bruto70 = baseReg * 0.7;
  const bruto50 = baseReg * 0.5;

  const maxFactor = h === 0 ? 1.75 : h === 1 ? 2.0 : 2.25;
  const max = IPREM * maxFactor;
  const minVal = h === 0 ? IPREM * 0.8 : IPREM * 1.07;

  const prest70 = Math.min(Math.max(bruto70, minVal), max);
  const prest50 = Math.min(Math.max(bruto50, minVal), max);

  const dias70 = Math.min(duracion, 180);
  const dias50 = Math.max(duracion - 180, 0);
  const meses70 = dias70 / 30;
  const meses50 = dias50 / 30;
  const totalBruto = prest70 * meses70 + prest50 * meses50;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Briefcase className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
      </div>
      <p className="text-muted-foreground mb-8">{t.subtitle}</p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t.cardTitle}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="salario">{t.salaryLabel}</Label>
            <Input id="salario" type="number" value={salario} onChange={(e) => setSalario(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="meses">{t.monthsLabel}</Label>
            <Input id="meses" type="number" min={0} max={72} value={meses} onChange={(e) => setMeses(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="hijos">{t.childrenLabel}</Label>
            <Select value={hijos} onValueChange={setHijos}>
              <SelectTrigger id="hijos" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">{t.noChildren}</SelectItem>
                <SelectItem value="1">{t.oneChild}</SelectItem>
                <SelectItem value="2">{t.twoChildren}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {!valid && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-sm text-amber-800 dark:text-amber-300 mb-8">
          {t.warning}
        </div>
      )}

      {valid && (
        <>
          <Card className="border-primary/30 bg-primary/5 mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">{t.durationLabel}</p>
                  <p className="text-2xl font-bold text-primary">{t.days(duracion)}</p>
                  <p className="text-xs text-muted-foreground">{t.months(duracion / 30)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.first6Label}</p>
                  <p className="text-2xl font-bold">{eur(prest70)}</p>
                  <p className="text-xs text-muted-foreground">{t.pct70}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.from7Label}</p>
                  <p className="text-2xl font-bold">{eur(prest50)}</p>
                  <p className="text-xs text-muted-foreground">{t.pct50}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.totalLabel}</p>
                  <p className="text-2xl font-bold text-emerald-600">{eur(totalBruto)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t.detailTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">{t.baseReg}</span>
                  <span className="font-medium">{eur(baseReg)}/mes</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">{t.diasCotizados}</span>
                  <span className="font-medium">{diasCotizados} días</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">{t.maxApplicable}</span>
                  <span className="font-medium">{eur(max)}/mes ({h === 0 ? "175%" : h === 1 ? "200%" : "225%"} IPREM)</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">{t.minApplicable}</span>
                  <span className="font-medium">{eur(minVal)}/mes ({h === 0 ? "80%" : "107%"} IPREM)</span>
                </div>
                {dias50 > 0 && (
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-muted-foreground">{t.breakdownLabel}</span>
                    <span className="font-medium">{t.breakdown(meses70, eur(prest70), meses50, eur(prest50))}</span>
                  </div>
                )}
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
          <AccordionItem value="q4">
            <AccordionTrigger>{t.q4}</AccordionTrigger>
            <AccordionContent>{t.a4}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
