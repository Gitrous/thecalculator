import { useState } from "react";
import { registerFaq } from "@/lib/faq-schema";
import { Percent } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { useLocale } from "@/lib/locale";

function pct(n: number) {
  return n.toLocaleString("es-ES", { minimumFractionDigits: 4, maximumFractionDigits: 4 }) + "%";
}

const FRECUENCIAS_ES = [
  { value: "12", label: "Mensual (12 veces/año)" },
  { value: "4", label: "Trimestral (4 veces/año)" },
  { value: "2", label: "Semestral (2 veces/año)" },
  { value: "1", label: "Anual (1 vez/año)" },
  { value: "365", label: "Diaria (365 veces/año)" },
  { value: "52", label: "Semanal (52 veces/año)" },
];

const FRECUENCIAS_EN = [
  { value: "12", label: "Monthly (12 times/year)" },
  { value: "4", label: "Quarterly (4 times/year)" },
  { value: "2", label: "Semi-annual (2 times/year)" },
  { value: "1", label: "Annual (1 time/year)" },
  { value: "365", label: "Daily (365 times/year)" },
  { value: "52", label: "Weekly (52 times/year)" },
];

const T = {
  es: {
    title: "Calculadora TAE / TIN",
    subtitle: "Convierte entre TIN (Tipo de Interés Nominal) y TAE (Tasa Anual Equivalente) según la frecuencia de capitalización. Imprescindible para comparar hipotecas, préstamos y depósitos.",
    intro1: "La TAE (Tasa Anual Equivalente) es el indicador que permite comparar de forma homogénea distintos productos financieros. La TAE contractual que publica una entidad incorpora el tipo de interés nominal (TIN), la frecuencia de capitalización y las comisiones y gastos obligatorios de la operación; es el dato que, por ley, las entidades financieras deben mostrar de forma destacada en su publicidad de préstamos, hipotecas y depósitos.",
    intro2: "Esta calculadora convierte en ambas direcciones entre TIN y TAE usando la fórmula estándar: TAE = (1 + TIN/n)^n − 1, donde n es la frecuencia de capitalización anual. También genera una tabla comparativa para visualizar cómo varía la TAE según la frecuencia (diaria, semanal, mensual, trimestral, semestral o anual). El resultado es, por tanto, la TAE matemática equivalente derivada del TIN y la frecuencia de capitalización. No calcula la TAE contractual completa de un préstamo o hipoteca cuando existen comisiones, gastos u otros costes. Para comparar ofertas reales, utiliza la TAE publicada por la entidad financiera.",
    disclaimer: "Los resultados de la conversión TIN↔TAE son matemáticamente exactos, pero solo reflejan el efecto de la capitalización. La TAE contractual de un préstamo suele ser mayor porque incorpora además las comisiones y gastos obligatorios, que esta herramienta no incluye.",
    cardTitle: "Convertidor",
    freqLabel: "Frecuencia de capitalización",
    tinLabel: "TIN (%)",
    taeLabel: "TAE (%)",
    equivalentTae: "TAE matemática equivalente (por capitalización)",
    mathNote: "Esta calculadora calcula la TAE matemática equivalente derivada del TIN y la frecuencia de capitalización. No calcula la TAE contractual completa de un préstamo o hipoteca cuando existen comisiones, gastos u otros costes. Para comparar ofertas reales, utiliza la TAE publicada por la entidad financiera.",
    equivalentTin: "TIN equivalente",
    tableTitle: (tin: string) => `TAE según frecuencia de capitalización — TIN ${tin}%`,
    faqTitle: "Preguntas frecuentes",
    q1: "¿Cuál es la diferencia entre TIN y TAE?",
    a1: (<>El <strong>TIN</strong> (Tipo de Interés Nominal) es el porcentaje de interés que el banco cobra o paga sobre el capital, sin considerar la frecuencia de capitalización ni comisiones. La <strong>TAE</strong> (Tasa Anual Equivalente) incluye el efecto de la capitalización y, en la TAE contractual de un préstamo, también las comisiones y gastos obligatorios. La TAE es el indicador legal que permite comparar productos financieros. Esta calculadora solo aplica el efecto de la capitalización, no las comisiones.</>),
    q2: "¿Por qué la TAE es siempre mayor que el TIN?",
    a2: "Porque la capitalización compuesta genera intereses sobre intereses. Cuanto más frecuente sea la capitalización (mensual es más que anual), mayor será la diferencia entre TAE y TIN. Si la capitalización es anual, TAE = TIN.",
    q3: "¿Qué debo mirar al comparar hipotecas?",
    a3: (<>Siempre compara la <strong>TAE</strong>, no el TIN ni el diferencial. La TAE de una hipoteca incluye el tipo de interés y las comisiones obligatorias (apertura, estudio), aunque legalmente no incluye seguros vinculados. En hipotecas variables, fíjate en el diferencial sobre el Euríbor + TAE del primer año.</>),
    q4: "¿Sirve la TAE para comparar depósitos y cuentas de ahorro?",
    a4: "Sí, y es precisamente donde resulta más útil, porque permite comparar productos con frecuencias de abono distintas. Un depósito que paga un 3 % TIN con liquidación mensual rinde más que otro al 3 % con liquidación anual, aunque el TIN anunciado sea idéntico: sus TAE son 3,04 % y 3,00 % respectivamente. En productos de ahorro conviene fijarse en que la TAE anunciada corresponda al plazo completo y no a una promoción de bienvenida de los primeros meses, una práctica habitual que infla la cifra publicitada.",
    q5: "¿Qué comisiones entran en el cálculo de la TAE?",
    a5: "En un préstamo, la TAE incorpora todas las comisiones y gastos obligatorios que el cliente debe pagar para obtener la financiación: comisión de apertura, de estudio y gastos de formalización que corran a su cargo. No incluye, en cambio, los seguros vinculados de hogar o vida, ni los gastos de notaría y registro en el caso hipotecario, ni las comisiones eventuales que solo se pagan si ocurre algo, como la de amortización anticipada o la de reclamación de impagados. Por eso dos hipotecas con la misma TAE pueden tener costes reales distintos según los productos vinculados que exijan.",
    deepTitle: "Cómo se calcula la TAE a partir del TIN",
    deep: "La fórmula que relaciona ambos indicadores es TAE = (1 + TIN/n)^n − 1, donde n es el número de veces que se capitalizan los intereses en un año. La lógica es sencilla: si los intereses se abonan varias veces al año, los generados en cada período pasan a producir intereses ellos mismos durante el resto del ejercicio, de modo que la rentabilidad efectiva supera al tipo nominal anunciado. Cuando la capitalización es anual (n = 1) la fórmula se simplifica y TAE y TIN coinciden. Conforme n crece, la TAE aumenta, aunque lo hace cada vez más despacio hasta acercarse a un límite matemático.",
    exampleTitle: "Ejemplo resuelto",
    example: "Tomemos un TIN del 6 % con capitalización mensual, es decir, n = 12. Aplicamos la fórmula: TAE = (1 + 0,06/12)^12 − 1 = (1 + 0,005)^12 − 1 = 1,061678 − 1 = 0,061678, es decir, un 6,17 %. La diferencia de 0,17 puntos parece pequeña, pero sobre un capital de 200.000 € a treinta años se traduce en varios miles de euros. Si la capitalización fuese trimestral (n = 4), la TAE sería del 6,14 %; si fuese anual, coincidiría exactamente con el 6 % del TIN.",
    refTableTitle: "TAE resultante de un TIN del 6 % según la capitalización",
    tableCol1: "Frecuencia",
    tableCol2: "TAE",
    interpretTitle: "Cómo interpretar el resultado",
    interpret: "La TAE es el único indicador que la ley obliga a publicar precisamente para que puedas comparar productos entre entidades en igualdad de condiciones, así que úsala siempre como criterio principal. Dicho esto, conviene recordar dos límites. Primero, una TAE más baja no siempre implica el producto más barato en tu caso concreto: si piensas amortizar anticipadamente, el reparto de comisiones puede pesar más que el tipo. Segundo, en las hipotecas la TAE deja fuera los seguros vinculados, que pueden encarecer notablemente el coste real; para compararlas de verdad, pide siempre el cuadro de amortización completo y suma aparte el coste anual de los productos que te exijan contratar.",
    explanationTinToTae: (tin: string, freq: string, tae: string) =>
      `Con capitalización ${freq}, un TIN del ${tin}% equivale a una TAE del ${tae}`,
    explanationTaeToTin: (tae: string, freq: string, tin: string) =>
      `Un TAE del ${tae}% capitalizado ${freq} implica un TIN del ${tin}`,
  },
  en: {
    title: "APR / Nominal Rate Converter",
    subtitle: "Convert between nominal interest rate (TIN) and APR (Annual Percentage Rate) based on the compounding frequency. Essential for comparing mortgages, loans and deposits.",
    intro1: "The APR (Annual Percentage Rate) is the indicator that allows homogeneous comparison of different financial products. The contractual APR published by a lender incorporates the nominal interest rate, the compounding frequency and the mandatory fees and charges of the operation; it is the figure that, by law, financial institutions must display prominently in their advertising for loans, mortgages and deposits.",
    intro2: "This calculator converts in both directions between the nominal rate and APR using the standard formula: APR = (1 + nominal/n)^n − 1, where n is the annual compounding frequency. It also generates a comparison table to visualise how the APR varies by frequency (daily, weekly, monthly, quarterly, half-yearly or annual). The result is therefore the mathematically equivalent APR derived from the nominal rate and the compounding frequency. It does not calculate the full contractual APR of a loan or mortgage when fees, charges or other costs apply. To compare real offers, use the APR published by the lender.",
    disclaimer: "The nominal-rate↔APR conversion results are mathematically exact, but they only reflect the effect of compounding. A loan's contractual APR is usually higher because it also incorporates mandatory fees and charges, which this tool does not include.",
    cardTitle: "Converter",
    freqLabel: "Compounding frequency",
    tinLabel: "Nominal rate (%)",
    taeLabel: "APR (%)",
    equivalentTae: "Mathematical equivalent APR (by compounding)",
    mathNote: "This calculator computes the mathematically equivalent APR derived from the nominal rate and the compounding frequency. It does not calculate the full contractual APR of a loan or mortgage when fees, charges or other costs apply. To compare real offers, use the APR published by the lender.",
    equivalentTin: "Equivalent nominal rate",
    tableTitle: (tin: string) => `APR by compounding frequency — Nominal rate ${tin}%`,
    faqTitle: "Frequently asked questions",
    q1: "What is the difference between nominal rate and APR?",
    a1: (<>The <strong>nominal rate</strong> is the interest percentage that the bank charges or pays on the capital, without considering the compounding frequency or fees. The <strong>APR</strong> (Annual Percentage Rate) includes the effect of compounding and, in a loan's contractual APR, also the mandatory fees and charges. The APR is the legal indicator that allows comparison of financial products. This calculator applies only the effect of compounding, not fees.</>),
    q2: "Why is the APR always higher than the nominal rate?",
    a2: "Because compound interest generates interest on interest. The more frequent the compounding (monthly is more than annual), the greater the difference between APR and nominal rate. If compounding is annual, APR = nominal rate.",
    q3: "What should I look at when comparing mortgages?",
    a3: (<>Always compare the <strong>APR</strong>, not the nominal rate or the spread. The APR of a mortgage includes the interest rate and mandatory fees (arrangement, study), although legally it does not include linked insurance. For variable mortgages, look at the Euribor spread + APR for the first year.</>),
    q4: "Is the APR useful for comparing deposits and savings accounts?",
    a4: "Yes, and this is precisely where it is most useful, because it lets you compare products with different payment frequencies. A deposit paying a 3% nominal rate with monthly settlement yields more than another at 3% with annual settlement, even though the advertised nominal rate is identical: their APRs are 3.04% and 3.00% respectively. With savings products it is worth checking that the advertised APR corresponds to the full term and not to a welcome promotion covering the first few months, a common practice that inflates the headline figure.",
    q5: "Which fees are included in the APR calculation?",
    a5: "In a loan, the APR incorporates all the mandatory fees and charges the customer must pay to obtain the financing: arrangement fee, study fee and any formalisation costs borne by them. It does not include linked home or life insurance, nor notary and registry costs in the mortgage case, nor contingent fees that are only paid if something happens, such as early repayment or arrears claim charges. That is why two mortgages with the same APR can have different real costs depending on the linked products they require.",
    deepTitle: "How the APR is calculated from the nominal rate",
    deep: "The formula relating the two indicators is APR = (1 + nominal/n)^n − 1, where n is the number of times interest is compounded in a year. The logic is simple: if interest is credited several times a year, the amounts generated in each period start earning interest themselves for the rest of the year, so the effective return exceeds the advertised nominal rate. When compounding is annual (n = 1) the formula simplifies and APR and nominal rate coincide. As n grows, the APR rises, though ever more slowly as it approaches a mathematical limit.",
    exampleTitle: "Worked example",
    example: "Take a nominal rate of 6% with monthly compounding, that is, n = 12. Applying the formula: APR = (1 + 0.06/12)^12 − 1 = (1 + 0.005)^12 − 1 = 1.061678 − 1 = 0.061678, i.e. 6.17%. The 0.17 percentage point difference seems small, but on €200,000 over thirty years it translates into several thousand euros. If compounding were quarterly (n = 4), the APR would be 6.14%; if annual, it would match the 6% nominal rate exactly.",
    refTableTitle: "APR resulting from a 6% nominal rate by compounding frequency",
    tableCol1: "Frequency",
    tableCol2: "APR",
    interpretTitle: "How to interpret the result",
    interpret: "The APR is the only indicator the law requires to be published precisely so you can compare products across lenders on equal terms, so always use it as your main criterion. That said, two limits are worth remembering. First, a lower APR does not always mean the cheapest product in your particular case: if you plan to repay early, the distribution of fees may matter more than the rate. Second, in mortgages the APR leaves out linked insurance, which can raise the real cost considerably; to compare properly, always ask for the full amortisation schedule and add the annual cost of any products you are required to take out.",
    explanationTinToTae: (tin: string, freq: string, tae: string) =>
      `With ${freq} compounding, a nominal rate of ${tin}% equals an APR of ${tae}`,
    explanationTaeToTin: (tae: string, freq: string, tin: string) =>
      `An APR of ${tae}% compounded ${freq} implies a nominal rate of ${tin}`,
  },
};

const TAE_TABLE = [
  { es: "Anual", en: "Annual", tae: "6,00 %" },
  { es: "Semestral", en: "Half-yearly", tae: "6,09 %" },
  { es: "Trimestral", en: "Quarterly", tae: "6,14 %" },
  { es: "Mensual", en: "Monthly", tae: "6,17 %" },
  { es: "Diaria", en: "Daily", tae: "6,18 %" },
];

export default function Tae() {
  const locale = useLocale();
  const t = T[locale];
  const isEn = locale === "en";
  const FRECUENCIAS = isEn ? FRECUENCIAS_EN : FRECUENCIAS_ES;

  const [mode, setMode] = useState<"tin-to-tae" | "tae-to-tin">("tin-to-tae");
  const [tin, setTin] = useState("5");
  const [tae, setTaeVal] = useState("5.116");
  const [frecuencia, setFrecuencia] = useState("12");

  const n = parseInt(frecuencia);

  const tinVal = parseFloat(tin) || 0;
  const taeFromTin = (Math.pow(1 + tinVal / 100 / n, n) - 1) * 100;

  const taeVal = parseFloat(tae) || 0;
  const tinFromTae = (Math.pow(1 + taeVal / 100, 1 / n) - 1) * n * 100;

  const resultado = mode === "tin-to-tae" ? taeFromTin : tinFromTae;
  const resultLabel = mode === "tin-to-tae" ? t.equivalentTae : t.equivalentTin;
  const inputLabel = mode === "tin-to-tae" ? t.tinLabel : t.taeLabel;

  const tinForTable = mode === "tin-to-tae" ? tinVal : tinFromTae;
  const tabla = FRECUENCIAS.map((f) => {
    const nF = parseInt(f.value);
    const taeF = (Math.pow(1 + tinForTable / 100 / nF, nF) - 1) * 100;
    return { label: f.label, n: nF, tae: taeF };
  });

  const currentFreqLabel = FRECUENCIAS.find((f) => f.value === frecuencia)?.label.toLowerCase() ?? "";

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Percent className="h-6 w-6 text-primary" />
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
          <div className="flex gap-2">
            <button
              onClick={() => setMode("tin-to-tae")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === "tin-to-tae"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {isEn ? "Nominal → APR" : "TIN → TAE"}
            </button>
            <button
              onClick={() => setMode("tae-to-tin")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === "tae-to-tin"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {isEn ? "APR → Nominal" : "TAE → TIN"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="input-rate">{inputLabel}</Label>
              <Input
                id="input-rate"
                type="number"
                step="0.001"
                value={mode === "tin-to-tae" ? tin : tae}
                onChange={(e) =>
                  mode === "tin-to-tae" ? setTin(e.target.value) : setTaeVal(e.target.value)
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="frecuencia">{t.freqLabel}</Label>
              <Select value={frecuencia} onValueChange={setFrecuencia}>
                <SelectTrigger id="frecuencia" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FRECUENCIAS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 rounded-lg border border-amber-300/60 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200">
        {t.mathNote}
      </div>

      <Card className="border-primary/30 bg-primary/5 mb-6">
        <CardContent className="pt-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">{resultLabel}</p>
          <p className="text-5xl font-bold text-primary mb-2">
            {resultado.toLocaleString("es-ES", { minimumFractionDigits: 4, maximumFractionDigits: 4 })}%
          </p>
          <p className="text-sm text-muted-foreground">
            {mode === "tin-to-tae"
              ? t.explanationTinToTae(tin, currentFreqLabel, pct(taeFromTin))
              : t.explanationTaeToTin(tae, currentFreqLabel, pct(tinFromTae))}
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            {t.tableTitle(tinForTable.toLocaleString("es-ES", { maximumFractionDigits: 3 }))}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {tabla.map((row) => (
              <div key={row.n} className={`flex justify-between items-center py-2 border-b text-sm ${row.n === n ? "font-semibold text-primary" : ""}`}>
                <span>{row.label}</span>
                <span>{pct(row.tae)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground italic mt-4 mb-2">{t.disclaimer}</p>

      <section className="mt-12 prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t.deepTitle}</h2>
        <p>{t.deep}</p>
        <h3 className="text-base font-semibold mt-6 mb-2 text-gray-900 dark:text-white">{t.exampleTitle}</h3>
        <p>{t.example}</p>
      </section>

      <div className="mt-8 overflow-x-auto">
        <h3 className="text-base font-semibold mb-3 text-gray-900 dark:text-white">{t.refTableTitle}</h3>
        <table className="w-full text-sm border-collapse max-w-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10 text-left text-gray-500 dark:text-white/50">
              <th className="py-2 pr-4 font-medium">{t.tableCol1}</th>
              <th className="py-2 font-medium">{t.tableCol2}</th>
            </tr>
          </thead>
          <tbody>
            {TAE_TABLE.map((row) => (
              <tr key={row.en} className="border-b border-gray-100 dark:border-white/5">
                <td className="py-2 pr-4 text-gray-900 dark:text-white whitespace-nowrap">{isEn ? row.en : row.es}</td>
                <td className="py-2 font-semibold text-primary whitespace-nowrap">{row.tae}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-8 prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t.interpretTitle}</h2>
        <p>{t.interpret}</p>
      </section>

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

registerFaq("finanzas/tae", T);
