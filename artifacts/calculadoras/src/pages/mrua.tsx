import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Atom } from "lucide-react";
import { useLocale } from "@/lib/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";

interface Result {
  v0: number;
  a: number;
  t: number;
  vf: number;
  d: number;
  chartData: { t: number; v: number; d: number }[];
}

function fmt(n: number): string {
  return n.toLocaleString("es-ES", { maximumFractionDigits: 4 });
}

const T = {
  es: {
    backHome: "Volver al inicio",
    title: "Calculadora MRUA",
    subtitle: "Movimiento Rectilíneo Uniformemente Acelerado: calcula velocidad final y distancia recorrida.",
    cardTitle: "Datos del movimiento",
    v0Label: "Velocidad inicial v₀ (m/s)",
    v0Hint: "Puede ser negativa (movimiento opuesto)",
    aLabel: "Aceleración a (m/s²)",
    aHint: "Puede ser negativa (desaceleración)",
    tLabel: "Tiempo t (s)",
    errV0: "La velocidad inicial debe ser un número.",
    errA: "La aceleración debe ser un número.",
    errT: "El tiempo debe ser un número positivo.",
    calculateBtn: "Calcular",
    finalVelocity: "Velocidad final",
    distance: "Distancia recorrida",
    formulaTitle: "Fórmulas aplicadas",
    chartTitle: "Velocidad y posición en el tiempo",
    velocityLabel: "Velocidad (m/s)",
    distanceLabel: "Distancia (m)",
    howTitle: "¿Qué es el MRUA?",
    howText: "El Movimiento Rectilíneo Uniformemente Acelerado (MRUA) es aquel en que un objeto se desplaza en línea recta con una aceleración constante. La velocidad cambia uniformemente con el tiempo.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Qué es la caída libre?",
    a1: "La caída libre es un ejemplo de MRUA con aceleración = g ≈ 9.8 m/s² (gravedad terrestre) y velocidad inicial = 0. Si el objeto tiene velocidad inicial, se llama \"tiro vertical\".",
    q2: "¿Qué significa una aceleración negativa?",
    a2: "Una aceleración negativa significa que el objeto está desacelerando (si se mueve en la dirección positiva) o acelerando en la dirección contraria. Por ejemplo, un coche frenando tiene aceleración negativa respecto a su velocidad de avance.",
    q3: "¿Cuándo el MRUA se convierte en MRU?",
    a3: "Cuando la aceleración es cero (a = 0). En ese caso, la velocidad no cambia y el movimiento es uniforme (MRU), con d = v × t.",
    q4: "¿Cómo afecta la resistencia del aire al MRUA?",
    a4: "La resistencia del aire es una fuerza que se opone al movimiento y provoca que la aceleración no sea constante. En ese caso, las fórmulas del MRUA ya no son exactas. Para problemas reales con alta velocidad se necesitan ecuaciones diferenciales.",
  },
  en: {
    backHome: "Back to home",
    title: "UARM Calculator",
    subtitle: "Uniformly Accelerated Rectilinear Motion: calculate final velocity and distance travelled.",
    cardTitle: "Motion data",
    v0Label: "Initial velocity v₀ (m/s)",
    v0Hint: "Can be negative (opposite direction)",
    aLabel: "Acceleration a (m/s²)",
    aHint: "Can be negative (deceleration)",
    tLabel: "Time t (s)",
    errV0: "Initial velocity must be a number.",
    errA: "Acceleration must be a number.",
    errT: "Time must be a positive number.",
    calculateBtn: "Calculate",
    finalVelocity: "Final velocity",
    distance: "Distance travelled",
    formulaTitle: "Formulas applied",
    chartTitle: "Velocity and position over time",
    velocityLabel: "Velocity (m/s)",
    distanceLabel: "Distance (m)",
    howTitle: "What is UARM?",
    howText: "Uniformly Accelerated Rectilinear Motion (UARM) is the motion in which an object moves in a straight line with constant acceleration. The velocity changes uniformly over time.",
    faqTitle: "Frequently asked questions",
    q1: "What is free fall?",
    a1: "Free fall is an example of UARM with acceleration = g ≈ 9.8 m/s² (Earth's gravity) and initial velocity = 0. If the object has an initial velocity, it is called a \"vertical throw\".",
    q2: "What does negative acceleration mean?",
    a2: "Negative acceleration means the object is decelerating (if moving in the positive direction) or accelerating in the opposite direction. For example, a braking car has negative acceleration relative to its forward velocity.",
    q3: "When does UARM become URM?",
    a3: "When the acceleration is zero (a = 0). In that case, the velocity does not change and the motion is uniform (URM), with d = v × t.",
    q4: "How does air resistance affect UARM?",
    a4: "Air resistance is a force that opposes motion and causes the acceleration to not be constant. In that case, the UARM formulas are no longer exact. For real problems at high speed, differential equations are needed.",
  },
};

