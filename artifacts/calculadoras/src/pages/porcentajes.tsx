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
  },
  en: {
    title: "Percentage Calculator",
    subtitle: "Calculate percentages instantly: X% of Y, what percentage a value represents, the change between two figures, or apply an increase/discount.",
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
  },
};

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
      <p className="text-muted-foreground mb-8">{t.subtitle}</p>

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
