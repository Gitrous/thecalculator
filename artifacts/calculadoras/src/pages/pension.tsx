import { useState } from "react";
import { Landmark } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function eur(n: number) {
  return n.toLocaleString("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });
}

// Porcentaje de la pensión según años cotizados (sistema 2024-2027 en transición)
// 15 años: 50%; a partir de ahí se suman fracciones hasta llegar al 100%
// Años 16-25: +1.15%/mes extra → 0,21%/mes (se añade 2.52% por año)
// Años 26-35: +1.15%/mes → igual
// Años 36-37.5: 0.19%/mes
// Simplificación usando el sistema vigente 2024:
function getPorcentaje(anios: number): number {
  if (anios < 15) return 0;
  let pct = 50;
  // Años 16 a 25: +2.52% por año
  const extra1 = Math.min(Math.max(anios - 15, 0), 10) * 2.52;
  // Años 26 en adelante: +2.28% por año hasta 37
  const extra2 = Math.min(Math.max(anios - 25, 0), 12) * 2.28;
  pct += extra1 + extra2;
  return Math.min(pct, 100);
}

// Pensión máxima 2024 (€/mes, 14 pagas)
const PENSION_MAX = 3175.04;
// Pensión mínima 2024 (€/mes, con cónyuge a cargo, > 65 años)
const PENSION_MIN_65 = 959.3;

export default function Pension() {
  const [anios, setAnios] = useState("35");
  const [baseReg, setBaseReg] = useState("2000");

  const a = parseFloat(anios) || 0;
  const b = parseFloat(baseReg) || 0;
  const valid = a >= 15 && b > 0;

  const porcentaje = getPorcentaje(a);
  const pensionBruta = Math.min((b * porcentaje) / 100, PENSION_MAX);
  const pensionAnual = pensionBruta * 14;

  const aniosFull = 37; // años para el 100% en 2024

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Landmark className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Calculadora de Pensión de Jubilación 2024
        </h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Estima tu pensión mensual de jubilación según los años cotizados y tu
        base reguladora. Calculadora orientativa basada en el sistema español.
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Tus datos</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="anios">Años cotizados</Label>
            <Input
              id="anios"
              type="number"
              min={0}
              max={50}
              value={anios}
              onChange={(e) => setAnios(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="baseReg">
              Base reguladora mensual (€)
              <span className="ml-1 text-xs text-muted-foreground">
                (media últimos 25 años)
              </span>
            </Label>
            <Input
              id="baseReg"
              type="number"
              value={baseReg}
              onChange={(e) => setBaseReg(e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {a > 0 && a < 15 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6 text-sm text-amber-800 dark:text-amber-300">
          Necesitas al menos <strong>15 años cotizados</strong> para acceder a
          la pensión contributiva de jubilación.
        </div>
      )}

      {valid && (
        <>
          <Card className="border-primary/30 bg-primary/5 mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Porcentaje aplicado</p>
                  <p className="text-3xl font-bold">{porcentaje.toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pensión mensual bruta</p>
                  <p className="text-3xl font-bold text-primary">{eur(pensionBruta)}</p>
                  <p className="text-xs text-muted-foreground">14 pagas/año</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pensión anual bruta</p>
                  <p className="text-2xl font-bold">{eur(pensionAnual)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Para el 100% faltan</p>
                  <p className="text-2xl font-bold">
                    {porcentaje >= 100 ? "¡Completo!" : `${Math.max(aniosFull - a, 0)} años`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress bar */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Progreso hacia la pensión completa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>0%</span>
                <span className="font-semibold text-foreground">{porcentaje.toFixed(1)}% alcanzado</span>
                <span>100%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-primary h-4 rounded-full transition-all"
                  style={{ width: `${Math.min(porcentaje, 100)}%` }}
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between border-b py-1">
                  <span className="text-muted-foreground">Pensión máxima (2024)</span>
                  <span className="font-medium">{eur(PENSION_MAX)}/mes</span>
                </div>
                <div className="flex justify-between border-b py-1">
                  <span className="text-muted-foreground">Pensión mínima (≥ 65 años)</span>
                  <span className="font-medium">{eur(PENSION_MIN_65)}/mes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8 text-sm text-blue-800 dark:text-blue-300">
        <strong>Nota:</strong> Esta es una estimación orientativa. La pensión
        real depende de las bases de cotización año a año (media de los últimos
        300 meses), la edad de jubilación, posibles coeficientes reductores por
        jubilación anticipada y la normativa vigente en el momento del retiro.
      </div>

      <section className="mt-4">
        <h2 className="text-xl font-semibold mb-4">Preguntas frecuentes</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="q1">
            <AccordionTrigger>¿A qué edad me puedo jubilar en España?</AccordionTrigger>
            <AccordionContent>
              La edad ordinaria en 2024 es <strong>65 años</strong> si tienes
              38 años y 3 meses o más cotizados, o <strong>66 años y 6 meses</strong>
              si cotizaste menos. Esta edad aumentará hasta 67 años en 2027.
              Existe jubilación anticipada voluntaria (2 años antes) e involuntaria
              (4 años antes) con coeficientes reductores.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>¿Qué es la base reguladora?</AccordionTrigger>
            <AccordionContent>
              Es la media de las bases de cotización de los últimos 25 años (300
              mensualidades), actualizadas por el IPC excepto los 24 meses
              anteriores a la jubilación. Cuanto más alta sea tu base de cotización
              histórica, mayor será tu pensión.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>¿Los autónomos tienen la misma pensión?</AccordionTrigger>
            <AccordionContent>
              Los autónomos cotizan por la base elegida dentro de los tramos del
              RETA. Históricamente cotizaban por la mínima, lo que generaba
              pensiones bajas. Con el sistema 2023-2025 la cotización se acerca
              a los ingresos reales, mejorando la futura pensión de nuevos
              autónomos.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
