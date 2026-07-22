import { useState } from "react";
import { Link } from "wouter";
import { HeartPulse, Heart, Zap, Activity, ChevronRight } from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { useLocale } from "@/lib/locale";

interface ImcRange {
  max: number;
  labelEs: string;
  labelEn: string;
  color: string;
  badgeCls: string;
  descEs: string;
  descEn: string;
}

const RANGES: ImcRange[] = [
  {
    max: 18.5,
    labelEs: "Bajo peso", labelEn: "Underweight",
    color: "text-blue-500",
    badgeCls: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    descEs: "Tu peso está por debajo del rango saludable.",
    descEn: "Your weight is below the healthy range.",
  },
  {
    max: 25,
    labelEs: "Peso normal", labelEn: "Normal weight",
    color: "text-emerald-500",
    badgeCls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    descEs: "Estás dentro del rango ideal.",
    descEn: "You are within the ideal range.",
  },
  {
    max: 30,
    labelEs: "Sobrepeso", labelEn: "Overweight",
    color: "text-amber-500",
    badgeCls: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    descEs: "Tu peso está ligeramente por encima del rango ideal.",
    descEn: "Your weight is slightly above the ideal range.",
  },
  {
    max: 35,
    labelEs: "Obesidad grado I", labelEn: "Obesity class I",
    color: "text-orange-500",
    badgeCls: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    descEs: "Se recomienda consultar con un profesional de la salud.",
    descEn: "Consulting a healthcare professional is recommended.",
  },
  {
    max: 40,
    labelEs: "Obesidad grado II", labelEn: "Obesity class II",
    color: "text-red-500",
    badgeCls: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    descEs: "Es importante consultar con tu médico.",
    descEn: "It is important to consult a doctor.",
  },
  {
    max: Infinity,
    labelEs: "Obesidad grado III", labelEn: "Obesity class III",
    color: "text-red-700",
    badgeCls: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
    descEs: "Se requiere atención médica especializada.",
    descEn: "Specialised medical care is required.",
  },
];

// Recommendations per category index (0=bajo, 1=normal, 2+=sobrepeso/obesidad)
const RECS = {
  es: [
    {
      nut: "Aumenta gradualmente la ingesta calórica con alimentos nutritivos: frutos secos, aguacate, proteínas magras y cereales integrales. Evita saltarte comidas.",
      act: "Los ejercicios de fuerza son los más beneficiosos para ganar masa muscular. Evita el exceso de cardio intenso hasta alcanzar un peso saludable.",
      seg: "Pésate una vez por semana en las mismas condiciones. Considera consultar a un dietista-nutricionista para un plan personalizado.",
    },
    {
      nut: "Mantén una dieta equilibrada y variada, rica en frutas, verduras, proteínas magras y grasas saludables. La hidratación adecuada es esencial.",
      act: "La OMS recomienda al menos 150-300 minutos de actividad aeróbica moderada a la semana, complementada con ejercicios de fuerza 2 días.",
      seg: "Pésate mensualmente para detectar variaciones. Tu peso puede fluctuar ±2 kg según el día y la hidratación. Registra tu progreso.",
    },
    {
      nut: "Un déficit calórico moderado de 300-500 kcal/día es más efectivo y sostenible que las dietas drásticas. Prioriza alimentos ricos en fibra y proteínas.",
      act: "Empieza con caminatas de 30 minutos al día y aumenta progresivamente la intensidad. La constancia es más importante que la intensidad al inicio.",
      seg: "Consulta con tu médico o endocrino para un plan personalizado. Establece metas realistas a corto plazo y cél�bralas cuando las alcances.",
    },
  ],
  en: [
    {
      nut: "Gradually increase caloric intake with nutritious foods: nuts, avocado, lean protein and whole grains. Avoid skipping meals.",
      act: "Strength training is most beneficial for gaining muscle mass. Avoid excessive intense cardio until you reach a healthy weight.",
      seg: "Weigh yourself once a week under the same conditions. Consider consulting a registered dietitian for a personalised plan.",
    },
    {
      nut: "Maintain a balanced and varied diet, rich in fruit, vegetables, lean protein and healthy fats. Staying well hydrated is essential.",
      act: "The WHO recommends at least 150-300 minutes of moderate aerobic activity per week, plus strength training on 2 days.",
      seg: "Weigh yourself monthly to detect changes. Your weight can fluctuate ±2 kg depending on the day and hydration levels.",
    },
    {
      nut: "A moderate calorie deficit of 300-500 kcal/day is more effective and sustainable than drastic diets. Prioritise fibre- and protein-rich foods.",
      act: "Start with 30-minute daily walks and gradually increase intensity. Consistency is more important than intensity when starting out.",
      seg: "Consult your doctor or endocrinologist for a personalised plan. Set realistic short-term goals and celebrate when you achieve them.",
    },
  ],
};

