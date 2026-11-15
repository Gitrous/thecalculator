import { useState } from "react";
import { registerFaq } from "@/lib/faq-schema";
import { Umbrella } from "lucide-react";
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
import { ReviewedNote } from "@/components/reviewed-note";
import { useLocale } from "@/lib/locale";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface HolidayResult {
  /** Days of service between the start date and the reference date. */
  serviceDays: number;
  /** Holiday days accrued up to the reference date (natural days). */
  accrued: number;
  /** Accrued minus taken. Negative means days taken in advance. */
  pending: number;
}

/** Pure: holiday days accrued from `start` to `reference` (ISO yyyy-mm-dd),
 * pro rata to time worked, for a yearly entitlement of `daysPerYear` natural
 * days. Returns null when the dates are invalid or the reference is not after
 * the start. Art. 38.1 ET: the minimum is 30 natural days a year. */
export function computeHolidays(
  start: string,
  reference: string,
  daysPerYear: number,
  taken: number,
): HolidayResult | null {
  const s = Date.parse(start);
  const r = Date.parse(reference);
  if (!Number.isFinite(s) || !Number.isFinite(r) || r <= s) return null;
  if (!Number.isFinite(daysPerYear) || daysPerYear < 30) return null;
  if (!Number.isFinite(taken) || taken < 0) return null;

  const serviceDays = Math.round((r - s) / MS_PER_DAY);
  const accrued = (daysPerYear * serviceDays) / 365;
  return { serviceDays, accrued, pending: accrued - taken };
}

const SOURCE_URL = "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430";

