import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowLeftRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { useLocale } from "@/lib/locale";

type Category = {
  key: string;
  nameEs: string;
  nameEn: string;
  units: { key: string; label: string }[];
  convert: (value: number, from: string, to: string) => number;
};

// Temperature needs special handling
function convertTemp(v: number, from: string, to: string): number {
  // to Kelvin first
  let kelvin: number;
  if (from === "C") kelvin = v + 273.15;
  else if (from === "F") kelvin = (v + 459.67) * (5 / 9);
  else kelvin = v;
  // from Kelvin to target
  if (to === "C") return kelvin - 273.15;
  if (to === "F") return kelvin * (9 / 5) - 459.67;
  return kelvin;
}

// Generic linear conversion
function linearConvert(toSI: Record<string, number>) {
  return (v: number, from: string, to: string) => (v * toSI[from]) / toSI[to];
}

const categories: Category[] = [
  {
    key: "length",
    nameEs: "Longitud",
    nameEn: "Length",
    units: [
      { key: "m", label: "Metro (m)" },
      { key: "km", label: "Kilómetro (km)" },
      { key: "cm", label: "Centímetro (cm)" },
      { key: "mm", label: "Milímetro (mm)" },
      { key: "mi", label: "Milla (mi)" },
      { key: "ft", label: "Pie (ft)" },
      { key: "in", label: "Pulgada (in)" },
      { key: "yd", label: "Yarda (yd)" },
    ],
    convert: linearConvert({ m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, ft: 0.3048, in: 0.0254, yd: 0.9144 }),
  },
  {
    key: "mass",
    nameEs: "Masa",
    nameEn: "Mass",
    units: [
      { key: "kg", label: "Kilogramo (kg)" },
      { key: "g", label: "Gramo (g)" },
      { key: "mg", label: "Miligramo (mg)" },
      { key: "lb", label: "Libra (lb)" },
      { key: "oz", label: "Onza (oz)" },
      { key: "t", label: "Tonelada métrica (t)" },
    ],
    convert: linearConvert({ kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495, t: 1000 }),
  },
  {
    key: "temperature",
    nameEs: "Temperatura",
    nameEn: "Temperature",
    units: [
      { key: "C", label: "Celsius (°C)" },
      { key: "F", label: "Fahrenheit (°F)" },
      { key: "K", label: "Kelvin (K)" },
    ],
    convert: convertTemp,
  },
  {
    key: "energy",
    nameEs: "Energía",
    nameEn: "Energy",
    units: [
      { key: "J", label: "Julio (J)" },
      { key: "kJ", label: "Kilojulio (kJ)" },
      { key: "cal", label: "Caloría (cal)" },
      { key: "kcal", label: "Kilocaloría (kcal)" },
      { key: "kWh", label: "Kilovatio hora (kWh)" },
      { key: "eV", label: "Electronvoltio (eV)" },
    ],
    convert: linearConvert({ J: 1, kJ: 1000, cal: 4.184, kcal: 4184, kWh: 3600000, eV: 1.60218e-19 }),
  },
  {
    key: "speed",
    nameEs: "Velocidad",
    nameEn: "Speed",
    units: [
      { key: "ms", label: "Metro/segundo (m/s)" },
      { key: "kmh", label: "Kilómetro/hora (km/h)" },
      { key: "mph", label: "Milla/hora (mph)" },
      { key: "kt", label: "Nudo (kt)" },
    ],
    convert: linearConvert({ ms: 1, kmh: 1 / 3.6, mph: 0.44704, kt: 0.514444 }),
  },
  {
    key: "area",
    nameEs: "Área",
    nameEn: "Area",
    units: [
      { key: "m2", label: "Metro cuadrado (m²)" },
      { key: "km2", label: "Kilómetro cuadrado (km²)" },
      { key: "cm2", label: "Centímetro cuadrado (cm²)" },
      { key: "ha", label: "Hectárea (ha)" },
      { key: "ft2", label: "Pie cuadrado (ft²)" },
      { key: "acre", label: "Acre" },
    ],
    convert: linearConvert({ m2: 1, km2: 1e6, cm2: 0.0001, ha: 10000, ft2: 0.092903, acre: 4046.86 }),
  },
  {
    key: "volume",
    nameEs: "Volumen",
    nameEn: "Volume",
    units: [
      { key: "L", label: "Litro (L)" },
      { key: "mL", label: "Mililitro (mL)" },
      { key: "m3", label: "Metro cúbico (m³)" },
      { key: "cm3", label: "Centímetro cúbico (cm³)" },
      { key: "floz", label: "Fl oz (fl oz)" },
      { key: "gal", label: "Galón US (gal)" },
    ],
    convert: linearConvert({ L: 1, mL: 0.001, m3: 1000, cm3: 0.001, floz: 0.0295735, gal: 3.78541 }),
  },
];

