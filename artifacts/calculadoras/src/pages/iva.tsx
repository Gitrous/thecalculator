import { useState } from "react";
import { Receipt } from "lucide-react";
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

const RATES = [21, 10, 4, 0];

function eur(n: number): string {
  return n.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  });
}

export default function Iva() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState(21);
  const [mode, setMode] = useState<"add" | "remove">("add");

  const value = parseFloat(amount);
  const valid = !isNaN(value) && value >= 0;

  let base = 0;
  let iva = 0;
  let total = 0;
  if (valid) {
    if (mode === "add") {
      base = value;
      iva = (value * rate) / 100;
      total = base + iva;
    } else {
      total = value;
      base = value / (1 + rate / 100);
      iva = total - base;
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Receipt className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Calculadora de IVA</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Suma o resta el IVA a cualquier precio. Tipos del 21%, 10%, 4% y 0%.
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Datos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={mode === "add" ? "default" : "outline"}
              onClick={() => setMode("add")}
            >
              Añadir IVA
            </Button>
            <Button
              variant={mode === "remove" ? "default" : "outline"}
              onClick={() => setMode("remove")}
            >
              Quitar IVA
            </Button>
          </div>

          <div>
            <Label htmlFor="amount">
              {mode === "add" ? "Importe sin IVA (base)" : "Importe con IVA (total)"}
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1"
              placeholder="0,00 €"
            />
          </div>

          <div>
            <Label>Tipo de IVA</Label>
            <div className="flex gap-2 flex-wrap mt-1">
              {RATES.map((r) => (
                <Button
                  key={r}
                  variant={rate === r ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRate(r)}
                >
                  {r}%
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {valid && (
        <Card className="border-primary/30 bg-primary/5 mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Base imponible</p>
                <p className="text-xl font-bold">{eur(base)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">IVA ({rate}%)</p>
                <p className="text-xl font-bold">{eur(iva)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold text-primary">{eur(total)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Preguntas frecuentes</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="q1">
            <AccordionTrigger>¿Qué tipos de IVA hay en España?</AccordionTrigger>
            <AccordionContent>
              El tipo general es del 21%, el reducido del 10% (hostelería,
              transporte…), el superreducido del 4% (alimentos básicos,
              medicamentos, libros) y el 0% para algunos productos exentos.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>¿Cómo se quita el IVA de un precio final?</AccordionTrigger>
            <AccordionContent>
              Se divide el precio con IVA entre (1 + tipo/100). Por ejemplo, con
              un 21%: base = total / 1,21.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
