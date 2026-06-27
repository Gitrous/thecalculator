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
    howTitle: "Cómo se calculan los días entre dos fechas",
    how1:
      "Calcular los días entre dos fechas consiste en restar la fecha inicial a la final y contar el número de días naturales transcurridos. A partir de ese total se derivan las semanas (dividiendo entre 7), los meses aproximados y los días laborables, que descartan los fines de semana.",
    how2:
      "Esta calculadora hace esa diferencia automáticamente al introducir ambas fechas y te muestra el resultado en días, semanas, meses y días hábiles, sin tener que contar a mano en el calendario.",
    exampleTitle: "Ejemplo",
    example:
      "Entre el 1 y el 15 de enero hay 14 días naturales (2 semanas) y, descontando un fin de semana, unos 10 días laborables. Si necesitas incluir el propio día de inicio, suma 1 al total.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Se incluyen los dos extremos?",
    a1: "El cálculo usa la diferencia estricta entre ambas fechas: si el inicio y el final son el mismo día, el resultado es 0. Para contar el propio día de inicio y el de fin —como en plazos legales o estancias en alojamiento—, suma 1 al total. Por ejemplo, del 1 al 7 de enero transcurren 6 días; si quieres contar ambos extremos, son 7 noches o 7 días naturales.",
    q2: "¿Los días laborables tienen en cuenta festivos?",
    a2: "Se excluyen sábados y domingos, pero no los festivos locales o nacionales, ya que estos varían según la comunidad autónoma y el municipio. Si necesitas el cómputo exacto con festivos —para un contrato, una baja laboral o un plazo administrativo—, consulta el calendario laboral oficial de tu provincia. El resultado de esta calculadora es una estimación de días hábiles sin festivos.",
    q3: "¿Para qué se usa habitualmente?",
    a3: "Este cálculo es útil en muchos contextos: saber cuántos días quedan para un evento, comprobar si un plazo legal ha vencido (los recursos administrativos suelen tener 15 o 30 días hábiles), calcular el período de prueba de un contrato laboral, estimar el tiempo entre dos hitos de un proyecto o verificar cuántos días de vacaciones han transcurrido.",
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
    howTitle: "How the days between two dates are calculated",
    how1:
      "Calculating the days between two dates means subtracting the start date from the end date and counting the number of calendar days elapsed. From that total you derive the weeks (dividing by 7), the approximate months and the working days, which exclude weekends.",
    how2:
      "This calculator works out that difference automatically when you enter both dates and shows the result in days, weeks, months and working days, with no need to count by hand on the calendar.",
    exampleTitle: "Example",
    example:
      "Between 1 and 15 January there are 14 calendar days (2 weeks) and, excluding one weekend, around 10 working days. If you need to include the start day itself, add 1 to the total.",
    faqTitle: "Frequently asked questions",
    q1: "Are both endpoints included?",
    a1: "The calculation uses the strict difference between the two dates: if the start and end are the same day, the result is 0. To count the start day and the end day themselves—as in legal deadlines or accommodation stays—add 1 to the total. For example, from 1 January to 7 January is 6 days elapsed; if you want to count both endpoints, that is 7 nights or 7 calendar days.",
    q2: "Do working days account for public holidays?",
    a2: "Saturdays and Sundays are excluded, but not local or national public holidays, which vary by region and municipality. If you need the exact count including public holidays—for a contract, sick leave or an administrative deadline—consult the official labour calendar for your province. The result of this calculator is an estimate of working days without holidays.",
    q3: "What is it typically used for?",
    a3: "This calculation is useful in many situations: finding out how many days are left until an event, checking whether a legal deadline has passed (administrative appeals usually allow 15 or 30 working days), calculating the probationary period of a contract, estimating the time between two project milestones, or verifying how many holiday days have elapsed.",
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

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">{t.howTitle}</h2>
        <p className="text-muted-foreground mb-4">{t.how1}</p>
        <p className="text-muted-foreground mb-4">{t.how2}</p>
        <h3 className="text-lg font-semibold mb-2">{t.exampleTitle}</h3>
        <p className="text-muted-foreground">{t.example}</p>
      </section>

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
          <AccordionItem value="q3">
            <AccordionTrigger>{t.q3}</AccordionTrigger>
            <AccordionContent>{t.a3}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}