const T = {
  es: {
    title: "Calculadora de IMC",
    subtitle: "Calcula tu Índice de Masa Corporal y descubre en qué rango de peso te encuentras según la OMS.",
    intro1: "El Índice de Masa Corporal (IMC) es la herramienta de referencia de la Organización Mundial de la Salud para clasificar el peso corporal en relación con la altura. Se obtiene dividiendo el peso en kilogramos entre el cuadrado de la altura en metros y permite comparar tu estado ponderal con los valores de referencia poblacionales.",
    intro2: "Aunque es un indicador práctico y ampliamente utilizado, el IMC tiene limitaciones importantes: no distingue entre masa muscular y grasa corporal, ni tiene en cuenta la distribución de la grasa. Por eso debe interpretarse siempre junto con otros datos clínicos como la circunferencia de cintura o el porcentaje de grasa corporal.",
    yourMeasures: "Tus Medidas",
    heightLabel: "Altura (cm)",
    weightLabel: "Peso (kg)",
    male: "Masculino",
    female: "Femenino",
    healthContext: "Contexto de Salud",
    barLow: "Bajo",
    barNormal: "Normal",
    barOver: "Sobrepeso",
    barObese: "Obeso",
    yourBmi: "Tu IMC Resultante",
    idealWeight: "Peso Ideal",
    category: "Categoría",
    related: "Herramientas relacionadas",
    recommendations: "Recomendaciones de Salud",
    nutTitle: "Nutrición",
    actTitle: "Actividad Física",
    segTitle: "Seguimiento",
    disclaimer: "Los resultados son orientativos. Consulta a un profesional de la salud para una evaluación completa de tu composición corporal.",
    howTitle: "Qué es el IMC y cómo se calcula",
    how1: "El IMC (Índice de Masa Corporal) es una medida que relaciona tu peso con tu altura para estimar si te encuentras en un rango de peso saludable. Es el indicador más utilizado por la OMS para clasificar el peso a nivel poblacional, por su sencillez y porque solo necesita dos datos: peso y altura.",
    how2: "Se calcula dividiendo el peso en kilogramos entre el cuadrado de la altura en metros: IMC = kg / m². El resultado se compara con las categorías de la OMS para saber si corresponde a bajo peso, peso normal, sobrepeso u obesidad.",
    exampleTitle: "Ejemplo",
    example: "Una persona de 70 kg y 1,75 m de altura tiene un IMC de 70 / (1,75 × 1,75) = 22,9, que está dentro del rango de peso normal (18,5–24,9).",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Cómo se calcula el IMC?",
    a1: "El IMC se obtiene dividiendo el peso en kilogramos entre el cuadrado de la altura en metros: IMC = kg / m². Por ejemplo, una persona de 70 kg y 1,75 m tiene un IMC de 22,9, que corresponde a peso normal. Esta fórmula fue desarrollada por el matemático belga Adolphe Quetelet en el siglo XIX y adoptada por la OMS como indicador de referencia.",
    q2: "¿Es fiable el IMC para todas las personas?",
    a2: "El IMC es útil como indicador poblacional, pero tiene limitaciones a nivel individual: no distingue entre masa muscular y grasa corporal, no tiene en cuenta la distribución de la grasa y puede clasificar incorrectamente a deportistas con mucho músculo o a personas mayores con poca masa muscular. Para una evaluación más precisa, los profesionales combinan el IMC con la circunferencia de cintura, el porcentaje de grasa corporal y otros factores clínicos.",
    q3: "¿Qué significa cada categoría de la OMS?",
    a3: "La OMS establece estas categorías: Bajo peso (IMC < 18,5) puede indicar desnutrición. Peso normal (18,5–24,9) se asocia con el menor riesgo de enfermedades. Sobrepeso (25–29,9) aumenta el riesgo cardiovascular y de diabetes. Obesidad grado I (30–34,9) y grado II (35–39,9) implican riesgo moderado-alto. Obesidad grado III (≥ 40) se asocia con riesgo muy elevado.",
    q4: "¿Cómo puedo reducir mi IMC de forma saludable?",
    a4: "La forma más efectiva y sostenible es combinar una alimentación equilibrada con un déficit calórico moderado (300-500 kcal/día menos) y actividad física regular. Las dietas muy restrictivas son contraproducentes a largo plazo. Perder entre 0,5 y 1 kg por semana es un ritmo seguro y sostenible. Consulta siempre a un profesional sanitario antes de iniciar un plan de pérdida de peso.",
    q5: "¿Existe un IMC diferente para hombres y mujeres?",
    a5: "La OMS aplica las mismas categorías de IMC para hombres y mujeres adultos. Sin embargo, hombres y mujeres tienden a distribuir la grasa de forma diferente: las mujeres suelen tener mayor porcentaje de grasa corporal que los hombres con el mismo IMC. Por eso, para una evaluación más precisa de la composición corporal, se recomienda complementar el IMC con la circunferencia de cintura y, si es posible, una medición de porcentaje graso.",
    q6: "¿Qué alternativas existen al IMC para valorar la composición corporal?",
    a6: "Existen varias medidas que aportan información que el IMC no capta. El perímetro de cintura es la más sencilla y una de las más útiles, porque estima la grasa abdominal, que es la más asociada al riesgo cardiovascular y metabólico: se consideran valores de riesgo por encima de 88 cm en mujeres y 102 cm en hombres. El índice cintura-altura, que consiste en dividir el perímetro de cintura entre la altura, es aún mejor predictor y su umbral es sencillo de recordar: la cintura debería medir menos de la mitad de tu altura. Para una valoración más precisa existen la bioimpedancia, los pliegues cutáneos medidos con plicómetro y, como referencia clínica, la densitometría DEXA.",
    deepTitle: "Qué mide realmente el IMC y cuáles son sus límites",
    deep: "El índice de masa corporal se calcula dividiendo el peso en kilogramos entre el cuadrado de la altura en metros, y fue diseñado en el siglo XIX por el estadístico Adolphe Quetelet para estudiar poblaciones, no para diagnosticar individuos. Ahí reside su principal limitación: relaciona peso y altura, pero no distingue de qué está compuesto ese peso. Un deportista con mucha masa muscular puede obtener un IMC de sobrepeso u obesidad estando perfectamente sano, mientras que una persona sedentaria con poca musculatura y grasa abdominal elevada puede situarse en normopeso pese a tener un riesgo metabólico real. Tampoco tiene en cuenta la edad, el sexo, la etnia ni la distribución de la grasa corporal.",
    workedTitle: "Ejemplo resuelto",
    worked: "Para una persona de 75 kg y 1,75 m de altura: IMC = 75 / (1,75 × 1,75) = 75 / 3,0625 = 24,5. Ese valor se sitúa dentro del rango de normopeso de la OMS, que va de 18,5 a 24,9, aunque muy cerca del límite del sobrepeso. Si esa misma persona pesara 80 kg, su IMC sería 80 / 3,0625 = 26,1, ya en categoría de sobrepeso. Fíjate en que, al elevar la altura al cuadrado, pequeñas diferencias de estatura tienen un efecto notable: con 1,80 m, esos 80 kg darían un IMC de 24,7, de nuevo en normopeso.",
    tableTitle: "Categorías de IMC según la OMS",
    tableCol1: "IMC",
    tableCol2: "Categoría",
    interpretTitle: "Cómo interpretar tu resultado",
    interpret: "Toma el IMC como una primera aproximación orientativa, no como un diagnóstico. Es una herramienta de cribado útil para detectar tendencias en poblaciones y para que un profesional decida si conviene profundizar, pero por sí solo no dice nada sobre tu salud real. Interpretarlo bien exige combinarlo con otros datos: el perímetro de cintura, tu nivel de actividad física, tu composición corporal y analíticas como el perfil lipídico o la glucemia. Si tu resultado se aleja del rango de normopeso, lo sensato es consultarlo con tu médico o con un dietista-nutricionista antes de tomar decisiones sobre tu alimentación, y desconfiar de cualquier plan que prometa cambios rápidos sin supervisión profesional.",
  },
  en: {
    title: "BMI Calculator",
    subtitle: "Calculate your Body Mass Index and find your weight category according to WHO standards.",
    intro1: "Body Mass Index (BMI) is the World Health Organization's reference tool for classifying body weight in relation to height. It is calculated by dividing weight in kilograms by the square of height in metres, and allows your weight status to be compared against population reference values.",
    intro2: "Although it is a practical and widely used indicator, BMI has important limitations: it does not distinguish between muscle mass and body fat, nor does it account for fat distribution. It should therefore always be interpreted alongside other clinical indicators such as waist circumference or body fat percentage.",
    yourMeasures: "Your Measurements",
    heightLabel: "Height (cm)",
    weightLabel: "Weight (kg)",
    male: "Male",
    female: "Female",
    healthContext: "Health Context",
    barLow: "Underweight",
    barNormal: "Normal",
    barOver: "Overweight",
    barObese: "Obese",
    yourBmi: "Your BMI Result",
    idealWeight: "Ideal Weight",
    category: "Category",
    related: "Related tools",
    recommendations: "Health Recommendations",
    nutTitle: "Nutrition",
    actTitle: "Physical Activity",
    segTitle: "Tracking",
    disclaimer: "Results are indicative only. Consult a healthcare professional for a complete assessment of your body composition.",
    howTitle: "What BMI is and how to calculate it",
    how1: "BMI (Body Mass Index) is a measure that relates your weight to your height to estimate whether you are within a healthy weight range. It is the indicator most used by the WHO to classify weight at the population level, because it is simple and only needs two figures: weight and height.",
    how2: "It is calculated by dividing weight in kilograms by the square of height in metres: BMI = kg / m². The result is compared with the WHO categories to find out whether it corresponds to underweight, normal weight, overweight or obesity.",
    exampleTitle: "Example",
    example: "A person weighing 70 kg and 1.75 m tall has a BMI of 70 / (1.75 × 1.75) = 22.9, which is within the normal weight range (18.5–24.9).",
    faqTitle: "Frequently asked questions",
    q1: "How is BMI calculated?",
    a1: "BMI is calculated by dividing weight in kilograms by the square of height in metres: BMI = kg / m². For example, a person weighing 70 kg and 1.75 m tall has a BMI of 22.9, which falls in the normal weight range. The formula was developed by Belgian mathematician Adolphe Quetelet in the 19th century and later adopted by the WHO as a reference indicator.",
    q2: "Is BMI reliable for everyone?",
    a2: "BMI is useful as a population-level indicator, but has limitations at the individual level: it does not distinguish between muscle mass and body fat, does not account for fat distribution, and can misclassify athletes with high muscle mass or older people with low muscle mass. Healthcare professionals combine BMI with waist circumference, body fat percentage and other clinical factors for a more accurate assessment.",
    q3: "What does each WHO category mean?",
    a3: "The WHO defines these categories: Underweight (BMI < 18.5) may indicate malnutrition. Normal weight (18.5–24.9) is associated with the lowest disease risk. Overweight (25–29.9) increases cardiovascular and diabetes risk. Obesity class I (30–34.9) and class II (35–39.9) carry moderate-to-high risk. Obesity class III (≥ 40) is associated with very high risk.",
    q4: "How can I reduce my BMI healthily?",
    a4: "The most effective and sustainable approach is to combine a balanced diet with a moderate calorie deficit (300-500 kcal/day less) and regular physical activity. Very restrictive diets are counterproductive in the long run. Losing 0.5 to 1 kg per week is a safe and sustainable pace. Always consult a healthcare professional before starting a weight-loss plan.",
    q5: "Is there a different BMI for men and women?",
    a5: "The WHO applies the same BMI categories to both adult men and women. However, men and women tend to distribute body fat differently: women typically have a higher body fat percentage than men with the same BMI. For a more accurate assessment of body composition, it is recommended to complement BMI with waist circumference and, if possible, a body fat percentage measurement.",
    q6: "What alternatives to BMI exist for assessing body composition?",
    a6: "Several measures provide information BMI cannot capture. Waist circumference is the simplest and one of the most useful, because it estimates abdominal fat, which is most associated with cardiovascular and metabolic risk: values above 88 cm in women and 102 cm in men are considered risky. The waist-to-height ratio, obtained by dividing waist circumference by height, is an even better predictor and its threshold is easy to remember: your waist should measure less than half your height. For a more precise assessment there is bioimpedance, skinfold measurements with callipers and, as the clinical reference, DEXA densitometry.",
    deepTitle: "What BMI actually measures and its limits",
    deep: "Body mass index is calculated by dividing weight in kilograms by the square of height in metres, and was designed in the 19th century by the statistician Adolphe Quetelet to study populations, not to diagnose individuals. That is its main limitation: it relates weight to height, but does not distinguish what that weight is made of. An athlete with substantial muscle mass can register an overweight or obese BMI while being perfectly healthy, whereas a sedentary person with little muscle and high abdominal fat can sit in the normal range despite carrying real metabolic risk. It also takes no account of age, sex, ethnicity or body fat distribution.",
    workedTitle: "Worked example",
    worked: "For a person weighing 75 kg and 1.75 m tall: BMI = 75 / (1.75 × 1.75) = 75 / 3.0625 = 24.5. That value falls within the WHO normal range of 18.5 to 24.9, though very close to the overweight threshold. If that same person weighed 80 kg, their BMI would be 80 / 3.0625 = 26.1, already in the overweight category. Note that, because height is squared, small differences in stature have a marked effect: at 1.80 m, those 80 kg would give a BMI of 24.7, back in the normal range.",
    tableTitle: "BMI categories according to the WHO",
    tableCol1: "BMI",
    tableCol2: "Category",
    interpretTitle: "How to interpret your result",
    interpret: "Treat BMI as a first rough approximation, not a diagnosis. It is a useful screening tool for spotting trends in populations and for helping a professional decide whether to investigate further, but on its own it says nothing about your actual health. Interpreting it properly means combining it with other data: waist circumference, your level of physical activity, your body composition and blood tests such as lipid profile or blood glucose. If your result falls outside the normal range, the sensible step is to discuss it with your doctor or a registered dietitian before making decisions about your diet, and to be wary of any plan promising rapid changes without professional supervision.",
  },
};

