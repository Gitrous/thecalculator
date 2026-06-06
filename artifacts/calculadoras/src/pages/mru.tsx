import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Atom } from "lucide-react";
import { useLocale } from "@/lib/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type Solve = "distance" | "velocity" | "time";

const distanceUnits: Record<string, { label: string; toSI: number }> = {
  m: { label: "Metros (m)", toSI: 1 },
  km: { label: "Kilómetros (km)", toSI: 1000 },
  mi: { label: "Millas (mi)", toSI: 1609.344 },
};

const velocityUnits: Record<string, { label: string; toSI: number }> = {
  "m/s": { label: "m/s", toSI: 1 },
  "km/h": { label: "km/h", toSI: 1 / 3.6 },
  mph: { label: "mph", toSI: 0.44704 },
};

const timeUnits: Record<string, { label: string; toSI: number }> = {
  s: { label: "Segundos (s)", toSI: 1 },
  min: { label: "Minutos (min)", toSI: 60 },
  h: { label: "Horas (h)", toSI: 3600 },
};

function fmt(n: number, decimals = 4): string {
  if (Math.abs(n) >= 1000) return n.toLocaleString("es-ES", { maximumFractionDigits: 2 });
  return n.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: decimals });
}

const T = {
  es: {
    backHome: "Volver al inicio",
    title: "Calculadora MRU",
    subtitle: "Movimiento Rectilíneo Uniforme: calcula distancia, velocidad o tiempo con la fórmula d = v × t.",
    cardTitle: "¿Qué quieres calcular?",
    distanceBtn: "Distancia",
    velocityBtn: "Velocidad",
    timeBtn: "Tiempo",
    distanceLabel: "Distancia",
    velocityLabel: "Velocidad",
    timeLabel: "Tiempo",
    unitLabel: "Unidad",
    valuePlaceholder: "Valor",
    errDistance: "La distancia debe ser un número positivo.",
    errVelocity: "La velocidad debe ser un número positivo.",
    errTime: "El tiempo debe ser un número positivo.",
    calculateBtn: "Calcular",
    calculatedLabel: (label: string) => `${label} calculada`,
    chartTitle: "Posición en el tiempo",
    distanceChartLabel: "Distancia",
    formulaTitle: "Fórmula aplicada",
    formulaBase: "d = v × t",
    howTitle: "¿Qué es el MRU?",
    howText: "El Movimiento Rectilíneo Uniforme (MRU) es aquel en que un objeto se desplaza en línea recta con velocidad constante, es decir, sin aceleración. La relación entre las magnitudes es:",
    howFormulas: "d = v × t   |   v = d / t   |   t = d / v",
    howText2: "Donde d es la distancia recorrida, v es la velocidad y t es el tiempo transcurrido.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Cuál es la diferencia entre MRU y MRUA?",
    a1: "En el MRU la velocidad es constante (aceleración = 0). En el MRUA la velocidad cambia uniformemente porque hay una aceleración constante diferente de cero.",
    q2: "¿Se puede aplicar el MRU al movimiento de los planetas?",
    a2: "No exactamente. Los planetas siguen órbitas elípticas y su velocidad varía. Sin embargo, para tramos muy pequeños de la trayectoria, puede aproximarse como MRU.",
    q3: "¿Cuándo se usa el MRU en la vida cotidiana?",
    a3: "En viajes por autopista a velocidad constante, en cintas transportadoras industriales, en satélites en órbita circular (aproximadamente), y en muchos problemas de física básica de bachillerato y universidad.",
    resultLabels: { distance: "Distancia", velocity: "Velocidad", time: "Tiempo" } as Record<string, string>,
  },
  en: {
    backHome: "Back to home",
    title: "URM Calculator",
    subtitle: "Uniform Rectilinear Motion: calculate distance, velocity or time with the formula d = v × t.",
    cardTitle: "What do you want to calculate?",
    distanceBtn: "Distance",
    velocityBtn: "Velocity",
    timeBtn: "Time",
    distanceLabel: "Distance",
    velocityLabel: "Velocity",
    timeLabel: "Time",
    unitLabel: "Unit",
    valuePlaceholder: "Value",
    errDistance: "Distance must be a positive number.",
    errVelocity: "Velocity must be a positive number.",
    errTime: "Time must be a positive number.",
    calculateBtn: "Calculate",
    calculatedLabel: (label: string) => `Calculated ${label.toLowerCase()}`,
    chartTitle: "Position over time",
    distanceChartLabel: "Distance",
    formulaTitle: "Formula applied",
    formulaBase: "d = v × t",
    howTitle: "What is URM?",
    howText: "Uniform Rectilinear Motion (URM) is the motion in which an object moves in a straight line at constant velocity, i.e., without acceleration. The relationship between the quantities is:",
    howFormulas: "d = v × t   |   v = d / t   |   t = d / v",
    howText2: "Where d is the distance travelled, v is the velocity and t is the time elapsed.",
    faqTitle: "Frequently asked questions",
    q1: "What is the difference between URM and UARM?",
    a1: "In URM the velocity is constant (acceleration = 0). In UARM the velocity changes uniformly because there is a non-zero constant acceleration.",
    q2: "Can URM be applied to the motion of planets?",
    a2: "Not exactly. Planets follow elliptical orbits and their speed varies. However, for very small sections of the trajectory, it can be approximated as URM.",
    q3: "When is URM used in everyday life?",
    a3: "On motorway journeys at constant speed, on industrial conveyor belts, on satellites in approximately circular orbits, and in many basic physics problems at secondary and university level.",
    resultLabels: { distance: "Distance", velocity: "Velocity", time: "Time" } as Record<string, string>,
  },
};