const COMMON_TABLE = [
  { es: ["1 pulgada", "2,54 cm"], en: ["1 inch", "2.54 cm"] },
  { es: ["1 pie", "30,48 cm"], en: ["1 foot", "30.48 cm"] },
  { es: ["1 milla", "1,609 km"], en: ["1 mile", "1.609 km"] },
  { es: ["1 libra", "0,454 kg"], en: ["1 pound", "0.454 kg"] },
  { es: ["1 onza", "28,35 g"], en: ["1 ounce", "28.35 g"] },
  { es: ["1 galón US", "3,785 L"], en: ["1 US gallon", "3.785 L"] },
  { es: ["0 °C", "32 °F"], en: ["0 °C", "32 °F"] },
  { es: ["100 °C", "212 °F"], en: ["100 °C", "212 °F"] },
  { es: ["1 kcal", "4,184 kJ"], en: ["1 kcal", "4.184 kJ"] },
];

const T = {
  es: {
    backHome: "Volver al inicio",
    title: "Conversor de Unidades",
    subtitle: "Convierte entre unidades de longitud, masa, temperatura, energía, velocidad, área y volumen al instante.",
    intro1: "El conversor de unidades te permite transformar al instante valores entre los sistemas de medida más utilizados: el Sistema Internacional (SI), el sistema anglosajón y otras unidades de uso habitual. Las categorías cubiertas son longitud, masa, temperatura, energía, velocidad, área y volumen, abarcando las conversiones más frecuentes en ciencia, ingeniería y vida cotidiana.",
    intro2: "Para cada categoría, selecciona la unidad de origen y la unidad de destino, introduce el valor y obtendrás el resultado al instante. También se muestra una tabla de referencia rápida con los valores equivalentes para 1, 10, 100 y 1.000 unidades. El conversor usa factores de conversión estandarizados o valores de consenso científico.",
    disclaimer: "Los factores de conversión son los establecidos internacionalmente. Para aplicaciones de ingeniería o científicas de alta precisión, consulta las fuentes normativas oficiales.",
    fromLabel: "De",
    toLabel: "A",
    valueLabel: "Valor a convertir",
    valuePlaceholder: "Introduce un valor...",
    resultLabel: "Resultado",
    quickTable: "Tabla de conversión rápida",
    swapTitle: "Intercambiar unidades",
    aboutTitle: "Sobre el conversor",
    aboutText: "Este conversor realiza conversiones instantáneas entre las unidades más habituales del Sistema Internacional (SI) y otros sistemas de medida. Las conversiones utilizan factores exactos cuando están estandarizados (por ejemplo, 1 pulgada = exactamente 0,0254 m) o valores de consenso científico para el resto.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Por qué la temperatura no tiene un factor lineal simple?",
    a1: "Porque el cero de °C y °F es arbitrario (no corresponde a ausencia absoluta de calor). El Kelvin sí tiene el cero absoluto. Por eso la conversión requiere sumar o restar constantes además del factor multiplicativo.",
    q2: "¿Qué sistema de unidades se usa en ciencia?",
    a2: "El Sistema Internacional de Unidades (SI). Sus unidades base son: metro (m), kilogramo (kg), segundo (s), amperio (A), kelvin (K), mol (mol) y candela (cd).",
    q3: "¿Cuántos litros tiene un galón?",
    a3: "Un galón estadounidense equivale a 3,785 litros aproximadamente. El galón imperial (utilizado en el Reino Unido) equivale a 4,546 litros. Esta calculadora usa el galón US.",
    q4: "¿Cuántos kilómetros tiene una milla?",
    a4: "Una milla terrestre equivale exactamente a 1.609,344 metros, es decir, aproximadamente 1,609 km. La milla náutica equivale a 1,852 km y es la que se usa en aviación y náutica.",
    q5: "¿Cuál es la diferencia entre masa y peso?",
    a5: "En el lenguaje cotidiano se usan como sinónimos, pero en física son cosas distintas. La masa es la cantidad de materia de un objeto y se mide en kilogramos; es la misma en la Tierra, en la Luna o en el espacio. El peso es la fuerza con la que la gravedad atrae esa masa y se mide en newtons; cambia según la gravedad del lugar. Este conversor trabaja con masa (kg, g, lb, oz), que es lo que habitualmente se necesita en la vida diaria, la cocina o el comercio.",
    q6: "¿Puedo convertir entre unidades de distinta categoría?",
    a6: "No directamente, porque miden magnitudes físicas diferentes: no tiene sentido convertir litros a kilómetros. Algunas magnitudes sí están relacionadas por una densidad o un factor concreto (un litro de agua pura pesa aproximadamente 1 kg a 4 °C), pero esa equivalencia depende de la sustancia y no es una conversión de unidades pura. Por eso el conversor está organizado por categorías y solo permite convertir entre unidades que miden la misma magnitud.",
    howTitle: "Cómo funcionan las conversiones",
    how1: "Convertir unidades consiste en multiplicar el valor original por un factor que relaciona ambas unidades con una referencia común. Internamente, el conversor transforma primero el valor a la unidad base del Sistema Internacional de esa categoría (metros para longitud, kilogramos para masa, julios para energía) y después lo convierte a la unidad de destino. Este método de doble paso garantiza que todas las conversiones dentro de una misma categoría sean coherentes entre sí y evita acumular errores de redondeo.",
    commonTitle: "Conversiones más habituales",
    tableColFrom: "Unidad",
    tableColTo: "Equivale a",
  },
  en: {
    backHome: "Back to home",
    title: "Unit Converter",
    subtitle: "Instantly convert between units of length, mass, temperature, energy, speed, area and volume.",
    intro1: "The unit converter lets you instantly transform values between the most widely used measurement systems: the International System (SI), the imperial system and other commonly used units. The categories covered are length, mass, temperature, energy, speed, area and volume, covering the most frequent conversions in science, engineering and everyday life.",
    intro2: "For each category, select the source unit and target unit, enter the value and you will get the result instantly. A quick reference table is also shown with equivalent values for 1, 10, 100 and 1,000 units. The converter uses standardised conversion factors or scientific consensus values.",
    disclaimer: "Conversion factors are internationally established. For high-precision engineering or scientific applications, consult the official normative sources.",
    fromLabel: "From",
    toLabel: "To",
    valueLabel: "Value to convert",
    valuePlaceholder: "Enter a value...",
    resultLabel: "Result",
    quickTable: "Quick conversion table",
    swapTitle: "Swap units",
    aboutTitle: "About this converter",
    aboutText: "This converter performs instant conversions between the most common units of the International System (SI) and other measurement systems. Conversions use exact factors where standardised (e.g. 1 inch = exactly 0.0254 m) or scientific consensus values otherwise.",
    faqTitle: "Frequently asked questions",
    q1: "Why doesn't temperature use a simple linear factor?",
    a1: "Because the zero point of °C and °F is arbitrary (it does not correspond to the absence of heat). Kelvin has the absolute zero. That is why the conversion requires adding or subtracting constants in addition to the multiplicative factor.",
    q2: "Which unit system is used in science?",
    a2: "The International System of Units (SI). Its base units are: metre (m), kilogram (kg), second (s), ampere (A), kelvin (K), mole (mol) and candela (cd).",
    q3: "How many litres are in a gallon?",
    a3: "One US gallon is approximately 3.785 litres. The imperial gallon (used in the United Kingdom) is 4.546 litres. This calculator uses the US gallon.",
    q4: "How many kilometres are in a mile?",
    a4: "One statute mile is exactly 1,609.344 metres, i.e. approximately 1.609 km. The nautical mile is 1.852 km and is used in aviation and sailing.",
    q5: "What is the difference between mass and weight?",
    a5: "In everyday language they are used as synonyms, but in physics they are different things. Mass is the amount of matter in an object and is measured in kilograms; it is the same on Earth, on the Moon or in space. Weight is the force with which gravity pulls on that mass and is measured in newtons; it changes with the local gravity. This converter works with mass (kg, g, lb, oz), which is what you usually need in everyday life, cooking or commerce.",
    q6: "Can I convert between units of different categories?",
    a6: "Not directly, because they measure different physical quantities: it makes no sense to convert litres to kilometres. Some quantities are related by a density or a specific factor (one litre of pure water weighs about 1 kg at 4 °C), but that equivalence depends on the substance and is not a pure unit conversion. That is why the converter is organised by categories and only lets you convert between units that measure the same quantity.",
    howTitle: "How conversions work",
    how1: "Converting units means multiplying the original value by a factor that relates both units to a common reference. Internally, the converter first transforms the value into that category's International System base unit (metres for length, kilograms for mass, joules for energy) and then converts it to the target unit. This two-step method ensures that all conversions within the same category are consistent with one another and avoids accumulating rounding errors.",
    commonTitle: "Most common conversions",
    tableColFrom: "Unit",
    tableColTo: "Equals",
  },
};

