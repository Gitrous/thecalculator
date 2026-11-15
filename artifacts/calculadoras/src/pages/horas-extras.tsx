import { useState } from "react";
import { registerFaq } from "@/lib/faq-schema";
import { Timer } from "lucide-react";
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

/** Legal cap on overtime hours per year (Estatuto de los Trabajadores, art. 35.2). */
export const MAX_OVERTIME_HOURS_PER_YEAR = 80;

export interface OvertimeResult {
  /** Value of one ordinary hour: annual gross salary / annual ordinary hours. */
  hourlyValue: number;
  /** Value of one overtime hour, with the premium applied. */
  overtimeHourValue: number;
  /** Gross amount for the overtime hours. */
  amount: number;
  /** True when the hours exceed the 80-hour annual legal cap. */
  overCap: boolean;
}

/** Pure: value of overtime hours. The hourly value is the annual gross salary divided
 * by the annual ordinary hours; the premium is a percentage over that value (0 means
 * paid at the ordinary hourly value, the minimum allowed by art. 35.1 ET). Returns
 * null for invalid input. */
export function computeOvertime(
  annualGross: number,
  annualOrdinaryHours: number,
  overtimeHours: number,
  premiumPct: number,
): OvertimeResult | null {
  if (!Number.isFinite(annualGross) || annualGross <= 0) return null;
  if (!Number.isFinite(annualOrdinaryHours) || annualOrdinaryHours <= 0) return null;
  if (!Number.isFinite(overtimeHours) || overtimeHours < 0) return null;
  if (!Number.isFinite(premiumPct) || premiumPct < 0) return null;

  const hourlyValue = annualGross / annualOrdinaryHours;
  const overtimeHourValue = hourlyValue * (1 + premiumPct / 100);
  return {
    hourlyValue,
    overtimeHourValue,
    amount: overtimeHourValue * overtimeHours,
    overCap: overtimeHours > MAX_OVERTIME_HOURS_PER_YEAR,
  };
}

const SOURCE_URL = "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430";