const T = {
  es: {
    title: "Calculadora de Vacaciones Devengadas",
    subtitle:
      "Calcula los días de vacaciones que llevas generados desde tu alta, los que ya has disfrutado y los que te quedan pendientes.",
    intro1:
      "Las vacaciones se generan día a día mientras trabajas. Según el Estatuto de los Trabajadores, el periodo de vacaciones anuales retribuidas lo fija el convenio colectivo o el contrato, pero nunca puede ser inferior a 30 días naturales al año. Lo que te corresponde en un momento dado son los días generados hasta esa fecha, no el año completo, y de ellos hay que restar los que ya has disfrutado.",
    intro2:
      "Indica la fecha de inicio del contrato, la fecha de cálculo (hoy, o la fecha de fin si lo haces para un finiquito), los días de vacaciones de tu convenio y los días que ya has disfrutado. El cálculo se hace en tu navegador y no se guarda nada.",
    cardTitle: "Datos",
    startLabel: "Fecha de inicio del contrato",
    refLabel: "Fecha de cálculo",
    daysLabel: "Días de vacaciones al año (naturales)",
    takenLabel: "Días ya disfrutados",
    invalid:
      "Revisa los datos: la fecha de cálculo debe ser posterior a la de inicio, los días al año deben ser al menos 30 y los disfrutados no pueden ser negativos.",
    accruedLabel: "Días generados",
    takenShort: "Disfrutados",
    pendingLabel: "Días pendientes",
    aheadNote: "Tienes más días disfrutados que generados: son días tomados por adelantado.",
    serviceLabel: "Tiempo trabajado",
    daysUnit: "días",
    howTitle: "Cómo se calcula",
    howText:
      "Días generados = días de vacaciones al año × días trabajados ÷ 365. Días pendientes = días generados − días disfrutados. El cálculo es proporcional al tiempo trabajado, de modo que un año completo genera la cifra íntegra del convenio y un periodo parcial genera la parte que corresponde.",
    deepTitle: "Días naturales y días laborables",
    deep:
      "La ley habla de días naturales, pero muchos convenios fijan las vacaciones en días laborables, normalmente de lunes a viernes o de lunes a sábado. Por eso una misma persona puede tener 22 días laborables de vacaciones y 30 días naturales. Antes de comparar cifras, comprueba qué unidad usa tu convenio. Esta calculadora trabaja siempre en días naturales, así que si tu convenio usa laborables, introduce la equivalencia que indique tu convenio.",
    finiquitoTitle: "Vacaciones y finiquito",
    finiquito:
      "Cuando el contrato termina, los días generados y no disfrutados se pagan en el finiquito. Por eso el cálculo a la fecha de fin del contrato es el que importa para el finiquito. Para ver el importe completo, incluidas las pagas extra pendientes, usa la calculadora de finiquito.",
    exampleTitle: "Ejemplo resuelto",
    example:
      "Contrato desde el 1 de enero de 2026, convenio de 30 días naturales al año, cálculo a 1 de julio de 2026 y 5 días ya disfrutados. Tiempo trabajado: 181 días. Días generados: 30 × 181 ÷ 365 ≈ 14,88. Días pendientes: 14,88 − 5 ≈ 9,88.",
    sourceTitle: "Fuente de las cifras",
    sourceText:
      "Estatuto de los Trabajadores, artículo 38.1: el periodo de vacaciones anuales retribuidas será el pactado en convenio colectivo o contrato, y en ningún caso inferior a 30 días naturales, publicado en el Boletín Oficial del Estado.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Cuántos días de vacaciones me corresponden al año?",
    a1:
      "Como mínimo, 30 días naturales al año, según el artículo 38.1 del Estatuto de los Trabajadores. Ese mínimo puede mejorarse en el convenio colectivo o en tu contrato, y en muchos convenios se fija en días laborables, por ejemplo 22 o 23 al año. Si tu convenio habla de laborables, la equivalencia en naturales es mayor, porque los fines de semana cuentan como días naturales. Lo que vale para ti es lo que dice tu convenio o tu contrato, y si no hay nada escrito, rige el mínimo legal de 30 días naturales.",
    q2: "¿Cómo se generan los días si entro o salgo a mitad de año?",
    a2:
      "Se generan de forma proporcional al tiempo trabajado. Si entras el 1 de julio y tu convenio da 30 días naturales al año, al final del año llevarás unos 15 días generados, es decir, la mitad. Lo mismo ocurre al salir: si el contrato termina a mitad de año, los días generados hasta esa fecha son los que te corresponden. Esta calculadora aplica esa regla de proporcionalidad sobre los días trabajados, así que el resultado es una aproximación al mes, no al día exacto del convenio.",
    q3: "¿Qué pasa si he disfrutado más días de los que me tocan?",
    a3:
      "Entonces el saldo sale negativo, lo que significa que has disfrutado días por adelantado. En ese caso, cómo se trata ese saldo al terminar el contrato depende de lo pactado o del convenio, y no se descuenta de forma automática. Si tienes dudas sobre el saldo, pide a la empresa por escrito el cálculo de tus días generados y disfrutados. Conviene revisarlo antes de firmar el finiquito, porque es el momento en que se regulariza cualquier diferencia.",
    q4: "¿Puedo cobrar en dinero los días que no he disfrutado?",
    a4:
      "Durante el contrato, las vacaciones son retribuidas pero no pueden sustituirse por dinero: el artículo 38.1 del Estatuto establece que el periodo de vacaciones no es sustituible por compensación económica. Lo habitual es disfrutarlas. Al terminar el contrato, sin embargo, los días generados y no disfrutados se liquidan en el finiquito. Ese pago corresponde a la liquidación del contrato y no a un cambio de tus vacaciones durante la relación laboral, y es una de las partidas que más se revisan en un finiquito.",
    q5: "¿Se guardan los datos que introduzco?",
    a5:
      "No. El cálculo se hace en tu propio navegador, con el código que ya se ha cargado en la página. Las fechas y los días no se envían a ningún servidor ni se guardan en la web. Al cerrar la pestaña se pierde el resultado.",
  },
  en: {
    title: "Holiday Entitlement Calculator",
    subtitle:
      "Calculate the paid holiday days you have accrued since you started, the days you have already taken, and the days still pending.",
    intro1:
      "Paid holidays build up day by day while you work. Under Spain's Workers' Statute, the annual paid holiday period is set by the collective agreement or your contract, but it can never be less than 30 natural days a year. What you are owed at any given moment is the amount accrued up to that date, not the full year, and the days you have already taken must be subtracted from it.",
    intro2:
      "Enter the contract start date, the calculation date (today, or the end date if you are working out a final settlement), the holiday days in your collective agreement, and the days you have already taken. The calculation runs in your browser and nothing is saved.",
    cardTitle: "Details",
    startLabel: "Contract start date",
    refLabel: "Calculation date",
    daysLabel: "Holiday days per year (natural days)",
    takenLabel: "Days already taken",
    invalid:
      "Check the data: the calculation date must be after the start date, the yearly days must be at least 30, and days taken cannot be negative.",
    accruedLabel: "Days accrued",
    takenShort: "Taken",
    pendingLabel: "Days pending",
    aheadNote: "You have taken more days than you have accrued: those days were taken in advance.",
    serviceLabel: "Time worked",
    daysUnit: "days",
    howTitle: "How it is calculated",
    howText:
      "Days accrued = holiday days per year × days worked ÷ 365. Days pending = days accrued − days taken. The calculation is pro rata to time worked, so a full year gives the full figure from the agreement and a partial period gives the corresponding share.",
    deepTitle: "Natural days and working days",
    deep:
      "The law speaks of natural days, but many collective agreements set holidays in working days, usually Monday to Friday or Monday to Saturday. The same person can therefore have 22 working days of holiday and 30 natural days. Before comparing figures, check which unit your agreement uses. This calculator always works in natural days, so if your agreement uses working days, enter the equivalent your agreement gives.",
    finiquitoTitle: "Holidays and the final settlement",
    finiquito:
      "When the contract ends, accrued days that were not taken are paid in the final settlement. That is why the calculation at the contract end date is the one that matters for the settlement. For the full amount, including outstanding extra pays, use the final settlement calculator.",
    exampleTitle: "Worked example",
    example:
      "Contract from 1 January 2026, agreement of 30 natural days a year, calculation on 1 July 2026, and 5 days already taken. Time worked: 181 days. Days accrued: 30 × 181 ÷ 365 ≈ 14.88. Days pending: 14.88 − 5 ≈ 9.88.",
    sourceTitle: "Source of the figures",
    sourceText:
      "Spanish Workers' Statute (Estatuto de los Trabajadores), article 38.1: the paid annual holiday period is the one set by collective agreement or contract, and in no case less than 30 natural days, published in the Boletín Oficial del Estado.",
    faqTitle: "Frequently asked questions",
    q1: "How many holiday days am I entitled to per year?",
    a1:
      "At least 30 natural days a year, under article 38.1 of Spain's Workers' Statute. That minimum can be improved by the collective agreement or your contract, and many agreements set it in working days, for example 22 or 23 a year. If your agreement uses working days, the natural-day equivalent is higher, because weekends count as natural days. What applies to you is what your agreement or contract says, and if nothing is written down, the legal minimum of 30 natural days applies.",
    q2: "How are days accrued if I start or leave mid-year?",
    a2:
      "They accrue pro rata to time worked. If you start on 1 July and your agreement gives 30 natural days a year, by the end of the year you will have about 15 days accrued, which is half. The same applies when leaving: if the contract ends mid-year, the days accrued up to that date are yours. This calculator applies that pro-rata rule to the days worked, so the result is an estimate of the day count rather than an exact figure from your payroll system.",
    q3: "What if I have taken more days than I have accrued?",
    a3:
      "Then the balance comes out negative, which means you have taken days in advance. In that case, how that balance is treated when the contract ends depends on what was agreed or on the collective agreement, and it is not deducted automatically. If you are unsure about the balance, ask your employer in writing for the calculation of accrued and taken days. It is worth checking before you sign the final settlement, because that is when any difference is settled.",
    q4: "Can I be paid in cash for holidays I have not taken?",
    a4:
      "During the contract, holidays are paid but cannot be replaced by money: article 38.1 of the Workers' Statute says the holiday period cannot be substituted by financial compensation. The normal practice is to take them. When the contract ends, however, days accrued and not taken are settled in the final settlement. That payment is part of closing the contract, not a change to your holidays during the employment relationship, and it is one of the items most often checked in a final settlement.",
    q5: "Are the data I enter saved?",
    a5:
      "No. The calculation runs in your own browser, with code that has already loaded on the page. The dates and day counts are not sent to any server and are not stored on the website. Closing the tab removes the result with it.",
  },
};

