import { useState } from "react";
import { registerFaq } from "@/lib/faq-schema";
import { Users } from "lucide-react";
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

export interface SplitResult {
  totalCents: number;
  baseCents: number;
  extraPeople: number; // people who pay one extra cent so the sum is exact
  people: number;
}

/** Splits an amount in cents among n people so the parts add up exactly to the
 * total. Every person pays floor(total / n) cents; the leftover cents are added,
 * one each, to the first people. Working in integer cents avoids float drift. */
export function splitBill(
  amount: number,
  people: number,
  tipPercent: number,
): SplitResult | null {
  if (!Number.isFinite(amount) || amount <= 0) return null;
  if (!Number.isInteger(people) || people < 1 || people > 50) return null;
  if (!Number.isFinite(tipPercent) || tipPercent < 0 || tipPercent > 100) return null;

  const totalCents = Math.round(amount * (1 + tipPercent / 100) * 100);
  const baseCents = Math.floor(totalCents / people);
  const extraPeople = totalCents - baseCents * people;
  return { totalCents, baseCents, extraPeople, people };
}

const T = {
  es: {
    title: "Dividir la Cuenta entre Amigos",
    subtitle: "Reparte un gasto entre varias personas, con propina si la hay, y sin que los céntimos se descuadren.",
    intro1: "Repartir una cuenta parece sencillo hasta que aparecen los céntimos: 100 € entre 3 personas no dan una cifra exacta, y si cada uno redondea por su cuenta, el total no cuadra. Esta calculadora reparte la cantidad en céntimos enteros, de modo que la suma de lo que paga cada persona siempre coincide con el total.",
    intro2: "Introduce el importe total, el número de personas y, si queréis dejar propina, su porcentaje. El resultado muestra cuánto paga cada uno y cuántos céntimos extra se reparten para cuadrar la cuenta. Todo se calcula en tu navegador.",
    cardTitle: "Datos de la cuenta",
    amountLabel: "Importe total (€)",
    peopleLabel: "Número de personas",
    tipLabel: "Propina (%)",
    invalid: "Revisa los datos: el importe debe ser mayor que 0, las personas un número entero entre 1 y 50, y la propina entre 0 y 100.",
    totalWithTip: "Total con propina",
    perPerson: "Cada persona paga",
    exactSplit: (extra: number, people: number, base: string, plusOne: string) =>
      `${extra} de ${people} personas pagan ${plusOne} € y las demás ${base} €, para que la suma sea exacta.`,
    howTitle: "Cómo se reparte la cuenta sin errores",
    howText: "La calculadora convierte el total en céntimos enteros y lo divide entre el número de personas. La parte entera de esa división es lo que paga cada uno. Si sobran céntimos, se asignan de uno en uno a las primeras personas. Así la suma de todos los pagos coincide exactamente con el total, algo que no siempre ocurre cuando cada persona redondea por su cuenta.",
    deepTitle: "Propina, reparto y decisiones prácticas",
    deep: "La propina se aplica sobre el importe antes de repartir. Si el 10 % de propina se suma al total de 60 € para cuatro personas, el total a pagar es 66 € y cada uno pone 16,50 €. Dividir antes de añadir la propina daría una cifra distinta y un total que no cuadra. Otra decisión práctica es si todos consumieron lo mismo: si no es así, repartir a partes iguales favorece a quien pidió menos. En ese caso conviene que cada uno pague lo suyo y se añada la parte proporcional de la propina y de los gastos comunes, en lugar de dividir el total entre todos.",
    exampleTitle: "Ejemplo resuelto",
    example: "Cuenta de 100 € para 3 personas con 10 % de propina. El total es 110 €, es decir, 11.000 céntimos. 11.000 / 3 = 3.666 céntimos con resto 2. Cada persona paga 36,66 € como base, y 2 de ellas pagan 36,67 €. La suma es 36,67 × 2 + 36,66 = 110,00 €.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Cómo se reparte una cuenta de forma exacta?",
    a1: "Se convierte el total en céntimos enteros, se divide entre el número de personas y se toma la parte entera como pago base. Los céntimos que sobran se suman de uno en uno a algunas personas, de forma que la suma de todos los pagos sea exactamente el total. Este método evita que la suma de redondeos individuales difiera del importe de la factura, un problema habitual cuando cada uno calcula a ojo o usa una calculadora que redondea sin control.",
    q2: "¿Se aplica la propina antes o después de dividir?",
    a2: "Antes. La propina es un porcentaje del importe de la cuenta, así que primero se calcula el total con propina y después se reparte. Si se divide primero y se añade luego la propina a cada parte, el resultado es casi igual, pero puede haber diferencias de céntimos que impiden que la suma cuadre con el total del ticket. Calcular el total y repartirlo después garantiza la coincidencia.",
    q3: "¿Qué hago si no todos han consumido lo mismo?",
    a3: "Lo más justo suele ser que cada persona pague lo que ha pedido y que después se reparta a partes iguales solo lo que es común, como la propina sobre el total o un postre compartido. Esta calculadora sirve para la parte igualitaria: si introduces solo el importe que se reparte por igual, obtienes la cuota de cada uno. Para la parte individual basta con sumar lo que pidió cada persona a su cuota.",
    q4: "¿Por qué salen céntimos distintos para algunas personas?",
    a4: "Porque el importe en céntimos no siempre se puede dividir en partes iguales. Si el total son 10,00 € entre 3 personas, cada una pagaría 3,333 € con infinitos decimales. La calculadora redondea a céntimos y ajusta: una persona paga 3,34 € y dos pagan 3,33 €, de modo que la suma sigue siendo 10,00 €. Esa diferencia de un céntimo es la forma más justa de cuadrar la cuenta.",
    q5: "¿Se guardan los importes que introduzco?",
    a5: "No. El cálculo se hace en tu propio navegador con el código que ya se ha cargado en la página. Los importes y el número de personas no se envían a ningún servidor ni se almacenan en la web. Si cierras la pestaña, el resultado desaparece con ella.",
  },
  en: {
    title: "Split the Bill Among Friends",
    subtitle: "Share an expense between several people, with a tip if you add one, without the cents failing to add up.",
    intro1: "Splitting a bill looks simple until the cents appear: 100 € among 3 people has no exact figure, and if everyone rounds on their own the total does not add up. This calculator divides the amount in whole cents, so the sum of what each person pays always matches the total.",
    intro2: "Enter the total amount, the number of people and, if you want to leave a tip, its percentage. The result shows how much each person pays and how many extra cents are shared out to balance the bill. Everything is calculated in your browser.",
    cardTitle: "Bill details",
    amountLabel: "Total amount (€)",
    peopleLabel: "Number of people",
    tipLabel: "Tip (%)",
    invalid: "Check the details: the amount must be greater than 0, the people a whole number from 1 to 50, and the tip between 0 and 100.",
    totalWithTip: "Total with tip",
    perPerson: "Each person pays",
    exactSplit: (extra: number, people: number, base: string, plusOne: string) =>
      `${extra} of ${people} people pay €${plusOne} and the rest pay €${base}, so the sum is exact.`,
    howTitle: "How the bill is split without errors",
    howText: "The calculator converts the total into whole cents and divides it by the number of people. The whole part of that division is what each person pays. If cents are left over, they are assigned one at a time to the first people. The sum of all payments then matches the total exactly, which does not always happen when each person rounds on their own.",
    deepTitle: "Tip, sharing and practical decisions",
    deep: "The tip is applied to the amount before splitting. If a 10% tip is added to a 60 € bill for four people, the total to pay is 66 € and each person pays 16.50 €. Dividing first and adding the tip afterwards gives a different figure and a total that does not match the receipt. Another practical question is whether everyone ordered the same: if not, splitting equally favours whoever ordered least. In that case it is fairer for each person to pay for what they ordered, adding their share of the tip and of any shared items, instead of dividing the whole bill evenly.",
    exampleTitle: "Worked example",
    example: "A 100 € bill for 3 people with a 10% tip. The total is 110 €, that is 11,000 cents. 11,000 / 3 = 3,666 cents with a remainder of 2. Each person pays 36.66 € as a base, and 2 of them pay 36.67 €. The sum is 36.67 × 2 + 36.66 = 110.00 €.",
    faqTitle: "Frequently asked questions",
    q1: "How do you split a bill exactly?",
    a1: "Convert the total into whole cents, divide it by the number of people and take the whole part as the base payment. The leftover cents are added one at a time to some of the people, so that the sum of all payments is exactly the total. This avoids the common problem where individual rounding makes the sum differ from the receipt, which happens when everyone works it out by eye or uses a calculator that rounds without control.",
    q2: "Is the tip applied before or after dividing?",
    a2: "Before. The tip is a percentage of the bill, so you first calculate the total with the tip and then split it. If you divide first and add the tip to each share, the result is almost the same, but cent differences can stop the sum from matching the receipt total. Calculating the total and then splitting it guarantees the match.",
    q3: "What do I do if not everyone ordered the same?",
    a3: "The fairest approach is usually for each person to pay for what they ordered, and then to split equally only the shared part, such as the tip on the total or a shared dessert. This calculator handles the equal part: if you enter only the amount to be shared equally, you get each person's share. For the individual part, simply add what each person ordered to their share.",
    q4: "Why do some people pay slightly different amounts?",
    a4: "Because the amount in cents does not always divide into equal parts. If the total is 10.00 € among 3 people, each would pay 3.333 €, which has endless decimals. The calculator rounds to cents and adjusts: one person pays 3.34 € and two pay 3.33 €, so the sum is still 10.00 €. That one-cent difference is the fairest way to balance the bill.",
    q5: "Are the amounts I enter saved?",
    a5: "No. The calculation runs in your own browser, with code that has already loaded on the page. The amounts and the number of people are not sent to any server and are not stored on the website. Closing the tab removes the result with it.",
  },
};

