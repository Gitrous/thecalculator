import { useState } from "react";
import { CalendarDays } from "lucide-react";
import {
  differenceInCalendarDays,
  differenceInBusinessDays,
  differenceInMonths,
  differenceInWeeks,
} from "date-fns";
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

function fmt(n: number): string {
  return n.toLocaleString("es-ES", { maximumFractionDigits: 0 });
}

const T = {
  es: {
    title: "Calculadora de Días entre Fechas",
    subtitle: "Calcula cuántos días, semanas, meses y días laborables hay entre dos fechas.",
    cardTitle: "Fechas",
    startLabel: "Fecha inicial",
    endLabel: "Fecha final",
    totalDaysLabel: "Días totales",
    weeksLabel: "Semanas",
    monthsLabel: "Meses",
    businessLabel: "Días laborables",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Se incluyen los dos extremos?",
    a1: "El cálculo cuenta los días transcurridos entre ambas fechas. Si necesitas incluir el primer y el último día, suma uno al total.",
    q2: "¿Los días laborables tienen en cuenta festivos?",
    a2: "Se excluyen sábados y domingos, pero no los festivos locales o nacionales, que varían según la comunidad autónoma.",
  },
  en: {
    title: "Days Between Dates Calculator",
    subtitle: "Calculate how many days, weeks, months and working days there are between two dates.",
    cardTitle: "Dates",
    startLabel: "Start date",
    endLabel: "End date",
    totalDaysLabel: "Total days",
    weeksLabel: "Weeks",
    monthsLabel: "Months",
    businessLabel: "Working days",
    faqTitle: "Frequently asked questions",
    q1: "Are both endpoints included?",
    a1: "The calculation counts the days elapsed between the two dates. If you need to include both the first and last day, add one to the total.",
    q2: "Do working days account for public holidays?",
    a2: "Saturdays and Sundays are excluded, but not local or national public holidays, which vary by region.",
  },
};

export default function DiasEntreFechas() {
  const locale = useLocale();
  const t = T[locale];

  const today = new Date().toISOString().slice(0, 10);
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(today);

  const d1 = new Date(start);
  const d2 = new Date(end);
  const valid = !isNaN(d1.getTime()) && !isNaN(d2.getTime());

  const [from, to] = d1 <= d2 ? [d1, d2] : [d2, d1];

  const days = valid ? differenceInCalendarDays(to, from) : 0;
  const weeks = valid ? differenceInWeeks(to, from) : 0;
  const months = valid ? differenceInMonths(to, from) : 0;
  const business = valid ? differenceInBusinessDays(to, from) : 0;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <CalendarDays className="h-6 w-6 text-primary" />
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
            <Label htmlFor="start">{t.startLabel}</Label>
            <Input id="start" type="date" value={start} onChange={(e) => setStart(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="end">{t.endLabel}</Label>
            <Input id="end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="mt-1" />
          </div>
        </CardContent>
      </Card>

      {valid && (
        <Card className="border-primary/30 bg-primary/5 mb-8">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground mb-1">{t.totalDaysLabel}</p>
              <p className="text-4xl font-bold text-primary">{fmt(days)}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">{t.weeksLabel}</p>
                <p className="text-lg font-semibold">{fmt(weeks)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.monthsLabel}</p>
                <p className="text-lg font-semibold">{fmt(months)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.businessLabel}</p>
                <p className="text-lg font-semibold">{fmt(business)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <AdUnit slot={AD_SLOTS.midContent} className="my-10" />

      <section className="mt-12">
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
    </div>
  );
}
