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

const ACTIVITY_TABLE_ES = [
  { factor: "1,2", nivel: "Sedentario", desc: "Trabajo de oficina, desplazamientos en coche y sin ejercicio planificado." },
  { factor: "1,375", nivel: "Poco activo", desc: "Ejercicio ligero o deporte 1–3 días por semana." },
  { factor: "1,55", nivel: "Moderadamente activo", desc: "Ejercicio moderado 3–5 días por semana." },
  { factor: "1,725", nivel: "Muy activo", desc: "Ejercicio intenso 6–7 días por semana." },
  { factor: "1,9", nivel: "Extra activo", desc: "Trabajo físico exigente combinado con entrenamiento diario." },
];

const ACTIVITY_TABLE_EN = [
  { factor: "1.2", nivel: "Sedentary", desc: "Desk job, driving everywhere and no planned exercise." },
  { factor: "1.375", nivel: "Lightly active", desc: "Light exercise or sport 1–3 days per week." },
  { factor: "1.55", nivel: "Moderately active", desc: "Moderate exercise 3–5 days per week." },
  { factor: "1.725", nivel: "Very active", desc: "Intense exercise 6–7 days per week." },
  { factor: "1.9", nivel: "Extra active", desc: "Demanding physical job combined with daily training." },
];

const T = {
  es: {
    title: "Calculadora de Calorías y TMB",
    subtitle: "Calcula tu Tasa Metabólica Basal (TMB) y las calorías diarias que necesitas según tu nivel de actividad y objetivo.",
    intro1: "Saber cuántas calorías necesitas al día es el punto de partida para cualquier objetivo de composición corporal: perder grasa, ganar músculo o mantener tu peso actual. Esta calculadora parte de la Tasa Metabólica Basal (TMB) — la energía que tu cuerpo consume en reposo — y la multiplica por tu factor de actividad para obtener el gasto energético total diario (TDEE).",
    intro2: "A partir del TDEE y de tu objetivo, la calculadora determina el aporte calórico diario recomendado y ofrece una distribución orientativa de macronutrientes: proteínas, hidratos de carbono y grasas. Se utiliza la fórmula de Mifflin-St Jeor, considerada la más precisa para la población general.",
    medDisclaimer: "Los valores son estimaciones poblacionales. Consulta a un nutricionista o dietista antes de realizar cambios significativos en tu alimentación.",
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
    q4: "¿Cuántas calorías debo comer para adelgazar?",
    a4: "Para perder grasa necesitas un déficit calórico, es decir, comer menos calorías de las que gastas. Un déficit moderado de 300 a 500 kcal diarias respecto a tu TDEE permite perder entre 0,3 y 0,5 kg de grasa por semana, un ritmo sostenible que preserva la masa muscular. Los déficits muy agresivos (más de 750–1.000 kcal) aceleran la pérdida a corto plazo, pero aumentan la pérdida de músculo, el hambre y el riesgo de abandonar la dieta. Es preferible un déficit pequeño mantenido en el tiempo, acompañado de suficiente proteína y algo de ejercicio de fuerza.",
    q5: "¿Por qué necesito tanta proteína?",
    a5: "La proteína es el macronutriente clave para conservar y construir masa muscular, especialmente cuando estás en déficit calórico. Las recomendaciones habituales para personas activas van de 1,6 a 2,2 gramos por kilo de peso corporal al día. Además, la proteína es el nutriente más saciante y el que más energía consume durante su digestión, lo que ayuda de forma indirecta al control del peso. Esta calculadora asigna un 30 % de las calorías a proteína como punto de partida orientativo; puedes ajustarlo según tu dieta y tus preferencias.",
    howTitle: "Cómo se calculan tus calorías diarias",
    how1: "El cálculo se realiza en tres pasos. Primero se estima la Tasa Metabólica Basal (TMB) con la ecuación de Mifflin-St Jeor, que solo necesita tu peso, altura, edad y sexo biológico. Después, la TMB se multiplica por un factor de actividad (de 1,2 si eres sedentario a 1,9 si entrenas a diario y tienes un trabajo físico) para obtener el Gasto Energético Total Diario o TDEE. Por último, se suma o resta el ajuste correspondiente a tu objetivo: un déficit de unas 500 kcal para perder alrededor de 0,5 kg de grasa por semana, o un superávit moderado de 300 kcal para ganar músculo minimizando la ganancia de grasa.",
    exampleTitle: "Ejemplo resuelto",
    example: "Para un hombre de 30 años, 75 kg y 175 cm con actividad moderada (factor 1,55): la TMB es 10×75 + 6,25×175 − 5×30 + 5 = 1.699 kcal. Multiplicada por 1,55 da un TDEE de unas 2.633 kcal, que es lo que necesitaría para mantener su peso. Si su objetivo es perder grasa, restaría 500 kcal y comería alrededor de 2.133 kcal al día; si busca ganar músculo, sumaría 300 kcal hasta unas 2.933 kcal.",
    tableTitle: "Factores de actividad física",
    tableFactor: "Factor",
    tableLevel: "Nivel",
    tableDesc: "A quién corresponde",
    interpretTitle: "Cómo interpretar el resultado",
    interpret: "El número que obtienes es un punto de partida, no una cifra exacta e inmutable. La mejor forma de usarlo es mantener ese aporte calórico durante 2 o 3 semanas y pesarte siempre en las mismas condiciones: si el peso evoluciona según tu objetivo, la estimación es correcta; si no se mueve, ajusta en ±100–150 kcal y vuelve a observar. Recuerda que la balanza fluctúa a diario por el agua, el glucógeno y el tránsito intestinal, así que fíjate en la tendencia semanal y no en el dato de un solo día.",
  },
  en: {
    title: "Calorie & BMR Calculator",
    subtitle: "Calculate your Basal Metabolic Rate (BMR) and daily calorie needs based on your activity level and goal.",
    intro1: "Knowing how many calories you need each day is the starting point for any body composition goal: losing fat, gaining muscle or maintaining your current weight. This calculator starts from the Basal Metabolic Rate (BMR) — the energy your body burns at rest — and multiplies it by your activity factor to get your Total Daily Energy Expenditure (TDEE).",
    intro2: "Based on your TDEE and goal, the calculator works out your recommended daily calorie intake and provides an indicative macronutrient breakdown: protein, carbohydrates and fat. It uses the Mifflin-St Jeor formula, considered the most accurate for the general population.",
    medDisclaimer: "Values are population estimates. Consult a nutritionist or dietitian before making significant changes to your diet.",
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
    q4: "How many calories should I eat to lose weight?",
    a4: "To lose fat you need a calorie deficit — eating fewer calories than you burn. A moderate deficit of 300 to 500 kcal per day below your TDEE lets you lose between 0.3 and 0.5 kg of fat per week, a sustainable pace that preserves muscle mass. Very aggressive deficits (more than 750–1,000 kcal) speed up short-term loss but increase muscle loss, hunger and the risk of giving up. A small deficit maintained over time, alongside enough protein and some strength training, works far better.",
    q5: "Why do I need so much protein?",
    a5: "Protein is the key macronutrient for preserving and building muscle mass, especially in a calorie deficit. Common recommendations for active people range from 1.6 to 2.2 grams per kilogram of body weight per day. Protein is also the most satiating nutrient and the one that burns the most energy during digestion, which indirectly helps with weight control. This calculator assigns 30% of calories to protein as an indicative starting point; you can adjust it to suit your diet and preferences.",
    howTitle: "How your daily calories are calculated",
    how1: "The calculation happens in three steps. First, your Basal Metabolic Rate (BMR) is estimated with the Mifflin-St Jeor equation, which only needs your weight, height, age and biological sex. Then the BMR is multiplied by an activity factor (from 1.2 if you are sedentary to 1.9 if you train daily and have a physical job) to get your Total Daily Energy Expenditure or TDEE. Finally, the adjustment for your goal is added or subtracted: a deficit of around 500 kcal to lose about 0.5 kg of fat per week, or a moderate surplus of 300 kcal to gain muscle while minimising fat gain.",
    exampleTitle: "Worked example",
    example: "For a 30-year-old man, 75 kg and 175 cm, moderately active (factor 1.55): the BMR is 10×75 + 6.25×175 − 5×30 + 5 = 1,699 kcal. Multiplied by 1.55, that gives a TDEE of about 2,633 kcal, which is what he would need to maintain his weight. To lose fat he would subtract 500 kcal and eat around 2,133 kcal a day; to gain muscle he would add 300 kcal, up to about 2,933 kcal.",
    tableTitle: "Physical activity factors",
    tableFactor: "Factor",
    tableLevel: "Level",
    tableDesc: "Who it applies to",
    interpretTitle: "How to interpret the result",
    interpret: "The number you get is a starting point, not an exact, fixed figure. The best way to use it is to keep that calorie intake for 2 to 3 weeks and weigh yourself under the same conditions each time: if your weight moves in line with your goal, the estimate is right; if it doesn't budge, adjust by ±100–150 kcal and observe again. Remember the scale fluctuates daily due to water, glycogen and gut transit, so watch the weekly trend rather than a single day's reading.",
  },
};