function ConverterTab({ category, t }: { category: Category; t: typeof T["es"] }) {
  const [fromUnit, setFromUnit] = useState(category.units[0].key);
  const [toUnit, setToUnit] = useState(category.units[1].key);
  const [value, setValue] = useState("");

  const result =
    value !== "" && !isNaN(parseFloat(value))
      ? category.convert(parseFloat(value), fromUnit, toUnit)
      : null;

  const fmt = (n: number) => {
    if (Math.abs(n) === 0) return "0";
    if (Math.abs(n) >= 1e10 || (Math.abs(n) < 0.0001 && n !== 0)) {
      return n.toExponential(6);
    }
    return n.toLocaleString("es-ES", { maximumFractionDigits: 8 });
  };

  const swap = () => {
    const tmp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tmp);
  };

  const fromLabel = category.units.find((u) => u.key === fromUnit)?.label ?? fromUnit;
  const toLabel = category.units.find((u) => u.key === toUnit)?.label ?? toUnit;

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div className="md:col-span-2">
            <Label>{t.fromLabel}</Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger data-testid={`select-from-${category.key}`} className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {category.units.map((u) => (
                  <SelectItem key={u.key} value={u.key}>{u.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-center md:col-span-1">
            <button
              data-testid={`button-swap-${category.key}`}
              onClick={swap}
              className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-primary"
              title={t.swapTitle}
            >
              <ArrowLeftRight className="h-5 w-5" />
            </button>
          </div>
          <div className="md:col-span-2">
            <Label>{t.toLabel}</Label>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger data-testid={`select-to-${category.key}`} className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {category.units.map((u) => (
                  <SelectItem key={u.key} value={u.key}>{u.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor={`value-${category.key}`}>{t.valueLabel}</Label>
          <Input
            id={`value-${category.key}`}
            data-testid={`input-value-${category.key}`}
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={t.valuePlaceholder}
            className="mt-1 text-lg"
          />
        </div>

        {result !== null && (
          <div className="bg-accent/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">{t.resultLabel}</p>
            <p className="text-2xl font-bold text-primary">
              {fmt(result)} <span className="text-base font-normal text-muted-foreground">{toLabel}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {value} {fromLabel} = {fmt(result)} {toLabel}
            </p>
          </div>
        )}

        <div className="mt-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">{t.quickTable}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[1, 10, 100, 1000].map((n) => {
              const r = category.convert(n, fromUnit, toUnit);
              return (
                <div key={n} className="text-xs bg-muted/50 rounded-md p-2">
                  <p className="font-medium">{n}</p>
                  <p className="text-muted-foreground">{fmt(r)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ConversorUnidades() {
  const locale = useLocale();
  const t = T[locale];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href={locale === "en" ? "/en" : "/"} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
          {t.backHome}
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <ArrowLeftRight className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
      </div>
      <p className="text-muted-foreground mb-6">{t.subtitle}</p>

      <div className="prose prose-sm dark:prose-invert max-w-none mb-8 space-y-3 text-gray-700 dark:text-gray-300">
        <p>{t.intro1}</p>
        <p>{t.intro2}</p>
      </div>

      <Tabs defaultValue="length">
        <TabsList className="flex flex-wrap h-auto mb-6 gap-1">
          {categories.map((c) => (
            <TabsTrigger key={c.key} value={c.key} data-testid={`tab-${c.key}`}>
              {locale === "en" ? c.nameEn : c.nameEs}
            </TabsTrigger>
          ))}
        </TabsList>
        {categories.map((c) => (
          <TabsContent key={c.key} value={c.key}>
            <ConverterTab category={c} t={t} />
          </TabsContent>
        ))}
      </Tabs>

      <section className="mt-12 prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t.aboutTitle}</h2>
        <p>{t.aboutText}</p>
        <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">{t.howTitle}</h2>
        <p>{t.how1}</p>
      </section>

      <div className="mt-8 overflow-x-auto">
        <h3 className="text-base font-semibold mb-3 text-gray-900 dark:text-white">{t.commonTitle}</h3>
        <table className="w-full text-sm border-collapse max-w-md">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10 text-left text-gray-500 dark:text-white/50">
              <th className="py-2 pr-4 font-medium">{t.tableColFrom}</th>
              <th className="py-2 font-medium">{t.tableColTo}</th>
            </tr>
          </thead>
          <tbody>
            {COMMON_TABLE.map((row) => {
              const [from, to] = locale === "en" ? row.en : row.es;
              return (
                <tr key={from} className="border-b border-gray-100 dark:border-white/5">
                  <td className="py-2 pr-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{from}</td>
                  <td className="py-2 font-semibold text-primary whitespace-nowrap">{to}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AdUnit slot={AD_SLOTS.midContent} className="my-10" />

      <section className="mt-10">
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
          <AccordionItem value="q6">
            <AccordionTrigger>{t.q6}</AccordionTrigger>
            <AccordionContent>{t.a6}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}