function Slider({
  value, min, max, step = 1,
  onChange,
}: {
  value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="relative h-5 flex items-center select-none">
      <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-white/20 relative overflow-visible">
        <div
          className="absolute left-0 top-0 h-full bg-primary rounded-full pointer-events-none"
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-md pointer-events-none transition-all"
          style={{ left: `${pct}%` }}
        />
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
}

const BMI_TABLE = [
  { es: "Menos de 18,5", en: "Below 18.5", cat: "Bajo peso", catEn: "Underweight" },
  { es: "18,5 – 24,9", en: "18.5 – 24.9", cat: "Normopeso", catEn: "Normal weight" },
  { es: "25,0 – 29,9", en: "25.0 – 29.9", cat: "Sobrepeso", catEn: "Overweight" },
  { es: "30,0 – 34,9", en: "30.0 – 34.9", cat: "Obesidad grado I", catEn: "Obesity class I" },
  { es: "35,0 – 39,9", en: "35.0 – 39.9", cat: "Obesidad grado II", catEn: "Obesity class II" },
  { es: "40,0 o más", en: "40.0 or above", cat: "Obesidad grado III", catEn: "Obesity class III" },
];

export default function Imc() {
  const locale = useLocale();
  const t = T[locale];
  const isEn = locale === "en";

  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [sex, setSex] = useState<"m" | "f">("m");

  const h = height / 100;
  const imc = weight / (h * h);
  const rangeIdx = RANGES.findIndex((r) => imc < r.max);
  const range = RANGES[rangeIdx === -1 ? RANGES.length - 1 : rangeIdx];
  const idealMin = Math.round(18.5 * h * h * 10) / 10;
  const idealMax = Math.round(24.9 * h * h * 10) / 10;

  // Gradient bar: map IMC 15–40 to 0–100%
  const barPct = Math.min(100, Math.max(0, ((imc - 15) / (40 - 15)) * 100));

  const recIdx = rangeIdx <= 0 ? 0 : rangeIdx === 1 ? 1 : 2;
  const rec = RECS[isEn ? "en" : "es"][recIdx];

  const fmt = (n: number) =>
    n.toLocaleString(isEn ? "en-US" : "es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-rose-100 dark:bg-rose-900/30 p-2 rounded-lg">
          <HeartPulse className="h-6 w-6 text-rose-600 dark:text-rose-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
      </div>
      <p className="text-muted-foreground mb-6">{t.subtitle}</p>

      <div className="prose prose-sm dark:prose-invert max-w-none mb-8 space-y-3 text-gray-700 dark:text-gray-300">
        <p>{t.intro1}</p>
        <p>{t.intro2}</p>
      </div>

      {/* ── Main two-column widget ── */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">

        {/* LEFT column */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Tus Medidas */}
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-6">{t.yourMeasures}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {/* Height */}
              <div>
                <div className="flex justify-between items-baseline mb-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{t.heightLabel}</span>
                  <span className="text-xl font-bold text-primary">{height} cm</span>
                </div>
                <Slider value={height} min={100} max={220} onChange={setHeight} />
                <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                  <span>100 cm</span>
                  <span>220 cm</span>
                </div>
              </div>

              {/* Weight */}
              <div>
                <div className="flex justify-between items-baseline mb-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{t.weightLabel}</span>
                  <span className="text-xl font-bold text-primary">{weight} kg</span>
                </div>
                <Slider value={weight} min={30} max={200} onChange={setWeight} />
                <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                  <span>30 kg</span>
                  <span>200 kg</span>
                </div>
              </div>
            </div>

            {/* Sex toggle */}
            <div className="grid grid-cols-2 gap-3">
              {(["m", "f"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSex(s)}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-semibold transition-colors ${
                    sex === s
                      ? "border-primary text-primary bg-primary/5 dark:bg-primary/10"
                      : "border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20"
                  }`}
                >
                  <span>{s === "m" ? "♂" : "♀"}</span>
                  {s === "m" ? t.male : t.female}
                </button>
              ))}
            </div>
          </div>

          {/* Contexto de Salud */}
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">{t.healthContext}</h2>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${range.badgeCls}`}>
                {isEn ? range.labelEn : range.labelEs}
              </span>
            </div>

            {/* Gradient bar */}
            <div className="relative">
              <div
                className="h-3 rounded-full"
                style={{ background: "linear-gradient(to right, #3b82f6 0%, #22c55e 30%, #eab308 52%, #f97316 72%, #ef4444 100%)" }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-zinc-200 border-2 border-gray-700 dark:border-gray-900 rounded-full shadow-lg transition-all duration-300 pointer-events-none"
                style={{ left: `${barPct}%` }}
              />
            </div>

            {/* Labels */}
            <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-2.5 px-0.5">
              <span>{t.barLow}</span>
              <span>{t.barNormal}</span>
              <span>{t.barOver}</span>
              <span>{t.barObese}</span>
            </div>
          </div>
        </div>

        {/* RIGHT column */}
        <div className="w-full lg:w-72 shrink-0 space-y-4 lg:sticky lg:top-24">

          {/* IMC result card */}
          <div className="rounded-2xl bg-gray-900 dark:bg-zinc-900 p-6">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">{t.yourBmi}</p>
            <p className="text-6xl font-bold text-white leading-none mb-2">{fmt(imc)}</p>
            <p className="text-sm text-gray-400 mb-5">{isEn ? range.descEn : range.descEs}</p>

            <div className="space-y-0 border-t border-white/10 pt-4">
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-sm text-gray-400">{t.idealWeight}</span>
                <span className="text-sm font-semibold text-white">
                  {idealMin.toLocaleString(isEn ? "en-US" : "es-ES", { maximumFractionDigits: 1 })} –{" "}
                  {idealMax.toLocaleString(isEn ? "en-US" : "es-ES", { maximumFractionDigits: 1 })} kg
                </span>
              </div>
              <div className="flex justify-between items-center pt-3">
                <span className="text-sm text-gray-400">{t.category}</span>
                <span className={`text-sm font-semibold ${range.color}`}>
                  {isEn ? range.labelEn : range.labelEs}
                </span>
              </div>
            </div>
          </div>

          {/* Related tools */}
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
              {t.related}
            </p>
            <div className="space-y-1">
              {[
                {
                  href: isEn ? "/en/calculators/health/calorias" : "/calculadoras/salud/calorias",
                  icon: <Zap className="w-4 h-4 text-amber-500" />,
                  bg: "bg-amber-100 dark:bg-amber-900/30",
                  label: isEn ? "Calories & BMR" : "Calorías y TMB",
                  sub: isEn ? "Calculate your energy expenditure" : "Calcula tu gasto energético",
                },
                {
                  href: isEn ? "/en/calculators/health/agua-diaria" : "/calculadoras/salud/agua-diaria",
                  icon: <Activity className="w-4 h-4 text-blue-500" />,
                  bg: "bg-blue-100 dark:bg-blue-900/30",
                  label: isEn ? "Daily Water" : "Agua Diaria",
                  sub: isEn ? "Recommended hydration" : "Hidratación recomendada",
                },
                {
                  href: isEn ? "/en/calculators/health/frecuencia-cardiaca" : "/calculadoras/salud/frecuencia-cardiaca",
                  icon: <Heart className="w-4 h-4 text-rose-500" />,
                  bg: "bg-rose-100 dark:bg-rose-900/30",
                  label: isEn ? "Heart Rate" : "Frecuencia Cardíaca",
                  sub: isEn ? "Training zones" : "Zonas de entrenamiento",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.bg}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">{item.label}</p>
                    <p className="text-xs text-gray-400 truncate">{item.sub}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 dark:text-white/20 group-hover:text-primary transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Recommendations ── */}
      <div className="mt-8 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
            <HeartPulse className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t.recommendations}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <Heart className="w-5 h-5 text-rose-500" />, bg: "bg-rose-100 dark:bg-rose-900/30", title: t.nutTitle, text: rec.nut },
            { icon: <Zap className="w-5 h-5 text-amber-500" />, bg: "bg-amber-100 dark:bg-amber-900/30", title: t.actTitle, text: rec.act },
            { icon: <Activity className="w-5 h-5 text-blue-500" />, bg: "bg-blue-100 dark:bg-blue-900/30", title: t.segTitle, text: rec.seg },
          ].map((card) => (
            <div key={card.title} className="rounded-xl border border-gray-100 dark:border-white/8 p-4 bg-gray-50 dark:bg-white/3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${card.bg}`}>
                {card.icon}
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">{card.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{card.text}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground italic mt-6 mb-2">{t.disclaimer}</p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">{t.howTitle}</h2>
        <p className="text-muted-foreground mb-3">{t.how1}</p>
        <p className="text-muted-foreground mb-4">{t.how2}</p>
        <h3 className="text-base font-semibold mb-2">{t.exampleTitle}</h3>
        <div className="bg-accent/50 rounded-lg p-4 text-sm text-muted-foreground">{t.example}</div>
      </section>

      <section className="mt-12 prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t.deepTitle}</h2>
        <p>{t.deep}</p>
        <h3 className="text-base font-semibold mt-6 mb-2 text-gray-900 dark:text-white">{t.workedTitle}</h3>
        <p>{t.worked}</p>
      </section>

      <div className="mt-8 overflow-x-auto">
        <h3 className="text-base font-semibold mb-3 text-gray-900 dark:text-white">{t.tableTitle}</h3>
        <table className="w-full text-sm border-collapse max-w-lg">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10 text-left text-gray-500 dark:text-white/50">
              <th className="py-2 pr-4 font-medium">{t.tableCol1}</th>
              <th className="py-2 font-medium">{t.tableCol2}</th>
            </tr>
          </thead>
          <tbody>
            {BMI_TABLE.map((row) => (
              <tr key={row.es} className="border-b border-gray-100 dark:border-white/5">
                <td className="py-2 pr-4 text-gray-900 dark:text-white">{locale === "en" ? row.en : row.es}</td>
                <td className="py-2 font-semibold text-primary whitespace-nowrap">{locale === "en" ? row.catEn : row.cat}</td>
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

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">{t.faqTitle}</h2>
        <Accordion type="single" collapsible className="w-full">
          {(["q1","q2","q3","q4","q5","q6"] as const).map((q) => (
            <AccordionItem key={q} value={q}>
              <AccordionTrigger>{t[q]}</AccordionTrigger>
              <AccordionContent>{t[`a${q.slice(1)}` as keyof typeof t]}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}
