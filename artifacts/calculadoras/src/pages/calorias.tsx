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

const ACTIVITY_LEVELS = [
  { value: "1.2", label: "Sedentario (sin ejercicio)" },
  { value: "1.375", label: "Poco activo (1–3 días/semana)" },
  { value: "1.55", label: "Moderadamente activo (3–5 días/semana)" },
  { value: "1.725", label: "Muy activo (6–7 días/semana)" },
  { value: "1.9", label: "Extra activo (trabajo físico + deporte)" },
];

const GOALS = [
  { value: "-500", label: "Perder peso (déficit –500 kcal)" },
  { value: "0", label: "Mantener peso" },
  { value: "300", label: "Ganar músculo (superávit +300 kcal)" },
];

export default function Calorias() {
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
  const proteinas = Math.round((objetivo_kcal * 0.3) / 4); // 30% proteína, 4 kcal/g
  const carbos = Math.round((objetivo_kcal * 0.4) / 4);    // 40% hidratos, 4 kcal/g
  const grasas = Math.round((objetivo_kcal * 0.3) / 9);    // 30% grasa, 9 kcal/g

  const objLabel = GOALS.find((g) => g.value === objetivo)?.label ?? "";

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <HeartPulse className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Calculadora de Calorías y TMB
        </h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Calcula tu Tasa Metabólica Basal (TMB) y las calorías diarias que
        necesitas según tu nivel de actividad y objetivo.
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Tus datos</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="peso">Peso (kg)</Label>
            <Input id="peso" type="number" value={peso} onChange={(e) => setPeso(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="altura">Altura (cm)</Label>
            <Input id="altura" type="number" value={altura} onChange={(e) => setAltura(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="edad">Edad (años)</Label>
            <Input id="edad" type="number" value={edad} onChange={(e) => setEdad(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="sexo">Sexo biológico</Label>
            <Select value={sexo} onValueChange={setSexo}>
              <SelectTrigger id="sexo" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hombre">Hombre</SelectItem>
                <SelectItem value="mujer">Mujer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="actividad">Nivel de actividad</Label>
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
            <Label htmlFor="objetivo">Objetivo</Label>
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
                  <p className="text-sm text-muted-foreground">TMB (en reposo)</p>
                  <p className="text-3xl font-bold">{Math.round(tmb)}</p>
                  <p className="text-xs text-muted-foreground">kcal/día</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">TDEE (con actividad)</p>
                  <p className="text-3xl font-bold">{Math.round(tdee)}</p>
                  <p className="text-xs text-muted-foreground">kcal/día</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Objetivo diario</p>
                  <p className="text-3xl font-bold text-primary">{Math.round(objetivo_kcal)}</p>
                  <p className="text-xs text-muted-foreground">kcal/día</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Macronutrientes orientativos — {objLabel}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <p className="text-2xl font-bold text-blue-600">{proteinas}g</p>
                  <p className="text-sm font-medium">Proteínas</p>
                  <p className="text-xs text-muted-foreground">30% · 4 kcal/g</p>
                </div>
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                  <p className="text-2xl font-bold text-amber-600">{carbos}g</p>
                  <p className="text-sm font-medium">Hidratos</p>
                  <p className="text-xs text-muted-foreground">40% · 4 kcal/g</p>
                </div>
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                  <p className="text-2xl font-bold text-emerald-600">{grasas}g</p>
                  <p className="text-sm font-medium">Grasas</p>
                  <p className="text-xs text-muted-foreground">30% · 9 kcal/g</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Distribución estándar orientativa. Ajusta según tu dieta y objetivos concretos.
              </p>
            </CardContent>
          </Card>
        </>
      )}

      <section className="mt-4">
        <h2 className="text-xl font-semibold mb-4">Preguntas frecuentes</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="q1">
            <AccordionTrigger>¿Qué es la TMB?</AccordionTrigger>
            <AccordionContent>
              La Tasa Metabólica Basal es la energía mínima que tu cuerpo necesita
              en reposo absoluto para mantener funciones vitales: respiración,
              circulación, temperatura corporal, etc. Representa entre el 60-75%
              del gasto calórico total.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>¿Qué fórmula usa esta calculadora?</AccordionTrigger>
            <AccordionContent>
              Usa la fórmula de <strong>Mifflin-St Jeor</strong> (1990), considerada
              la más precisa para la población general:
              hombre: 10×peso + 6,25×altura − 5×edad + 5;
              mujer: 10×peso + 6,25×altura − 5×edad − 161.
              Después se multiplica por el factor de actividad para obtener el TDEE.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>¿Por qué no bajo de peso comiendo menos calorías?</AccordionTrigger>
            <AccordionContent>
              Las calculadoras son estimaciones poblacionales. Tu metabolismo puede
              diferir. Factores como el estado hormonal, la masa muscular, el sueño
              o la microbiota afectan el gasto real. Si llevas semanas sin progresar,
              ajusta las calorías en ±100 kcal y observa el resultado.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
