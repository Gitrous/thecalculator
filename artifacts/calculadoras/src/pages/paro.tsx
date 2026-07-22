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
    intro1: "La prestación por desempleo (comúnmente llamada 'el paro') es una prestación contributiva del sistema de Seguridad Social español que compensa la pérdida de ingresos cuando un trabajador queda en situación legal de desempleo. Para tener derecho a ella es necesario haber cotizado al menos 360 días (12 meses) en los últimos 6 años antes de quedarse sin trabajo.",
    intro2: "Esta calculadora estima el importe de la prestación y su duración en función de los meses cotizados y el salario. La cuantía es el 70% de la base reguladora durante los primeros 180 días (6 meses) y el 50% a partir del séptimo mes, con un tope máximo y mínimo establecido por el IPREM. Los resultados son orientativos; el SEPE aplica los datos reales de las bases de cotización.",
    disclaimer: "Estimación orientativa. Para calcular tu prestación exacta, consulta la sede electrónica del SEPE con tu informe de vida laboral.",
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
    q5: "¿Cuánto se cobra de paro y cómo baja con el tiempo?",
    a5: "La prestación contributiva equivale al 70 % de la base reguladora durante los primeros 180 días y baja al 60 % a partir del día 181. Sobre ese resultado se aplican topes ligados al IPREM: el mínimo es el 80 % del IPREM incrementado si no tienes hijos a cargo y el 107 % si los tienes, mientras que el máximo va del 175 % del IPREM sin hijos al 225 % con dos o más. Esto significa que los salarios altos ven su prestación recortada por el tope máximo, de modo que la cuantía real puede quedar bastante por debajo del 70 % teórico de su sueldo.",
    q6: "¿Qué diferencia hay entre la prestación contributiva y el subsidio?",
    a6: "La prestación contributiva es lo que coloquialmente llamamos paro: se cobra por haber cotizado previamente, su importe depende de tu base de cotización y su duración de los días cotizados. El subsidio por desempleo es una ayuda asistencial de cuantía fija, en torno al 80 % del IPREM, destinada a quienes han agotado la prestación o no cotizaron los 360 días mínimos exigidos. Para acceder al subsidio se exige carecer de rentas superiores al 75 % del salario mínimo y, en algunas modalidades, tener responsabilidades familiares o una edad determinada.",
    deepTitle: "Cómo se calcula la prestación por desempleo",
    deep: "El cálculo combina dos elementos independientes. El primero es la cuantía, que parte de la base reguladora —la media de las bases de cotización por desempleo de los últimos 180 días trabajados— y aplica el 70 % durante los seis primeros meses y el 60 % después, siempre dentro de los topes mínimo y máximo vinculados al IPREM. El segundo es la duración, que depende exclusivamente de los días cotizados en los seis años anteriores a la situación legal de desempleo, según una escala que concede 120 días de prestación por los primeros 360 cotizados y va sumando 60 días por cada 180 adicionales, hasta un máximo de 720 días.",
    exampleTitle: "Ejemplo resuelto",
    example: "Una persona con una base reguladora de 1.800 € mensuales y 1.080 días cotizados. Por duración, 1.080 días le dan derecho a 360 días de prestación, es decir, un año. Por cuantía, los primeros 180 días cobraría el 70 % de 1.800 €, unos 1.260 € mensuales; a partir del día 181 pasaría al 60 %, unos 1.080 €. A esos importes brutos hay que restarles la retención de IRPF y la cotización a la Seguridad Social que sigue corriendo a cargo del trabajador durante la prestación.",
    tableTitle: "Duración de la prestación según días cotizados",
    tableCol1: "Días cotizados",
    tableCol2: "Días de prestación",
    interpretTitle: "Cómo interpretar el resultado",
    interpret: "La cifra que obtienes es el importe bruto: de la prestación se descuenta la retención de IRPF, que suele ser menor que la de una nómina, y la parte de cotización a la Seguridad Social que corresponde al trabajador, ya que el SEPE mantiene tu cotización mientras cobras. Ten presente además que la prestación se solicita en los 15 días hábiles siguientes al cese y que presentarla tarde no la reduce en duración, pero sí hace que pierdas los días transcurridos desde el fin del plazo. Si trabajas a tiempo parcial mientras la cobras, el importe se reduce en proporción a la jornada, pero el consumo de días también se ajusta.",
  },
  en: {
    title: "Spanish Unemployment Benefit Calculator 2026",
    subtitle: "Calculate how much unemployment benefit you will receive, for how long, and the total amount based on your salary and contributions.",
    intro1: "Unemployment benefit (commonly known as 'el paro') is a contributory benefit from the Spanish Social Security system that compensates for income loss when a worker is in a legal situation of unemployment. To be entitled to it, you must have contributed at least 360 days (12 months) in the last 6 years before becoming unemployed.",
    intro2: "This calculator estimates the benefit amount and its duration based on months contributed and salary. The benefit is 70% of the regulatory base for the first 180 days (6 months) and 50% from the seventh month onwards, with a maximum and minimum cap set by the IPREM. Results are indicative; the SEPE applies actual contribution base data.",
    disclaimer: "Indicative estimate. For your exact benefit calculation, consult the SEPE electronic office with your Social Security contributions report.",
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
    q5: "How much unemployment benefit is paid and how does it fall over time?",
    a5: "The contributory benefit equals 70% of the regulatory base during the first 180 days and drops to 60% from day 181. Caps linked to the IPREM index are then applied: the minimum is 80% of the increased IPREM if you have no dependent children and 107% if you do, while the maximum ranges from 175% of the IPREM with no children to 225% with two or more. This means high salaries see their benefit cut by the maximum cap, so the real amount can fall well below the theoretical 70% of their salary.",
    q6: "What is the difference between contributory benefit and the subsidy?",
    a6: "The contributory benefit is what is colloquially called 'paro': it is paid because you contributed beforehand, its amount depends on your contribution base and its duration on days contributed. The unemployment subsidy is a flat-rate welfare payment, around 80% of the IPREM, for those who have exhausted the benefit or did not contribute the minimum 360 days. To qualify for the subsidy you must have no income above 75% of the minimum wage and, in some forms, have family responsibilities or be of a certain age.",
    deepTitle: "How unemployment benefit is calculated",
    deep: "The calculation combines two independent elements. The first is the amount, which starts from the regulatory base — the average of unemployment contribution bases over the last 180 days worked — and applies 70% for the first six months and 60% thereafter, always within the minimum and maximum caps linked to the IPREM. The second is the duration, which depends solely on days contributed in the six years preceding legal unemployment, following a scale that grants 120 days of benefit for the first 360 contributed and adds 60 days for each additional 180, up to a maximum of 720 days.",
    exampleTitle: "Worked example",
    example: "Someone with a regulatory base of €1,800 a month and 1,080 days contributed. On duration, 1,080 days entitles them to 360 days of benefit, that is, one year. On amount, for the first 180 days they would receive 70% of €1,800, about €1,260 a month; from day 181 they would move to 60%, about €1,080. From those gross amounts you must deduct income tax withholding and the social security contribution that the worker continues to pay during the benefit period.",
    tableTitle: "Benefit duration by days contributed",
    tableCol1: "Days contributed",
    tableCol2: "Days of benefit",
    interpretTitle: "How to interpret the result",
    interpret: "The figure you get is the gross amount: income tax withholding, usually lower than on a payslip, and the worker's share of social security contributions are deducted, since the employment service maintains your contributions while you claim. Bear in mind too that the benefit must be applied for within 15 working days of leaving your job, and applying late does not shorten its duration but does mean you lose the days elapsed since the deadline. If you work part-time while claiming, the amount is reduced in proportion to your hours, but the consumption of days is adjusted too.",
  },
};

const PARO_TABLE = [
  { es: "360 días", en: "360 days", dur: "120" },
  { es: "720 días", en: "720 days", dur: "240" },
  { es: "1.080 días", en: "1,080 days", dur: "360" },
  { es: "1.440 días", en: "1,440 days", dur: "480" },
  { es: "1.800 días", en: "1,800 days", dur: "600" },
  { es: "2.160 días o más", en: "2,160 days or more", dur: "720" },
];

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
      <p className="text-muted-foreground mb-6">{t.subtitle}</p>

      <div className="prose prose-sm dark:prose-invert max-w-none mb-8 space-y-3 text-gray-700 dark:text-gray-300">
        <p>{t.intro1}</p>
        <p>{t.intro2}</p>
      </div>

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
            {PARO_TABLE.map((row) => (
              <tr key={row.es} className="border-b border-gray-100 dark:border-white/5">
                <td className="py-2 pr-4 text-gray-900 dark:text-white">{locale === "en" ? row.en : row.es}</td>
                <td className="py-2 font-semibold text-primary whitespace-nowrap">{row.dur}</td>
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
          <AccordionItem value="q6">
            <AccordionTrigger>{t.q6}</AccordionTrigger>
            <AccordionContent>{t.a6}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}
