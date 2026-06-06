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
    faqTitle: "Preguntas frecuentes",
    q1: "¿Cómo se calcula el X% de una cantidad?",
    a1: "Se divide el porcentaje entre 100 y se multiplica por la cantidad. Por ejemplo, el 20% de 150 es (20 / 100) × 150 = 30.",
    q2: "¿Cómo calcular la variación porcentual?",
    a2: "Se resta el valor inicial al final, se divide entre el inicial y se multiplica por 100: ((final − inicial) / inicial) × 100.",
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
    faqTitle: "Frequently asked questions",
    q1: "How do you calculate X% of an amount?",
    a1: "Divide the percentage by 100 and multiply by the amount. For example, 20% of 150 is (20 / 100) × 150 = 30.",
    q2: "How do you calculate the percentage change?",
    a2: "Subtract the initial value from the final, divide by the initial and multiply by 100: ((final − initial) / initial) × 100.",
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
        </Accordion>
      </section>
    </div>
  );
}
