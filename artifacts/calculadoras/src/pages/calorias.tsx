import { useState } from "react";
import { HeartPulse } from "lucide-react";
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
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { useLocale } from "@/lib/locale";

const ACTIVITY_LEVELS_ES = [
  { value: "1.2", label: "Sedentario (sin ejercicio)" },
  { value: "1.375", label: "Poco activo (1–3 días/semana)" },
  { value: "1.55", label: "Moderadamente activo (3–5 días/semana)" },
  { value: "1.725", label: "Muy activo (6–7 días/semana)" },
  { value: "1.9", label: "Extra activo (trabajo físico + deporte)" },
];

const ACTIVITY_LEVELS_EN = [
  { value: "1.2", label: "Sedentary (no exercise)" },
  { value: "1.375", label: "Lightly active (1–3 days/week)" },
  { value: "1.55", label: "Moderately active (3–5 days/week)" },
  { value: "1.725", label: "Very active (6–7 days/week)" },
  { value: "1.9", label: "Extra active (physical job + sport)" },
];

const GOALS_ES = [
  { value: "-500", label: "Perder peso (déficit –500 kcal)" },
  { value: "0", label: "Mantener peso" },
  { value: "300", label: "Ganar músculo (superávit +300 kcal)" },
];

const GOALS_EN = [
  { value: "-500", label: "Lose weight (–500 kcal deficit)" },
  { value: "0", label: "Maintain weight" },
  { value: "300", label: "Gain muscle (+300 kcal surplus)" },
];

const T = {
  es: {
    title: "Calculadora de Calorías y TMB",
    subtitle: "Calcula tu Tasa Metabólica Basal (TMB) y las calorías diarias que necesitas según tu nivel de actividad y objetivo.",
    cardTitle: "Tus datos",
    weightLabel: "Peso (kg)",
    heightLabel: "Altura (cm)",
    ageLabel: "Edad (años)",
    sexLabel: "Sexo biológico",
    male: "Hombre",
    female: "Mujer",
    activityLabel: "Nivel de actividad",
    goalLabel: "Objetivo",
    tmbLabel: "TMB (en reposo)",
    tdeeLabel: "TDEE (con actividad)",
    dailyTargetLabel: "Objetivo diario",
    macroCardTitle: (obj: string) => `Macronutrientes orientativos — ${obj}`,
    proteinLabel: "Proteínas",
    carbsLabel: "Hidratos",
    fatLabel: "Grasas",
    disclaimer: "Distribución estándar orientativa. Ajusta según tu dieta y objetivos concretos.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Qué es la TMB?",
    a1: "La Tasa Metabólica Basal es la energía mínima que tu cuerpo necesita en reposo absoluto para mantener funciones vitales: respiración, circulación, temperatura corporal, etc. Representa entre el 60-75% del gasto calórico total.",
    q2: "¿Qué fórmula usa esta calculadora?",
    a2: "Usa la fórmula de Mifflin-St Jeor (1990), considerada la más precisa para la población general: hombre: 10×peso + 6,25×altura − 5×edad + 5; mujer: 10×peso + 6,25×altura − 5×edad − 161. Después se multiplica por el factor de actividad para obtener el TDEE.",
    q3: "¿Por qué no bajo de peso comiendo menos calorías?",
    a3: "Las calculadoras son estimaciones poblacionales. Tu metabolismo puede diferir. Factores como el estado hormonal, la masa muscular, el sueño o la microbiota afectan el gasto real. Si llevas semanas sin progresar, ajusta las calorías en ±100 kcal y observa el resultado.",
  },
  en: {
    title: "Calorie & BMR Calculator",
    subtitle: "Calculate your Basal Metabolic Rate (BMR) and daily calorie needs based on your activity level and goal.",
    cardTitle: "Your data",
    weightLabel: "Weight (kg)",
    heightLabel: "Height (cm)",
    ageLabel: "Age (years)",
    sexLabel: "Biological sex",
    male: "Male",
    female: "Female",
    activityLabel: "Activity level",
    goalLabel: "Goal",
    tmbLabel: "BMR (at rest)",
    tdeeLabel: "TDEE (with activity)",
    dailyTargetLabel: "Daily target",
    macroCardTitle: (obj: string) => `Daily macros — ${obj}`,
    proteinLabel: "Protein",
    carbsLabel: "Carbs",
    fatLabel: "Fat",
    disclaimer: "Standard indicative distribution. Adjust according to your diet and specific goals.",
    faqTitle: "Frequently asked questions",
    q1: "What is BMR?",
    a1: "The Basal Metabolic Rate is the minimum energy your body needs at absolute rest to maintain vital functions: breathing, circulation, body temperature, etc. It represents 60–75% of total calorie expenditure.",
    q2: "What formula does this calculator use?",
    a2: "It uses the Mifflin-St Jeor formula (1990), considered the most accurate for the general population: male: 10×weight + 6.25×height − 5×age + 5; female: 10×weight + 6.25×height − 5×age − 161. The result is then multiplied by the activity factor to get TDEE.",
    q3: "Why am I not losing weight eating fewer calories?",
    a3: "Calculators are population estimates. Your metabolism may differ. Factors such as hormonal status, muscle mass, sleep or gut microbiome affect actual expenditure. If you have not progressed for weeks, adjust calories by ±100 kcal and observe the result.",
  },
};

