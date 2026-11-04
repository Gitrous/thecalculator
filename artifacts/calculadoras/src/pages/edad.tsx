import { useState } from "react";
import { registerFaq } from "@/lib/faq-schema";
import { Cake } from "lucide-react";
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

const DAY_MS = 86_400_000;

interface Ymd {
  y: number;
  m: number; // 1..12
  d: number;
}

/** Parses a "YYYY-MM-DD" string from an <input type="date">. Rejects dates that
 * do not exist (for example 30 February), so the result is always a real day. */
function parseYmd(s: string): Ymd | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const check = new Date(Date.UTC(y, m - 1, d));
  if (check.getUTCFullYear() !== y || check.getUTCMonth() !== m - 1 || check.getUTCDate() !== d) {
    return null;
  }
  return { y, m, d };
}

/** Days in month m (1..12) of year y. Day 0 of the next month is the last day. */
function daysInMonth(y: number, m: number): number {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

/** UTC timestamp of the anniversary that is k whole months after the birth date.
 * A birth on the 31st falls on the last day of shorter months instead of rolling
 * into the next month, so months are never skipped or double-counted. */
function anniversary(b: Ymd, k: number): number {
  const idx = b.m - 1 + k;
  const y = b.y + Math.floor(idx / 12);
  const m0 = idx % 12;
  const d = Math.min(b.d, daysInMonth(y, m0 + 1));
  return Date.UTC(y, m0, d);
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  nextIn: number;
  nextAge: number;
}

export function computeAge(birth: string, ref: string): AgeResult | null {
  const b = parseYmd(birth);
  const r = parseYmd(ref);
  if (!b || !r) return null;
  const birthUtc = Date.UTC(b.y, b.m - 1, b.d);
  const refUtc = Date.UTC(r.y, r.m - 1, r.d);
  if (birthUtc > refUtc) return null;

  // Largest whole number of months k such that the anniversary is not after the reference.
  let k = (r.y - b.y) * 12 + (r.m - b.m);
  while (k > 0 && anniversary(b, k) > refUtc) k -= 1;
  while (anniversary(b, k + 1) <= refUtc) k += 1;

  const days = Math.round((refUtc - anniversary(b, k)) / DAY_MS);

  // Next birthday: this year's anniversary if still ahead, otherwise next year's.
  let nextUtc = Date.UTC(r.y, b.m - 1, Math.min(b.d, daysInMonth(r.y, b.m)));
  if (nextUtc < refUtc) {
    nextUtc = Date.UTC(r.y + 1, b.m - 1, Math.min(b.d, daysInMonth(r.y + 1, b.m)));
  }

  return {
    years: Math.floor(k / 12),
    months: k % 12,
    days,
    totalDays: Math.round((refUtc - birthUtc) / DAY_MS),
    nextIn: Math.round((nextUtc - refUtc) / DAY_MS),
    nextAge: new Date(nextUtc).getUTCFullYear() - b.y,
  };
}

function todayLocal(): string {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${mm}-${dd}`;
}

const T = {
  es: {
    title: "Calculadora de Edad",
    subtitle: "Calcula tu edad exacta en años, meses y días, los días que llevas vivo y cuánto falta para tu próximo cumpleaños.",
    intro1: "La edad se cuenta en años cumplidos: un año se completa cuando llega la fecha de cumpleaños del año siguiente. Por eso restar el año de nacimiento al año actual no siempre da la edad real. Si todavía no has cumplido años este año, el resultado de esa resta es uno más de lo que tienes.",
    intro2: "Introduce tu fecha de nacimiento. Si quieres saber la edad en otra fecha, como la de una solicitud, un examen o un evento, cambia la fecha de referencia. El cálculo se hace en tu navegador y no se envía ningún dato a ningún servidor.",
    cardTitle: "Fechas",
    birthLabel: "Fecha de nacimiento",
    refLabel: "Fecha de referencia (hoy por defecto)",
    invalid: "Revisa las fechas: la de nacimiento debe existir y no puede ser posterior a la de referencia.",
    ageLabel: "Edad",
    yearsWord: (n: number) => (n === 1 ? "año" : "años"),
    monthsWord: (n: number) => (n === 1 ? "mes" : "meses"),
    daysWord: (n: number) => (n === 1 ? "día" : "días"),
    totalLabel: "Días vividos",
    nextToday: "¡Hoy es tu cumpleaños!",
    nextLabel: (days: number, age: number) =>
      `Próximo cumpleaños en ${days} ${days === 1 ? "día" : "días"}, cuando cumplas ${age} ${age === 1 ? "año" : "años"}.`,
    howTitle: "Cómo se calcula la edad exacta",
    howText: "La calculadora cuenta los meses completos entre las dos fechas sin pasar nunca del aniversario, y después cuenta los días que sobran. Si naciste el 31 de un mes y la fecha de referencia cae en un mes de 30 días, el aniversario de ese mes se toma el último día disponible, así que no se pierde ningún mes ni se cuenta un día de más. Los años bisiestos se tienen en cuenta de forma automática, porque se usa el calendario real y no una aproximación de 365 días por año.",
    deepTitle: "Por qué la edad no es solo una resta",
    deep: "Restar el año de nacimiento al año actual sirve como estimación rápida, pero se equivoca durante buena parte del año. Quien cumple años en diciembre tiene durante once meses un año menos de lo que indica la resta. Por eso la forma fiable es comparar la fecha completa: día, mes y año. La calculadora hace exactamente eso. Primero busca cuántos meses completos han pasado desde el nacimiento, y luego suma los días transcurridos desde el último aniversario. Con esos dos valores obtiene los años, los meses sobrantes y los días. El mismo método sirve para calcular la edad en cualquier fecha futura o pasada, por ejemplo para saber si una persona cumplirá una edad concreta antes de una fecha límite.",
    exampleTitle: "Ejemplo resuelto",
    example: "Nacimiento: 14 de marzo de 1990. Referencia: 2 de noviembre de 2026. Desde el 14 de marzo de 2026 han pasado 7 meses y 19 días, así que la edad es 36 años, 7 meses y 19 días. Los días vividos son 13.382. El siguiente cumpleaños es el 14 de marzo de 2027: faltan 132 días y se cumplen 37 años.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Cómo se calcula la edad en años, meses y días?",
    a1: "Se toma la fecha de nacimiento y se avanza mes a mes, sin pasar de la fecha de referencia, hasta llegar al último aniversario anterior a esa fecha. Los meses completos dan los años y los meses sobrantes, y los días que faltan desde ese último aniversario son los días. Es el mismo método que usan la mayoría de registros y trámites cuando piden edad exacta, y evita errores típicos como restar solo los años o contar meses de 30 días.",
    q2: "¿Por qué restar el año de nacimiento no siempre da la edad correcta?",
    a2: "Porque la edad cambia en el día del cumpleaños, no el 1 de enero. Si cumples años el 20 de julio y hoy es 10 de marzo, el año en curso todavía no te ha sumado uno, aunque el año de nacimiento indique lo contrario. Por eso la diferencia entre años puede ser una unidad mayor que la edad real durante casi todo el año. Para saber la edad exacta hay que comparar la fecha completa.",
    q3: "¿Qué pasa si nací el 29 de febrero?",
    a3: "En los años que no son bisiestos no existe el 29 de febrero. Esta calculadora usa el 28 de febrero como aniversario en esos años, de modo que la edad avanza ese día. Algunas personas celebran el cumpleaños el 1 de marzo. Si necesitas la fecha a efectos oficiales, consulta la norma o el organismo que lo pida, porque la regla puede variar según el trámite.",
    q4: "¿Puedo calcular la edad que tendré en una fecha futura?",
    a4: "Sí. Cambia la fecha de referencia por la fecha futura que te interese y la calculadora mostrará la edad en esa fecha. Es útil para comprobar si cumplirás una edad antes de un plazo, de una beca, de una convocatoria o de un examen con límite de edad. Ten en cuenta que el resultado depende solo de las dos fechas, así que siempre es exacto para el calendario real.",
    q5: "¿Se guardan o se envían mis fechas?",
    a5: "No. El cálculo se hace en tu propio navegador, con el código que ya se ha cargado en la página. Las fechas que introduces no se envían a ningún servidor ni se almacenan en la web. Si cierras la pestaña, el resultado desaparece con ella.",
  },
  en: {
    title: "Age Calculator",
    subtitle: "Calculate your exact age in years, months and days, the number of days you have lived, and how long until your next birthday.",
    intro1: "Age is counted in completed years: a year is completed when your birthday arrives in the following year. That is why subtracting your birth year from the current year does not always give your real age. If your birthday has not yet come this year, that subtraction gives one more year than you actually have.",
    intro2: "Enter your date of birth. If you want to know your age on another date, such as the date of an application, an exam or an event, change the reference date. The calculation runs in your browser and no data is sent to any server.",
    cardTitle: "Dates",
    birthLabel: "Date of birth",
    refLabel: "Reference date (today by default)",
    invalid: "Check the dates: the date of birth must exist and cannot be later than the reference date.",
    ageLabel: "Age",
    yearsWord: (n: number) => (n === 1 ? "year" : "years"),
    monthsWord: (n: number) => (n === 1 ? "month" : "months"),
    daysWord: (n: number) => (n === 1 ? "day" : "days"),
    totalLabel: "Days lived",
    nextToday: "Today is your birthday!",
    nextLabel: (days: number, age: number) =>
      `Next birthday in ${days} ${days === 1 ? "day" : "days"}, when you turn ${age}.`,
    howTitle: "How the exact age is calculated",
    howText: "The calculator counts the whole months between the two dates without ever passing an anniversary, and then counts the days left over. If you were born on the 31st of a month and the reference date falls in a 30-day month, that anniversary is taken as the last available day, so no month is lost and no day is added. Leap years are handled automatically because the real calendar is used, not an approximation of 365 days per year.",
    deepTitle: "Why age is not just a subtraction",
    deep: "Subtracting the birth year from the current year is a quick estimate, but it is wrong for much of the year. Someone born in December is one year younger than the subtraction suggests for eleven months. The reliable method is to compare the full date: day, month and year. The calculator does exactly that. It first finds how many complete months have passed since birth, then adds the days elapsed since the last anniversary. From those two values it obtains the years, the leftover months and the days. The same method works for any past or future date, for example to check whether someone will reach a given age before a deadline.",
    exampleTitle: "Worked example",
    example: "Birth: 14 March 1990. Reference: 2 November 2026. Since 14 March 2026, 7 months and 19 days have passed, so the age is 36 years, 7 months and 19 days. The days lived are 13,382. The next birthday is 14 March 2027: 132 days away, when the person turns 37.",
    faqTitle: "Frequently asked questions",
    q1: "How is age calculated in years, months and days?",
    a1: "Start from the date of birth and move forward month by month, without passing the reference date, until you reach the last anniversary before that date. The complete months give the years and the leftover months, and the days between that last anniversary and the reference date are the days. This is the same method most records and forms use when they ask for an exact age, and it avoids common mistakes such as subtracting only the years or counting months as 30 days.",
    q2: "Why does subtracting the birth year not always give the right age?",
    a2: "Because age changes on the birthday, not on 1 January. If your birthday is 20 July and today is 10 March, the current year has not yet added one to your age, even though the birth year suggests otherwise. That is why the difference between years can be one higher than the real age for most of the year. To get the exact age you have to compare the complete date.",
    q3: "What happens if I was born on 29 February?",
    a3: "In years that are not leap years there is no 29 February. This calculator uses 28 February as the anniversary in those years, so age moves forward that day. Some people celebrate on 1 March instead. If you need the date for an official purpose, check the rule of the body that asks for it, because the convention can vary by procedure.",
    q4: "Can I calculate the age I will be on a future date?",
    a4: "Yes. Change the reference date to the future date you are interested in and the calculator shows the age on that day. It is useful to check whether you will reach an age before a deadline, a scholarship, a call for applications or an exam with an age limit. The result depends only on the two dates, so it is always exact for the real calendar.",
    q5: "Are my dates saved or sent anywhere?",
    a5: "No. The calculation runs in your own browser, with code that has already loaded on the page. The dates you enter are not sent to any server and are not stored on the website. Closing the tab removes the result with it.",
  },
};

function plural(n: number, word: (n: number) => string): string {
  return `${n} ${word(n)}`;
}

export default function Edad() {
  const locale = useLocale();
  const t = T[locale];

  const [birth, setBirth] = useState("");
  const [ref, setRef] = useState(todayLocal);
  const result = birth ? computeAge(birth, ref) : null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Cake className="h-6 w-6 text-primary" />
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
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="birth">{t.birthLabel}</Label>
            <Input
              id="birth"
              type="date"
              value={birth}
              onChange={(e) => setBirth(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="ref">{t.refLabel}</Label>
            <Input
              id="ref"
              type="date"
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {birth && (
        <Card className="border-primary/30 bg-primary/5 mb-8">
          <CardContent className="pt-6 text-center">
            {result ? (
              <>
                <p className="text-sm text-muted-foreground mb-1">{t.ageLabel}</p>
                <p className="text-4xl font-bold text-primary">
                  {plural(result.years, t.yearsWord)}, {plural(result.months, t.monthsWord)} {locale === "en" ? "and" : "y"} {plural(result.days, t.daysWord)}
                </p>
                <p className="mt-3 text-muted-foreground">
                  {t.totalLabel}: <span className="font-semibold">{result.totalDays.toLocaleString(locale === "en" ? "en-GB" : "es-ES")}</span>
                </p>
                <p className="mt-1 text-muted-foreground">
                  {result.nextIn === 0 ? t.nextToday : t.nextLabel(result.nextIn, result.nextAge)}
                </p>
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
        <h3 className="text-base font-semibold mt-6 mb-2 text-gray-900 dark:text-white">{t.exampleTitle}</h3>
        <p>{t.example}</p>
      </section>

      <AdUnit slot={AD_SLOTS.midContent} className="my-10" />

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

registerFaq("trabajo/edad", T);