const T = {
  es: {
    title: "Calculadora de Horas Extra",
    subtitle:
      "Calcula cuánto valen tus horas extraordinarias según tu salario bruto anual, tu jornada y el recargo de tu convenio.",
    intro1:
      "Las horas extraordinarias son las que trabajas por encima de la jornada ordinaria fijada en tu convenio o contrato. La ley dice que se pagan a un importe que no puede ser inferior al valor de la hora ordinaria, o bien se compensan con tiempo de descanso retribuido. Además, el número máximo es de 80 horas al año, salvo las excepciones de la propia ley.",
    intro2:
      "Introduce tu salario bruto anual, las horas ordinarias de tu jornada al año según tu convenio, las horas extra que has hecho y el recargo que pague tu convenio. Si no hay recargo, pon 0. El cálculo se hace en tu navegador y no se guarda nada.",
    cardTitle: "Datos",
    salaryLabel: "Salario bruto anual (€)",
    ordinaryLabel: "Horas ordinarias al año (según tu convenio o jornada)",
    overtimeLabel: "Horas extra realizadas al año",
    premiumLabel: "Recargo sobre la hora ordinaria (%)",
    premiumHint: "Pon 0 si se paga al valor de la hora ordinaria. Tu convenio puede fijar más.",
    invalid:
      "Revisa los datos: el salario y las horas ordinarias deben ser mayores que cero, y las horas extra y el recargo no pueden ser negativos.",
    capWarning:
      "Superas el máximo legal de 80 horas extra al año. Revisa tu caso con tu representante de los trabajadores o un asesor laboral.",
    hourlyLabel: "Valor de la hora ordinaria",
    overtimeHourLabel: "Valor de cada hora extra",
    amountLabel: "Importe bruto anual",
    howTitle: "Cómo se calcula",
    howText:
      "Valor de la hora ordinaria = salario bruto anual ÷ horas ordinarias al año. Valor de la hora extra = valor de la hora ordinaria × (1 + recargo ÷ 100). Importe = valor de la hora extra × horas extra. El recargo es opcional: la ley exige que la hora extra se pague al menos como hora ordinaria.",
    deepTitle: "Pagar o compensar con descanso",
    deep:
      "Si el convenio o tu contrato no dicen otra cosa, la ley establece que las horas extra deben compensarse con descanso retribuido dentro de los cuatro meses siguientes a su realización. Si la empresa opta por pagarlas, el importe no puede ser inferior al valor de la hora ordinaria. Esta calculadora solo valora el pago en dinero: si te compensan con tiempo libre, el valor económico no se refleja aquí.",
    limitsTitle: "Límites de esta calculadora",
    limits:
      "El valor de la hora ordinaria depende de cómo tu convenio cuente las horas al año, que puede incluir o no algunas partidas. Esta calculadora usa la fórmula más simple y no aplica retenciones de IRPF ni cotizaciones, así que el resultado es bruto. Las horas nocturnas, festivas o de domingo pueden tener recargos propios en tu convenio que tampoco se reflejan aquí.",
    exampleTitle: "Ejemplo resuelto",
    example:
      "Salario bruto anual de 30.000 €, 1.800 horas ordinarias al año, 20 horas extra y un recargo del 25 %. Valor de la hora ordinaria: 30.000 ÷ 1.800 = 16,67 €. Valor de la hora extra: 16,67 × 1,25 = 20,83 €. Importe: 20,83 × 20 = 416,67 € brutos al año.",
    sourceTitle: "Fuente de las cifras",
    sourceText:
      "Estatuto de los Trabajadores, artículo 35.1 (la hora extra se paga al menos como hora ordinaria, o se compensa con descanso dentro de los cuatro meses siguientes) y artículo 35.2 (máximo de 80 horas extra al año), en el Boletín Oficial del Estado.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Cuánto cobro por una hora extra?",
    a1:
      "Como mínimo, el valor de una hora ordinaria, según el artículo 35.1 del Estatuto de los Trabajadores. Ese valor sale de dividir tu salario bruto anual entre las horas ordinarias de tu jornada. Tu convenio puede fijar un recargo, por ejemplo del 25 % o del 50 %, y si lo hace, se aplica sobre la hora ordinaria. Si tu contrato o convenio no dicen nada, la regla general es pagarla al menos al valor de la hora ordinaria o compensarla con descanso. Por eso conviene mirar el convenio antes de aceptar cualquier cifra.",
    q2: "¿Cuál es el máximo de horas extra al año?",
    a2:
      "Son 80 horas al año, según el artículo 35.2 del Estatuto. Para las personas con contrato a tiempo parcial o de duración que hacen una jornada anual inferior a la general, el máximo se reduce en la misma proporción. Las horas que se compensan con descanso dentro de los cuatro meses siguientes no cuentan para ese límite. Si superas las 80 horas en el año, la empresa incumple la ley, y conviene revisarlo con tu representación sindical o con un asesor laboral antes de firmar cualquier acuerdo.",
    q3: "¿Qué pasa si la empresa no me paga ni me deja descansar?",
    a3:
      "Si las horas extra no se pagan ni se compensan, lo que te corresponde se puede reclamar. La ley fija que, sin pacto, deben compensarse con descanso dentro de los cuatro meses siguientes. Si eso no ocurre, puedes pedir por escrito el abono o el descanso, dejar constancia de las horas realizadas con registros propios, y acudir a tu representación de los trabajadores. Si no hay acuerdo, el siguiente paso es la conciliación previa ante el servicio de mediación correspondiente y, en su caso, la vía judicial. Un asesor laboral puede orientarte según tu caso.",
    q4: "¿Las horas extra cuentan para la base de cotización y el IRPF?",
    a4:
      "Sí, en general. Lo que cobras por horas extra forma parte del salario bruto y se integra en las bases de cotización y en la base del IRPF, igual que el resto de partidas salariales. Por eso esta calculadora da cifras brutas: el neto dependerá de tu tipo de retención y de tus cotizaciones. Si lo que cobras por horas extra cambia tu tramo de retención, la diferencia se nota en la nómina del mes en que se pagan. Para ver el neto completo, usa la calculadora de salario neto.",
    q5: "¿Se guardan los datos que introduzco?",
    a5:
      "No. El cálculo se hace en tu propio navegador, con el código que ya se ha cargado en la página. Los datos no se envían a ningún servidor ni se guardan en la web. Al cerrar la pestaña se pierde el resultado.",
  },
  en: {
    title: "Overtime Calculator",
    subtitle:
      "Calculate what your overtime hours are worth, based on your gross annual salary, your working hours and your collective agreement premium.",
    intro1:
      "Overtime is work done beyond the ordinary working day set in your collective agreement or contract. Under Spain's Workers' Statute, overtime is paid at an amount that cannot be less than the ordinary hourly value, or it can be offset with paid rest time. The maximum is 80 overtime hours a year, subject to the exceptions in the law itself.",
    intro2:
      "Enter your gross annual salary, the ordinary hours in your year under your collective agreement, the overtime hours you have worked, and the premium your agreement pays. Enter 0 for no premium. The calculation runs in your browser and nothing is saved.",
    cardTitle: "Details",
    salaryLabel: "Gross annual salary (€)",
    ordinaryLabel: "Ordinary hours per year (per your agreement or working time)",
    overtimeLabel: "Overtime hours worked per year",
    premiumLabel: "Premium on the ordinary hour (%)",
    premiumHint: "Enter 0 if paid at the ordinary hourly value. Your agreement may set more.",
    invalid:
      "Check the data: salary and ordinary hours must be greater than zero, and overtime hours and premium cannot be negative.",
    capWarning:
      "You are over the legal maximum of 80 overtime hours a year. Check your case with your workers' representatives or an employment adviser.",
    hourlyLabel: "Ordinary hourly value",
    overtimeHourLabel: "Value of each overtime hour",
    amountLabel: "Gross annual amount",
    howTitle: "How it is calculated",
    howText:
      "Ordinary hourly value = gross annual salary ÷ ordinary hours per year. Overtime hour value = ordinary hourly value × (1 + premium ÷ 100). Amount = overtime hour value × overtime hours. The premium is optional: the law requires an overtime hour to be paid at least as an ordinary hour.",
    deepTitle: "Paying or offsetting with rest",
    deep:
      "Unless your agreement or contract says otherwise, the law says overtime must be offset with paid rest within the four months after it is worked. If the employer chooses to pay instead, the amount cannot be lower than the ordinary hourly value. This calculator only values payment in money: if you are given time off instead, its economic value is not shown here.",
    limitsTitle: "Limits of this calculator",
    limits:
      "The ordinary hourly value depends on how your agreement counts hours in a year, which may or may not include some pay items. This calculator uses the simplest formula and applies no income tax or contributions, so the result is gross. Night, holiday or Sunday hours may carry their own premiums in your agreement, which are not reflected here.",
    exampleTitle: "Worked example",
    example:
      "Gross annual salary of €30,000, 1,800 ordinary hours a year, 20 overtime hours and a 25% premium. Ordinary hourly value: 30,000 ÷ 1,800 = €16.67. Overtime hour value: 16.67 × 1.25 = €20.83. Amount: 20.83 × 20 = €416.67 gross a year.",
    sourceTitle: "Source of the figures",
    sourceText:
      "Spanish Workers' Statute (Estatuto de los Trabajadores), article 35.1 (an overtime hour is paid at least as an ordinary hour, or offset with rest within the following four months) and article 35.2 (maximum of 80 overtime hours a year), published in the Boletín Oficial del Estado.",
    faqTitle: "Frequently asked questions",
    q1: "How much do I get paid for an overtime hour?",
    a1:
      "At least the value of an ordinary hour, under article 35.1 of Spain's Workers' Statute. That value comes from dividing your gross annual salary by the ordinary hours of your working time. Your collective agreement may set a premium, for example 25% or 50%, applied on top of the ordinary hour. If your contract or agreement says nothing, the general rule is to pay at least the ordinary hourly value or to offset with rest. So check your agreement before accepting any figure.",
    q2: "What is the maximum number of overtime hours per year?",
    a2:
      "80 hours a year, under article 35.2 of the Workers' Statute. For people on part-time or fixed-term contracts whose annual working time is below the general one, the maximum is reduced in the same proportion. Hours offset with rest within the following four months do not count towards that limit. If you go over 80 hours in a year, the employer is breaking the law, and it is worth reviewing this with your union or an employment adviser before signing any agreement.",
    q3: "What if my employer neither pays me nor gives me rest?",
    a3:
      "If overtime is neither paid nor offset, what you are owed can be claimed. The law says that, without agreement, it must be offset with rest within the following four months. If that does not happen, you can ask in writing for payment or rest, keep your own record of the hours worked, and raise it with your workers' representatives. If there is still no agreement, the next step is the prior conciliation before the relevant mediation service and, if needed, the courts. An employment adviser can guide you on your case.",
    q4: "Do overtime hours count for contributions and income tax?",
    a4:
      "Generally yes. What you earn for overtime is part of your gross salary and is included in the contribution bases and in the income tax base, like any other pay item. That is why this calculator gives gross figures: your net pay depends on your withholding rate and contributions. If overtime pay moves you into a higher withholding bracket, the difference shows on the payslip of the month it is paid. For the full net figure, use the net salary calculator.",
    q5: "Are the data I enter saved?",
    a5:
      "No. The calculation runs in your own browser, with code that has already loaded on the page. The data are not sent to any server and are not stored on the website. Closing the tab removes the result with it.",
  },
};

