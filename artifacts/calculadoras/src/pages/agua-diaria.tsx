import { useState } from "react";
import { Droplets } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { useLocale } from "@/lib/locale";

type Activity = "sedentary" | "light" | "moderate" | "intense";
type Climate = "temperate" | "hot";

interface ActivityOption { value: Activity; labelEs: string; labelEn: string; factor: number }
interface ClimateOption  { value: Climate;  labelEs: string; labelEn: string; extra: number }

const ACTIVITIES: ActivityOption[] = [
  { value: "sedentary", labelEs: "Sedentario (sin ejercicio)", labelEn: "Sedentary (no exercise)", factor: 30 },
  { value: "light",     labelEs: "Ligero (1-3 días/semana)",   labelEn: "Light (1-3 days/week)",   factor: 33 },
  { value: "moderate",  labelEs: "Moderado (4-5 días/semana)", labelEn: "Moderate (4-5 days/week)", factor: 36 },
  { value: "intense",   labelEs: "Intenso (6-7 días/semana)",  labelEn: "Intense (6-7 days/week)",  factor: 40 },
];

const CLIMATES: ClimateOption[] = [
  { value: "temperate", labelEs: "Clima templado", labelEn: "Temperate climate", extra: 0 },
  { value: "hot",       labelEs: "Clima cálido / mucho calor", labelEn: "Hot / very warm climate", extra: 500 },
];

const T = {
  es: {
    title: "Calculadora de Agua Diaria",
    subtitle: "Descubre cuánta agua debes beber al día según tu peso, nivel de actividad física y el clima donde vives.",
    intro1: "El agua es imprescindible para casi todos los procesos del organismo: regula la temperatura corporal, transporta nutrientes, facilita la digestión y elimina residuos metabólicos. Sin embargo, las necesidades hídricas no son iguales para todas las personas: varían en función del peso corporal, la intensidad del ejercicio físico y las condiciones climáticas.",
    intro2: "Esta calculadora aplica la fórmula utilizada por dietistas y nutricionistas: un factor base de 30 a 40 ml por kilogramo de peso, ajustado según tu nivel de actividad, más un extra de 500 ml en climas cálidos para compensar las pérdidas por sudoración. El resultado te indica los litros de líquido que deberías beber a lo largo del día para mantenerte correctamente hidratado.",
    disclaimer: "Los resultados son orientativos. Las necesidades de hidratación pueden variar por motivos de salud. Consulta a un profesional sanitario si tienes dudas.",
    cardTitle: "Tus datos",
    weightLabel: "Peso (kg)",
    activityLabel: "Nivel de actividad",
    climateLabel: "Clima",
    resultLabel: "Agua recomendada al día",
    resultDesc: (ml: number) => `Equivale a ${(ml / 250).toFixed(0)} vasos de agua (250 ml cada uno)`,
    minNote: "Mínimo recomendado por la OMS: 1,5 litros/día para adultos.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Cómo se calcula la cantidad de agua diaria?",
    a1: "La fórmula más utilizada por dietistas y nutricionistas parte de un factor base de 30-40 ml por kilogramo de peso corporal, ajustado según el nivel de actividad física. A ese resultado se añaden entre 300 y 700 ml extra en climas cálidos para compensar las pérdidas por sudoración. Esta calculadora usa 30 ml/kg para personas sedentarias, hasta 40 ml/kg para deportistas de alta intensidad, más 500 ml adicionales en climas calurosos.",
    q2: "¿Cuenta el agua de los alimentos?",
    a2: "Sí. Aproximadamente el 20-30% de la ingesta hídrica diaria proviene de los alimentos sólidos, especialmente frutas y verduras (la sandía, el pepino o la lechuga tienen más de un 90% de agua). Sin embargo, los valores de esta calculadora se refieren exclusivamente a líquidos que debes beber, ya que es la forma más fácil de controlar la hidratación. Si tu dieta es rica en frutas y verduras, puedes estar en el límite inferior del rango.",
    q3: "¿Cuáles son las señales de deshidratación?",
    a3: "Los primeros signos de deshidratación leve son la sed, la orina de color amarillo oscuro, el cansancio y la dificultad para concentrarse. Con una deshidratación del 2% del peso corporal ya se observa una reducción del rendimiento físico y cognitivo. La deshidratación severa (>5%) puede causar mareos, taquicardia y confusión, y requiere atención médica. Como norma práctica, la orina debe ser de color amarillo pálido; si es transparente estás bien hidratado, si es oscura debes beber más.",
  },
  en: {
    title: "Daily Water Intake Calculator",
    subtitle: "Find out how much water you should drink per day based on your weight, physical activity level and climate.",
    intro1: "Water is essential for almost every process in the body: it regulates body temperature, transports nutrients, aids digestion and removes metabolic waste. However, hydration needs are not the same for everyone — they vary depending on body weight, the intensity of physical activity and climatic conditions.",
    intro2: "This calculator applies the formula used by dietitians and nutritionists: a base factor of 30 to 40 ml per kilogram of body weight, adjusted for your activity level, plus an extra 500 ml in hot climates to compensate for fluid lost through sweating. The result tells you how many litres of fluid you should drink throughout the day to stay properly hydrated.",
    disclaimer: "Results are indicative only. Hydration needs may vary for health reasons. Consult a healthcare professional if you have any concerns.",
    cardTitle: "Your data",
    weightLabel: "Weight (kg)",
    activityLabel: "Activity level",
    climateLabel: "Climate",
    resultLabel: "Recommended daily water intake",
    resultDesc: (ml: number) => `Equivalent to ${(ml / 250).toFixed(0)} glasses of water (250 ml each)`,
    minNote: "WHO minimum recommendation: 1.5 litres/day for adults.",
    faqTitle: "Frequently asked questions",
    q1: "How is the daily water requirement calculated?",
    a1: "The most widely used formula among dietitians and nutritionists starts with a base factor of 30-40 ml per kilogram of body weight, adjusted for physical activity level. An extra 300-700 ml is added in hot climates to compensate for sweat losses. This calculator uses 30 ml/kg for sedentary people up to 40 ml/kg for high-intensity athletes, plus an additional 500 ml in hot climates.",
    q2: "Does water from food count?",
    a2: "Yes. Approximately 20-30% of daily fluid intake comes from solid foods, especially fruits and vegetables (watermelon, cucumber and lettuce contain over 90% water). However, the values in this calculator refer exclusively to fluids you should drink, as this is the easiest way to monitor hydration. If your diet is rich in fruit and vegetables, you may sit at the lower end of the range.",
    q3: "What are the signs of dehydration?",
    a3: "The first signs of mild dehydration are thirst, dark yellow urine, fatigue and difficulty concentrating. A dehydration of just 2% of body weight already leads to a measurable reduction in physical and cognitive performance. Severe dehydration (>5%) can cause dizziness, rapid heartbeat and confusion, and requires medical attention. As a practical rule, your urine should be pale yellow; if it is clear you are well hydrated, if it is dark you need to drink more.",
  },
};

