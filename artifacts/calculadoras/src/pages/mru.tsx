import { useState, useRef } from "react";
import { Link } from "wouter";
import { ArrowLeft, Atom, Download } from "lucide-react";
import { useLocale } from "@/lib/locale";
import { downloadChart } from "@/lib/chart-download";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";

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
    intro1: "El Movimiento Rectilíneo Uniforme (MRU) es el modelo de movimiento más sencillo de la física: un objeto que se desplaza en línea recta a velocidad constante, sin aceleración. La relación entre distancia, velocidad y tiempo se expresa mediante la fórmula d = v × t, que permite calcular cualquiera de las tres magnitudes cuando se conocen las otras dos.",
    intro2: "Esta calculadora resuelve el MRU en las tres variantes posibles: calcular la distancia recorrida dados velocidad y tiempo, calcular la velocidad dados distancia y tiempo, o calcular el tiempo dados distancia y velocidad. También incluye un gráfico posición-tiempo y admite distintas unidades (metros, kilómetros, millas, km/h, m/s, mph, segundos, minutos, horas).",
    disclaimer: "Los resultados asumen condiciones ideales (velocidad estrictamente constante y movimiento en línea recta). En situaciones reales existen factores externos que modifican el movimiento.",
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
    q4: "¿Cómo se pasa de km/h a m/s?",
    a4: "Se divide entre 3,6. La razón es que un kilómetro son 1.000 metros y una hora son 3.600 segundos, de modo que 1 km/h = 1.000/3.600 m/s = 0,2778 m/s. Por ejemplo, 90 km/h equivalen a 90/3,6 = 25 m/s. Para la conversión inversa, de m/s a km/h, se multiplica por 3,6: 10 m/s son 36 km/h. Esta conversión es imprescindible en los problemas de física, porque el Sistema Internacional trabaja en metros y segundos mientras que los enunciados suelen dar las velocidades en kilómetros por hora.",
    q5: "¿Qué diferencia hay entre velocidad y rapidez?",
    a5: "En física la velocidad es una magnitud vectorial: tiene módulo, dirección y sentido. La rapidez (o celeridad) es solo el módulo, un número sin dirección asociada. En un MRU en línea recta y sin cambios de sentido ambas coinciden en valor, y por eso en los problemas básicos se usan indistintamente. La diferencia importa cuando hay cambios de dirección: si das una vuelta completa a una pista y vuelves al punto de partida, tu rapidez media es la distancia total dividida entre el tiempo, pero tu velocidad media es cero, porque tu desplazamiento neto ha sido nulo.",
    deepTitle: "Cómo resolver problemas de MRU paso a paso",
    deep: "El procedimiento es siempre el mismo. Primero identifica qué magnitud te piden y cuáles te dan. Segundo, comprueba las unidades: este es el error más frecuente en los ejercicios. Si mezclas km/h con segundos el resultado será incorrecto, así que conviene pasar todo a un sistema coherente (metros y segundos, o kilómetros y horas). Recuerda que para pasar de km/h a m/s se divide entre 3,6, y para el camino inverso se multiplica por 3,6. Tercero, despeja la fórmula d = v × t según lo que busques y sustituye los valores. Por último, comprueba que el resultado tiene sentido físico: una distancia o un tiempo nunca pueden ser negativos.",
    exampleTitle: "Ejemplo resuelto",
    example: "Un tren circula a velocidad constante de 90 km/h durante 2,5 horas. ¿Qué distancia recorre? Aplicamos d = v × t = 90 × 2,5 = 225 km. Si en cambio conociéramos la distancia (225 km) y el tiempo (2,5 h), la velocidad sería v = d / t = 225 / 2,5 = 90 km/h. Y si supiéramos la distancia y la velocidad, el tiempo sería t = d / v = 225 / 90 = 2,5 h. Lo importante es que las unidades sean coherentes: si la velocidad está en km/h, el tiempo debe expresarse en horas para que la distancia salga en kilómetros.",
    tableTitle: "Velocidades habituales de referencia",
    tableCol1: "Situación",
    tableCol2: "km/h",
    tableCol3: "m/s",
    interpretTitle: "Cómo interpretar la gráfica posición-tiempo",
    interpret: "En un MRU, la gráfica de posición frente al tiempo es siempre una línea recta, y su pendiente es precisamente la velocidad: cuanto más inclinada está la recta, más rápido se mueve el objeto. Una recta horizontal significa que el objeto está en reposo. Esto contrasta con el MRUA, donde la gráfica posición-tiempo es una parábola porque la velocidad cambia de forma continua. Si en cambio representas la velocidad frente al tiempo en un MRU obtendrás una línea horizontal, y el área encerrada bajo esa línea equivale a la distancia recorrida.",
    resultLabels: { distance: "Distancia", velocity: "Velocidad", time: "Tiempo" } as Record<string, string>,
  },
  en: {
    backHome: "Back to home",
    title: "URM Calculator",
    subtitle: "Uniform Rectilinear Motion: calculate distance, velocity or time with the formula d = v × t.",
    intro1: "Uniform Rectilinear Motion (URM) is the simplest model of motion in physics: an object that moves in a straight line at constant velocity, with no acceleration. The relationship between distance, velocity and time is expressed by the formula d = v × t, which allows any of the three quantities to be calculated when the other two are known.",
    intro2: "This calculator solves URM in all three possible variants: calculating the distance given velocity and time, calculating the velocity given distance and time, or calculating the time given distance and velocity. It also includes a position-time graph and supports different units (metres, kilometres, miles, km/h, m/s, mph, seconds, minutes, hours).",
    disclaimer: "Results assume ideal conditions (strictly constant velocity and straight-line motion). In real situations, external factors affect the motion.",
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
    q4: "How do you convert km/h to m/s?",
    a4: "You divide by 3.6. The reason is that one kilometre is 1,000 metres and one hour is 3,600 seconds, so 1 km/h = 1,000/3,600 m/s = 0.2778 m/s. For example, 90 km/h equals 90/3.6 = 25 m/s. For the reverse conversion, from m/s to km/h, you multiply by 3.6: 10 m/s is 36 km/h. This conversion is essential in physics problems, because the International System works in metres and seconds while exercises usually give speeds in kilometres per hour.",
    q5: "What is the difference between velocity and speed?",
    a5: "In physics, velocity is a vector quantity: it has magnitude, direction and sense. Speed is only the magnitude, a number with no associated direction. In URM along a straight line with no change of sense, the two coincide in value, which is why basic problems use them interchangeably. The difference matters when there are changes of direction: if you run a full lap of a track and return to the starting point, your average speed is the total distance divided by time, but your average velocity is zero, because your net displacement was nil.",
    deepTitle: "How to solve URM problems step by step",
    deep: "The procedure is always the same. First, identify which quantity you are asked for and which ones you are given. Second, check the units: this is the most common mistake in exercises. If you mix km/h with seconds the result will be wrong, so convert everything into a consistent system (metres and seconds, or kilometres and hours). Remember that to go from km/h to m/s you divide by 3.6, and multiply by 3.6 for the reverse. Third, rearrange the formula d = v × t according to what you are looking for and substitute the values. Finally, check that the result makes physical sense: a distance or a time can never be negative.",
    exampleTitle: "Worked example",
    example: "A train travels at a constant speed of 90 km/h for 2.5 hours. How far does it go? We apply d = v × t = 90 × 2.5 = 225 km. If instead we knew the distance (225 km) and the time (2.5 h), the velocity would be v = d / t = 225 / 2.5 = 90 km/h. And if we knew the distance and the velocity, the time would be t = d / v = 225 / 90 = 2.5 h. The key is that units must be consistent: if velocity is in km/h, time must be in hours for the distance to come out in kilometres.",
    tableTitle: "Common reference speeds",
    tableCol1: "Situation",
    tableCol2: "km/h",
    tableCol3: "m/s",
    interpretTitle: "How to read the position-time graph",
    interpret: "In URM, the graph of position against time is always a straight line, and its slope is precisely the velocity: the steeper the line, the faster the object moves. A horizontal line means the object is at rest. This contrasts with UARM, where the position-time graph is a parabola because the velocity changes continuously. If instead you plot velocity against time in URM you get a horizontal line, and the area enclosed under that line equals the distance travelled.",
    resultLabels: { distance: "Distance", velocity: "Velocity", time: "Time" } as Record<string, string>,
  },
};