export default function HorasExtras() {
  const locale = useLocale();
  const t = T[locale];
  const nf = new Intl.NumberFormat(locale === "en" ? "en-GB" : "es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  });

  const [salary, setSalary] = useState("");
  const [ordinary, setOrdinary] = useState("1800");
  const [overtime, setOvertime] = useState("");
  const [premium, setPremium] = useState("0");

  const num = (v: string) => Number(v.replace(",", "."));
  const result =
    salary.trim() !== "" && ordinary.trim() !== "" && overtime.trim() !== "" && premium.trim() !== ""
      ? computeOvertime(num(salary), num(ordinary), num(overtime), num(premium))
      : null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Timer className="h-6 w-6 text-primary" />
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
              <Label htmlFor="salary">{t.salaryLabel}</Label>
              <Input id="salary" inputMode="decimal" value={salary} onChange={(e) => setSalary(e.target.value)} className="mt-1" placeholder="30000" />
            </div>
            <div>
              <Label htmlFor="ordinary">{t.ordinaryLabel}</Label>
              <Input id="ordinary" inputMode="decimal" value={ordinary} onChange={(e) => setOrdinary(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="overtime">{t.overtimeLabel}</Label>
              <Input id="overtime" inputMode="decimal" value={overtime} onChange={(e) => setOvertime(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="premium">{t.premiumLabel}</Label>
              <Input id="premium" inputMode="decimal" value={premium} onChange={(e) => setPremium(e.target.value)} className="mt-1" />
              <p className="mt-1 text-xs text-muted-foreground">{t.premiumHint}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {salary.trim() !== "" && overtime.trim() !== "" && (
        <Card className="border-primary/30 bg-primary/5 mb-8">
          <CardContent className="pt-6">
            {result ? (
              <>
                <dl className="grid grid-cols-2 gap-4 text-center sm:grid-cols-3">
                  <div>
                    <dt className="text-sm text-muted-foreground">{t.hourlyLabel}</dt>
                    <dd className="text-2xl font-semibold">{nf.format(result.hourlyValue)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">{t.overtimeHourLabel}</dt>
                    <dd className="text-2xl font-semibold">{nf.format(result.overtimeHourValue)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">{t.amountLabel}</dt>
                    <dd className="text-2xl font-bold text-primary">{nf.format(result.amount)}</dd>
                  </div>
                </dl>
                {result.overCap && <p className="mt-4 text-sm text-destructive">{t.capWarning}</p>}
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

registerFaq("trabajo/horas-extras", T);
