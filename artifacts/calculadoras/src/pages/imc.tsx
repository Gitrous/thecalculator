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
    faqTitle: "Preguntas frecuentes",
    q1: "¿Cómo se calcula el IMC?",
    a1: "El IMC se obtiene dividiendo el peso en kilos entre el cuadrado de la altura en metros: IMC = peso / altura². Un valor entre 18,5 y 24,9 se considera peso normal.",
    q2: "¿Es fiable el IMC?",
    a2: "Es una referencia general para la población adulta, pero no distingue masa muscular de grasa ni tiene en cuenta la edad o el sexo. No sustituye una valoración médica.",
  },
  en: {
    title: "BMI Calculator",
    subtitle: "Calculate your Body Mass Index and find your weight category according to WHO standards.",
    cardTitle: "Your data",
    weightLabel: "Weight (kg)",
    heightLabel: "Height (cm)",
    yourBmi: "Your BMI",
    healthyRange: "Healthy weight for your height:",
    faqTitle: "Frequently asked questions",
    q1: "How is BMI calculated?",
    a1: "BMI is calculated by dividing weight in kilograms by the square of height in metres: BMI = weight / height². A value between 18.5 and 24.9 is considered normal weight.",
    q2: "Is BMI reliable?",
    a2: "It is a general reference for the adult population, but it does not distinguish muscle mass from fat, nor does it account for age or sex. It is not a substitute for a medical assessment.",
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
        </Accordion>
      </section>

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}