export default function Calorias() {
  const locale = useLocale();
  const t = T[locale];
  const isEn = locale === "en";

  const ACTIVITY_LEVELS = isEn ? ACTIVITY_LEVELS_EN : ACTIVITY_LEVELS_ES;
  const GOALS = isEn ? GOALS_EN : GOALS_ES;

  const [peso, setPeso] = useState("75");
  const [altura, setAltura] = useState("175");
  const [edad, setEdad] = useState("30");
  const [sexo, setSexo] = useState("hombre");
  const [actividad, setActividad] = useState("1.55");
  const [objetivo, setObjetivo] = useState("0");

  const p = parseFloat(peso) || 0;
  const a = parseFloat(altura) || 0;
  const e = parseFloat(edad) || 0;
  const act = parseFloat(actividad);
  const obj = parseFloat(objetivo);
  const valid = p > 0 && a > 0 && e > 0;

  // Mifflin-St Jeor
  const tmb = valid
    ? sexo === "hombre"
      ? 10 * p + 6.25 * a - 5 * e + 5
      : 10 * p + 6.25 * a - 5 * e - 161
    : 0;

  const tdee = tmb * act;
  const objetivo_kcal = tdee + obj;

  // Macros aproximados (orientativos)
  const proteinas = Math.round((objetivo_kcal * 0.3) / 4);
  const carbos = Math.round((objetivo_kcal * 0.4) / 4);
  const grasas = Math.round((objetivo_kcal * 0.3) / 9);

  const objLabel = GOALS.find((g) => g.value === objetivo)?.label ?? "";

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <HeartPulse className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
      </div>
      <p className="text-muted-foreground mb-8">{t.subtitle}</p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t.cardTitle}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="peso">{t.weightLabel}</Label>
            <Input id="peso" type="number" value={peso} onChange={(e) => setPeso(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="altura">{t.heightLabel}</Label>
            <Input id="altura" type="number" value={altura} onChange={(e) => setAltura(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="edad">{t.ageLabel}</Label>
            <Input id="edad" type="number" value={edad} onChange={(e) => setEdad(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="sexo">{t.sexLabel}</Label>
            <Select value={sexo} onValueChange={setSexo}>
              <SelectTrigger id="sexo" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hombre">{t.male}</SelectItem>
                <SelectItem value="mujer">{t.female}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="actividad">{t.activityLabel}</Label>
            <Select value={actividad} onValueChange={setActividad}>
              <SelectTrigger id="actividad" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITY_LEVELS.map((l) => (
                  <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="objetivo">{t.goalLabel}</Label>
            <Select value={objetivo} onValueChange={setObjetivo}>
              <SelectTrigger id="objetivo" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GOALS.map((g) => (
                  <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {valid && (
        <>
          <Card className="border-primary/30 bg-primary/5 mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">{t.tmbLabel}</p>
                  <p className="text-3xl font-bold">{Math.round(tmb)}</p>
                  <p className="text-xs text-muted-foreground">kcal/día</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.tdeeLabel}</p>
                  <p className="text-3xl font-bold">{Math.round(tdee)}</p>
                  <p className="text-xs text-muted-foreground">kcal/día</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.dailyTargetLabel}</p>
                  <p className="text-3xl font-bold text-primary">{Math.round(objetivo_kcal)}</p>
                  <p className="text-xs text-muted-foreground">kcal/día</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t.macroCardTitle(objLabel)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <p className="text-2xl font-bold text-blue-600">{proteinas}g</p>
                  <p className="text-sm font-medium">{t.proteinLabel}</p>
                  <p className="text-xs text-muted-foreground">30% · 4 kcal/g</p>
                </div>
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                  <p className="text-2xl font-bold text-amber-600">{carbos}g</p>
                  <p className="text-sm font-medium">{t.carbsLabel}</p>
                  <p className="text-xs text-muted-foreground">40% · 4 kcal/g</p>
                </div>
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                  <p className="text-2xl font-bold text-emerald-600">{grasas}g</p>
                  <p className="text-sm font-medium">{t.fatLabel}</p>
                  <p className="text-xs text-muted-foreground">30% · 9 kcal/g</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">{t.disclaimer}</p>
            </CardContent>
          </Card>
        </>
      )}

      <AdUnit slot={AD_SLOTS.midContent} className="my-10" />

      <section className="mt-4">
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
        </Accordion>
      </section>
    </div>
  );
}
