import { useState } from "react";
import { registerFaq } from "@/lib/faq-schema";
import { House } from "lucide-react";
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

export interface RentalYieldResult {
  /** Annual rent collected, after months without tenant. */
  annualRent: number;
  /** Gross yield: annual rent / purchase price. */
  grossYieldPct: number;
  /** Annual running costs (IBI, community, insurance, maintenance). */
  annualCosts: number;
  /** Net yield: (annual rent - annual costs) / (price + purchase costs). */
  netYieldPct: number;
  /** Net rent per year before tax. */
  netRent: number;
}

/** Pure: gross and net rental yield before income tax.
 * Gross = annual rent ÷ price. Net = (annual rent − annual costs) ÷ (price + purchase
 * costs). Rent is counted only for the months the flat is let (vacancy is deducted).
 * Returns null for invalid input. */
export function computeRentalYield(
  price: number,
  purchaseCosts: number,
  monthlyRent: number,
  monthsRented: number,
  annualCosts: number,
): RentalYieldResult | null {
  if (!Number.isFinite(price) || price <= 0) return null;
  if (!Number.isFinite(purchaseCosts) || purchaseCosts < 0) return null;
  if (!Number.isFinite(monthlyRent) || monthlyRent < 0) return null;
  if (!Number.isFinite(monthsRented) || monthsRented < 0 || monthsRented > 12) return null;
  if (!Number.isFinite(annualCosts) || annualCosts < 0) return null;

  const annualRent = monthlyRent * monthsRented;
  const netRent = annualRent - annualCosts;
  return {
    annualRent,
    grossYieldPct: (annualRent / price) * 100,
    annualCosts,
    netYieldPct: (netRent / (price + purchaseCosts)) * 100,
    netRent,
  };
}

