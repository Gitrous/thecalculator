import { useState } from "react";
import { registerFaq } from "@/lib/faq-schema";
import { Scale } from "lucide-react";
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

export type DismissalKind = "unfair" | "objective";

export interface SeveranceResult {
  /** Days of service between start and end date. */
  serviceDays: number;
  /** Years of service, days / 365. */
  serviceYears: number;
  /** Daily salary: annual gross / 365. */
  dailySalary: number;
  /** Compensation before the cap. */
  uncapped: number;
  /** Compensation after the cap (what is paid). */
  amount: number;
  /** True when the monthly cap was the limit. */
  capped: boolean;
}

/** Days of service per year and the cap in monthly salaries, by dismissal type.
 * Estatuto de los Trabajadores, art. 56.1 (unfair: 33 days, max 24 months) and
 * art. 53.1.b (objective: 20 days, max 12 months). */
export const RULES: Record<DismissalKind, { daysPerYear: number; capMonths: number }> = {
  unfair: { daysPerYear: 33, capMonths: 24 },
  objective: { daysPerYear: 20, capMonths: 12 },
};

/** Pure: compensation for a contract that started on `start` and ends on `end`
 * (both ISO dates, yyyy-mm-dd), with `annualGross` including extra pays. Returns
 * null for invalid input (bad dates, end not after start, non-positive salary). */
export function computeSeverance(
  start: string,
  end: string,
  annualGross: number,
  kind: DismissalKind,
): SeveranceResult | null {
  const s = Date.parse(start);
  const e = Date.parse(end);
  if (!Number.isFinite(s) || !Number.isFinite(e) || e <= s) return null;
  if (!Number.isFinite(annualGross) || annualGross <= 0) return null;

  const serviceDays = Math.round((e - s) / MS_PER_DAY);
  const serviceYears = serviceDays / 365;
  const dailySalary = annualGross / 365;
  const monthly = annualGross / 12;
  const rule = RULES[kind];

  const uncapped = dailySalary * rule.daysPerYear * serviceYears;
  const cap = monthly * rule.capMonths;
  const capped = uncapped > cap;
  return {
    serviceDays,
    serviceYears,
    dailySalary,
    uncapped,
    amount: capped ? cap : uncapped,
    capped,
  };
}

const SOURCE_URL = "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430";