export default function VacacionesDevengadas() {
  const locale = useLocale();
  const t = T[locale];
  const nd = new Intl.NumberFormat(locale === "en" ? "en-GB" : "es-ES", {
    maximumFractionDigits: 2,
  });

  const [start, setStart] = useState("");
  const [ref, setRef] = useState("");
  const [daysPerYear, setDaysPerYear] = useState("30");
  const [taken, setTaken] = useState("0");

  const perYear = Number(daysPerYear.replace(",", "."));
  const takenNum = Number(taken.replace(",", "."));
  const result =
    start && ref && daysPerYear.trim() !== "" && taken.trim() !== ""
      ? computeHolidays(start, ref, perYear, takenNum)
      : null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Umbrella className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
      </div>
      <p className="text-muted-foreground mb-6">{t.subtitle}</p>

      <ReviewedNote
        date="15/11/2026"
        sources={[{ label: "BOE — Estatuto de los Trabajadores", href: SOURCE_URL }]}
        className="mb-6"
      />

      <div className="prose prose-sm dark:prose-invert max-w-none mb-8 space-y-3 text-gray-700 dark:text-gray-300">
        <p>{t.intro1}</p>
        <p>{t.intro2}</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t.cardTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="start">{t.startLabel}</Label>
              <Input id="start" type="date" value={start} onChange={(e) => setStart(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="ref">{t.refLabel}</Label>
              <Input id="ref" type="date" value={ref} onChange={(e) => setRef(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="days">{t.daysLabel}</Label>
              <Input
                id="days"
                inputMode="decimal"
                value={daysPerYear}
                onChange={(e) => setDaysPerYear(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="taken">{t.takenLabel}</Label>
              <Input
                id="taken"
                inputMode="decimal"
                value={taken}
                onChange={(e) => setTaken(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {start && ref && (
        <Card className="border-primary/30 bg-primary/5 mb-8">
          <CardContent className="pt-6">
            {result ? (
              <>
                <dl className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
                  <div>
                    <dt className="text-sm text-muted-foreground">{t.serviceLabel}</dt>
                    <dd className="text-2xl font-semibold">
                      {result.serviceDays} {t.daysUnit}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">{t.accruedLabel}</dt>
                    <dd className="text-2xl font-semibold">{nd.format(result.accrued)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">{t.takenShort}</dt>
                    <dd className="text-2xl font-semibold">{nd.format(takenNum)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">{t.pendingLabel}</dt>
                    <dd className="text-2xl font-bold text-primary">{nd.format(result.pending)}</dd>
                  </div>
                </dl>
                {result.pending < 0 && <p className="mt-4 text-sm text-muted-foreground">{t.aheadNote}</p>}
              </>
            ) : (
              <p className="text-destructive">{t.invalid}</p>
            )}
          </CardContent>
        </Card>
      )}

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">{t.howTitle}</h2>
        <p className="text-muted-foreground mb-4">{t.howText}</p>
      </section>

      <section className="mt-10 prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t.deepTitle}</h2>
        <p>{t.deep}</p>
        <h3 className="text-base font-semibold mt-6 mb-2 text-gray-900 dark:text-white">{t.finiquitoTitle}</h3>
        <p>{t.finiquito}</p>
        <h3 className="text-base font-semibold mt-6 mb-2 text-gray-900 dark:text-white">{t.exampleTitle}</h3>
        <p>{t.example}</p>
      </section>

      <AdUnit slot={AD_SLOTS.midContent} className="my-10" />

      <section className="mt-10 text-sm text-muted-foreground">
        <h2 className="text-base font-semibold mb-2 text-gray-900 dark:text-white">{t.sourceTitle}</h2>
        <p>
          {t.sourceText}{" "}
          <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer" className="underline">
            boe.es
          </a>
        </p>
      </section>

      <section className="mt-10">
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

registerFaq("trabajo/vacaciones-devengadas", T);
