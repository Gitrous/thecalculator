import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Clock, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Interval {
  id: number;
  label: string;
  start: string;
  end: string;
}

interface Result {
  totalMinutes: number;
  contractualMinutes: number;
  extraMinutes: number;
  intervals: { label: string; minutes: number }[];
}

function parseTime(t: string): number | null {
  const match = t.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}

function formatDuration(minutes: number): string {
  const h = Math.floor(Math.abs(minutes) / 60);
  const m = Math.abs(minutes) % 60;
  const sign = minutes < 0 ? "-" : "";
  return `${sign}${h}h ${m.toString().padStart(2, "0")}m`;
}

export default function HorasTrabajadas() {
  const [intervals, setIntervals] = useState<Interval[]>([
    { id: 1, label: "Lunes", start: "09:00", end: "17:00" },
    { id: 2, label: "Martes", start: "09:00", end: "17:00" },
  ]);
  const [contractualHours, setContractualHours] = useState("8");
  const [result, setResult] = useState<Result | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const addInterval = () => {
    setIntervals((prev) => [
      ...prev,
      { id: Date.now(), label: "", start: "", end: "" },
    ]);
  };

  const removeInterval = (id: number) => {
    setIntervals((prev) => prev.filter((i) => i.id !== id));
  };

  const updateInterval = (id: number, field: keyof Interval, value: string) => {
    setIntervals((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const calculate = () => {
    const errs: string[] = [];
    const contractual = parseFloat(contractualHours);
    if (isNaN(contractual) || contractual <= 0)
      errs.push("Las horas contractuales deben ser un número positivo.");

    const computed: { label: string; minutes: number }[] = [];
    for (const iv of intervals) {
      const s = parseTime(iv.start);
      const e = parseTime(iv.end);
      if (s === null || e === null) {
        if (iv.start || iv.end)
          errs.push(`Formato de hora inválido en "${iv.label || "intervalo sin nombre"}". Usa HH:MM.`);
        continue;
      }
      let diff = e - s;
      if (diff < 0) diff += 24 * 60; // overnight
      computed.push({ label: iv.label || "Intervalo", minutes: diff });
    }

    if (computed.length === 0) errs.push("Añade al menos un intervalo válido.");
    setErrors(errs);
    if (errs.length > 0) return;

    const totalMinutes = computed.reduce((s, c) => s + c.minutes, 0);
    const contractualMinutes = contractual * 60 * computed.length;
    const extraMinutes = totalMinutes - contractualMinutes;
    setResult({ totalMinutes, contractualMinutes, extraMinutes, intervals: computed });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Clock className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Calculadora de Horas Trabajadas</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Calcula el total de horas trabajadas, horas extra o pendientes por día o semana.
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Horas contractuales por día</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs">
            <Label htmlFor="contractual-hours">Horas diarias según contrato</Label>
            <Input
              id="contractual-hours"
              data-testid="input-contractual-hours"
              type="number"
              step="0.5"
              value={contractualHours}
              onChange={(e) => setContractualHours(e.target.value)}
              placeholder="8"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Intervalos de trabajo</CardTitle>
          <Button data-testid="button-add-interval" variant="outline" size="sm" onClick={addInterval}>
            <Plus className="h-4 w-4 mr-1" />
            Añadir día
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-10 gap-2 text-xs font-medium text-muted-foreground px-1 mb-1">
            <span className="col-span-4">Etiqueta (día)</span>
            <span className="col-span-3">Hora inicio</span>
            <span className="col-span-3">Hora fin</span>
          </div>
          {intervals.map((iv) => (
            <div key={iv.id} className="grid grid-cols-10 gap-2 items-center">
              <Input
                data-testid={`input-interval-label-${iv.id}`}
                className="col-span-4"
                placeholder="Lunes"
                value={iv.label}
                onChange={(e) => updateInterval(iv.id, "label", e.target.value)}
              />
              <Input
                data-testid={`input-interval-start-${iv.id}`}
                className="col-span-3"
                type="time"
                value={iv.start}
                onChange={(e) => updateInterval(iv.id, "start", e.target.value)}
              />
              <Input
                data-testid={`input-interval-end-${iv.id}`}
                className="col-span-2"
                type="time"
                value={iv.end}
                onChange={(e) => updateInterval(iv.id, "end", e.target.value)}
              />
              <Button
                data-testid={`button-remove-interval-${iv.id}`}
                variant="ghost"
                size="icon"
                className="col-span-1 text-muted-foreground hover:text-destructive"
                onClick={() => removeInterval(iv.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {errors.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-4">
          {errors.map((e, i) => (
            <p key={i} className="text-sm text-destructive">{e}</p>
          ))}
        </div>
      )}

      <Button data-testid="button-calculate" onClick={calculate} className="w-full mb-8" size="lg">
        Calcular horas
      </Button>

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">Total trabajado</p>
                <p className="text-2xl font-bold text-primary">{formatDuration(result.totalMinutes)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">Horas contractuales</p>
                <p className="text-2xl font-bold text-gray-700">{formatDuration(result.contractualMinutes)}</p>
              </CardContent>
            </Card>
            <Card className={result.extraMinutes >= 0 ? "border-primary/30 bg-primary/5" : "border-destructive/30 bg-destructive/5"}>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  {result.extraMinutes >= 0 ? "Horas extra" : "Horas pendientes"}
                </p>
                <p className={`text-2xl font-bold ${result.extraMinutes >= 0 ? "text-primary" : "text-destructive"}`}>
                  {formatDuration(result.extraMinutes)}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Detalle por día</CardTitle></CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Día</th>
                    <th className="text-right py-2">Horas trabajadas</th>
                    <th className="text-right py-2">Diff. contractual</th>
                  </tr>
                </thead>
                <tbody>
                  {result.intervals.map((iv, i) => {
                    const contractMin = parseFloat(contractualHours) * 60;
                    const diff = iv.minutes - contractMin;
                    return (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2 font-medium">{iv.label}</td>
                        <td className="text-right py-2">{formatDuration(iv.minutes)}</td>
                        <td className={`text-right py-2 ${diff >= 0 ? "text-primary" : "text-destructive"}`}>
                          {diff >= 0 ? "+" : ""}{formatDuration(diff)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Cómo funciona</h2>
        <p className="text-muted-foreground">
          Introduce la hora de entrada y salida para cada día de trabajo. La calculadora suma el tiempo
          de cada intervalo y lo compara con las horas contractuales configuradas. Las horas extra son
          las trabajadas por encima de la jornada pactada; las horas pendientes son las que faltan para
          completar la jornada.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Preguntas frecuentes</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="q1">
            <AccordionTrigger>¿Puedo incluir pausas para la comida?</AccordionTrigger>
            <AccordionContent>
              Sí. Añade dos intervalos separados: uno de mañana y otro de tarde. El total será la suma
              de ambos sin contar el descanso.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>¿Qué pasa si trabajo de noche (turno que cruza la medianoche)?</AccordionTrigger>
            <AccordionContent>
              La calculadora detecta automáticamente que la hora de fin es anterior a la de inicio y suma
              24 horas. Por ejemplo, de 22:00 a 06:00 calculará 8 horas.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>¿Qué paga se percibe por horas extra en España?</AccordionTrigger>
            <AccordionContent>
              Según el Estatuto de los Trabajadores, las horas extra pueden compensarse con tiempo libre
              o remunerarse económicamente. Si se pagan, no puede ser inferior al valor de la hora
              ordinaria. El límite máximo es 80 horas extra al año.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q4">
            <AccordionTrigger>¿Cuántas horas es la jornada ordinaria en España?</AccordionTrigger>
            <AccordionContent>
              La jornada máxima ordinaria es de 40 horas semanales. Con la nueva legislación prevista,
              se reducirá a 37,5 horas semanales. La jornada diaria máxima es de 9 horas ordinarias.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
