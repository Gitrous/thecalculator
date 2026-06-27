import { useState } from "react";
import { HeartPulse } from "lucide-react";
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

interface Range {
  max: number;
  labelEs: string;
  labelEn: string;
  color: string;
}

const RANGES: Range[] = [
  { max: 18.5, labelEs: "Bajo peso", labelEn: "Underweight", color: "text-blue-600" },
  { max: 25, labelEs: "Peso normal", labelEn: "Normal weight", color: "text-emerald-600" },
  { max: 30, labelEs: "Sobrepeso", labelEn: "Overweight", color: "text-amber-600" },
  { max: 35, labelEs: "Obesidad grado I", labelEn: "Obesity class I", color: "text-orange-600" },
  { max: 40, labelEs: "Obesidad grado II", labelEn: "Obesity class II", color: "text-red-600" },
  { max: Infinity, labelEs: "Obesidad grado III", labelEn: "Obesity class III", color: "text-red-700" },
];

const T = {
  es: {
    title: "Calculadora de IMC",
    subtitle: "Calcula tu Índice de Masa Corporal y descubre en qué rango de peso te encuentras según la OMS.",
    cardTitle: "Datos",
    weightLabel: "Peso (kg)",
    heightLabel: "Altura (cm)",
    yourBmi: "Tu IMC",
    healthyRange: "Peso saludable para tu altura:",
    howTitle: "Qué es el IMC y cómo se calcula",
    how1:
      "El IMC (Índice de Masa Corporal) es una medida que relaciona tu peso con tu altura para estimar si te encuentras en un rango de peso saludable. Es el indicador más utilizado por la OMS para clasificar el peso a nivel poblacional, por su sencillez y porque solo necesita dos datos: peso y altura.",
    how2:
      "Se calcula dividiendo el peso en kilogramos entre el cuadrado de la altura en metros: IMC = kg / m². El resultado se compara con las categorías de la OMS para saber si corresponde a bajo peso, peso normal, sobrepeso u obesidad.",
    exampleTitle: "Ejemplo",
    example:
      "Una persona de 70 kg y 1,75 m de altura tiene un IMC de 70 / (1,75 × 1,75) = 22,9, que está dentro del rango de peso normal (18,5–24,9).",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Cómo se calcula el IMC?",
    a1: "El IMC (Índice de Masa Corporal) se obtiene dividiendo el peso en kilogramos entre el cuadrado de la altura en metros: IMC = kg / m². Por ejemplo, una persona de 70 kg y 1,75 m tiene un IMC de 70 / (1,75 × 1,75) = 22,9, que corresponde a peso normal. Esta fórmula fue desarrollada por el matemático belga Adolphe Quetelet en el siglo XIX y adoptada por la OMS como indicador de referencia.",
    q2: "¿Es fiable el IMC para todas las personas?",
    a2: "El IMC es útil como indicador poblacional, pero tiene limitaciones importantes a nivel individual: no distingue entre masa muscular y grasa corporal, no tiene en cuenta la distribución de la grasa (que influye en el riesgo cardiovascular), y puede clasificar incorrectamente a deportistas con mucho músculo o a personas mayores con poca masa muscular. Para una evaluación más precisa, los profesionales de la salud combinan el IMC con la circunferencia de cintura, el porcentaje de grasa corporal y otros factores clínicos.",
    q3: "¿Qué significa cada categoría de la OMS?",
    a3: "La Organización Mundial de la Salud establece cinco categorías: Bajo peso (IMC < 18,5) puede indicar desnutrición o problemas de salud subyacentes. Peso normal (18,5–24,9) se asocia con el menor riesgo de enfermedades relacionadas con el peso. Sobrepeso (25–29,9) aumenta el riesgo de hipertensión, diabetes tipo 2 y enfermedades cardiovasculares. Obesidad grado I (30–34,9) y Obesidad grado II (35–39,9) implican un riesgo moderado-alto. Obesidad grado III (≥ 40), también llamada obesidad mórbida, se asocia con riesgo muy elevado y puede requerir intervención médica especializada.",
  },
  en: {
    title: "BMI Calculator",
    subtitle: "Calculate your Body Mass Index and find your weight category according to WHO standards.",
    cardTitle: "Your data",
    weightLabel: "Weight (kg)",
    heightLabel: "Height (cm)",
    yourBmi: "Your BMI",
    healthyRange: "Healthy weight for your height:",
    howTitle: "What BMI is and how to calculate it",
    how1:
      "BMI (Body Mass Index) is a measure that relates your weight to your height to estimate whether you are within a healthy weight range. It is the indicator most used by the WHO to classify weight at the population level, because it is simple and only needs two figures: weight and height.",
    how2:
      "It is calculated by dividing weight in kilograms by the square of height in metres: BMI = kg / m². The result is compared with the WHO categories to find out whether it corresponds to underweight, normal weight, overweight or obesity.",
    exampleTitle: "Example",
    example:
      "A person weighing 70 kg and 1.75 m tall has a BMI of 70 / (1.75 × 1.75) = 22.9, which is within the normal weight range (18.5–24.9).",
    faqTitle: "Frequently asked questions",
    q1: "How is BMI calculated?",
    a1: "BMI (Body Mass Index) is calculated by dividing weight in kilograms by the square of height in metres: BMI = kg / m². For example, a person weighing 70 kg and 1.75 m tall has a BMI of 70 / (1.75 × 1.75) = 22.9, which falls in the normal weight range. The formula was developed by Belgian mathematician Adolphe Quetelet in the 19th century and later adopted by the WHO as a standard reference indicator.",
    q2: "Is BMI reliable for everyone?",
    a2: "BMI is useful as a population-level indicator, but it has significant limitations at the individual level: it does not distinguish between muscle mass and body fat, it does not account for fat distribution (which influences cardiovascular risk), and it can misclassify athletes with high muscle mass or older people with low muscle mass. For a more accurate assessment, healthcare professionals combine BMI with waist circumference, body fat percentage and other clinical factors.",
    q3: "What does each WHO category mean?",
    a3: "The World Health Organisation defines five categories: Underweight (BMI < 18.5) may indicate malnutrition or underlying health problems. Normal weight (18.5–24.9) is associated with the lowest risk of weight-related disease. Overweight (25–29.9) increases the risk of hypertension, type 2 diabetes and cardiovascular disease. Obesity class I (30–34.9) and Obesity class II (35–39.9) carry a moderate-to-high risk. Obesity class III (≥ 40), also called morbid obesity, is associated with very high risk and may require specialist medical intervention.",
  },
};