const T = {
  es: {
    title: "Calculadora de Indemnización por Despido",
    subtitle:
      "Calcula la indemnización por despido improcedente u objetivo según tu antigüedad y tu salario bruto anual.",
    intro1:
      "Cuando una empresa te despide, la ley fija una indemnización mínima que depende de dos cosas: cuánto tiempo llevabas en la empresa (la antigüedad) y cuál era tu salario. El cálculo cambia según el tipo de despido. Si el juez declara el despido improcedente, la indemnización es de 33 días de salario por año trabajado, con un máximo de 24 mensualidades. Si el despido es objetivo, por causas económicas, técnicas, organizativas o de producción, o por faltas de asistencia, la indemnización es de 20 días por año, con un máximo de 12 mensualidades.",
    intro2:
      "Introduce la fecha de inicio del contrato, la fecha de fin, tu salario bruto anual incluyendo las pagas extra y el tipo de despido. El cálculo se hace en tu navegador y no se guarda nada.",
    cardTitle: "Datos del despido",
    kindLabel: "Tipo de despido",
    unfairOption: "Improcedente (33 días/año, máx. 24 meses)",
    objectiveOption: "Objetivo (20 días/año, máx. 12 meses)",
    startLabel: "Fecha de inicio del contrato",
    endLabel: "Fecha de fin del contrato",
    salaryLabel: "Salario bruto anual (con pagas extra)",
    invalid:
      "Revisa los datos: la fecha de fin debe ser posterior a la de inicio y el salario debe ser mayor que cero.",
    serviceLabel: "Antigüedad",
    yearsUnit: "años",
    dailyLabel: "Salario diario",
    uncappedLabel: "Sin tope",
    amountLabel: "Indemnización bruta",
    cappedNote: "Se aplica el tope de mensualidades: el importe sin tope superaría el máximo legal.",
    howTitle: "Cómo se calcula",
    howText:
      "Indemnización = salario diario × días por año × antigüedad en años, con el límite de mensualidades. El salario diario es el salario bruto anual dividido entre 365, y la mensualidad es el salario bruto anual dividido entre 12. La antigüedad se calcula en días y se divide entre 365, lo que aproxima el prorrateo por meses que indica la ley para los periodos inferiores a un año.",
    deepTitle: "Qué incluye y qué no incluye",
    deep:
      "La indemnización es lo que corresponde por el despido en sí. No incluye las vacaciones pendientes, las pagas extra devengadas y no abonadas, ni los salarios de tramitación si el despido se declara improcedente y el trabajador es readmitido. Esas partidas van en el finiquito, que se suma a la indemnización. Tampoco contempla el paro, que es una prestación distinta. Si quieres ver el conjunto, usa la calculadora de finiquito.",
    limitsTitle: "Límites de esta calculadora",
    limits:
      "Esta calculadora aplica la regla general para contratos firmados a partir del 12 de febrero de 2012. Los contratos anteriores tienen un régimen transitorio distinto (disposición transitoria undécima del Estatuto), con 45 días por año para el tiempo trabajado antes de esa fecha, y no se reflejan aquí. Tampoco incluye convenios colectivos que mejoren la indemnización, ni los casos de despido nulo o disciplinario con condena específica. Ante un caso concreto, consulta con un graduado social, un abogado laboralista o tu sindicato.",
    exampleTitle: "Ejemplo resuelto",
    example:
      "Contrato del 1 de marzo de 2019 al 1 de marzo de 2026, salario bruto anual de 30.000 €, despido improcedente. Antigüedad: 2.557 días, es decir, 7,0 años. Salario diario: 30.000 / 365 = 82,19 €. Indemnización sin tope: 82,19 × 33 × 7,0 ≈ 18.986 €. El tope de 24 mensualidades es 60.000 €, así que no se aplica. Indemnización bruta: unos 18.986 €.",
    sourceTitle: "Fuente de las cifras",
    sourceText:
      "Estatuto de los Trabajadores, artículo 56.1 (despido improcedente: 33 días por año, máximo 24 mensualidades) y artículo 53.1.b (despido objetivo: 20 días por año, máximo 12 mensualidades), en el Boletín Oficial del Estado.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Cuánto cobro de indemnización por despido improcedente?",
    a1:
      "En un despido improcedente la ley fija 33 días de salario por año de servicio, con un máximo de 24 mensualidades. Por ejemplo, con 5 años de antigüedad y un salario bruto anual de 24.000 €, el salario diario es 65,75 € y la indemnización ronda los 10.836 €. Los periodos inferiores a un año se prorratean por meses. El tope de 24 mensualidades solo se alcanza con una antigüedad larga, de unos 22 años para ese salario, así que en la mayoría de casos el cálculo se hace sin tope.",
    q2: "¿Y en un despido objetivo?",
    a2:
      "En un despido objetivo, la empresa debe poner a disposición del trabajador una indemnización de 20 días de salario por año de servicio, con un máximo de 12 mensualidades. Es la regla del artículo 53.1.b del Estatuto. Esa indemnización debe ofrecerse a la vez que la carta de despido. Si el despido se declara improcedente después, la cuantía pasa a ser la de 33 días por año, y se descuenta lo ya abonado. Por eso conviene revisar la carta y la cantidad puesta a disposición.",
    q3: "¿Cómo se calcula el salario diario para la indemnización?",
    a3:
      "Se toma el salario bruto anual, incluidas las pagas extra prorrateadas, y se divide entre 365 días. Así se obtiene el salario diario que se multiplica por los días por año. Las pagas extra cuentan porque forman parte del salario a efectos de despido. No se usan los conceptos variables puntuales ni las dietas, salvo que el convenio o el contrato los incluyan como salario. Si tu salario ha cambiado en los últimos años, la cifra que cuenta es la de la fecha del despido, no la de la firma del contrato.",
    q4: "¿Qué pasa con el periodo de prueba o con contratos temporales?",
    a4:
      "El periodo de prueba no cuenta como antigüedad a efectos de indemnización si el contrato se extingue dentro de él. Un contrato temporal que termina al acabar su duración pactada no da derecho a indemnización por despido, sino que la indemnización por fin de contrato es de 12 días por año en los casos del artículo 49.1.c del Estatuto. Aquí la calculadora se aplica a despidos, no a la finalización de contratos temporales, que tienen su propia regla.",
    q5: "¿Se guardan los datos que introduzco?",
    a5:
      "No. El cálculo se hace en tu propio navegador, con el código que ya se ha cargado en la página. Las fechas y el salario no se envían a ningún servidor ni se guardan en la web. Al cerrar la pestaña se pierde el resultado.",
  },
  en: {
    title: "Dismissal Compensation Calculator",
    subtitle:
      "Calculate the compensation for an unfair or objective dismissal in Spain, based on your length of service and gross annual salary.",
    intro1:
      "When a Spanish employer dismisses you, the law sets a minimum compensation that depends on two things: how long you worked there (length of service) and your salary. The amount depends on the type of dismissal. If a court declares the dismissal unfair, compensation is 33 days of salary per year worked, capped at 24 monthly salaries. If the dismissal is objective, for economic, technical, organisational or production reasons, or for absences, compensation is 20 days per year, capped at 12 monthly salaries.",
    intro2:
      "Enter the contract start date, the end date, your gross annual salary including extra pays, and the type of dismissal. The calculation runs in your browser and nothing is saved.",
    cardTitle: "Dismissal details",
    kindLabel: "Type of dismissal",
    unfairOption: "Unfair (33 days/year, max. 24 months)",
    objectiveOption: "Objective (20 days/year, max. 12 months)",
    startLabel: "Contract start date",
    endLabel: "Contract end date",
    salaryLabel: "Gross annual salary (including extra pays)",
    invalid: "Check the data: the end date must be after the start date and the salary must be greater than zero.",
    serviceLabel: "Length of service",
    yearsUnit: "years",
    dailyLabel: "Daily salary",
    uncappedLabel: "Before cap",
    amountLabel: "Gross compensation",
    cappedNote: "The monthly cap applies: the amount before the cap would exceed the legal maximum.",
    howTitle: "How it is calculated",
    howText:
      "Compensation = daily salary × days per year × length of service in years, limited to the monthly cap. The daily salary is the gross annual salary divided by 365, and a monthly salary is the gross annual salary divided by 12. Length of service is counted in days and divided by 365, which approximates the monthly pro-rating the law requires for periods under one year.",
    deepTitle: "What is and is not included",
    deep:
      "The compensation is what is owed because of the dismissal itself. It does not include unpaid holidays, earned but unpaid extra pays, or wages during the proceedings if an unfair dismissal is reversed and you are reinstated. Those items belong in the final settlement, which is added on top. Unemployment benefit is separate too. To see the whole picture, use the final settlement calculator.",
    limitsTitle: "Limits of this calculator",
    limits:
      "This calculator applies the general rule for contracts signed on or after 12 February 2012. Earlier contracts follow a transitional regime (eleventh transitional provision of the Workers' Statute), with 45 days per year for service before that date, and are not reflected here. It also ignores collective agreements that improve the compensation, and cases of void or disciplinary dismissal with specific rulings. For a specific case, speak to a labour adviser, an employment lawyer or your union.",
    exampleTitle: "Worked example",
    example:
      "Contract from 1 March 2019 to 1 March 2026, gross annual salary of €30,000, unfair dismissal. Length of service: 2,557 days, or 7.0 years. Daily salary: 30,000 / 365 = €82.19. Compensation before cap: 82.19 × 33 × 7.0 ≈ €18,986. The 24-month cap is €60,000, so it does not apply. Gross compensation: about €18,986.",
    sourceTitle: "Source of the figures",
    sourceText:
      "Spanish Workers' Statute (Estatuto de los Trabajadores), article 56.1 (unfair dismissal: 33 days per year, maximum 24 monthly salaries) and article 53.1.b (objective dismissal: 20 days per year, maximum 12 monthly salaries), published in the Boletín Oficial del Estado.",
    faqTitle: "Frequently asked questions",
    q1: "How much compensation do I get for an unfair dismissal?",
    a1:
      "For an unfair dismissal, Spanish law sets 33 days of salary per year of service, with a maximum of 24 monthly salaries. For example, with 5 years of service and a gross annual salary of €24,000, the daily salary is €65.75 and the compensation is about €10,836. Periods under one year are pro-rated by months. The 24-month cap only applies after a long service, around 22 years at that salary, so in most cases the calculation has no cap at all.",
    q2: "And for an objective dismissal?",
    a2:
      "For an objective dismissal, the employer must make available to the worker compensation of 20 days of salary per year of service, with a maximum of 12 monthly salaries. This is the rule in article 53.1.b of the Workers' Statute. The compensation must be offered at the same time as the dismissal letter. If a court later declares the dismissal unfair, the amount becomes 33 days per year, minus what was already paid. That is why it is worth checking the letter and the amount offered.",
    q3: "How is the daily salary calculated for compensation?",
    a3:
      "Take the gross annual salary, including extra pays spread across the year, and divide it by 365 days. That gives the daily salary, which is multiplied by the days per year. Extra pays count because they are part of salary for dismissal purposes. One-off variable payments and allowances are not usually included, unless the collective agreement or the contract treats them as salary. If your pay has changed over the years, the figure that counts is the one on the date of dismissal, not the one at signing.",
    q4: "What about the probation period or fixed-term contracts?",
    a4:
      "Time within a probation period does not count as length of service for compensation if the contract ends during it. A fixed-term contract that ends at its agreed term does not give a right to dismissal compensation. The end-of-contract compensation is 12 days per year in the cases of article 49.1.c of the Workers' Statute. This calculator covers dismissals, not the end of temporary contracts, which have their own rule.",
    q5: "Are the data I enter saved?",
    a5:
      "No. The calculation runs in your own browser, with code that has already loaded on the page. The dates and salary are not sent to any server and are not stored on the website. Closing the tab removes the result with it.",
  },
};

