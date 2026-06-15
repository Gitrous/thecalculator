import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Clock, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { useLocale } from "@/lib/locale";

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

const T = {
  es: {
    backHome: "Volver al inicio",
    title: "Calculadora de Horas Trabajadas",
    subtitle: "Calcula el total de horas trabajadas, horas extra o pendientes por día o semana.",
    contractualCardTitle: "Horas contractuales por día",
    contractualLabel: "Horas diarias según contrato",
    intervalsCardTitle: "Intervalos de trabajo",
    addDayBtn: "Añadir día",
    colLabel: "Etiqueta (día)",
    colStart: "Hora inicio",
    colEnd: "Hora fin",
    labelPlaceholder: "Lunes",
    errContractual: "Las horas contractuales deben ser un número positivo.",
    errInvalidInterval: (label: string) => `Formato de hora inválido en "${label}". Usa HH:MM.`,
    intervalDefault: "Intervalo",
    errNoIntervals: "Añade al menos un intervalo válido.",
    calculateBtn: "Calcular horas",
    totalWorked: "Total trabajado",
    contractualHoursLabel: "Horas contractuales",
    extraHours: "Horas extra",
    pendingHours: "Horas pendientes",
    detailTitle: "Detalle por día",
    colDay: "Día",
    colWorked: "Horas trabajadas",
    colDiff: "Diff. contractual",
    howTitle: "Cómo funciona",
    howText: "Introduce la hora de entrada y salida para cada día de trabajo. La calculadora suma el tiempo de cada intervalo y lo compara con las horas contractuales configuradas. Las horas extra son las trabajadas por encima de la jornada pactada; las horas pendientes son las que faltan para completar la jornada.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Puedo incluir pausas para la comida?",
    a1: "Sí. Añade dos intervalos separados: uno de mañana y otro de tarde. El total será la suma de ambos sin contar el descanso.",
    q2: "¿Qué pasa si trabajo de noche (turno que cruza la medianoche)?",
    a2: "La calculadora detecta automáticamente que la hora de fin es anterior a la de inicio y suma 24 horas. Por ejemplo, de 22:00 a 06:00 calculará 8 horas.",
    q3: "¿Qué paga se percibe por horas extra en España?",
    a3: "Según el Estatuto de los Trabajadores, las horas extra pueden compensarse con tiempo libre o remunerarse económicamente. Si se pagan, no puede ser inferior al valor de la hora ordinaria. El límite máximo es 80 horas extra al año.",
    q4: "¿Cuántas horas es la jornada ordinaria en España?",
    a4: "La jornada máxima ordinaria es de 40 horas semanales. Con la nueva legislación prevista, se reducirá a 37,5 horas semanales. La jornada diaria máxima es de 9 horas ordinarias.",
  },
  en: {
    backHome: "Back to home",
    title: "Working Hours Calculator",
    subtitle: "Calculate total hours worked, overtime or pending hours per day or week.",
    contractualCardTitle: "Contractual hours per day",
    contractualLabel: "Daily hours according to contract",
    intervalsCardTitle: "Work intervals",
    addDayBtn: "Add day",
    colLabel: "Label (day)",
    colStart: "Start time",
    colEnd: "End time",
    labelPlaceholder: "Monday",
    errContractual: "Contractual hours must be a positive number.",
    errInvalidInterval: (label: string) => `Invalid time format in "${label}". Use HH:MM.`,
    intervalDefault: "Interval",
    errNoIntervals: "Add at least one valid interval.",
    calculateBtn: "Calculate hours",
    totalWorked: "Total worked",
    contractualHoursLabel: "Contractual hours",
    extraHours: "Overtime",
    pendingHours: "Pending hours",
    detailTitle: "Daily breakdown",
    colDay: "Day",
    colWorked: "Hours worked",
    colDiff: "Contractual diff.",
    howTitle: "How it works",
    howText: "Enter the start and end time for each working day. The calculator adds up the time for each interval and compares it with the configured contractual hours. Overtime is the time worked above the agreed shift; pending hours are what remain to complete the shift.",
    faqTitle: "Frequently asked questions",
    q1: "Can I include lunch breaks?",
    a1: "Yes. Add two separate intervals: one for the morning and one for the afternoon. The total will be the sum of both without counting the break.",
    q2: "What if I work nights (a shift that crosses midnight)?",
    a2: "The calculator automatically detects that the end time is earlier than the start time and adds 24 hours. For example, from 22:00 to 06:00 it will calculate 8 hours.",
    q3: "How is overtime paid in Spain?",
    a3: "According to the Workers' Statute, overtime can be compensated with time off or paid financially. If paid, it cannot be less than the value of an ordinary hour. The maximum limit is 80 hours of overtime per year.",
    q4: "How many hours is the standard working day in Spain?",
    a4: "The maximum ordinary working week is 40 hours. With the new planned legislation, it will be reduced to 37.5 hours per week. The maximum ordinary working day is 9 hours.",
  },
};

