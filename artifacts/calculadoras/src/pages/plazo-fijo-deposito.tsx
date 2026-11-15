import { useState } from "react";
import { registerFaq } from "@/lib/faq-schema";
import { Banknote } from "lucide-react";
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

export interface DepositResult {
  days: number;
  gross: number;
  withholding: number;
  net: number;
  total: number;
}

/** Pure: simple interest on a fixed-term deposit, paid at maturity. Interest is
 * capital × annual rate × days / 365 (actual/365, the usual convention for simple
 * interest). The withholding is applied to the interest, not to the capital.
 * Returns null for invalid inputs. Rates are in percent (e.g. 2.5 for 2.5 %). */
export function computeDeposit(
  capital: number,
  annualRatePct: number,
  days: number,
  withholdingPct: number,
): DepositResult | null {
  if (!Number.isFinite(capital) || capital <= 0) return null;
  if (!Number.isFinite(annualRatePct) || annualRatePct < 0) return null;
  if (!Number.isFinite(days) || days <= 0) return null;
  if (!Number.isFinite(withholdingPct) || withholdingPct < 0 || withholdingPct > 100) return null;

  const gross = (capital * (annualRatePct / 100) * days) / 365;
  const withholding = (gross * withholdingPct) / 100;
  const net = gross - withholding;
  return { days, gross, withholding, net, total: capital + net };
}