const SPEED_TABLE = [
  { es: "Persona caminando", en: "Person walking", kmh: "5", ms: "1,4" },
  { es: "Corriendo (ritmo popular)", en: "Running (recreational)", kmh: "12", ms: "3,3" },
  { es: "Bicicleta", en: "Bicycle", kmh: "25", ms: "6,9" },
  { es: "Coche en ciudad", en: "Car in town", kmh: "50", ms: "13,9" },
  { es: "Coche en autopista", en: "Car on motorway", kmh: "120", ms: "33,3" },
  { es: "Sonido en el aire", en: "Sound in air", kmh: "1.235", ms: "343" },
];

export default function MRU() {
  const locale = useLocale();
  const isEn = locale === "en";
  const tr = T[locale];
  const [chartType, setChartType] = useState<"line" | "area" | "bar">("line");
  const chartRef = useRef<HTMLDivElement>(null);
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
      <p className="text-muted-foreground mb-6">{tr.subtitle}</p>

      <div className="prose prose-sm dark:prose-invert max-w-none mb-8 space-y-3 text-gray-700 dark:text-gray-300">
        <p>{tr.intro1}</p>
        <p>{tr.intro2}</p>
      </div>

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
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>{tr.chartTitle}</CardTitle>
              <div className="flex gap-1">
                {(["line", "area", "bar"] as const).map((ct) => (
                  <button key={ct} onClick={() => setChartType(ct)}
                    className={`px-2 py-1 text-xs rounded-md font-medium transition-colors ${chartType === ct ? "bg-primary text-white" : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20"}`}>
                    {ct === "line" ? (isEn ? "Line" : "Línea") : ct === "area" ? (isEn ? "Area" : "Área") : (isEn ? "Bars" : "Barras")}
                  </button>
                ))}
                <button
                  onClick={() => downloadChart(chartRef.current, "grafico-mru")}
                  title={isEn ? "Download chart" : "Descargar gráfico"}
                  className="p-1 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div ref={chartRef}>
              <ResponsiveContainer width="100%" height={250}>
                {chartType === "line" ? (
                  <LineChart data={result.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="t" label={{ value: timeUnit, position: "insideBottomRight", offset: -5 }} tick={{ fontSize: 12 }} />
                    <YAxis label={{ value: distUnit, angle: -90, position: "insideLeft" }} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v: number) => [`${fmt(v)} ${distUnit}`, tr.distanceChartLabel]} labelFormatter={(l) => `t = ${l} ${timeUnit}`} />
                    <Line type="linear" dataKey="d" stroke="#0FA958" strokeWidth={2} dot={false} />
                  </LineChart>
                ) : chartType === "area" ? (
                  <AreaChart data={result.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="t" label={{ value: timeUnit, position: "insideBottomRight", offset: -5 }} tick={{ fontSize: 12 }} />
                    <YAxis label={{ value: distUnit, angle: -90, position: "insideLeft" }} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v: number) => [`${fmt(v)} ${distUnit}`, tr.distanceChartLabel]} labelFormatter={(l) => `t = ${l} ${timeUnit}`} />
                    <Area type="linear" dataKey="d" stroke="#0FA958" fill="#0FA958" fillOpacity={0.3} strokeWidth={2} dot={false} />
                  </AreaChart>
                ) : (
                  <BarChart data={result.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="t" label={{ value: timeUnit, position: "insideBottomRight", offset: -5 }} tick={{ fontSize: 12 }} />
                    <YAxis label={{ value: distUnit, angle: -90, position: "insideLeft" }} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v: number) => [`${fmt(v)} ${distUnit}`, tr.distanceChartLabel]} labelFormatter={(l) => `t = ${l} ${timeUnit}`} />
                    <Bar dataKey="d" fill="#0FA958" fillOpacity={0.8} />
                  </BarChart>
                )}
              </ResponsiveContainer>
              </div>
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

      <section className="mt-10 prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{tr.deepTitle}</h2>
        <p>{tr.deep}</p>
        <h3 className="text-base font-semibold mt-6 mb-2 text-gray-900 dark:text-white">{tr.exampleTitle}</h3>
        <p>{tr.example}</p>
      </section>

      <div className="mt-8 overflow-x-auto">
        <h3 className="text-base font-semibold mb-3 text-gray-900 dark:text-white">{tr.tableTitle}</h3>
        <table className="w-full text-sm border-collapse max-w-lg">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10 text-left text-gray-500 dark:text-white/50">
              <th className="py-2 pr-4 font-medium">{tr.tableCol1}</th>
              <th className="py-2 pr-4 font-medium">{tr.tableCol2}</th>
              <th className="py-2 font-medium">{tr.tableCol3}</th>
            </tr>
          </thead>
          <tbody>
            {SPEED_TABLE.map((row) => (
              <tr key={row.es} className="border-b border-gray-100 dark:border-white/5">
                <td className="py-2 pr-4 font-medium text-gray-900 dark:text-white">{isEn ? row.en : row.es}</td>
                <td className="py-2 pr-4 font-semibold text-primary whitespace-nowrap">{row.kmh}</td>
                <td className="py-2 text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.ms}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-8 prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{tr.interpretTitle}</h2>
        <p>{tr.interpret}</p>
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
          <AccordionItem value="q5">
            <AccordionTrigger>{tr.q5}</AccordionTrigger>
            <AccordionContent>{tr.a5}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}