export default function IndemnizacionDespido() {
  const locale = useLocale();
  const t = T[locale];
  const nf = new Intl.NumberFormat(locale === "en" ? "en-GB" : "es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  });
  const nd = new Intl.NumberFormat(locale === "en" ? "en-GB" : "es-ES", {
    maximumFractionDigits: 1,
  });

  const [kind, setKind] = useState<DismissalKind>("unfair");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [salary, setSalary] = useState("");

  const annual = Number(salary.replace(",", "."));
  const result =
    start && end && salary.trim() !== "" ? computeSeverance(start, end, annual, kind) : null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Scale className="h-6 w-6 text-primary" />
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
          <div>
            <Label>{t.kindLabel}</Label>
            <div className="mt-2 flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="kind" checked={kind === "unfair"} onChange={() => setKind("unfair")} />
                {t.unfairOption}
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="kind" checked={kind === "objective"} onChange={() => setKind("objective")} />
                {t.objectiveOption}
              </label>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="start">{t.startLabel}</Label>
              <Input id="start" type="date" value={start} onChange={(e) => setStart(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="end">{t.endLabel}</Label>
              <Input id="end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="mt-1" />
            </div>
          </div>
          <div>
            <Label htmlFor="salary">{t.salaryLabel}</Label>
            <Input
              id="salary"
              inputMode="decimal"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="mt-1"
              placeholder="30000"
            />
          </div>
        </CardContent>
      </Card>

      {start && end && salary.trim() !== "" && (
        <Card className="border-primary/30 bg-primary/5 mb-8">
          <CardContent className="pt-6">
            {result ? (
              <>
                <dl className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
                  <div>
                    <dt className="text-sm text-muted-foreground">{t.serviceLabel}</dt>
                    <dd className="text-2xl font-semibold">
                      {nd.format(result.serviceYears)} {t.yearsUnit}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">{t.dailyLabel}</dt>
                    <dd className="text-2xl font-semibold">{nf.format(result.dailySalary)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">{t.uncappedLabel}</dt>
                    <dd className="text-2xl font-semibold">{nf.format(result.uncapped)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">{t.amountLabel}</dt>
                    <dd className="text-2xl font-bold text-primary">{nf.format(result.amount)}</dd>
                  </div>
                </dl>
                {result.capped && <p className="mt-4 text-sm text-muted-foreground">{t.cappedNote}</p>}
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
        <h3 className="text-base font-semibold mt-6 mb-2 text-gray-900 dark:text-white">{t.limitsTitle}</h3>
        <p>{t.limits}</p>
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

registerFaq("trabajo/indemnizacion-despido", T);