export default function AguaDiaria() {
  const locale = useLocale();
  const isEn = locale === "en";
  const t = T[isEn ? "en" : "es"];

  const [weight, setWeight] = useState("70");
  const [activity, setActivity] = useState<Activity>("light");
  const [climate, setClimate] = useState<Climate>("temperate");

  const w = parseFloat(weight) || 0;
  const valid = w > 0 && w < 300;
  const actOpt = ACTIVITIES.find((a) => a.value === activity)!;
  const climOpt = CLIMATES.find((c) => c.value === climate)!;
  const ml = valid ? Math.round(w * actOpt.factor + climOpt.extra) : 0;
  const litres = (ml / 1000).toFixed(1);

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Droplets className="h-6 w-6 text-primary" />
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
        <CardContent className="space-y-6">
          {/* Weight */}
          <div>
            <Label htmlFor="weight">{t.weightLabel}</Label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="mt-1 max-w-xs"
              min={20}
              max={300}
              placeholder="70"
            />
          </div>

          {/* Activity */}
          <div>
            <Label className="mb-2 block">{t.activityLabel}</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ACTIVITIES.map((a) => (
                <button
                  key={a.value}
                  onClick={() => setActivity(a.value)}
                  className={cn(
                    "text-left px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all",
                    activity === a.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:border-gray-300 dark:hover:border-white/20"
                  )}
                >
                  {isEn ? a.labelEn : a.labelEs}
                </button>
              ))}
            </div>
          </div>

          {/* Climate */}
          <div>
            <Label className="mb-2 block">{t.climateLabel}</Label>
            <div className="grid grid-cols-2 gap-2">
              {CLIMATES.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setClimate(c.value)}
                  className={cn(
                    "text-left px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all",
                    climate === c.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 hover:border-gray-300 dark:hover:border-white/20"
                  )}
                >
                  {isEn ? c.labelEn : c.labelEs}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {valid && (
        <Card className="border-primary/30 bg-primary/5 mb-8">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">{t.resultLabel}</p>
            <p className="text-5xl font-bold text-primary">{litres} <span className="text-2xl">L</span></p>
            <p className="text-sm text-muted-foreground mt-2">{t.resultDesc(ml)}</p>
            <p className="text-xs text-muted-foreground mt-3 italic">{t.minNote}</p>
          </CardContent>
        </Card>
      )}

      {valid && (
        <p className="text-xs text-muted-foreground italic mb-2">{t.disclaimer}</p>
      )}

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
