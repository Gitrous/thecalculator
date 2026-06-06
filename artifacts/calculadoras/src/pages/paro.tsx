import { useState } from "react";
import { Briefcase } from "lucide-react";
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

function eur(n: number) {
  return n.toLocaleString("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });
}

// IPREM mensual 2024/2025 (€/mes)
const IPREM = 600;

// Duración de la prestación según días cotizados
const DURACION_TABLE: { min: number; dias: number }[] = [
  { min: 360, dias: 120 },
  { min: 540, dias: 180 },
  { min: 720, dias: 240 },
  { min: 900, dias: 300 },
  { min: 1080, dias: 360 },
  { min: 1260, dias: 420 },
  { min: 1440, dias: 480 },
  { min: 1620, dias: 540 },
  { min: 1800, dias: 600 },
  { min: 1980, dias: 660 },
  { min: 2160, dias: 720 },
];

function getDuracion(diasCotizados: number): number {
  const row = [...DURACION_TABLE].reverse().find((r) => diasCotizados >= r.min);
  return row?.dias ?? 0;
}

export default function Paro() {
  const [salario, setSalario] = useState("1800");
  const [meses, setMeses] = useState("24");
  const [hijos, setHijos] = useState("0");

  const s = parseFloat(salario) || 0;
  const m = parseFloat(meses) || 0;
  const h = parseInt(hijos);
  const diasCotizados = m * 30;
  const duracion = getDuracion(diasCotizados);
  const valid = duracion > 0;

  // Base reguladora = salario bruto mensual (simplificación)
  const baseReg = s;

  // Cuantías
  const bruto70 = baseReg * 0.7;
  const bruto50 = baseReg * 0.5;

  // Máximos (IPREM × factor)
  const maxFactor = h === 0 ? 1.75 : h === 1 ? 2.0 : 2.25;
  const max = IPREM * maxFactor;
  const minVal = h === 0 ? IPREM * 0.8 : IPREM * 1.07;

  const prest70 = Math.min(Math.max(bruto70, minVal), max);
  const prest50 = Math.min(Math.max(bruto50, minVal), max);

  // Desglose temporal
  const dias70 = Math.min(duracion, 180);
  const dias50 = Math.max(duracion - 180, 0);
  const meses70 = dias70 / 30;
  const meses50 = dias50 / 30;
  const totalBruto = prest70 * meses70 + prest50 * meses50;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Briefcase className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Calculadora de Prestación por Desempleo (Paro) 2025
        </h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Calcula cuánto cobrarás de paro, durante cuánto tiempo y el total de la
        prestación según tu salario y los meses cotizados.
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Tus datos</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="salario">Salario bruto mensual (€)</Label>
            <Input
              id="salario"
              type="number"
              value={salario}
              onChange={(e) => setSalario(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="meses">Meses cotizados (últimos 6 años)</Label>
            <Input
              id="meses"
              type="number"
              min={0}
              max={72}
              value={meses}
              onChange={(e) => setMeses(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="hijos">Hijos a cargo</Label>
            <Select value={hijos} onValueChange={setHijos}>
              <SelectTrigger id="hijos" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Sin hijos</SelectItem>
                <SelectItem value="1">1 hijo</SelectItem>
                <SelectItem value="2">2 o más hijos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {!valid && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-sm text-amber-800 dark:text-amber-300 mb-8">
          Necesitas al menos <strong>360 días cotizados</strong> (12 meses) en
          los últimos 6 años para tener derecho a la prestación contributiva.
        </div>
      )}

      {valid && (
        <>
          <Card className="border-primary/30 bg-primary/5 mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Duración total</p>
                  <p className="text-2xl font-bold text-primary">
                    {duracion} días
                  </p>
                  <p className="text-xs text-muted-foreground">({duracion / 30} meses)</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Primeros 6 meses</p>
                  <p className="text-2xl font-bold">{eur(prest70)}</p>
                  <p className="text-xs text-muted-foreground">70% base reguladora</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">A partir del 7.º mes</p>
                  <p className="text-2xl font-bold">{eur(prest50)}</p>
                  <p className="text-xs text-muted-foreground">50% base reguladora</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total estimado bruto</p>
                  <p className="text-2xl font-bold text-emerald-600">{eur(totalBruto)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Detalle del cálculo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Base reguladora</span>
                  <span className="font-medium">{eur(baseReg)}/mes</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Días cotizados</span>
                  <span className="font-medium">{diasCotizados} días</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Máximo aplicable</span>
                  <span className="font-medium">{eur(max)}/mes ({h === 0 ? "175%" : h === 1 ? "200%" : "225%"} IPREM)</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Mínimo aplicable</span>
                  <span className="font-medium">{eur(minVal)}/mes ({h === 0 ? "80%" : "107%"} IPREM)</span>
                </div>
                {dias50 > 0 && (
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-muted-foreground">Desglose temporal</span>
                    <span className="font-medium">{meses70} meses × {eur(prest70)} + {meses50} meses × {eur(prest50)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8 text-sm text-blue-800 dark:text-blue-300">
        <strong>Nota:</strong> Las cantidades son brutas. El SEPE descuenta las
        cotizaciones a la Seguridad Social (4,7%) y aplica retención de IRPF. La
        base reguladora real es la media de las bases de cotización por desempleo
        de los últimos 180 días.
      </div>

      <section className="mt-4">
        <h2 className="text-xl font-semibold mb-4">Preguntas frecuentes</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="q1">
            <AccordionTrigger>¿Cuánto tiempo tengo para solicitar el paro?</AccordionTrigger>
            <AccordionContent>
              Tienes <strong>15 días hábiles</strong> desde el día siguiente al
              de la situación legal de desempleo (fin de contrato, despido, etc.).
              Si lo solicitas después, pierdes días de prestación.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>¿Qué es la base reguladora?</AccordionTrigger>
            <AccordionContent>
              Es la media de las bases de cotización por desempleo de los últimos
              180 días trabajados. Se calcula dividiendo el total cotizado en ese
              período entre 180. Para simplificar, esta calculadora usa el salario
              bruto mensual como aproximación.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>¿Se puede cobrar el paro siendo autónomo?</AccordionTrigger>
            <AccordionContent>
              Sí, desde 2019 los autónomos que hayan cotizado por cese de actividad
              pueden acceder a la prestación por desempleo. Los requisitos son
              distintos a los de los trabajadores por cuenta ajena.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q4">
            <AccordionTrigger>¿Se puede cobrar el paro y trabajar a la vez?</AccordionTrigger>
            <AccordionContent>
              En algunos casos sí, mediante la <strong>compatibilización</strong>
              del paro con un trabajo a tiempo parcial, o capitalizando el paro
              como autónomo. En general, un trabajo a jornada completa suspende
              o extingue la prestación.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
