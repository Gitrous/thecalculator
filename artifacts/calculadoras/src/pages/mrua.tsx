import { useState, useRef } from "react";
import { Link } from "wouter";
import { ArrowLeft, Atom, Download } from "lucide-react";
import { useLocale } from "@/lib/locale";
import { downloadChart } from "@/lib/chart-download";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
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
    intro1: "El Movimiento Rectilíneo Uniformemente Acelerado (MRUA) describe el movimiento de un objeto que se desplaza en línea recta con una aceleración constante. Es el modelo que describe la caída libre, el lanzamiento vertical y el movimiento de vehículos que aceleran o frenan de forma uniforme. Las ecuaciones del MRUA permiten calcular la velocidad en cada instante y el espacio recorrido.",
    intro2: "Esta calculadora resuelve el MRUA dado el valor de velocidad inicial, aceleración y tiempo. Calcula la velocidad final y la distancia recorrida, y genera un gráfico de velocidad y posición en el tiempo. La aceleración puede ser positiva (el objeto acelera) o negativa (el objeto decelera o se mueve en sentido contrario).",
    disclaimer: "Los resultados asumen aceleración constante y ausencia de resistencias externas. La resistencia del aire y otras fuerzas externas modifican el comportamiento real.",
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
    a1: "La caída libre es el ejemplo más característico de MRUA: un objeto que cae únicamente bajo la acción de la gravedad, con una aceleración constante de g ≈ 9,81 m/s² en la superficie terrestre y velocidad inicial cero. Una consecuencia sorprendente es que, si se desprecia la resistencia del aire, todos los cuerpos caen con la misma aceleración independientemente de su masa: una pluma y una bola de acero llegarían al suelo a la vez en el vacío. Cuando el objeto parte con una velocidad inicial hacia arriba o hacia abajo, el movimiento se denomina tiro vertical, pero las ecuaciones que se aplican son exactamente las mismas.",
    q2: "¿Qué significa una aceleración negativa?",
    a2: "Una aceleración negativa significa que el vector aceleración apunta en sentido contrario al que hemos tomado como positivo. Si el objeto se mueve en la dirección positiva, una aceleración negativa hace que frene: es el caso de un coche que reduce su velocidad. Pero conviene evitar la interpretación automática, porque si el objeto ya se mueve en sentido negativo, una aceleración negativa lo acelera todavía más. El signo depende siempre del sistema de referencia que hayas elegido al plantear el problema, así que conviene definirlo de forma explícita antes de empezar a operar.",
    q3: "¿Cuándo el MRUA se convierte en MRU?",
    a3: "Cuando la aceleración es cero (a = 0). Al sustituir a = 0 en las ecuaciones del MRUA, la primera queda v = v₀ (la velocidad no cambia) y la segunda se reduce a d = v₀ · t, que es exactamente la fórmula del MRU. Por eso el MRU puede entenderse como un caso particular del MRUA, el más simple de todos. En la práctica, cualquier movimiento en el que la velocidad se mantenga constante durante el tramo estudiado puede tratarse como MRU, aunque antes o después de ese tramo hayan existido aceleraciones.",
    q4: "¿Cómo afecta la resistencia del aire al MRUA?",
    a4: "La resistencia del aire es una fuerza que se opone al movimiento y que crece con la velocidad, por lo que la aceleración deja de ser constante y las ecuaciones del MRUA dejan de ser exactas. En una caída real, conforme el objeto gana velocidad la resistencia aumenta hasta igualar el peso; en ese momento la aceleración se anula y el cuerpo cae a velocidad constante, lo que se conoce como velocidad límite o terminal. Un paracaidista alcanza unos 200 km/h en posición horizontal antes de abrir el paracaídas. Para modelar estas situaciones con precisión se necesitan ecuaciones diferenciales, aunque para caídas cortas y objetos densos el MRUA sigue siendo una buena aproximación.",
    q5: "¿Por qué la distancia de frenado crece tanto con la velocidad?",
    a5: "Porque la distancia depende del cuadrado de la velocidad, no de la velocidad. Según la ecuación v² = v₀² + 2·a·d, al despejar la distancia de frenado obtenemos d = v₀² / (2·|a|). Esto significa que duplicar la velocidad multiplica por cuatro la distancia necesaria para detenerse, y triplicarla la multiplica por nueve. Un coche que frena desde 50 km/h necesita unos 15 metros, mientras que desde 100 km/h necesita alrededor de 60. A esa distancia hay que sumar además la recorrida durante el tiempo de reacción del conductor, que a 100 km/h supone casi 30 metros adicionales.",
    q6: "¿Qué diferencia hay entre aceleración media e instantánea?",
    a6: "La aceleración media es la variación total de velocidad dividida entre el tiempo transcurrido: a = (v − v₀) / t. La aceleración instantánea es la que tiene el objeto en un momento concreto y se corresponde con la derivada de la velocidad respecto al tiempo. En el MRUA ambas coinciden, porque la aceleración es constante por definición, y esa es precisamente la razón por la que sus ecuaciones resultan tan sencillas. En movimientos con aceleración variable, como una caída con resistencia del aire, la distinción sí es relevante y hay que recurrir al cálculo diferencial.",
    deepTitle: "Las tres ecuaciones del MRUA y cuándo usar cada una",
    deep: "El MRUA se describe con tres ecuaciones que se derivan unas de otras. La primera, v = v₀ + a·t, relaciona la velocidad con el tiempo y se usa cuando quieres saber a qué velocidad va el objeto en un instante dado. La segunda, d = v₀·t + ½·a·t², da la distancia recorrida en función del tiempo y es la que aparece en la mayoría de los problemas de caída libre. La tercera, v² = v₀² + 2·a·d, resulta especialmente útil porque no incluye el tiempo: permite relacionar velocidad y distancia directamente, algo muy práctico en problemas de frenada donde el tiempo no se conoce ni se pide. Elegir bien la ecuación es el paso que más tiempo ahorra al resolver un ejercicio.",
    exampleTitle: "Ejemplo resuelto",
    example: "Un coche circula a 20 m/s y frena con una aceleración constante de −4 m/s². ¿Cuánto tarda en detenerse y qué distancia recorre? Para el tiempo usamos v = v₀ + a·t con v = 0: 0 = 20 + (−4)·t, de donde t = 5 s. Para la distancia conviene la tercera ecuación, que no depende del tiempo: v² = v₀² + 2·a·d → 0 = 400 + 2·(−4)·d → d = 400/8 = 50 m. El coche recorre 50 metros antes de detenerse, lo que explica por qué la distancia de frenado crece tan deprisa con la velocidad: al depender de v², duplicar la velocidad cuadruplica la distancia.",
    tableTitle: "Aceleración de la gravedad en distintos cuerpos",
    tableCol1: "Cuerpo celeste",
    tableCol2: "Gravedad (m/s²)",
    interpretTitle: "Cómo interpretar las gráficas del MRUA",
    interpret: "En un MRUA la gráfica de velocidad frente al tiempo es una línea recta cuya pendiente es la aceleración: ascendente si el objeto acelera y descendente si frena. El área comprendida bajo esa recta equivale a la distancia recorrida, un recurso muy útil para resolver problemas gráficamente. La gráfica de posición frente al tiempo, en cambio, es una parábola: su curvatura hacia arriba indica aceleración positiva y hacia abajo, desaceleración. Si la parábola alcanza un máximo y después desciende, significa que el objeto se detuvo y cambió de sentido, como ocurre en un tiro vertical cuando la pelota llega a su altura máxima.",
  },
  en: {
    backHome: "Back to home",
    title: "UARM Calculator",
    subtitle: "Uniformly Accelerated Rectilinear Motion: calculate final velocity and distance travelled.",
    intro1: "Uniformly Accelerated Rectilinear Motion (UARM) describes the motion of an object moving in a straight line with constant acceleration. It is the model that describes free fall, vertical throws and the motion of vehicles that accelerate or brake uniformly. The UARM equations allow the velocity at any instant and the distance travelled to be calculated.",
    intro2: "This calculator solves UARM given the initial velocity, acceleration and time values. It calculates the final velocity and distance covered, and generates a graph of velocity and position over time. The acceleration can be positive (the object accelerates) or negative (the object decelerates or moves in the opposite direction).",
    disclaimer: "Results assume constant acceleration and absence of external resistances. Air resistance and other external forces modify real-world behaviour.",
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
    a1: "Free fall is the most characteristic example of UARM: an object falling solely under the action of gravity, with a constant acceleration of g ≈ 9.81 m/s² at the Earth's surface and zero initial velocity. A surprising consequence is that, ignoring air resistance, all bodies fall with the same acceleration regardless of their mass: a feather and a steel ball would hit the ground at the same time in a vacuum. When the object starts with an initial velocity upwards or downwards, the motion is called a vertical throw, but the equations applied are exactly the same.",
    q2: "What does negative acceleration mean?",
    a2: "Negative acceleration means the acceleration vector points in the opposite direction to the one taken as positive. If the object moves in the positive direction, a negative acceleration makes it slow down: this is the case of a car reducing speed. But avoid the automatic interpretation, because if the object is already moving in the negative direction, a negative acceleration speeds it up even more. The sign always depends on the reference frame you chose when setting up the problem, so it is worth defining it explicitly before you start calculating.",
    q3: "When does UARM become URM?",
    a3: "When the acceleration is zero (a = 0). Substituting a = 0 into the UARM equations, the first becomes v = v₀ (velocity does not change) and the second reduces to d = v₀ · t, which is exactly the URM formula. That is why URM can be understood as a particular case of UARM, the simplest one of all. In practice, any motion in which velocity stays constant over the stretch being studied can be treated as URM, even if there were accelerations before or after that stretch.",
    q4: "How does air resistance affect UARM?",
    a4: "Air resistance is a force that opposes motion and grows with velocity, so the acceleration stops being constant and the UARM equations stop being exact. In a real fall, as the object gains speed the resistance increases until it matches the weight; at that moment the acceleration vanishes and the body falls at constant velocity, which is known as terminal velocity. A skydiver reaches about 200 km/h in a horizontal position before opening the parachute. Modelling these situations accurately requires differential equations, although for short falls and dense objects UARM remains a good approximation.",
    q5: "Why does braking distance grow so much with speed?",
    a5: "Because the distance depends on the square of the velocity, not on the velocity itself. From the equation v² = v₀² + 2·a·d, solving for braking distance gives d = v₀² / (2·|a|). This means doubling your speed multiplies the distance needed to stop by four, and tripling it multiplies it by nine. A car braking from 50 km/h needs about 15 metres, while from 100 km/h it needs around 60. On top of that you must add the distance covered during the driver's reaction time, which at 100 km/h amounts to almost 30 extra metres.",
    q6: "What is the difference between average and instantaneous acceleration?",
    a6: "Average acceleration is the total change in velocity divided by the time elapsed: a = (v − v₀) / t. Instantaneous acceleration is the value the object has at a specific moment and corresponds to the derivative of velocity with respect to time. In UARM the two coincide, because the acceleration is constant by definition, and that is precisely why its equations are so simple. In motion with variable acceleration, such as a fall with air resistance, the distinction does matter and you need differential calculus.",
    deepTitle: "The three UARM equations and when to use each",
    deep: "UARM is described by three equations derived from one another. The first, v = v₀ + a·t, relates velocity to time and is used when you want to know how fast the object is moving at a given instant. The second, d = v₀·t + ½·a·t², gives the distance travelled as a function of time and is the one that appears in most free-fall problems. The third, v² = v₀² + 2·a·d, is especially useful because it does not include time: it relates velocity and distance directly, which is very handy in braking problems where time is neither known nor asked for. Choosing the right equation is the step that saves the most time when solving an exercise.",
    exampleTitle: "Worked example",
    example: "A car travels at 20 m/s and brakes with a constant acceleration of −4 m/s². How long does it take to stop and how far does it travel? For the time we use v = v₀ + a·t with v = 0: 0 = 20 + (−4)·t, giving t = 5 s. For the distance the third equation is better, as it does not depend on time: v² = v₀² + 2·a·d → 0 = 400 + 2·(−4)·d → d = 400/8 = 50 m. The car covers 50 metres before stopping, which explains why braking distance grows so quickly with speed: since it depends on v², doubling the speed quadruples the distance.",
    tableTitle: "Gravitational acceleration on different bodies",
    tableCol1: "Celestial body",
    tableCol2: "Gravity (m/s²)",
    interpretTitle: "How to read UARM graphs",
    interpret: "In UARM the graph of velocity against time is a straight line whose slope is the acceleration: rising if the object speeds up and falling if it brakes. The area under that line equals the distance travelled, a very useful trick for solving problems graphically. The position-time graph, by contrast, is a parabola: curvature upwards indicates positive acceleration and downwards, deceleration. If the parabola reaches a maximum and then descends, it means the object stopped and reversed direction, as happens in a vertical throw when the ball reaches its highest point.",
  },
};

