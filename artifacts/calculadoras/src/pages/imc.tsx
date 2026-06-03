import { useState } from "react";
import { HeartPulse } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Range {
  max: number;
  label: string;
  color: string;
}

const RANGES: Range[] = [
  { max: 18.5, label: "Bajo peso", color: "text-blue-600" },
  { max: 25, label: "Peso normal", color: "text-emerald-600" },
  { max: 30, label: "Sobrepeso", color: "text-amber-600" },
  { max: 35, label: "Obesidad grado I", color: "text-orange-600" },
  { max: 40, label: "Obesidad grado II", color: "text-red-600" },
  { max: Infinity, label: "Obesidad grado III", color: "text-red-700" },
];

export default function Imc() {
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("170");

  const w = parseFloat(weight);
  const hCm = parseFloat(height);
  const valid = w > 0 && hCm > 0;

  let imc: number | null = null;
  let range: Range | null = null;
  let idealMin = 0;
  let idealMax = 0;
  if (valid) {
    const h = hCm / 100;
    imc = w / (h * h);
    range = RANGES.find((r) => imc! < r.max) ?? RANGES[RANGES.length - 1];
    idealMin = 18.5 * h * h;
    idealMax = 24.9 * h * h;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <HeartPulse className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Calculadora de IMC
        </h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Calcula tu Índice de Masa Corporal y descubre en qué rango de peso te
        encuentras según la OMS.
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Datos</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="height">Altura (cm)</Label>
            <Input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {imc !== null && range && (
        <Card className="border-primary/30 bg-primary/5 mb-8">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Tu IMC</p>
            <p className="text-4xl font-bold text-primary mb-1">
              {imc.toLocaleString("es-ES", { maximumFractionDigits: 1 })}
            </p>
            <p className={`font-semibold ${range.color}`}>{range.label}</p>
            <p className="text-sm text-muted-foreground mt-3">
              Peso saludable para tu altura:{" "}
              {idealMin.toLocaleString("es-ES", { maximumFractionDigits: 1 })} –{" "}
              {idealMax.toLocaleString("es-ES", { maximumFractionDigits: 1 })} kg
            </p>
          </CardContent>
        </Card>
      )}

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Preguntas frecuentes</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="q1">
            <AccordionTrigger>¿Cómo se calcula el IMC?</AccordionTrigger>
            <AccordionContent>
              El IMC se obtiene dividiendo el peso en kilos entre el cuadrado de
              la altura en metros: IMC = peso / altura². Un valor entre 18,5 y
              24,9 se considera peso normal.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>¿Es fiable el IMC?</AccordionTrigger>
            <AccordionContent>
              Es una referencia general para la población adulta, pero no
              distingue masa muscular de grasa ni tiene en cuenta la edad o el
              sexo. No sustituye una valoración médica.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