const T = {
  es: {
    title: "Calculadora de Plazo Fijo",
    subtitle:
      "Calcula cuánto cobras al vencimiento de un depósito a plazo fijo: intereses brutos, retención y total final.",
    intro1:
      "Un depósito a plazo fijo es un ahorro que inmovilizas durante un tiempo a cambio de un interés pactado. Al vencimiento recuperas el capital y los intereses. Con un plazo fijo de interés simple, el dinero no se capitaliza durante el plazo: los intereses se calculan siempre sobre el capital inicial y se cobran al final.",
    intro2:
      "Introduce el capital, el interés nominal anual que ofrece la entidad, los días del plazo y el porcentaje de retención que aplique. El cálculo se hace en tu navegador y no se guarda nada.",
    cardTitle: "Datos del depósito",
    capitalLabel: "Capital depositado (€)",
    rateLabel: "Interés nominal anual (%)",
    daysLabel: "Duración (días)",
    withholdingLabel: "Retención sobre intereses (%)",
    withholdingHint: "Pon 0 si tu entidad no aplica retención o no la conoces. Confírmala con la entidad.",
    invalid:
      "Revisa los datos: el capital y los días deben ser mayores que cero, el interés no puede ser negativo y la retención debe estar entre 0 y 100.",
    grossLabel: "Intereses brutos",
    withholdingShort: "Retención",
    netLabel: "Intereses netos",
    totalLabel: "Total al vencimiento",
    howTitle: "Cómo se calcula",
    howText:
      "Intereses brutos = capital × interés anual ÷ 100 × días ÷ 365. Retención = intereses brutos × retención ÷ 100. Intereses netos = intereses brutos − retención. Total al vencimiento = capital + intereses netos. Es interés simple: no hay reinversión de intereses durante el plazo.",
    deepTitle: "Interés nominal y TAE",
    deep:
      "El interés nominal es el porcentaje anual que se aplica al capital. La TAE, o tasa anual equivalente, incluye el efecto de cuándo se abonan los intereses y de las comisiones. Si el depósito paga los intereses solo al vencimiento y sin reinversión, el interés nominal y el cálculo de esta página coinciden con lo que vas a cobrar. Si la entidad paga intereses periódicos y los reinvierte, el cobro final será mayor, y la calculadora de interés compuesto te dará una cifra más ajustada.",
    exampleTitle: "Ejemplo resuelto",
    example:
      "Depósito de 10.000 € a 12 meses (365 días) con un interés nominal del 2 % y sin retención. Intereses brutos: 10.000 × 2 ÷ 100 × 365 ÷ 365 = 200 €. Total al vencimiento: 10.200 €. Si la retención fuera del 19 %, la retención sería 38 € y los intereses netos 162 €.",
    sourceTitle: "Cómo se calcula",
    sourceText:
      "La fórmula es la de interés simple con base actual/365, la convención habitual en depósitos. Las condiciones concretas (plazo, interés, retención y cancelación anticipada) las fija cada entidad en su contrato.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Qué diferencia hay entre el interés nominal y la TAE?",
    a1:
      "El interés nominal es el porcentaje anual que se aplica al capital, sin tener en cuenta cuándo se pagan los intereses. La TAE, la tasa anual equivalente, convierte ese interés en una cifra anual comparable entre productos que pagan con distinta frecuencia. Si el depósito paga los intereses solo al vencimiento y no los reinvierte, el cobro es el que resulta del nominal y los días, que es lo que calcula esta página. Para comparar dos depósitos con distinta duración o distinto pago de intereses, conviene mirar la TAE y el total al vencimiento que te indique cada entidad.",
    q2: "¿Cómo afecta la retención a lo que cobro?",
    a2:
      "La retención se aplica sobre los intereses, no sobre el capital. Si los intereses brutos son 200 € y la retención es del 19 %, la entidad retiene 38 € y tú recibes 162 € de intereses netos. Tu capital siempre vuelve íntegro. El porcentaje de retención depende de la normativa fiscal vigente y de cómo tu entidad lo aplique, así que conviene confirmarlo antes de contratar. Esta calculadora deja el campo a tu elección para que puedas ajustarlo al dato que te dé la entidad.",
    q3: "¿Qué pasa si saco el dinero antes del vencimiento?",
    a3:
      "Depende de las condiciones del contrato. Muchos depósitos a plazo fijo no permiten la cancelación anticipada, y en los que sí la permiten suele haber una penalización o se pierden los intereses del periodo transcurrido. Antes de contratar, revisa si hay cancelación anticipada y en qué condiciones. Si necesitas liquidez, un depósito a plazo más corto o un fondo de efectivo pueden encajar mejor, aunque suelen pagar menos interés que un plazo fijo largo.",
    q4: "¿Se capitalizan los intereses durante el plazo?",
    a4:
      "En un plazo fijo de interés simple, no. Los intereses se calculan siempre sobre el capital inicial y se abonan al final, así que no generan intereses por sí mismos. Si el producto reinvierte los intereses cada cierto tiempo, el resultado final es mayor, porque los intereses ganan a su vez intereses. Esa diferencia crece con el plazo y con el tipo de interés. Para ver cómo afecta la reinversión, compara con la calculadora de interés compuesto, que aplica esa regla.",
    q5: "¿Se guardan los datos que introduzco?",
    a5:
      "No. El cálculo se hace en tu propio navegador, con el código que ya se ha cargado en la página. Las cifras no se envían a ningún servidor ni se guardan en la web. Al cerrar la pestaña se pierde el resultado.",
  },
  en: {
    title: "Fixed Deposit Calculator",
    subtitle:
      "Calculate how much you receive at maturity on a fixed-term deposit: gross interest, withholding and the final total.",
    intro1:
      "A fixed-term deposit locks your savings for a set period in exchange for an agreed interest rate. At maturity you get back the capital plus the interest. With simple interest, the money does not compound during the term: interest is always calculated on the original capital and paid at the end.",
    intro2:
      "Enter the capital, the nominal annual interest the bank offers, the term in days, and the withholding rate that applies. The calculation runs in your browser and nothing is saved.",
    cardTitle: "Deposit details",
    capitalLabel: "Capital deposited (€)",
    rateLabel: "Nominal annual interest (%)",
    daysLabel: "Term (days)",
    withholdingLabel: "Withholding on interest (%)",
    withholdingHint: "Enter 0 if your bank applies no withholding or you do not know. Confirm it with the bank.",
    invalid:
      "Check the data: capital and days must be greater than zero, the interest cannot be negative, and withholding must be between 0 and 100.",
    grossLabel: "Gross interest",
    withholdingShort: "Withholding",
    netLabel: "Net interest",
    totalLabel: "Total at maturity",
    howTitle: "How it is calculated",
    howText:
      "Gross interest = capital × annual rate ÷ 100 × days ÷ 365. Withholding = gross interest × withholding rate ÷ 100. Net interest = gross interest − withholding. Total at maturity = capital + net interest. This is simple interest: interest is not reinvested during the term.",
    deepTitle: "Nominal rate and APR",
    deep:
      "The nominal rate is the annual percentage applied to the capital. The APR (annual percentage rate) also reflects when interest is paid and any fees. If the deposit pays interest only at maturity without reinvesting it, the nominal rate and the calculation on this page match what you will receive. If the bank pays periodic interest and reinvests it, the final amount will be higher, and the compound interest calculator gives a closer figure.",
    exampleTitle: "Worked example",
    example:
      "Deposit of €10,000 for 12 months (365 days) at a nominal rate of 2% with no withholding. Gross interest: 10,000 × 2 ÷ 100 × 365 ÷ 365 = €200. Total at maturity: €10,200. With a 19% withholding, the withholding would be €38 and net interest €162.",
    sourceTitle: "How it is calculated",
    sourceText:
      "The formula is simple interest on an actual/365 basis, the usual convention for deposits. The specific terms (term, rate, withholding and early cancellation) are set by each bank in its contract.",
    faqTitle: "Frequently asked questions",
    q1: "What is the difference between nominal interest and APR?",
    a1:
      "The nominal rate is the annual percentage applied to the capital, without considering when interest is paid. The APR, or annual percentage rate, turns that into an annual figure that can be compared across products that pay at different frequencies. If the deposit pays interest only at maturity and does not reinvest it, what you receive follows from the nominal rate and the number of days, which is what this page calculates. To compare two deposits with different terms or interest schedules, look at the APR and the total at maturity that each bank states.",
    q2: "How does withholding affect what I receive?",
    a2:
      "Withholding applies to the interest, not to the capital. If gross interest is €200 and withholding is 19%, the bank keeps €38 and you receive €162 in net interest. Your capital always comes back in full. The withholding rate depends on current tax rules and on how your bank applies them, so confirm it before you sign. This calculator leaves the field to you so you can match the figure the bank gives you.",
    q3: "What happens if I withdraw the money before maturity?",
    a3:
      "It depends on the contract. Many fixed-term deposits do not allow early cancellation, and where they do, there is usually a penalty or the interest for the elapsed period is lost. Before signing, check whether early cancellation is allowed and on what terms. If you may need the money sooner, a shorter deposit or a cash fund may suit you better, though they usually pay less interest than a longer fixed term.",
    q4: "Does the interest compound during the term?",
    a4:
      "In a simple-interest fixed term, no. Interest is always calculated on the original capital and paid at the end, so it does not earn interest itself. If the product reinvests interest at intervals, the final result is higher, because interest earns interest. That difference grows with the term and the rate. To see the effect of reinvestment, compare with the compound interest calculator, which applies that rule.",
    q5: "Are the data I enter saved?",
    a5:
      "No. The calculation runs in your own browser, with code that has already loaded on the page. The figures are not sent to any server and are not stored on the website. Closing the tab removes the result with it.",
  },
};