export default function Calorias() {
  const locale = useLocale();
  const t = T[locale];
  const isEn = locale === "en";

  const ACTIVITY_LEVELS = isEn ? ACTIVITY_LEVELS_EN : ACTIVITY_LEVELS_ES;
  const GOALS = isEn ? GOALS_EN : GOALS_ES;
  const ACTIVITY_TABLE = isEn ? ACTIVITY_TABLE_EN : ACTIVITY_TABLE_ES;

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
      <p className="text-muted-foreground mb-6">{t.subtitle}</p>

      <div className="prose prose-sm dark:prose-invert max-w-none mb-8 space-y-3 text-gray-700 dark:text-gray-300">
        <p>{t.intro1}</p>
        <p>{t.intro2}</p>
      </div>

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

      {valid && (
        <p className="text-xs text-muted-foreground italic mb-2">{t.medDisclaimer}</p>
      )}

      <section className="mt-12 prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t.howTitle}</h2>
        <p>{t.how1}</p>
        <h3 className="text-base font-semibold mt-6 mb-2 text-gray-900 dark:text-white">{t.exampleTitle}</h3>
        <p>{t.example}</p>
      </section>

      <div className="mt-8 overflow-x-auto">
        <h3 className="text-base font-semibold mb-3 text-gray-900 dark:text-white">{t.tableTitle}</h3>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10 text-left text-gray-500 dark:text-white/50">
              <th className="py-2 pr-4 font-medium">{t.tableFactor}</th>
              <th className="py-2 pr-4 font-medium">{t.tableLevel}</th>
              <th className="py-2 font-medium">{t.tableDesc}</th>
            </tr>
          </thead>
          <tbody>
            {ACTIVITY_TABLE.map((row) => (
              <tr key={row.factor} className="border-b border-gray-100 dark:border-white/5">
                <td className="py-2 pr-4 font-semibold text-primary whitespace-nowrap">{row.factor}</td>
                <td className="py-2 pr-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{row.nivel}</td>
                <td className="py-2 text-gray-600 dark:text-gray-400">{row.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-8 prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t.interpretTitle}</h2>
        <p>{t.interpret}</p>
      </section>

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
          <AccordionItem value="q4">
            <AccordionTrigger>{t.q4}</AccordionTrigger>
            <AccordionContent>{t.a4}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="q5">
            <AccordionTrigger>{t.q5}</AccordionTrigger>
            <AccordionContent>{t.a5}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}