export default function DividirCuenta() {
  const locale = useLocale();
  const t = T[locale];
  const nf = new Intl.NumberFormat(locale === "en" ? "en-GB" : "es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const [amount, setAmount] = useState("");
  const [people, setPeople] = useState("2");
  const [tip, setTip] = useState("0");

  const amountNum = amount.trim() === "" ? NaN : Number(amount.replace(",", "."));
  const peopleNum = people.trim() === "" ? NaN : Number(people);
  const tipNum = tip.trim() === "" ? 0 : Number(tip.replace(",", "."));
  const result = splitBill(amountNum, peopleNum, tipNum);

  const fmt = (cents: number) => nf.format(cents / 100);

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Users className="h-6 w-6 text-primary" />
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
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="amount">{t.amountLabel}</Label>
            <Input
              id="amount"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1"
              placeholder="100"
            />
          </div>
          <div>
            <Label htmlFor="people">{t.peopleLabel}</Label>
            <Input
              id="people"
              type="number"
              min={1}
              max={50}
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="tip">{t.tipLabel}</Label>
            <Input
              id="tip"
              inputMode="decimal"
              value={tip}
              onChange={(e) => setTip(e.target.value)}
              className="mt-1"
              placeholder="0"
            />
          </div>
        </CardContent>
      </Card>

      {amount.trim() !== "" && (
        <Card className="border-primary/30 bg-primary/5 mb-8">
          <CardContent className="pt-6 text-center">
            {result ? (
              <>
                <p className="text-sm text-muted-foreground mb-1">{t.perPerson}</p>
                <p className="text-4xl font-bold text-primary">
                  {fmt(result.baseCents)} €
                </p>
                {result.extraPeople > 0 && (
                  <p className="mt-2 text-muted-foreground">
                    {t.exactSplit(
                      result.extraPeople,
                      result.people,
                      fmt(result.baseCents),
                      fmt(result.baseCents + 1),
                    )}
                  </p>
                )}
                <p className="mt-3 text-muted-foreground">
                  {t.totalWithTip}: <span className="font-semibold">{fmt(result.totalCents)} €</span>
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

registerFaq("finanzas/dividir-cuenta", T);