export default function Imc() {
  const locale = useLocale();
  const t = T[locale];
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("170");

  const w = parseFloat(weight);
  const hCm = parseFloat(height);
  const valid = w > 0 && hCm > 0;

  let imc: number | null = null;
  let range: Range | null = null;
  let idealMin = 0;
  let idealMax = 0;
  if (valid) {
    const h = hCm / 100;
    imc = w / (h * h);
    range = RANGES.find((r) => imc! < r.max) ?? RANGES[RANGES.length - 1];
    idealMin = 18.5 * h * h;
    idealMax = 24.9 * h * h;
  }

  const localeStr = locale === "en" ? "en-US" : "es-ES";

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
            <Label htmlFor="weight">{t.weightLabel}</Label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="height">{t.heightLabel}</Label>
            <Input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {imc !== null && range && (
        <Card className="border-primary/30 bg-primary/5 mb-8">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">{t.yourBmi}</p>
            <p className="text-4xl font-bold text-primary mb-1">
              {imc.toLocaleString(localeStr, { maximumFractionDigits: 1 })}
            </p>
            <p className={`font-semibold ${range.color}`}>
              {locale === "en" ? range.labelEn : range.labelEs}
            </p>
            <p className="text-sm text-muted-foreground mt-3">
              {t.healthyRange}{" "}
              {idealMin.toLocaleString(localeStr, { maximumFractionDigits: 1 })} –{" "}
              {idealMax.toLocaleString(localeStr, { maximumFractionDigits: 1 })} kg
            </p>
          </CardContent>
        </Card>
      )}

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">{t.howTitle}</h2>
        <p className="text-muted-foreground mb-4">{t.how1}</p>
        <p className="text-muted-foreground mb-4">{t.how2}</p>
        <h3 className="text-lg font-semibold mb-2">{t.exampleTitle}</h3>
        <p className="text-muted-foreground">{t.example}</p>
      </section>

      <AdUnit slot={AD_SLOTS.midContent} className="my-10" />

      <section className="mt-12">
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

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}