const GRAVITY_TABLE = [
  { es: "Luna", en: "Moon", g: "1,62" },
  { es: "Marte", en: "Mars", g: "3,72" },
  { es: "Venus", en: "Venus", g: "8,87" },
  { es: "Tierra", en: "Earth", g: "9,81" },
  { es: "Júpiter", en: "Jupiter", g: "24,79" },
  { es: "Sol", en: "Sun", g: "274" },
];

export default function MRUA() {
  const locale = useLocale();
  const isEn = locale === "en";
  const tr = T[locale];
  const [chartType, setChartType] = useState<"line" | "area" | "bar">("line");
  const chartRef = useRef<HTMLDivElement>(null);
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
      <p className="text-muted-foreground mb-6">{tr.subtitle}</p>

      <div className="prose prose-sm dark:prose-invert max-w-none mb-8 space-y-3 text-gray-700 dark:text-gray-300">
        <p>{tr.intro1}</p>
        <p>{tr.intro2}</p>
      </div>

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
                  onClick={() => downloadChart(chartRef.current, "grafico-mrua")}
                  title={isEn ? "Download chart" : "Descargar gráfico"}
                  className="p-1 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div ref={chartRef}>
              <ResponsiveContainer width="100%" height={300}>
                {chartType === "line" ? (
                  <LineChart data={result.chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="t" label={{ value: "t (s)", position: "insideBottomRight", offset: -5 }} tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v: number, name: string) => [`${fmt(v)} ${name === "v" ? "m/s" : "m"}`, name === "v" ? tr.velocityLabel : tr.distanceLabel]} labelFormatter={(l) => `t = ${l} s`} />
                    <Legend formatter={(v) => v === "v" ? tr.velocityLabel : tr.distanceLabel} />
                    <Line type="monotone" dataKey="v" stroke="#0FA958" strokeWidth={2} dot={false} name="v" />
                    <Line type="monotone" dataKey="d" stroke="#0C7A42" strokeWidth={2} dot={false} strokeDasharray="5 5" name="d" />
                  </LineChart>
                ) : chartType === "area" ? (
                  <AreaChart data={result.chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="t" label={{ value: "t (s)", position: "insideBottomRight", offset: -5 }} tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v: number, name: string) => [`${fmt(v)} ${name === "v" ? "m/s" : "m"}`, name === "v" ? tr.velocityLabel : tr.distanceLabel]} labelFormatter={(l) => `t = ${l} s`} />
                    <Legend formatter={(v) => v === "v" ? tr.velocityLabel : tr.distanceLabel} />
                    <Area type="monotone" dataKey="v" stroke="#0FA958" fill="#0FA958" fillOpacity={0.3} strokeWidth={2} dot={false} name="v" />
                    <Area type="monotone" dataKey="d" stroke="#0C7A42" fill="#0C7A42" fillOpacity={0.2} strokeWidth={2} dot={false} name="d" />
                  </AreaChart>
                ) : (
                  <BarChart data={result.chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="t" label={{ value: "t (s)", position: "insideBottomRight", offset: -5 }} tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v: number, name: string) => [`${fmt(v)} ${name === "v" ? "m/s" : "m"}`, name === "v" ? tr.velocityLabel : tr.distanceLabel]} labelFormatter={(l) => `t = ${l} s`} />
                    <Legend formatter={(v) => v === "v" ? tr.velocityLabel : tr.distanceLabel} />
                    <Bar dataKey="v" fill="#0FA958" fillOpacity={0.8} name="v" />
                    <Bar dataKey="d" fill="#0C7A42" fillOpacity={0.8} name="d" />
                  </BarChart>
                )}
              </ResponsiveContainer>
              </div>
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

      <section className="mt-10 prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{tr.deepTitle}</h2>
        <p>{tr.deep}</p>
        <h3 className="text-base font-semibold mt-6 mb-2 text-gray-900 dark:text-white">{tr.exampleTitle}</h3>
        <p>{tr.example}</p>
      </section>

      <div className="mt-8 overflow-x-auto">
        <h3 className="text-base font-semibold mb-3 text-gray-900 dark:text-white">{tr.tableTitle}</h3>
        <table className="w-full text-sm border-collapse max-w-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10 text-left text-gray-500 dark:text-white/50">
              <th className="py-2 pr-4 font-medium">{tr.tableCol1}</th>
              <th className="py-2 font-medium">{tr.tableCol2}</th>
            </tr>
          </thead>
          <tbody>
            {GRAVITY_TABLE.map((row) => (
              <tr key={row.en} className="border-b border-gray-100 dark:border-white/5">
                <td className="py-2 pr-4 font-medium text-gray-900 dark:text-white">{isEn ? row.en : row.es}</td>
                <td className="py-2 font-semibold text-primary whitespace-nowrap">{row.g}</td>
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
          <AccordionItem value="q6">
            <AccordionTrigger>{tr.q6}</AccordionTrigger>
            <AccordionContent>{tr.a6}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}