export default function HorasTrabajadas() {
  const locale = useLocale();
  const t = T[locale];

  const [intervals, setIntervals] = useState<Interval[]>([
    { id: 1, label: locale === "en" ? "Monday" : "Lunes", start: "09:00", end: "17:00" },
    { id: 2, label: locale === "en" ? "Tuesday" : "Martes", start: "09:00", end: "17:00" },
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
      errs.push(t.errContractual);

    const computed: { label: string; minutes: number }[] = [];
    for (const iv of intervals) {
      const s = parseTime(iv.start);
      const e = parseTime(iv.end);
      if (s === null || e === null) {
        if (iv.start || iv.end)
          errs.push(t.errInvalidInterval(iv.label || t.intervalDefault));
        continue;
      }
      let diff = e - s;
      if (diff < 0) diff += 24 * 60; // overnight
      computed.push({ label: iv.label || t.intervalDefault, minutes: diff });
    }

    if (computed.length === 0) errs.push(t.errNoIntervals);
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
        <Link href={locale === "en" ? "/en" : "/"} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
          {t.backHome}
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Clock className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
      </div>
      <p className="text-muted-foreground mb-8">{t.subtitle}</p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t.contractualCardTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs">
            <Label htmlFor="contractual-hours">{t.contractualLabel}</Label>
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
          <CardTitle>{t.intervalsCardTitle}</CardTitle>
          <Button data-testid="button-add-interval" variant="outline" size="sm" onClick={addInterval}>
            <Plus className="h-4 w-4 mr-1" />
            {t.addDayBtn}
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-10 gap-2 text-xs font-medium text-muted-foreground px-1 mb-1">
            <span className="col-span-4">{t.colLabel}</span>
            <span className="col-span-3">{t.colStart}</span>
            <span className="col-span-3">{t.colEnd}</span>
          </div>
          {intervals.map((iv) => (
            <div key={iv.id} className="grid grid-cols-10 gap-2 items-center">
              <Input
                data-testid={`input-interval-label-${iv.id}`}
                className="col-span-4"
                placeholder={t.labelPlaceholder}
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
        {t.calculateBtn}
      </Button>

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">{t.totalWorked}</p>
                <p className="text-2xl font-bold text-primary">{formatDuration(result.totalMinutes)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">{t.contractualHoursLabel}</p>
                <p className="text-2xl font-bold text-gray-700">{formatDuration(result.contractualMinutes)}</p>
              </CardContent>
            </Card>
            <Card className={result.extraMinutes >= 0 ? "border-primary/30 bg-primary/5" : "border-destructive/30 bg-destructive/5"}>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  {result.extraMinutes >= 0 ? t.extraHours : t.pendingHours}
                </p>
                <p className={`text-2xl font-bold ${result.extraMinutes >= 0 ? "text-primary" : "text-destructive"}`}>
                  {formatDuration(result.extraMinutes)}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>{t.detailTitle}</CardTitle></CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">{t.colDay}</th>
                    <th className="text-right py-2">{t.colWorked}</th>
                    <th className="text-right py-2">{t.colDiff}</th>
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
        <h2 className="text-xl font-semibold mb-4">{t.howTitle}</h2>
        <p className="text-muted-foreground">{t.howText}</p>
      </section>

      <AdUnit slot={AD_SLOTS.midContent} className="my-10" />

      <section className="mt-10">
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
          <AccordionItem value="q4">
            <AccordionTrigger>{t.q4}</AccordionTrigger>
            <AccordionContent>{t.a4}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}