const T = {
  es: {
    title: "Calculadora de Rentabilidad de Alquiler",
    subtitle:
      "Calcula la rentabilidad bruta y neta de un piso en alquiler según su precio, la renta mensual y los gastos anuales.",
    intro1:
      "La rentabilidad de un alquiler se mide en porcentaje sobre lo que has invertido. La rentabilidad bruta divide la renta anual entre el precio de compra y es la cifra que se anuncia más a menudo. La rentabilidad neta descuenta los gastos que paga el propietario, como el IBI, la comunidad, el seguro o las reparaciones, y suma a la inversión los gastos de compra.",
    intro2:
      "Introduce el precio de compra, los gastos de compra (notaría, registro, impuestos), la renta mensual, los meses al año que el piso está alquilado y los gastos anuales. El cálculo se hace en tu navegador y no se guarda nada.",
    cardTitle: "Datos del inmueble",
    priceLabel: "Precio de compra (€)",
    purchaseLabel: "Gastos de compra (€)",
    rentLabel: "Renta mensual (€)",
    monthsLabel: "Meses alquilado al año",
    costsLabel: "Gastos anuales del propietario (€)",
    costsHint: "IBI, comunidad, seguro del hogar, reparaciones y gestión, sin contar la hipoteca.",
    invalid:
      "Revisa los datos: el precio debe ser mayor que cero, los meses entre 0 y 12, y ningún importe puede ser negativo.",
    grossLabel: "Rentabilidad bruta",
    netLabel: "Rentabilidad neta",
    rentLabelOut: "Renta neta anual",
    annualRentLabel: "Renta cobrada al año",
    howTitle: "Cómo se calcula",
    howText:
      "Renta anual = renta mensual × meses alquilado. Rentabilidad bruta = renta anual ÷ precio de compra × 100. Rentabilidad neta = (renta anual − gastos anuales) ÷ (precio de compra + gastos de compra) × 100. Ninguna cifra incluye el IRPF ni la hipoteca.",
    deepTitle: "Bruta frente a neta",
    deep:
      "La bruta sirve para comparar rápidamente pisos, pero ignora los gastos. La neta se acerca más a lo que queda en el bolsillo, aunque sigue sin contar impuestos ni financiación. Si compras con hipoteca, el coste financiero reduce el resultado final para el propietario; esta calculadora no lo incluye, así que para la rentabilidad real del capital propio hace falta otro cálculo.",
    limitsTitle: "Límites de esta calculadora",
    limits:
      "No incluye el IRPF sobre los alquileres, que se calcula con reglas de deducción propias, ni la hipoteca, ni la amortización del inmueble. Los gastos de compra son una estimación que tú introduces. Tampoco contempla el caso de un alquiler con fianza o garantías adicionales, que no son ingreso y no cambian la rentabilidad.",
    exampleTitle: "Ejemplo resuelto",
    example:
      "Piso de 150.000 € con 9.000 € de gastos de compra, renta de 700 € al mes, alquilado 11 meses al año y 2.400 € de gastos anuales. Renta anual: 700 × 11 = 7.700 €. Rentabilidad bruta: 7.700 ÷ 150.000 × 100 = 5,13 %. Rentabilidad neta: (7.700 − 2.400) ÷ (150.000 + 9.000) × 100 = 3,33 %.",
    sourceTitle: "Cómo se calcula",
    sourceText:
      "Las fórmulas son las de rentabilidad bruta y neta habituales en el mercado inmobiliario, sin datos oficiales. Los importes de gastos y de renta los pones tú según tu caso concreto.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Qué es una buena rentabilidad de alquiler?",
    a1:
      "No hay una cifra única. Como referencia, muchos inversores miran la rentabilidad bruta y la neta de la zona, y las comparan con las que ofrecen otros productos, como un depósito o un fondo de bajo riesgo. Una rentabilidad bruta alta puede esconder gastos grandes o un piso difícil de alquilar, y por eso conviene mirar la neta. Lo importante es comparar pisos de la misma zona y con el mismo tipo de inquilino, y tener en cuenta el riesgo de meses vacíos, las reparaciones y las obligaciones fiscales antes de decidir.",
    q2: "¿Por qué la rentabilidad neta es menor que la bruta?",
    a2:
      "Porque la neta resta los gastos anuales del propietario, como el IBI, la comunidad, el seguro o las reparaciones, y además suma a la inversión los gastos de compra, como notaría, registro e impuestos. Ambos efectos bajan el porcentaje. Por eso la neta siempre es menor que la bruta cuando hay gastos. Si la diferencia es muy grande, revisa si los gastos anuales que has introducido son realistas, porque suelen subestimarse, sobre todo las reparaciones y los meses sin inquilino.",
    q3: "¿Cuenta la hipoteca en la rentabilidad?",
    a3:
      "Esta calculadora no la incluye. La rentabilidad de la que hablamos mide el piso en sí, como si se hubiera comprado al contado. Si pides una hipoteca, lo que te queda como propietario depende de los intereses y de la cuota, y esa cifra se parece más a la rentabilidad sobre tu propio dinero. Para verla, calcula aparte la cuota anual, los intereses que pagas y el capital que aportas. La combinación de hipoteca y alquiler puede dar un resultado distinto al de la rentabilidad del inmueble.",
    q4: "¿Cuenta el IRPF en la rentabilidad?",
    a4:
      "Las cifras de esta página son antes de impuestos. El alquiler tributa en el IRPF como rendimiento del capital inmobiliario, con deducciones y reglas propias que dependen de tu situación. Por eso el dinero que queda al final puede ser menor que la rentabilidad neta calculada aquí. Si quieres saber lo que te queda después de impuestos, consulta con un asesor fiscal o revisa tu declaración con las deducciones que te correspondan. Esta calculadora no sustituye ese cálculo.",
    q5: "¿Se guardan los datos que introduzco?",
    a5:
      "No. El cálculo se hace en tu propio navegador, con el código que ya se ha cargado en la página. Los importes no se envían a ningún servidor ni se guardan en la web. Al cerrar la pestaña se pierde el resultado.",
  },
  en: {
    title: "Rental Yield Calculator",
    subtitle:
      "Calculate the gross and net rental yield of a flat based on its purchase price, monthly rent and annual running costs.",
    intro1:
      "Rental yield measures return as a percentage of what you have invested. Gross yield divides the annual rent by the purchase price and is the figure most often advertised. Net yield deducts the costs the owner pays, such as IBI property tax, community fees, insurance or repairs, and adds the purchase costs to the investment.",
    intro2:
      "Enter the purchase price, the purchase costs (notary, land registry, taxes), the monthly rent, the months per year the flat is let, and the annual running costs. The calculation runs in your browser and nothing is saved.",
    cardTitle: "Property details",
    priceLabel: "Purchase price (€)",
    purchaseLabel: "Purchase costs (€)",
    rentLabel: "Monthly rent (€)",
    monthsLabel: "Months let per year",
    costsLabel: "Annual running costs paid by the owner (€)",
    costsHint: "IBI, community fees, home insurance, repairs and management, excluding any mortgage.",
    invalid:
      "Check the data: the price must be greater than zero, months between 0 and 12, and no amount can be negative.",
    grossLabel: "Gross yield",
    netLabel: "Net yield",
    rentLabelOut: "Net annual rent",
    annualRentLabel: "Rent collected per year",
    howTitle: "How it is calculated",
    howText:
      "Annual rent = monthly rent × months let. Gross yield = annual rent ÷ purchase price × 100. Net yield = (annual rent − annual costs) ÷ (purchase price + purchase costs) × 100. None of the figures include income tax or a mortgage.",
    deepTitle: "Gross against net",
    deep:
      "Gross yield is useful to compare flats quickly, but it ignores costs. Net yield is closer to what stays in your pocket, although it still leaves out tax and financing. If you buy with a mortgage, the financing cost reduces what you keep as owner; this calculator does not include it, so the real return on your own capital needs a separate calculation.",
    limitsTitle: "Limits of this calculator",
    limits:
      "It does not include income tax on rent, which follows its own deduction rules, nor a mortgage, nor depreciation of the property. Purchase costs are an estimate you enter. It also does not model deposits or extra guarantees, which are not income and do not change the yield.",
    exampleTitle: "Worked example",
    example:
      "Flat of €150,000 with €9,000 of purchase costs, rent of €700 a month, let for 11 months a year and €2,400 of annual running costs. Annual rent: 700 × 11 = €7,700. Gross yield: 7,700 ÷ 150,000 × 100 = 5.13%. Net yield: (7,700 − 2,400) ÷ (150,000 + 9,000) × 100 = 3.33%.",
    sourceTitle: "How it is calculated",
    sourceText:
      "The formulas are the usual gross and net yield measures in the property market, with no official data. You enter the cost and rent figures according to your own case.",
    faqTitle: "Frequently asked questions",
    q1: "What is a good rental yield?",
    a1:
      "There is no single figure. As a reference, many investors compare the gross and net yields of an area with those of other products, such as a deposit or a low-risk fund. A high gross yield can hide large costs or a flat that is hard to let, which is why the net figure matters. What counts is comparing flats in the same area and for the same type of tenant, and weighing the risk of empty months, repairs and tax obligations before you decide.",
    q2: "Why is net yield lower than gross yield?",
    a2:
      "Because net yield deducts the owner's annual costs, such as IBI, community fees, insurance and repairs, and also adds the purchase costs, such as notary, land registry and taxes, to the investment. Both effects lower the percentage, so net is always below gross when there are costs. If the gap is very large, check whether the annual costs you entered are realistic, since they are often underestimated, especially repairs and months without a tenant.",
    q3: "Does a mortgage change the yield?",
    a3:
      "This calculator does not include one. The yield it measures is the property itself, as if it were bought outright. If you take a mortgage, what you keep as owner depends on the interest and the instalments, and that figure is closer to the return on your own money. To see it, calculate separately the annual instalments, the interest you pay and the capital you contribute. The mortgage and rent together can give a different result from the property yield.",
    q4: "Does income tax change the yield?",
    a4:
      "The figures on this page are before tax. Rental income is taxed under income tax as property capital income, with deductions and rules that depend on your situation. So what you keep at the end can be lower than the net yield calculated here. If you want to know what remains after tax, consult a tax adviser or review your return with the deductions that apply to you. This calculator does not replace that calculation.",
    q5: "Are the data I enter saved?",
    a5:
      "No. The calculation runs in your own browser, with code that has already loaded on the page. The amounts are not sent to any server and are not stored on the website. Closing the tab removes the result with it.",
  },
};

