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
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { useLocale } from "@/lib/locale";

function pct(n: number) {
  return n.toLocaleString("es-ES", { minimumFractionDigits: 4, maximumFractionDigits: 4 }) + "%";
}

const FRECUENCIAS_ES = [
  { value: "12", label: "Mensual (12 veces/año)" },
  { value: "4", label: "Trimestral (4 veces/año)" },
  { value: "2", label: "Semestral (2 veces/año)" },
  { value: "1", label: "Anual (1 vez/año)" },
  { value: "365", label: "Diaria (365 veces/año)" },
  { value: "52", label: "Semanal (52 veces/año)" },
];

const FRECUENCIAS_EN = [
  { value: "12", label: "Monthly (12 times/year)" },
  { value: "4", label: "Quarterly (4 times/year)" },
  { value: "2", label: "Semi-annual (2 times/year)" },
  { value: "1", label: "Annual (1 time/year)" },
  { value: "365", label: "Daily (365 times/year)" },
  { value: "52", label: "Weekly (52 times/year)" },
];

const T = {
  es: {
    title: "Calculadora TAE / TIN",
    subtitle: "Convierte entre TIN (Tipo de Interés Nominal) y TAE (Tasa Anual Equivalente) según la frecuencia de capitalización. Imprescindible para comparar hipotecas, préstamos y depósitos.",
    cardTitle: "Convertidor",
    freqLabel: "Frecuencia de capitalización",
    tinLabel: "TIN (%)",
    taeLabel: "TAE (%)",
    equivalentTae: "TAE equivalente",
    equivalentTin: "TIN equivalente",
    tableTitle: (tin: string) => `TAE según frecuencia de capitalización — TIN ${tin}%`,
    faqTitle: "Preguntas frecuentes",
    q1: "¿Cuál es la diferencia entre TIN y TAE?",
    a1: (<>El <strong>TIN</strong> (Tipo de Interés Nominal) es el porcentaje de interés que el banco cobra o paga sobre el capital, sin considerar la frecuencia de capitalización ni comisiones. La <strong>TAE</strong> (Tasa Anual Equivalente) incluye el efecto de la capitalización y, en préstamos, también las comisiones. La TAE es el indicador legal que permite comparar productos financieros.</>),
    q2: "¿Por qué la TAE es siempre mayor que el TIN?",
    a2: "Porque la capitalización compuesta genera intereses sobre intereses. Cuanto más frecuente sea la capitalización (mensual es más que anual), mayor será la diferencia entre TAE y TIN. Si la capitalización es anual, TAE = TIN.",
    q3: "¿Qué debo mirar al comparar hipotecas?",
    a3: (<>Siempre compara la <strong>TAE</strong>, no el TIN ni el diferencial. La TAE de una hipoteca incluye el tipo de interés y las comisiones obligatorias (apertura, estudio), aunque legalmente no incluye seguros vinculados. En hipotecas variables, fíjate en el diferencial sobre el Euríbor + TAE del primer año.</>),
    explanationTinToTae: (tin: string, freq: string, tae: string) =>
      `Con capitalización ${freq}, un TIN del ${tin}% equivale a una TAE del ${tae}`,
    explanationTaeToTin: (tae: string, freq: string, tin: string) =>
      `Un TAE del ${tae}% capitalizado ${freq} implica un TIN del ${tin}`,
  },
  en: {
    title: "APR / Nominal Rate Converter",
    subtitle: "Convert between nominal interest rate (TIN) and APR (Annual Percentage Rate) based on the compounding frequency. Essential for comparing mortgages, loans and deposits.",
    cardTitle: "Converter",
    freqLabel: "Compounding frequency",
    tinLabel: "Nominal rate (%)",
    taeLabel: "APR (%)",
    equivalentTae: "Equivalent APR",
    equivalentTin: "Equivalent nominal rate",
    tableTitle: (tin: string) => `APR by compounding frequency — Nominal rate ${tin}%`,
    faqTitle: "Frequently asked questions",
    q1: "What is the difference between nominal rate and APR?",
    a1: (<>The <strong>nominal rate</strong> is the interest percentage that the bank charges or pays on the capital, without considering the compounding frequency or fees. The <strong>APR</strong> (Annual Percentage Rate) includes the effect of compounding and, for loans, also fees. The APR is the legal indicator that allows comparison of financial products.</>),
    q2: "Why is the APR always higher than the nominal rate?",
    a2: "Because compound interest generates interest on interest. The more frequent the compounding (monthly is more than annual), the greater the difference between APR and nominal rate. If compounding is annual, APR = nominal rate.",
    q3: "What should I look at when comparing mortgages?",
    a3: (<>Always compare the <strong>APR</strong>, not the nominal rate or the spread. The APR of a mortgage includes the interest rate and mandatory fees (arrangement, study), although legally it does not include linked insurance. For variable mortgages, look at the Euribor spread + APR for the first year.</>),
    explanationTinToTae: (tin: string, freq: string, tae: string) =>
      `With ${freq} compounding, a nominal rate of ${tin}% equals an APR of ${tae}`,
    explanationTaeToTin: (tae: string, freq: string, tin: string) =>
      `An APR of ${tae}% compounded ${freq} implies a nominal rate of ${tin}`,
  },
};

