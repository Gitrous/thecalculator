import { useState } from "react";
import { Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { useLocale } from "@/lib/locale";

interface Zone {
  nameEs: string;
  nameEn: string;
  pctMin: number;
  pctMax: number;
  descEs: string;
  descEn: string;
  color: string;
  bg: string;
}

const ZONES: Zone[] = [
  { nameEs: "Zona 1 — Recuperación",   nameEn: "Zone 1 — Recovery",        pctMin: 50, pctMax: 60, descEs: "Calentamiento y recuperación activa", descEn: "Warm-up and active recovery",       color: "text-blue-600",   bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/40" },
  { nameEs: "Zona 2 — Aeróbica base",  nameEn: "Zone 2 — Base aerobic",     pctMin: 60, pctMax: 70, descEs: "Quema de grasa y resistencia aeróbica", descEn: "Fat burning and aerobic endurance", color: "text-teal-600",   bg: "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800/40" },
  { nameEs: "Zona 3 — Aeróbica alta",  nameEn: "Zone 3 — Upper aerobic",    pctMin: 70, pctMax: 80, descEs: "Mejora cardiovascular y resistencia",   descEn: "Cardiovascular improvement",       color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/40" },
  { nameEs: "Zona 4 — Anaeróbica",     nameEn: "Zone 4 — Anaerobic",        pctMin: 80, pctMax: 90, descEs: "Umbral anaeróbico y potencia",         descEn: "Anaerobic threshold and power",    color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/40" },
  { nameEs: "Zona 5 — Máxima",         nameEn: "Zone 5 — Maximum",          pctMin: 90, pctMax: 100, descEs: "Esfuerzo máximo (sprints cortos)",    descEn: "Maximum effort (short sprints)",   color: "text-rose-600",   bg: "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/40" },
];

const T = {
  es: {
    title: "Calculadora de Frecuencia Cardíaca Máxima",
    subtitle: "Calcula tu frecuencia cardíaca máxima (FCmáx) y tus cinco zonas de entrenamiento para optimizar tus sesiones de ejercicio.",
    intro1: "La frecuencia cardíaca máxima (FCmáx) es el número de latidos por minuto que tu corazón puede alcanzar en un esfuerzo máximo. Es un dato fundamental para planificar el entrenamiento: saber a qué porcentaje de tu FCmáx trabajas en cada sesión te permite controlar la intensidad del ejercicio, mejorar el rendimiento y reducir el riesgo de sobreentrenamiento.",
    intro2: "Esta calculadora utiliza la fórmula de Tanaka (2001), validada en un metaanálisis de más de 18.000 personas y considerada más precisa que la clásica «220 − edad». A partir de tu FCmáx calcula automáticamente tus cinco zonas de entrenamiento, cada una con objetivos fisiológicos distintos: desde la recuperación activa hasta el esfuerzo máximo.",
    disclaimer: "Los resultados son orientativos. Consulta a un médico o profesional del deporte antes de iniciar programas de entrenamiento de alta intensidad.",
    cardTitle: "Tu edad",
    ageLabel: "Edad (años)",
    fcmaxLabel: "FC Máxima (FCmáx)",
    fcmaxDesc: "Latidos por minuto según fórmula de Tanaka (208 − 0,7 × edad)",
    zonesTitle: "Zonas de entrenamiento",
    bpmUnit: "lpm",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Cómo se calcula la frecuencia cardíaca máxima?",
    a1: "La fórmula más extendida es la de Tanaka (2001): FCmáx = 208 − 0,7 × edad. Es más precisa que la clásica '220 − edad' porque fue validada en un metaanálisis de más de 18.000 personas. La FCmáx es individual y puede variar ±10-12 lpm entre personas de la misma edad; la única forma de medirla con exactitud es mediante una prueba de esfuerzo máximo supervisada por un médico deportivo.",
    q2: "¿Para qué sirven las zonas de entrenamiento?",
    a2: "Cada zona cardíaca produce adaptaciones fisiológicas distintas. La Zona 2 (60-70%) es ideal para mejorar la capacidad aeróbica de base y quemar grasa como combustible principal; los corredores de fondo dedican hasta el 80% de su volumen de entrenamiento aquí. La Zona 4 (80-90%) entrena el umbral de lactato y mejora el rendimiento en esfuerzos sostenidos de 20-60 minutos. La Zona 5 (>90%) desarrolla la potencia máxima y el VO₂máx, pero no debe mantenerse más de unos minutos.",
    q3: "¿Es seguro entrenar cerca de la FCmáx?",
    a3: "Para personas sanas y sin factores de riesgo cardiovascular, entrenar puntualmente en Zona 4 o 5 es seguro si se ha construido previamente una base aeróbica sólida (Zonas 1-3). Sin embargo, si tienes más de 40 años, llevas tiempo sedentario, o tienes antecedentes de enfermedades del corazón, consulta a tu médico antes de realizar entrenamientos de alta intensidad. Como norma general, nunca superes el 85% de tu FCmáx sin supervisión médica si eres principiante.",
  },
  en: {
    title: "Maximum Heart Rate Calculator",
    subtitle: "Calculate your maximum heart rate (MHR) and your five training zones to optimise your workout sessions.",
    intro1: "Maximum heart rate (MHR) is the highest number of beats per minute your heart can reach during maximum exertion. It is a key metric for planning your training: knowing at what percentage of your MHR you are working in each session lets you control exercise intensity, improve performance and reduce the risk of overtraining.",
    intro2: "This calculator uses the Tanaka formula (2001), validated in a meta-analysis of more than 18,000 people and considered more accurate than the classic '220 − age' formula. From your MHR it automatically calculates your five training zones, each with different physiological goals: from active recovery to maximum effort.",
    disclaimer: "Results are indicative only. Consult a doctor or sports professional before starting high-intensity training programmes.",
    cardTitle: "Your age",
    ageLabel: "Age (years)",
    fcmaxLabel: "Max Heart Rate (MHR)",
    fcmaxDesc: "Beats per minute using the Tanaka formula (208 − 0.7 × age)",
    zonesTitle: "Training zones",
    bpmUnit: "bpm",
    faqTitle: "Frequently asked questions",
    q1: "How is maximum heart rate calculated?",
    a1: "The most widely used formula is Tanaka's (2001): MHR = 208 − 0.7 × age. It is more accurate than the classic '220 − age' formula because it was validated in a meta-analysis of more than 18,000 people. MHR is individual and can vary ±10-12 bpm between people of the same age; the only way to measure it accurately is through a maximal exercise stress test supervised by a sports medicine doctor.",
    q2: "What are training zones used for?",
    a2: "Each heart rate zone produces different physiological adaptations. Zone 2 (60-70%) is ideal for improving base aerobic capacity and burning fat as the primary fuel; endurance runners spend up to 80% of their training volume here. Zone 4 (80-90%) trains the lactate threshold and improves performance in sustained efforts of 20-60 minutes. Zone 5 (>90%) develops maximum power and VO₂max, but cannot be sustained for more than a few minutes.",
    q3: "Is it safe to train near MHR?",
    a3: "For healthy people with no cardiovascular risk factors, occasionally training in Zone 4 or 5 is safe if a solid aerobic base (Zones 1-3) has been built beforehand. However, if you are over 40, have been sedentary for a long time, or have a history of heart disease, consult your doctor before high-intensity training. As a general rule, never exceed 85% of your MHR without medical supervision if you are a beginner.",
  },
};

export default function FrecuenciaCardiaca() {
  const locale = useLocale();
  const isEn = locale === "en";
  const t = T[isEn ? "en" : "es"];

  const [age, setAge] = useState("30");
  const ageNum = parseInt(age) || 0;
  const valid = ageNum >= 10 && ageNum <= 100;
  const fcmax = valid ? Math.round(208 - 0.7 * ageNum) : 0;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Heart className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
      </div>
      <p className="text-muted-foreground mb-6">{t.subtitle}</p>

      <div className="prose prose-sm dark:prose-invert max-w-none mb-8 space-y-3 text-gray-700 dark:text-gray-300">
        <p>{t.intro1}</p>
        <p>{t.intro2}</p>
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle>{t.cardTitle}</CardTitle></CardHeader>
        <CardContent>
          <Label htmlFor="age">{t.ageLabel}</Label>
          <Input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="mt-1 max-w-xs"
            min={10}
            max={100}
            placeholder="30"
          />
        </CardContent>
      </Card>

      {valid && (
        <>
          <Card className="border-primary/30 bg-primary/5 mb-6">
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">{t.fcmaxLabel}</p>
              <p className="text-5xl font-bold text-primary">{fcmax} <span className="text-2xl">{t.bpmUnit}</span></p>
              <p className="text-sm text-muted-foreground mt-2">{t.fcmaxDesc}</p>
            </CardContent>
          </Card>

          <h2 className="text-xl font-semibold mb-4">{t.zonesTitle}</h2>
          <div className="space-y-3 mb-8">
            {ZONES.map((z) => {
              const min = Math.round(fcmax * z.pctMin / 100);
              const max = Math.round(fcmax * z.pctMax / 100);
              return (
                <div key={z.pctMin} className={`flex items-center justify-between rounded-xl border p-4 ${z.bg}`}>
                  <div>
                    <p className={`text-sm font-semibold ${z.color}`}>{isEn ? z.nameEn : z.nameEs}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{isEn ? z.descEn : z.descEs}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className={`text-lg font-bold ${z.color}`}>{min}–{max}</p>
                    <p className="text-xs text-muted-foreground">{z.pctMin}–{z.pctMax}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <p className="text-xs text-muted-foreground italic mt-4 mb-2">{t.disclaimer}</p>

      <AdUnit slot={AD_SLOTS.midContent} className="my-10" />

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">{t.faqTitle}</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="q1"><AccordionTrigger>{t.q1}</AccordionTrigger><AccordionContent>{t.a1}</AccordionContent></AccordionItem>
          <AccordionItem value="q2"><AccordionTrigger>{t.q2}</AccordionTrigger><AccordionContent>{t.a2}</AccordionContent></AccordionItem>
          <AccordionItem value="q3"><AccordionTrigger>{t.q3}</AccordionTrigger><AccordionContent>{t.a3}</AccordionContent></AccordionItem>
        </Accordion>
      </section>

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}
