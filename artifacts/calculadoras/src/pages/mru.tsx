import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Atom } from "lucide-react";
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

export default function MRU() {
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

    if (solve !== "distance" && (isNaN(d) || d <= 0)) errs.push("La distancia debe ser un número positivo.");
    if (solve !== "velocity" && (isNaN(v) || v <= 0)) errs.push("La velocidad debe ser un número positivo.");
    if (solve !== "time" && (isNaN(t) || t <= 0)) errs.push("El tiempo debe ser un número positivo.");

    setErrors(errs);
    if (errs.length > 0) return;

    let resultValue: number;
    let resultLabel: string;
    let resultUnit: string;

    if (solve === "distance") {
      resultValue = v * t;
      resultLabel = "Distancia";
      resultUnit = distUnit;
      d = resultValue;
    } else if (solve === "velocity") {
      resultValue = d / t;
      resultLabel = "Velocidad";
      resultUnit = velUnit;
      v = resultValue;
    } else {
      resultValue = d / v;
      resultLabel = "Tiempo";
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
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Atom className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Calculadora MRU</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Movimiento Rectilíneo Uniforme: calcula distancia, velocidad o tiempo con la fórmula d = v × t.
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>¿Qué quieres calcular?</CardTitle>
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
                {s === "distance" ? "Distancia" : s === "velocity" ? "Velocidad" : "Tiempo"}
              </Button>
            ))}
          </div>

          <div className="grid gap-4">
            {solve !== "distance" && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="dist-val">Distancia</Label>
                  <Input id="dist-val" data-testid="input-distance" type="number" value={distVal} onChange={(e) => setDistVal(e.target.value)} placeholder="Valor" className="mt-1" />
                </div>
                <div>
                  <Label>Unidad</Label>
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
                  <Label htmlFor="vel-val">Velocidad</Label>
                  <Input id="vel-val" data-testid="input-velocity" type="number" value={velVal} onChange={(e) => setVelVal(e.target.value)} placeholder="Valor" className="mt-1" />
                </div>
                <div>
                  <Label>Unidad</Label>
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
                  <Label htmlFor="time-val">Tiempo</Label>
                  <Input id="time-val" data-testid="input-time" type="number" value={timeVal} onChange={(e) => setTimeVal(e.target.value)} placeholder="Valor" className="mt-1" />
                </div>
                <div>
                  <Label>Unidad</Label>
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
        Calcular
      </Button>

      {result && (
        <div className="space-y-6">
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">{result.label} calculada</p>
                <p className="text-4xl font-bold text-primary mb-1">{fmt(result.value)} <span className="text-2xl">{result.unit}</span></p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Posición en el tiempo</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={result.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="t" label={{ value: timeUnit, position: "insideBottomRight", offset: -5 }} tick={{ fontSize: 12 }} />
                  <YAxis label={{ value: distUnit, angle: -90, position: "insideLeft" }} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: number) => [`${fmt(v)} ${distUnit}`, "Distancia"]} labelFormatter={(l) => `t = ${l} ${timeUnit}`} />
                  <Line type="linear" dataKey="d" stroke="#0FA958" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Fórmula aplicada</CardTitle></CardHeader>
            <CardContent className="font-mono text-sm space-y-2">
              <p className="text-muted-foreground">d = v × t</p>
              {solve === "distance" && <p>d = {fmt(result.value)} {result.unit}</p>}
              {solve === "velocity" && <p>v = d / t = {fmt(result.value)} {result.unit}</p>}
              {solve === "time" && <p>t = d / v = {fmt(result.value)} {result.unit}</p>}
            </CardContent>
          </Card>
        </div>
      )}

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">¿Qué es el MRU?</h2>
        <p className="text-muted-foreground mb-4">
          El Movimiento Rectilíneo Uniforme (MRU) es aquel en que un objeto se desplaza en línea recta
          con velocidad constante, es decir, sin aceleración. La relación entre las magnitudes es:
        </p>
        <div className="bg-accent/50 rounded-lg p-4 font-mono text-sm mb-4">
          d = v × t &nbsp;&nbsp;|&nbsp;&nbsp; v = d / t &nbsp;&nbsp;|&nbsp;&nbsp; t = d / v
        </div>
        <p className="text-muted-foreground">
          Donde d es la distancia recorrida, v es la velocidad y t es el tiempo transcurrido.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Preguntas frecuentes</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="q1">
            <AccordionTrigger>¿Cuál es la diferencia entre MRU y MRUA?</AccordionTrigger>
            <AccordionContent>
              En el MRU la velocidad es constante (aceleración = 0). En el MRUA la velocidad cambia
              uniformemente porque hay una aceleración constante diferente de cero.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>¿Se puede aplicar el MRU al movimiento de los planetas?</AccordionTrigger>
            <AccordionContent>
              No exactamente. Los planetas siguen órbitas elípticas y su velocidad varía. Sin embargo,
              para tramos muy pequeños de la trayectoria, puede aproximarse como MRU.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>¿Cuándo se usa el MRU en la vida cotidiana?</AccordionTrigger>
            <AccordionContent>
              En viajes por autopista a velocidad constante, en cintas transportadoras industriales,
              en satélites en órbita circular (aproximadamente), y en muchos problemas de física básica
              de bachillerato y universidad.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
