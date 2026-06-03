import { useState } from "react";
import { Landmark } from "lucide-react";
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

function eur(n: number): string {
  return n.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  });
}

export default function PrestamoPersonal() {
  const [amount, setAmount] = useState("10000");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("5");

  const P = parseFloat(amount);
  const annual = parseFloat(rate);
  const n = Math.round(parseFloat(years) * 12);

  const valid = P > 0 && annual >= 0 && n > 0;

  let monthly = 0;
  let total = 0;
  let interest = 0;
  if (valid) {
    const i = annual / 100 / 12;
    monthly = i === 0 ? P / n : (P * i) / (1 - Math.pow(1 + i, -n));
    total = monthly * n;
    interest = total - P;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Landmark className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Calculadora de Préstamo Personal
        </h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Calcula la cuota mensual de tu préstamo, los intereses totales y el coste
        final con el sistema de amortización francés.
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Datos del préstamo</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="amount">Importe (€)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="rate">Interés anual (TIN %)</Label>
            <Input
              id="rate"
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="years">Plazo (años)</Label>
            <Input
              id="years"
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {valid && (
        <Card className="border-primary/30 bg-primary/5 mb-8">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground mb-1">Cuota mensual</p>
              <p className="text-4xl font-bold text-primary">{eur(monthly)}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Capital</p>
                <p className="text-lg font-semibold">{eur(P)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Intereses</p>
                <p className="text-lg font-semibold">{eur(interest)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total a pagar</p>
                <p className="text-lg font-semibold">{eur(total)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Preguntas frecuentes</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="q1">
            <AccordionTrigger>¿Qué diferencia hay entre TIN y TAE?</AccordionTrigger>
            <AccordionContent>
              El TIN es el tipo de interés nominal que se aplica al capital. La
              TAE incluye además comisiones y gastos, por lo que refleja mejor el
              coste real del préstamo. Esta calculadora usa el TIN.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>¿Cómo se calcula la cuota?</AccordionTrigger>
            <AccordionContent>
              Con el sistema francés (cuota constante): cuota = C · i / (1 −
              (1+i)^−n), donde C es el capital, i el interés mensual y n el número
              de meses.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
