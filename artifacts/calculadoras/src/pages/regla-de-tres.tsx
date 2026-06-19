import { useState } from "react";
import { GitCompare } from "lucide-react";
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

type Kind = "directa" | "inversa";

function fmt(n: number): string {
  return n.toLocaleString("es-ES", { maximumFractionDigits: 4 });
}

const T = {
  es: {
    title: "Calculadora Regla de Tres",
    subtitle: "Resuelve la regla de tres directa e inversa. Si A es a B, entonces C es a X.",
    cardTitle: "Tipo de proporción",
    directBtn: "Directa",
    inverseBtn: "Inversa",
    result: "X (resultado)",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Cuándo es directa o inversa?",
    a1: "En la proporción directa, al aumentar una magnitud la otra también aumenta en la misma proporción: si compramos más kg, pagamos más. En la inversa, al aumentar una, la otra disminuye: si más obreros trabajan en la misma obra, se tarda menos días. Identificar el tipo es el primer paso para resolver correctamente cualquier problema de proporcionalidad.",
    q2: "¿Cómo se calculan los valores?",
    a2: "En proporción directa: X = (B × C) / A. En proporción inversa: X = (A × B) / C. Ejemplo directo: si 5 kg cuestan 20 €, ¿cuánto cuestan 8 kg? X = (20 × 8) / 5 = 32 €. Ejemplo inverso: si 4 obreros tardan 10 días, ¿cuánto tardan 8? X = (4 × 10) / 8 = 5 días.",
    q3: "¿Para qué sirve en la vida cotidiana?",
    a3: "La regla de tres es la base de cálculos habituales: convertir divisas o unidades (si 1 € son 1,08 $, ¿cuántos $ son 250 €?), escalar recetas de cocina, calcular velocidades medias o repartir proporciones en un presupuesto. También es el fundamento de los cálculos de porcentaje e interés simple.",
  },
  en: {
    title: "Rule of Three Calculator",
    subtitle: "Solve direct and inverse proportions. If A is to B, then C is to X.",
    cardTitle: "Type of proportion",
    directBtn: "Direct",
    inverseBtn: "Inverse",
    result: "X (result)",
    faqTitle: "Frequently asked questions",
    q1: "When is it direct or inverse?",
    a1: "In a direct proportion, increasing one quantity increases the other at the same rate: buying more kg means paying more. In an inverse proportion, increasing one decreases the other: more workers on the same job means fewer days needed. Identifying the type is the first step to solving any proportion problem correctly.",
    q2: "How is the result calculated?",
    a2: "Direct proportion: X = (B × C) / A. Inverse proportion: X = (A × B) / C. Direct example: if 5 kg cost €20, how much do 8 kg cost? X = (20 × 8) / 5 = €32. Inverse example: if 4 workers take 10 days, how long do 8 workers take? X = (4 × 10) / 8 = 5 days.",
    q3: "What is it used for in everyday life?",
    a3: "The rule of three underlies many daily calculations: converting currencies or units (if €1 = $1.08, how many dollars are €250?), scaling recipes, calculating average speeds, or splitting proportional shares in a budget. It is also the foundation of percentage and simple interest calculations.",
  },
};

export default function ReglaDeTres() {
  const locale = useLocale();
  const t = T[locale];

  const [kind, setKind] = useState<Kind>("directa");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");

  const A = parseFloat(a);
  const B = parseFloat(b);
  const C = parseFloat(c);
  const valid = !isNaN(A) && !isNaN(B) && !isNaN(C) && A !== 0;

  let x: number | null = null;
  if (valid) {
    x = kind === "directa" ? (B * C) / A : (A * B) / C;
    if (kind === "inversa" && C === 0) x = null;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <GitCompare className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
      </div>
      <p className="text-muted-foreground mb-8">{t.subtitle}</p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t.cardTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Button
              variant={kind === "directa" ? "default" : "outline"}
              onClick={() => setKind("directa")}
            >
              {t.directBtn}
            </Button>
            <Button
              variant={kind === "inversa" ? "default" : "outline"}
              onClick={() => setKind("inversa")}
            >
              {t.inverseBtn}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 items-end">
            <div>
              <Label htmlFor="a">A</Label>
              <Input id="a" type="number" value={a} onChange={(e) => setA(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="b">B</Label>
              <Input id="b" type="number" value={b} onChange={(e) => setB(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="c">C</Label>
              <Input id="c" type="number" value={c} onChange={(e) => setC(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>{t.result}</Label>
              <div className="mt-1 h-9 flex items-center px-3 rounded-md border bg-muted/40 font-semibold">
                {x !== null ? fmt(x) : "—"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {x !== null && (
        <Card className="border-primary/30 bg-primary/5 mb-8">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">
              {kind === "directa" ? "X = (B × C) / A" : "X = (A × B) / C"}
            </p>
            <p className="text-4xl font-bold text-primary">{fmt(x)}</p>
          </CardContent>
        </Card>
      )}

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
