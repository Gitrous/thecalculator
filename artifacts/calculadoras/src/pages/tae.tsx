import { useState } from "react";
import { Percent } from "lucide-react";
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

function pct(n: number) {
  return n.toLocaleString("es-ES", { minimumFractionDigits: 4, maximumFractionDigits: 4 }) + "%";
}

const FRECUENCIAS = [
  { value: "12", label: "Mensual (12 veces/año)" },
  { value: "4", label: "Trimestral (4 veces/año)" },
  { value: "2", label: "Semestral (2 veces/año)" },
  { value: "1", label: "Anual (1 vez/año)" },
  { value: "365", label: "Diaria (365 veces/año)" },
  { value: "52", label: "Semanal (52 veces/año)" },
];

export default function Tae() {
  const [mode, setMode] = useState<"tin-to-tae" | "tae-to-tin">("tin-to-tae");
  const [tin, setTin] = useState("5");
  const [tae, setTaeVal] = useState("5.116");
  const [frecuencia, setFrecuencia] = useState("12");

  const n = parseInt(frecuencia);

  // TIN → TAE
  const tinVal = parseFloat(tin) || 0;
  const taeFromTin = (Math.pow(1 + tinVal / 100 / n, n) - 1) * 100;

  // TAE → TIN
  const taeVal = parseFloat(tae) || 0;
  const tinFromTae = (Math.pow(1 + taeVal / 100, 1 / n) - 1) * n * 100;

  const resultado = mode === "tin-to-tae" ? taeFromTin : tinFromTae;
  const label = mode === "tin-to-tae" ? "TAE" : "TIN";
  const inputLabel = mode === "tin-to-tae" ? "TIN" : "TAE";

  // Tabla comparativa para distintas frecuencias con el TIN actual
  const tinForTable = mode === "tin-to-tae" ? tinVal : tinFromTae;
  const tabla = FRECUENCIAS.map((f) => {
    const nF = parseInt(f.value);
    const taeF = (Math.pow(1 + tinForTable / 100 / nF, nF) - 1) * 100;
    return { label: f.label, n: nF, tae: taeF };
  });

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Percent className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Calculadora TAE / TIN
        </h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Convierte entre TIN (Tipo de Interés Nominal) y TAE (Tasa Anual
        Equivalente) según la frecuencia de capitalización. Imprescindible
        para comparar hipotecas, préstamos y depósitos.
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Convertidor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setMode("tin-to-tae")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === "tin-to-tae"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              TIN → TAE
            </button>
            <button
              onClick={() => setMode("tae-to-tin")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === "tae-to-tin"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              TAE → TIN
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="input-rate">{inputLabel} (%)</Label>
              <Input
                id="input-rate"
                type="number"
                step="0.001"
                value={mode === "tin-to-tae" ? tin : tae}
                onChange={(e) =>
                  mode === "tin-to-tae" ? setTin(e.target.value) : setTaeVal(e.target.value)
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="frecuencia">Frecuencia de capitalización</Label>
              <Select value={frecuencia} onValueChange={setFrecuencia}>
                <SelectTrigger id="frecuencia" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FRECUENCIAS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/30 bg-primary/5 mb-6">
        <CardContent className="pt-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">{label} equivalente</p>
          <p className="text-5xl font-bold text-primary mb-2">
            {resultado.toLocaleString("es-ES", { minimumFractionDigits: 4, maximumFractionDigits: 4 })}%
          </p>
          <p className="text-sm text-muted-foreground">
            {mode === "tin-to-tae"
              ? `Con capitalización ${FRECUENCIAS.find((f) => f.value === frecuencia)?.label.toLowerCase()}, un TIN del ${tin}% equivale a una TAE del ${pct(taeFromTin)}`
              : `Un TAE del ${tae}% capitalizado ${FRECUENCIAS.find((f) => f.value === frecuencia)?.label.toLowerCase()} implica un TIN del ${pct(tinFromTae)}`}
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            TAE según frecuencia de capitalización — TIN {tinForTable.toLocaleString("es-ES", { maximumFractionDigits: 3 })}%
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {tabla.map((row) => (
              <div key={row.n} className={`flex justify-between items-center py-2 border-b text-sm ${row.n === n ? "font-semibold text-primary" : ""}`}>
                <span>{row.label}</span>
                <span>{pct(row.tae)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <section className="mt-4">
        <h2 className="text-xl font-semibold mb-4">Preguntas frecuentes</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="q1">
            <AccordionTrigger>¿Cuál es la diferencia entre TIN y TAE?</AccordionTrigger>
            <AccordionContent>
              El <strong>TIN</strong> (Tipo de Interés Nominal) es el porcentaje
              de interés que el banco cobra o paga sobre el capital, sin considerar
              la frecuencia de capitalización ni comisiones. La <strong>TAE</strong>
              (Tasa Anual Equivalente) incluye el efecto de la capitalización y,
              en préstamos, también las comisiones. La TAE es el indicador legal
              que permite comparar productos financieros.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>¿Por qué la TAE es siempre mayor que el TIN?</AccordionTrigger>
            <AccordionContent>
              Porque la capitalización compuesta genera intereses sobre intereses.
              Cuanto más frecuente sea la capitalización (mensual es más que
              anual), mayor será la diferencia entre TAE y TIN. Si la
              capitalización es anual, TAE = TIN.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>¿Qué debo mirar al comparar hipotecas?</AccordionTrigger>
            <AccordionContent>
              Siempre compara la <strong>TAE</strong>, no el TIN ni el diferencial.
              La TAE de una hipoteca incluye el tipo de interés y las comisiones
              obligatorias (apertura, estudio), aunque legalmente no incluye
              seguros vinculados. En hipotecas variables, fíjate en el diferencial
              sobre el Euríbor + TAE del primer año.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