export default function PlazoFijoDeposito() {
  const locale = useLocale();
  const t = T[locale];
  const nf = new Intl.NumberFormat(locale === "en" ? "en-GB" : "es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  });

  const [capital, setCapital] = useState("10000");
  const [rate, setRate] = useState("2");
  const [days, setDays] = useState("365");
  const [withholding, setWithholding] = useState("0");

  const num = (v: string) => Number(v.replace(",", "."));
  const result =
    capital.trim() !== "" && rate.trim() !== "" && days.trim() !== "" && withholding.trim() !== ""
      ? computeDeposit(num(capital), num(rate), num(days), num(withholding))
      : null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Banknote className="h-6 w-6 text-primary" />
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
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="capital">{t.capitalLabel}</Label>
              <Input id="capital" inputMode="decimal" value={capital} onChange={(e) => setCapital(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="rate">{t.rateLabel}</Label>
              <Input id="rate" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="days">{t.daysLabel}</Label>
              <Input id="days" inputMode="numeric" value={days} onChange={(e) => setDays(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="withholding">{t.withholdingLabel}</Label>
              <Input
                id="withholding"
                inputMode="decimal"
                value={withholding}
                onChange={(e) => setWithholding(e.target.value)}
                className="mt-1"
              />
              <p className="mt-1 text-xs text-muted-foreground">{t.withholdingHint}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/30 bg-primary/5 mb-8">
        <CardContent className="pt-6">
          {result ? (
            <dl className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
              <div>
                <dt className="text-sm text-muted-foreground">{t.grossLabel}</dt>
                <dd className="text-2xl font-semibold">{nf.format(result.gross)}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">{t.withholdingShort}</dt>
                <dd className="text-2xl font-semibold">{nf.format(result.withholding)}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">{t.netLabel}</dt>
                <dd className="text-2xl font-semibold">{nf.format(result.net)}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">{t.totalLabel}</dt>
                <dd className="text-2xl font-bold text-primary">{nf.format(result.total)}</dd>
              </div>
            </dl>
          ) : (
            <p className="text-destructive">{t.invalid}</p>
          )}
        </CardContent>
      </Card>

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

      <section className="mt-10 text-sm text-muted-foreground">
        <h2 className="text-base font-semibold mb-2 text-gray-900 dark:text-white">{t.sourceTitle}</h2>
        <p>{t.sourceText}</p>
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

registerFaq("finanzas/plazo-fijo-deposito", T);