export default function RentabilidadAlquiler() {
  const locale = useLocale();
  const t = T[locale];
  const nf = new Intl.NumberFormat(locale === "en" ? "en-GB" : "es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
  const pf = new Intl.NumberFormat(locale === "en" ? "en-GB" : "es-ES", {
    style: "percent",
    maximumFractionDigits: 2,
  });

  const [price, setPrice] = useState("");
  const [purchase, setPurchase] = useState("0");
  const [rent, setRent] = useState("");
  const [months, setMonths] = useState("12");
  const [costs, setCosts] = useState("0");

  const num = (v: string) => Number(v.replace(",", "."));
  const result =
    price.trim() !== "" && rent.trim() !== "" && months.trim() !== "" && purchase.trim() !== "" && costs.trim() !== ""
      ? computeRentalYield(num(price), num(purchase), num(rent), num(months), num(costs))
      : null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <House className="h-6 w-6 text-primary" />
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
              <Label htmlFor="price">{t.priceLabel}</Label>
              <Input id="price" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1" placeholder="150000" />
            </div>
            <div>
              <Label htmlFor="purchase">{t.purchaseLabel}</Label>
              <Input id="purchase" inputMode="decimal" value={purchase} onChange={(e) => setPurchase(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="rent">{t.rentLabel}</Label>
              <Input id="rent" inputMode="decimal" value={rent} onChange={(e) => setRent(e.target.value)} className="mt-1" placeholder="700" />
            </div>
            <div>
              <Label htmlFor="months">{t.monthsLabel}</Label>
              <Input id="months" inputMode="decimal" value={months} onChange={(e) => setMonths(e.target.value)} className="mt-1" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="costs">{t.costsLabel}</Label>
              <Input id="costs" inputMode="decimal" value={costs} onChange={(e) => setCosts(e.target.value)} className="mt-1" />
              <p className="mt-1 text-xs text-muted-foreground">{t.costsHint}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {price.trim() !== "" && rent.trim() !== "" && (
        <Card className="border-primary/30 bg-primary/5 mb-8">
          <CardContent className="pt-6">
            {result ? (
              <dl className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
                <div>
                  <dt className="text-sm text-muted-foreground">{t.annualRentLabel}</dt>
                  <dd className="text-2xl font-semibold">{nf.format(result.annualRent)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">{t.grossLabel}</dt>
                  <dd className="text-2xl font-semibold">{pf.format(result.grossYieldPct / 100)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">{t.rentLabelOut}</dt>
                  <dd className="text-2xl font-semibold">{nf.format(result.netRent)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">{t.netLabel}</dt>
                  <dd className="text-2xl font-bold text-primary">{pf.format(result.netYieldPct / 100)}</dd>
                </div>
              </dl>
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

registerFaq("finanzas/rentabilidad-alquiler", T);