export default function MRUA() {
  const locale = useLocale();
  const tr = T[locale];
  const [v0, setV0] = useState("");
  const [a, setA] = useState("");
  const [t, setT] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const calculate = () => {
    const errs: string[] = [];
    const v0n = parseFloat(v0);
    const an = parseFloat(a);
    const tn = parseFloat(t);

    if (isNaN(v0n)) errs.push(tr.errV0);
    if (isNaN(an)) errs.push(tr.errA);
    if (isNaN(tn) || tn <= 0) errs.push(tr.errT);

    setErrors(errs);
    if (errs.length > 0) return;

    const vf = v0n + an * tn;
    const d = v0n * tn + 0.5 * an * tn * tn;

    const steps = 20;
    const chartData = Array.from({ length: steps + 1 }, (_, i) => {
      const ti = (tn / steps) * i;
      return {
        t: parseFloat(ti.toFixed(3)),
        v: parseFloat((v0n + an * ti).toFixed(4)),
        d: parseFloat((v0n * ti + 0.5 * an * ti * ti).toFixed(4)),
      };
    });

    setResult({ v0: v0n, a: an, t: tn, vf, d, chartData });
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
        <CardHeader><CardTitle>{tr.cardTitle}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="v0-input">{tr.v0Label}</Label>
              <Input
                id="v0-input"
                data-testid="input-v0"
                type="number"
                value={v0}
                onChange={(e) => setV0(e.target.value)}
                placeholder="0"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">{tr.v0Hint}</p>
            </div>
            <div>
              <Label htmlFor="a-input">{tr.aLabel}</Label>
              <Input
                id="a-input"
                data-testid="input-acceleration"
                type="number"
                value={a}
                onChange={(e) => setA(e.target.value)}
                placeholder="9.8"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">{tr.aHint}</p>
            </div>
          </div>
          <div className="max-w-xs">
            <Label htmlFor="t-input">{tr.tLabel}</Label>
            <Input
              id="t-input"
              data-testid="input-time"
              type="number"
              value={t}
              onChange={(e) => setT(e.target.value)}
              placeholder="10"
              className="mt-1"
            />
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
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">{tr.finalVelocity}</p>
                <p className="text-3xl font-bold text-primary">{fmt(result.vf)} m/s</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {fmt(result.vf * 3.6)} km/h
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">{tr.distance}</p>
                <p className="text-3xl font-bold text-primary">{fmt(result.d)} m</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {fmt(result.d / 1000)} km
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>{tr.formulaTitle}</CardTitle></CardHeader>
            <CardContent className="font-mono text-sm space-y-2 text-muted-foreground">
              <p>v(t) = v₀ + a·t = {fmt(result.v0)} + {fmt(result.a)} × {fmt(result.t)} = <span className="text-foreground font-semibold">{fmt(result.vf)} m/s</span></p>
              <p>d(t) = v₀·t + ½·a·t² = {fmt(result.v0)}×{fmt(result.t)} + 0.5×{fmt(result.a)}×{fmt(result.t)}² = <span className="text-foreground font-semibold">{fmt(result.d)} m</span></p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>{tr.chartTitle}</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={result.chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="t" label={{ value: "t (s)", position: "insideBottomRight", offset: -5 }} tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(v: number, name: string) => [
                      `${fmt(v)} ${name === "v" ? "m/s" : "m"}`,
                      name === "v" ? tr.velocityLabel : tr.distanceLabel,
                    ]}
                    labelFormatter={(l) => `t = ${l} s`}
                  />
                  <Legend formatter={(v) => v === "v" ? tr.velocityLabel : tr.distanceLabel} />
                  <Line type="monotone" dataKey="v" stroke="#0FA958" strokeWidth={2} dot={false} name="v" />
                  <Line type="monotone" dataKey="d" stroke="#0C7A42" strokeWidth={2} dot={false} strokeDasharray="5 5" name="d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">{tr.howTitle}</h2>
        <p className="text-muted-foreground mb-4">{tr.howText}</p>
        <div className="bg-accent/50 rounded-lg p-4 font-mono text-sm space-y-2">
          <p>v(t) = v₀ + a · t</p>
          <p>d(t) = v₀ · t + ½ · a · t²</p>
          <p>v² = v₀² + 2 · a · d</p>
        </div>
      </section>

      <AdUnit slot={AD_SLOTS.midContent} className="my-10" />

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
          <AccordionItem value="q4">
            <AccordionTrigger>{tr.q4}</AccordionTrigger>
            <AccordionContent>{tr.a4}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
