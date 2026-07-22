import { useState } from "react";
import { Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
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

type Mode = "percentOf" | "isWhatPercent" | "change" | "applyChange";

function fmt(n: number): string {
  return n.toLocaleString("es-ES", { maximumFractionDigits: 2 });
}

const T = {
  es: {
    title: "Calculadora de Porcentajes",
    subtitle: "Calcula porcentajes al instante: el X% de Y, qué porcentaje representa un valor, la variación entre dos cifras o aplicar un aumento/descuento.",
    intro1: "Los porcentajes son una de las herramientas matemáticas más utilizadas en el día a día: calcular el IVA de un precio, el descuento de unas rebajas, el incremento salarial anual o la variación de un índice bursátil. A pesar de ser un concepto básico, su aplicación práctica genera dudas frecuentes, especialmente cuando se trabaja con porcentajes encadenados o variaciones relativas.",
    intro2: "Esta calculadora resuelve los cuatro casos más comunes: calcular el X% de un número, averiguar qué porcentaje representa A respecto a B, calcular la variación porcentual entre dos valores y aplicar un aumento o descuento a un precio base. Selecciona el tipo de operación y obtendrás el resultado al instante.",
    disclaimer: "Los resultados son exactos matemáticamente. En contextos fiscales o financieros, verifica siempre los importes con tu asesor.",
    cardTitle: "¿Qué quieres calcular?",
    modes: [
      { id: "percentOf" as Mode, label: "El X% de Y" },
      { id: "isWhatPercent" as Mode, label: "X es qué % de Y" },
      { id: "change" as Mode, label: "Variación %" },
      { id: "applyChange" as Mode, label: "Subir / bajar un %" },
    ],
    labels: {
      percentOf: ["Porcentaje (X)", "Cantidad (Y)"],
      isWhatPercent: ["Valor (X)", "Total (Y)"],
      change: ["Valor inicial", "Valor final"],
      applyChange: ["Cantidad", "Porcentaje a aplicar (+/-)"],
    } as Record<Mode, [string, string]>,
    calculate: "Calcular",
    resultLabel: "Resultado",
    howTitle: "Cómo se calculan los porcentajes",
    how1:
      "Un porcentaje expresa una proporción sobre un total de 100. Calcular «el X% de Y» consiste en dividir el porcentaje entre 100 y multiplicarlo por la cantidad: resultado = (X / 100) × Y. Es la operación detrás de descuentos, impuestos, comisiones y propinas.",
    how2:
      "Esta calculadora cubre los cuatro cálculos más habituales: el X% de una cantidad, qué porcentaje representa un valor sobre un total, la variación porcentual entre dos cifras y aplicar un aumento o descuento. Elige el modo según lo que necesites y la fórmula se aplica automáticamente.",
    exampleTitle: "Ejemplo",
    example:
      "El 20% de 150 es (20 / 100) × 150 = 30. Y si una camiseta de 60 € tiene un 15% de descuento, el ahorro es (15 / 100) × 60 = 9 €, así que el precio final es 51 €.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Cómo se calcula el X% de una cantidad?",
    a1: "Se divide el porcentaje entre 100 y se multiplica por la cantidad. Por ejemplo, el 20% de 150 es (20 / 100) × 150 = 30. Esta operación es la base de los descuentos comerciales: si una camiseta vale 60 € y hay un 15% de descuento, el ahorro es (15 / 100) × 60 = 9 € y el precio final es 51 €.",
    q2: "¿Cómo calcular la variación porcentual?",
    a2: "Se resta el valor inicial al final, se divide entre el valor inicial y se multiplica por 100: ((final − inicial) / inicial) × 100. Si un producto pasó de 200 € a 250 €, la variación es ((250 − 200) / 200) × 100 = 25%. Un resultado negativo indica una bajada. Esta fórmula se usa en finanzas para calcular rentabilidades, IPC y variaciones de precio.",
    q3: "¿Cuándo usar cada tipo de cálculo?",
    a3: "Usa «el X% de Y» para aplicar descuentos, impuestos (IVA, IRPF) o comisiones. Usa «X es qué % de Y» cuando necesitas saber qué parte representa un valor respecto a un total, como la tasa de error en un proceso o el porcentaje de aciertos en un examen. Usa «variación %» para comparar dos cifras en el tiempo, como el crecimiento de ventas o la inflación.",
    q4: "¿Por qué subir un 20 % y luego bajar un 20 % no devuelve el precio original?",
    a4: "Porque cada porcentaje se aplica sobre una base distinta. Si un producto cuesta 100 € y sube un 20 %, pasa a costar 120 €. Al aplicar después una rebaja del 20 %, ese descuento se calcula sobre 120 € y no sobre los 100 € iniciales: 120 − 24 = 96 €. El resultado es un 4 % por debajo del precio de partida. La regla general es que una subida del x % seguida de una bajada del x % siempre deja un precio final inferior al original, y la pérdida equivale a x²/100 por ciento. Este efecto explica muchas ofertas comerciales que parecen devolver el precio inicial y no lo hacen.",
    q5: "¿Cómo calculo el precio sin IVA a partir del precio final?",
    a5: "Hay que dividir, no restar. Un error muy común es restar el 21 % al precio con IVA, lo que da un resultado incorrecto. La operación correcta es dividir entre 1,21: si un producto cuesta 121 € con IVA, la base imponible es 121 / 1,21 = 100 €, y el IVA son los 21 € restantes. Si restaras el 21 % de 121 € obtendrías 95,59 €, casi cinco euros por debajo del valor real. La misma lógica se aplica a cualquier tipo impositivo: para el IVA reducido del 10 % se divide entre 1,10 y para el superreducido del 4 % entre 1,04.",
    deepTitle: "Puntos porcentuales frente a porcentaje",
    deep: "Es una distinción que se confunde constantemente en prensa y conversación, y que cambia por completo el significado de una cifra. Si un tipo de interés pasa del 2 % al 3 %, ha subido un punto porcentual, pero en términos relativos ha aumentado un 50 %, porque 1 es la mitad de 2. Del mismo modo, si el paro baja del 12 % al 9 %, ha caído 3 puntos porcentuales o, equivalentemente, un 25 % en términos relativos. Cuando compares magnitudes que ya vienen expresadas en porcentaje, conviene indicar siempre si hablas de puntos o de variación relativa, porque las dos lecturas son correctas pero transmiten mensajes muy distintos.",
    workedTitle: "Ejemplo resuelto",
    worked: "Calcular el 15 % de 240 €: se multiplica 240 × 0,15 = 36 €. Para saber qué porcentaje representa 36 sobre 240, se hace la operación inversa: (36 / 240) × 100 = 15 %. Y para calcular la variación entre dos valores, por ejemplo un precio que pasa de 240 € a 288 €, se aplica ((288 − 240) / 240) × 100 = (48 / 240) × 100 = 20 % de subida. Fíjate en que el denominador siempre es el valor de partida, nunca el final: usar el valor final es el error más frecuente al calcular variaciones porcentuales.",
    tableTitle: "Descuentos habituales aplicados sobre 100 €",
    tableCol1: "Descuento",
    tableCol2: "Precio final",
    interpretTitle: "Errores frecuentes al trabajar con porcentajes",
    interpret: "Más allá de la aritmética, conviene vigilar tres trampas habituales. La primera es encadenar descuentos como si se sumaran: un 30 % más un 20 % adicional no equivale a un 50 %, sino a un 44 %, porque el segundo se aplica sobre el precio ya rebajado. La segunda es confundir el porcentaje de una cantidad con el porcentaje que representa esa cantidad: son operaciones inversas y dan resultados distintos. La tercera es olvidar la base de referencia al comunicar una variación: decir que algo ha subido un 200 % significa que se ha multiplicado por tres, no por dos, porque el incremento se suma al valor original.",
  },
  en: {
    title: "Percentage Calculator",
    subtitle: "Calculate percentages instantly: X% of Y, what percentage a value represents, the change between two figures, or apply an increase/discount.",
    intro1: "Percentages are one of the most widely used mathematical tools in everyday life: calculating VAT on a price, the discount in a sale, an annual pay rise or the change in a stock index. Despite being a basic concept, their practical application often causes confusion, especially when dealing with compound percentages or relative changes.",
    intro2: "This calculator solves the four most common cases: calculating X% of a number, finding what percentage A represents of B, calculating the percentage change between two values, and applying an increase or discount to a base price. Select the type of operation and you will get the result instantly.",
    disclaimer: "Results are mathematically exact. In tax or financial contexts, always verify amounts with your adviser.",
    cardTitle: "What do you want to calculate?",
    modes: [
      { id: "percentOf" as Mode, label: "X% of Y" },
      { id: "isWhatPercent" as Mode, label: "X is what % of Y" },
      { id: "change" as Mode, label: "% Change" },
      { id: "applyChange" as Mode, label: "Increase / decrease by %" },
    ],
    labels: {
      percentOf: ["Percentage (X)", "Amount (Y)"],
      isWhatPercent: ["Value (X)", "Total (Y)"],
      change: ["Initial value", "Final value"],
      applyChange: ["Amount", "Percentage to apply (+/-)"],
    } as Record<Mode, [string, string]>,
    calculate: "Calculate",
    resultLabel: "Result",
    howTitle: "How percentages are calculated",
    how1:
      "A percentage expresses a proportion out of a total of 100. Calculating 'X% of Y' means dividing the percentage by 100 and multiplying it by the amount: result = (X / 100) × Y. It is the operation behind discounts, taxes, commissions and tips.",
    how2:
      "This calculator covers the four most common calculations: X% of an amount, what percentage a value represents of a total, the percentage change between two figures, and applying an increase or discount. Choose the mode you need and the formula is applied automatically.",
    exampleTitle: "Example",
    example:
      "20% of 150 is (20 / 100) × 150 = 30. And if a €60 shirt has a 15% discount, the saving is (15 / 100) × 60 = €9, so the final price is €51.",
    faqTitle: "Frequently asked questions",
    q1: "How do you calculate X% of an amount?",
    a1: "Divide the percentage by 100 and multiply by the amount. For example, 20% of 150 is (20 / 100) × 150 = 30. This operation is the basis of commercial discounts: if a shirt costs €60 and there is a 15% discount, the saving is (15 / 100) × 60 = €9 and the final price is €51.",
    q2: "How do you calculate the percentage change?",
    a2: "Subtract the initial value from the final, divide by the initial value and multiply by 100: ((final − initial) / initial) × 100. If a product went from €200 to €250, the change is ((250 − 200) / 200) × 100 = 25%. A negative result indicates a decrease. This formula is used in finance to calculate returns, CPI and price variations.",
    q3: "When should I use each type of calculation?",
    a3: "Use 'X% of Y' to apply discounts, taxes (VAT, income tax) or commissions. Use 'X is what % of Y' when you need to know what proportion a value represents of a total, such as the error rate in a process or the percentage of correct answers in a test. Use '% change' to compare two figures over time, such as sales growth or inflation.",
    q4: "Why doesn't a 20% rise followed by a 20% cut return the original price?",
    a4: "Because each percentage is applied to a different base. If a product costs €100 and rises by 20%, it becomes €120. Applying a 20% discount afterwards, that reduction is calculated on €120 and not on the initial €100: 120 − 24 = €96. The result is 4% below the starting price. The general rule is that an x% rise followed by an x% fall always leaves a final price below the original, and the loss equals x²/100 per cent. This effect explains many commercial offers that appear to return the initial price but do not.",
    q5: "How do I work out the pre-VAT price from the final price?",
    a5: "You have to divide, not subtract. A very common mistake is subtracting 21% from the VAT-inclusive price, which gives an incorrect result. The correct operation is to divide by 1.21: if a product costs €121 including VAT, the taxable base is 121 / 1.21 = €100, and VAT is the remaining €21. If you subtracted 21% from €121 you would get €95.59, almost five euros below the real value. The same logic applies to any tax rate: for the reduced 10% VAT you divide by 1.10 and for the super-reduced 4% by 1.04.",
    deepTitle: "Percentage points versus percentage",
    deep: "This is a distinction constantly confused in the press and in conversation, and it completely changes the meaning of a figure. If an interest rate goes from 2% to 3%, it has risen one percentage point, but in relative terms it has increased by 50%, because 1 is half of 2. Likewise, if unemployment falls from 12% to 9%, it has dropped 3 percentage points or, equivalently, 25% in relative terms. When comparing quantities already expressed as percentages, always state whether you mean points or relative change, because both readings are correct but convey very different messages.",
    workedTitle: "Worked example",
    worked: "To calculate 15% of €240: multiply 240 × 0.15 = €36. To find what percentage 36 represents of 240, do the inverse operation: (36 / 240) × 100 = 15%. And to calculate the change between two values, for instance a price going from €240 to €288, apply ((288 − 240) / 240) × 100 = (48 / 240) × 100 = a 20% rise. Note that the denominator is always the starting value, never the final one: using the final value is the most frequent error when calculating percentage changes.",
    tableTitle: "Common discounts applied to €100",
    tableCol1: "Discount",
    tableCol2: "Final price",
    interpretTitle: "Common mistakes when working with percentages",
    interpret: "Beyond the arithmetic, three common traps are worth watching. The first is chaining discounts as if they added up: 30% plus an additional 20% is not 50% but 44%, because the second applies to the already reduced price. The second is confusing the percentage of a quantity with the percentage that quantity represents: these are inverse operations and give different results. The third is forgetting the reference base when communicating a change: saying something has risen 200% means it has tripled, not doubled, because the increase is added to the original value.",
  },
};

const PCT_TABLE = [
  { es: "10 %", en: "10%", final: "90,00 €" },
  { es: "20 %", en: "20%", final: "80,00 €" },
  { es: "25 %", en: "25%", final: "75,00 €" },
  { es: "30 % + 20 % adicional", en: "30% + extra 20%", final: "56,00 €" },
  { es: "50 %", en: "50%", final: "50,00 €" },
  { es: "70 %", en: "70%", final: "30,00 €" },
];

export default function Porcentajes() {
  const locale = useLocale();
  const t = T[locale];

  const [mode, setMode] = useState<Mode>("percentOf");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const x = parseFloat(a);
  const y = parseFloat(b);
  const valid = !isNaN(x) && !isNaN(y);

  const calculate = () => {
    if (!valid) {
      setResult(null);
      return;
    }
    let out = "";
    switch (mode) {
      case "percentOf":
        out = `${fmt((x / 100) * y)}`;
        break;
      case "isWhatPercent":
        out = y === 0 ? "—" : `${fmt((x / y) * 100)} %`;
        break;
      case "change":
        out = x === 0 ? "—" : `${fmt(((y - x) / Math.abs(x)) * 100)} %`;
        break;
      case "applyChange":
        out = `${fmt(x + (x * y) / 100)}`;
        break;
    }
    setResult(out);
  };

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
        <CardContent>
          <div className="flex gap-2 flex-wrap mb-6">
            {t.modes.map((m) => (
              <Button
                key={m.id}
                variant={mode === m.id ? "default" : "outline"}
                onClick={() => {
                  setMode(m.id);
                  setResult(null);
                }}
              >
                {m.label}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pa">{t.labels[mode][0]}</Label>
              <Input
                id="pa"
                type="number"
                value={a}
                onChange={(e) => setA(e.target.value)}
                className="mt-1"
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="pb">{t.labels[mode][1]}</Label>
              <Input
                id="pb"
                type="number"
                value={b}
                onChange={(e) => setB(e.target.value)}
                className="mt-1"
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={calculate} className="w-full mb-8" size="lg">
        {t.calculate}
      </Button>

      {result && (
        <Card className="border-primary/30 bg-primary/5 mb-8">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">{t.resultLabel}</p>
            <p className="text-4xl font-bold text-primary">{result}</p>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground italic mt-4 mb-2">{t.disclaimer}</p>

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">{t.howTitle}</h2>
        <p className="text-muted-foreground mb-4">{t.how1}</p>
        <p className="text-muted-foreground mb-4">{t.how2}</p>
        <h3 className="text-lg font-semibold mb-2">{t.exampleTitle}</h3>
        <p className="text-muted-foreground">{t.example}</p>
      </section>

      <section className="mt-12 prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t.deepTitle}</h2>
        <p>{t.deep}</p>
        <h3 className="text-base font-semibold mt-6 mb-2 text-gray-900 dark:text-white">{t.workedTitle}</h3>
        <p>{t.worked}</p>
      </section>

      <div className="mt-8 overflow-x-auto">
        <h3 className="text-base font-semibold mb-3 text-gray-900 dark:text-white">{t.tableTitle}</h3>
        <table className="w-full text-sm border-collapse max-w-lg">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10 text-left text-gray-500 dark:text-white/50">
              <th className="py-2 pr-4 font-medium">{t.tableCol1}</th>
              <th className="py-2 font-medium">{t.tableCol2}</th>
            </tr>
          </thead>
          <tbody>
            {PCT_TABLE.map((row) => (
              <tr key={row.es} className="border-b border-gray-100 dark:border-white/5">
                <td className="py-2 pr-4 text-gray-900 dark:text-white">{locale === "en" ? row.en : row.es}</td>
                <td className="py-2 font-semibold text-primary whitespace-nowrap">{row.final}</td>
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
