import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowLeftRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type Category = {
  name: string;
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
    name: "Longitud",
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
    name: "Masa",
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
    name: "Temperatura",
    units: [
      { key: "C", label: "Celsius (°C)" },
      { key: "F", label: "Fahrenheit (°F)" },
      { key: "K", label: "Kelvin (K)" },
    ],
    convert: convertTemp,
  },
  {
    name: "Energía",
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
    name: "Velocidad",
    units: [
      { key: "ms", label: "Metro/segundo (m/s)" },
      { key: "kmh", label: "Kilómetro/hora (km/h)" },
      { key: "mph", label: "Milla/hora (mph)" },
      { key: "kt", label: "Nudo (kt)" },
    ],
    convert: linearConvert({ ms: 1, kmh: 1 / 3.6, mph: 0.44704, kt: 0.514444 }),
  },
  {
    name: "Área",
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
    name: "Volumen",
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

function ConverterTab({ category }: { category: Category }) {
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
            <Label>De</Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger data-testid={`select-from-${category.name}`} className="mt-1">
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
              data-testid={`button-swap-${category.name}`}
              onClick={swap}
              className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-primary"
              title="Intercambiar unidades"
            >
              <ArrowLeftRight className="h-5 w-5" />
            </button>
          </div>
          <div className="md:col-span-2">
            <Label>A</Label>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger data-testid={`select-to-${category.name}`} className="mt-1">
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
          <Label htmlFor={`value-${category.name}`}>Valor a convertir</Label>
          <Input
            id={`value-${category.name}`}
            data-testid={`input-value-${category.name}`}
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Introduce un valor..."
            className="mt-1 text-lg"
          />
        </div>

        {result !== null && (
          <div className="bg-accent/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Resultado</p>
            <p className="text-2xl font-bold text-primary">
              {fmt(result)} <span className="text-base font-normal text-muted-foreground">{toLabel}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {value} {fromLabel} = {fmt(result)} {toLabel}
            </p>
          </div>
        )}

        <div className="mt-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Tabla de conversión rápida</p>
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
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <ArrowLeftRight className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Conversor de Unidades</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Convierte entre unidades de longitud, masa, temperatura, energía, velocidad, área y volumen al instante.
      </p>

      <Tabs defaultValue="Longitud">
        <TabsList className="flex flex-wrap h-auto mb-6 gap-1">
          {categories.map((c) => (
            <TabsTrigger key={c.name} value={c.name} data-testid={`tab-${c.name}`}>
              {c.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {categories.map((c) => (
          <TabsContent key={c.name} value={c.name}>
            <ConverterTab category={c} />
          </TabsContent>
        ))}
      </Tabs>

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Sobre el conversor</h2>
        <p className="text-muted-foreground">
          Este conversor realiza conversiones instantáneas entre las unidades más habituales del Sistema
          Internacional (SI) y otros sistemas de medida. Las conversiones utilizan factores exactos cuando
          están estandarizados (por ejemplo, 1 pulgada = exactamente 0,0254 m) o valores de consenso
          científico para el resto.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Preguntas frecuentes</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="q1">
            <AccordionTrigger>¿Por qué la temperatura no tiene un factor lineal simple?</AccordionTrigger>
            <AccordionContent>
              Porque el cero de °C y °F es arbitrario (no corresponde a ausencia absoluta de calor).
              El Kelvin sí tiene el cero absoluto. Por eso la conversión requiere sumar o restar constantes
              además del factor multiplicativo.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>¿Qué sistema de unidades se usa en ciencia?</AccordionTrigger>
            <AccordionContent>
              El Sistema Internacional de Unidades (SI). Sus unidades base son: metro (m), kilogramo (kg),
              segundo (s), amperio (A), kelvin (K), mol (mol) y candela (cd).
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>¿Cuántos litros tiene un galón?</AccordionTrigger>
            <AccordionContent>
              Un galón estadounidense equivale a 3,785 litros aproximadamente. El galón imperial
              (utilizado en el Reino Unido) equivale a 4,546 litros. Esta calculadora usa el galón US.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q4">
            <AccordionTrigger>¿Cuántos kilómetros tiene una milla?</AccordionTrigger>
            <AccordionContent>
              Una milla terrestre equivale exactamente a 1.609,344 metros, es decir, aproximadamente
              1,609 km. La milla náutica equivale a 1,852 km y es la que se usa en aviación y náutica.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
