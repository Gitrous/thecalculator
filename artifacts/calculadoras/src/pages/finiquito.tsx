import { useState } from "react";
import { FileText } from "lucide-react";
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

function eur(n: number): string {
  return n.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  });
}

const T = {
  es: {
    title: "Calculadora de Finiquito",
    subtitle: "Estima el finiquito que te corresponde: vacaciones no disfrutadas, días trabajados sin cobrar y parte proporcional de las pagas extra.",
    cardTitle: "Datos",
    annualLabel: "Salario bruto anual (€)",
    vacLabel: "Días de vacaciones pendientes",
    workedLabel: "Días trabajados sin cobrar (mes en curso)",
    extraLabel: "Meses desde la última paga extra",
    totalLabel: "Finiquito estimado (bruto)",
    vacationsLabel: "Vacaciones",
    workedDaysLabel: "Días trabajados",
    bonusLabel: "Pagas extra",
    note: "Cálculo orientativo en bruto. No incluye la indemnización por despido (que depende del tipo de despido y la antigüedad) ni retenciones de IRPF. Consulta tu convenio o un asesor laboral para el importe exacto.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿El finiquito incluye la indemnización?",
    a1: "No necesariamente. El finiquito son las cantidades pendientes (vacaciones, días trabajados, pagas extra). La indemnización por despido improcedente u objetivo se calcula y paga aparte.",
    q2: "¿Las pagas extra van prorrateadas?",
    a2: "Si tu nómina ya incluye las pagas prorrateadas cada mes, no se suman de nuevo en el finiquito. Pon 0 meses en ese caso.",
  },
  en: {
    title: "Severance Pay Calculator (Spain)",
    subtitle: "Estimate your severance pay: unused holidays, unpaid worked days and pro-rata bonus payments.",
    cardTitle: "Data",
    annualLabel: "Annual gross salary (€)",
    vacLabel: "Pending holiday days",
    workedLabel: "Worked days not yet paid (current month)",
    extraLabel: "Months since last bonus payment",
    totalLabel: "Estimated severance pay (gross)",
    vacationsLabel: "Holidays",
    workedDaysLabel: "Worked days",
    bonusLabel: "Bonus payments",
    note: "Indicative gross estimate. Does not include severance indemnity (which depends on the type of dismissal and seniority) or income tax withholding. Consult your collective agreement or a labour adviser for the exact amount.",
    faqTitle: "Frequently asked questions",
    q1: "Does severance pay include the dismissal indemnity?",
    a1: "Not necessarily. Severance pay (finiquito) covers pending amounts (holidays, worked days, bonus payments). The dismissal indemnity for unfair or objective dismissal is calculated and paid separately.",
    q2: "Are bonus payments already pro-rated in my salary?",
    a2: "If your payslip already includes pro-rated bonus payments each month, they are not added again in the severance pay. Enter 0 months in that case.",
  },
};

export default function Finiquito() {
  const locale = useLocale();
  const t = T[locale];

  const [annual, setAnnual] = useState("24000");
  const [vacDays, setVacDays] = useState("10");
  const [workedDays, setWorkedDays] = useState("15");
  const [monthsSinceExtra, setMonthsSinceExtra] = useState("3");

  const salaryAnnual = parseFloat(annual) || 0;
  const dailyRate = salaryAnnual / 365;
  const vac = (parseFloat(vacDays) || 0) * dailyRate;
  const worked = (parseFloat(workedDays) || 0) * dailyRate;

  const monthlyGross = salaryAnnual / 14;
  const extra = ((parseFloat(monthsSinceExtra) || 0) / 6) * monthlyGross;

  const total = vac + worked + extra;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <FileText className="h-6 w-6 text-primary" />
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
            <Label htmlFor="annual">{t.annualLabel}</Label>
            <Input id="annual" type="number" value={annual} onChange={(e) => setAnnual(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="vac">{t.vacLabel}</Label>
            <Input id="vac" type="number" value={vacDays} onChange={(e) => setVacDays(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="worked">{t.workedLabel}</Label>
            <Input id="worked" type="number" value={workedDays} onChange={(e) => setWorkedDays(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="extra">{t.extraLabel}</Label>
            <Input id="extra" type="number" value={monthsSinceExtra} onChange={(e) => setMonthsSinceExtra(e.target.value)} className="mt-1" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/30 bg-primary/5 mb-6">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground mb-1">{t.totalLabel}</p>
            <p className="text-4xl font-bold text-primary">{eur(total)}</p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">{t.vacationsLabel}</p>
              <p className="text-lg font-semibold">{eur(vac)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t.workedDaysLabel}</p>
              <p className="text-lg font-semibold">{eur(worked)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t.bonusLabel}</p>
              <p className="text-lg font-semibold">{eur(extra)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8 text-sm text-amber-800 dark:text-amber-300">
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
        </Accordion>
      </section>

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}