export default function Tae() {
  const locale = useLocale();
  const t = T[locale];
  const isEn = locale === "en";
  const FRECUENCIAS = isEn ? FRECUENCIAS_EN : FRECUENCIAS_ES;

  const [mode, setMode] = useState<"tin-to-tae" | "tae-to-tin">("tin-to-tae");
  const [tin, setTin] = useState("5");
  const [tae, setTaeVal] = useState("5.116");
  const [frecuencia, setFrecuencia] = useState("12");

  const n = parseInt(frecuencia);

  const tinVal = parseFloat(tin) || 0;
  const taeFromTin = (Math.pow(1 + tinVal / 100 / n, n) - 1) * 100;

  const taeVal = parseFloat(tae) || 0;
  const tinFromTae = (Math.pow(1 + taeVal / 100, 1 / n) - 1) * n * 100;

  const resultado = mode === "tin-to-tae" ? taeFromTin : tinFromTae;
  const resultLabel = mode === "tin-to-tae" ? t.equivalentTae : t.equivalentTin;
  const inputLabel = mode === "tin-to-tae" ? t.tinLabel : t.taeLabel;

  const tinForTable = mode === "tin-to-tae" ? tinVal : tinFromTae;
  const tabla = FRECUENCIAS.map((f) => {
    const nF = parseInt(f.value);
    const taeF = (Math.pow(1 + tinForTable / 100 / nF, nF) - 1) * 100;
    return { label: f.label, n: nF, tae: taeF };
  });

  const currentFreqLabel = FRECUENCIAS.find((f) => f.value === frecuencia)?.label.toLowerCase() ?? "";

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Percent className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
      </div>
      <p className="text-muted-foreground mb-8">{t.subtitle}</p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t.cardTitle}</CardTitle>
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
              {isEn ? "Nominal → APR" : "TIN → TAE"}
            </button>
            <button
              onClick={() => setMode("tae-to-tin")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === "tae-to-tin"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {isEn ? "APR → Nominal" : "TAE → TIN"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="input-rate">{inputLabel}</Label>
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
              <Label htmlFor="frecuencia">{t.freqLabel}</Label>
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
          <p className="text-sm text-muted-foreground mb-1">{resultLabel}</p>
          <p className="text-5xl font-bold text-primary mb-2">
            {resultado.toLocaleString("es-ES", { minimumFractionDigits: 4, maximumFractionDigits: 4 })}%
          </p>
          <p className="text-sm text-muted-foreground">
            {mode === "tin-to-tae"
              ? t.explanationTinToTae(tin, currentFreqLabel, pct(taeFromTin))
              : t.explanationTaeToTin(tae, currentFreqLabel, pct(tinFromTae))}
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            {t.tableTitle(tinForTable.toLocaleString("es-ES", { maximumFractionDigits: 3 }))}
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

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}