export default function MRU() {
  const locale = useLocale();
  const tr = T[locale];
  const [solve, setSolve] = useState<Solve>("distance");
  const [distVal, setDistVal] = useState("");
  const [distUnit, setDistUnit] = useState("m");
  const [velVal, setVelVal] = useState("");
  const [velUnit, setVelUnit] = useState("m/s");
  const [timeVal, setTimeVal] = useState("");
  const [timeUnit, setTimeUnit] = useState("s");
  const [result, setResult] = useState<{ value: number; label: string; unit: string; chartData: { t: number; d: number }[] } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const calculate = () => {
    const errs: string[] = [];
    let d = solve !== "distance" ? parseFloat(distVal) * distanceUnits[distUnit].toSI : NaN;
    let v = solve !== "velocity" ? parseFloat(velVal) * velocityUnits[velUnit].toSI : NaN;
    let t = solve !== "time" ? parseFloat(timeVal) * timeUnits[timeUnit].toSI : NaN;

    if (solve !== "distance" && (isNaN(d) || d <= 0)) errs.push(tr.errDistance);
    if (solve !== "velocity" && (isNaN(v) || v <= 0)) errs.push(tr.errVelocity);
    if (solve !== "time" && (isNaN(t) || t <= 0)) errs.push(tr.errTime);

    setErrors(errs);
    if (errs.length > 0) return;

    let resultValue: number;
    let resultLabel: string;
    let resultUnit: string;

    if (solve === "distance") {
      resultValue = v * t;
      resultLabel = tr.resultLabels["distance"];
      resultUnit = distUnit;
      d = resultValue;
    } else if (solve === "velocity") {
      resultValue = d / t;
      resultLabel = tr.resultLabels["velocity"];
      resultUnit = velUnit;
      v = resultValue;
    } else {
      resultValue = d / v;
      resultLabel = tr.resultLabels["time"];
      resultUnit = timeUnit;
      t = resultValue;
    }

    const display = resultValue / (solve === "distance" ? distanceUnits[distUnit].toSI : solve === "velocity" ? velocityUnits[velUnit].toSI : timeUnits[timeUnit].toSI);

    const steps = 10;
    const chartData = Array.from({ length: steps + 1 }, (_, i) => {
      const ti = (t / steps) * i;
      return { t: parseFloat((ti / timeUnits[timeUnit].toSI).toFixed(3)), d: parseFloat(((v * ti) / distanceUnits[distUnit].toSI).toFixed(4)) };
    });

    setResult({ value: display, label: resultLabel, unit: solve === "velocity" ? velUnit : solve === "time" ? timeUnit : distUnit, chartData });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href={locale === "en" ? "/en" : "/"} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
          {tr.backHome}
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Atom className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{tr.title}</h1>
      </div>
      <p className="text-muted-foreground mb-8">{tr.subtitle}</p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{tr.cardTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap mb-6">
            {(["distance", "velocity", "time"] as Solve[]).map((s) => (
              <Button
                key={s}
                data-testid={`button-solve-${s}`}
                variant={solve === s ? "default" : "outline"}
                onClick={() => { setSolve(s); setResult(null); setErrors([]); }}
              >
                {s === "distance" ? tr.distanceBtn : s === "velocity" ? tr.velocityBtn : tr.timeBtn}
              </Button>
            ))}
          </div>

          <div className="grid gap-4">
            {solve !== "distance" && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="dist-val">{tr.distanceLabel}</Label>
                  <Input id="dist-val" data-testid="input-distance" type="number" value={distVal} onChange={(e) => setDistVal(e.target.value)} placeholder={tr.valuePlaceholder} className="mt-1" />
                </div>
                <div>
                  <Label>{tr.unitLabel}</Label>
                  <Select value={distUnit} onValueChange={setDistUnit}>
                    <SelectTrigger data-testid="select-distance-unit" className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(distanceUnits).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {solve !== "velocity" && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="vel-val">{tr.velocityLabel}</Label>
                  <Input id="vel-val" data-testid="input-velocity" type="number" value={velVal} onChange={(e) => setVelVal(e.target.value)} placeholder={tr.valuePlaceholder} className="mt-1" />
                </div>
                <div>
                  <Label>{tr.unitLabel}</Label>
                  <Select value={velUnit} onValueChange={setVelUnit}>
                    <SelectTrigger data-testid="select-velocity-unit" className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(velocityUnits).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {solve !== "time" && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="time-val">{tr.timeLabel}</Label>
                  <Input id="time-val" data-testid="input-time" type="number" value={timeVal} onChange={(e) => setTimeVal(e.target.value)} placeholder={tr.valuePlaceholder} className="mt-1" />
                </div>
                <div>
                  <Label>{tr.unitLabel}</Label>
                  <Select value={timeUnit} onValueChange={setTimeUnit}>
                    <SelectTrigger data-testid="select-time-unit" className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(timeUnits).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {errors.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-4">
          {errors.map((e, i) => <p key={i} className="text-sm text-destructive">{e}</p>)}
        </div>
      )}

      <Button data-testid="button-calculate" onClick={calculate} className="w-full mb-8" size="lg">
        {tr.calculateBtn}
      </Button>

      {result && (
        <div className="space-y-6">
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">{tr.calculatedLabel(result.label)}</p>
                <p className="text-4xl font-bold text-primary mb-1">{fmt(result.value)} <span className="text-2xl">{result.unit}</span></p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>{tr.chartTitle}</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={result.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="t" label={{ value: timeUnit, position: "insideBottomRight", offset: -5 }} tick={{ fontSize: 12 }} />
                  <YAxis label={{ value: distUnit, angle: -90, position: "insideLeft" }} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: number) => [`${fmt(v)} ${distUnit}`, tr.distanceChartLabel]} labelFormatter={(l) => `t = ${l} ${timeUnit}`} />
                  <Line type="linear" dataKey="d" stroke="#0FA958" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>{tr.formulaTitle}</CardTitle></CardHeader>
            <CardContent className="font-mono text-sm space-y-2">
              <p className="text-muted-foreground">{tr.formulaBase}</p>
              {solve === "distance" && <p>d = {fmt(result.value)} {result.unit}</p>}
              {solve === "velocity" && <p>v = d / t = {fmt(result.value)} {result.unit}</p>}
              {solve === "time" && <p>t = d / v = {fmt(result.value)} {result.unit}</p>}
            </CardContent>
          </Card>
        </div>
      )}

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">{tr.howTitle}</h2>
        <p className="text-muted-foreground mb-4">{tr.howText}</p>
        <div className="bg-accent/50 rounded-lg p-4 font-mono text-sm mb-4">
          {tr.howFormulas}
        </div>
        <p className="text-muted-foreground">{tr.howText2}</p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">{tr.faqTitle}</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="q1">
            <AccordionTrigger>{tr.q1}</AccordionTrigger>
            <AccordionContent>{tr.a1}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>{tr.q2}</AccordionTrigger>
            <AccordionContent>{tr.a2}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>{tr.q3}</AccordionTrigger>
            <AccordionContent>{tr.a3}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
