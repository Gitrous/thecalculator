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
    a1: "Es directa cuando al aumentar una magnitud, la otra también aumenta (más kg, más precio). Es inversa cuando al aumentar una, la otra disminuye (más obreros, menos tiempo).",
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
    a1: "It is direct when increasing one quantity also increases the other (more kg, more price). It is inverse when increasing one decreases the other (more workers, less time).",
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

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">{t.faqTitle}</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="q1">
            <AccordionTrigger>{t.q1}</AccordionTrigger>
            <AccordionContent>{t.a1}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
