import { useState, useRef } from "react";
import { Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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

function eur(n: number): string {
  return n.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  });
}

interface SliderFieldProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  minLabel: string;
  maxLabel: string;
  format?: (v: number) => string;
  onChange: (v: number) => void;
}

function SliderField({ label, value, unit, min, max, step, minLabel, maxLabel, format, onChange }: SliderFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const displayVal = format ? format(value) : value.toLocaleString("es-ES");

  const startEditing = () => {
    setDraft(String(value));
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const commitEdit = () => {
    const v = parseFloat(draft.replace(",", "."));
    if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
    setEditing(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600 dark:text-white/60">{label}</span>
        {editing ? (
          <input
            ref={inputRef}
            type="number"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitEdit();
              if (e.key === "Escape") setEditing(false);
            }}
            className="w-28 text-right text-sm font-semibold text-primary border border-primary rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white dark:bg-white/10 dark:text-white"
          />
        ) : (
          <button
            onClick={startEditing}
            title="Haz clic para editar"
            className="text-sm font-semibold text-primary hover:bg-primary/10 rounded-lg px-2 py-0.5 transition-colors cursor-text"
          >
            {displayVal} {unit}
          </button>
        )}
      </div>
      <Slider min={min} max={max} step={step} value={[value]} onValueChange={([v]) => onChange(v)} />
      <div className="flex justify-between text-xs text-gray-400 dark:text-white/30">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

const T = {
  es: {
    title: "Calculadora de Préstamo Personal",
    subtitle: "Calcula la cuota mensual de tu préstamo, los intereses totales y el coste final con el sistema de amortización francés.",
    cardTitle: "Datos del préstamo",
    amountLabel: "Importe del préstamo",
    rateLabel: "Interés anual (TIN)",
    yearsLabel: "Plazo",
    calculateBtn: "Calcular préstamo",
    monthlyLabel: "Cuota mensual",
    capitalLabel: "Capital",
    interestLabel: "Intereses",
    totalLabel: "Total a pagar",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Qué diferencia hay entre TIN y TAE?",
    a1: "El TIN es el tipo de interés nominal que se aplica al capital. La TAE incluye además comisiones y gastos, por lo que refleja mejor el coste real del préstamo. Esta calculadora usa el TIN.",
    q2: "¿Cómo se calcula la cuota?",
    a2: "Con el sistema francés (cuota constante): cuota = C · i / (1 − (1+i)^−n), donde C es el capital, i el interés mensual y n el número de meses.",
  },
  en: {
    title: "Personal Loan Calculator",
    subtitle: "Calculate your monthly loan payment, total interest and final cost using the French amortisation system.",
    cardTitle: "Loan details",
    amountLabel: "Loan amount",
    rateLabel: "Annual interest rate (TIN)",
    yearsLabel: "Term",
    calculateBtn: "Calculate loan",
    monthlyLabel: "Monthly payment",
    capitalLabel: "Principal",
    interestLabel: "Interest",
    totalLabel: "Total to pay",
    faqTitle: "Frequently asked questions",
    q1: "What is the difference between TIN and TAE?",
    a1: "TIN is the nominal interest rate applied to the principal. TAE also includes fees and charges, so it better reflects the real cost of the loan. This calculator uses TIN.",
    q2: "How is the monthly payment calculated?",
    a2: "Using the French system (constant payment): payment = C · i / (1 − (1+i)^−n), where C is the principal, i the monthly interest rate and n the number of months.",
  },
};

export default function PrestamoPersonal() {
  const locale = useLocale();
  const t = T[locale];
  const isEs = locale === "es";

  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);
  const [calculated, setCalculated] = useState(false);

  const n = Math.round(years * 12);
  const valid = amount > 0 && rate >= 0 && n > 0;

  let monthly = 0, total = 0, interest = 0;
  if (valid && calculated) {
    const i = rate / 100 / 12;
    monthly = i === 0 ? amount / n : (amount * i) / (1 - Math.pow(1 + i, -n));
    total = monthly * n;
    interest = total - amount;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Landmark className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
      </div>
      <p className="text-muted-foreground mb-8">{t.subtitle}</p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t.cardTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <SliderField
            label={t.amountLabel}
            value={amount}
            unit="€"
            min={500}
            max={100000}
            step={500}
            minLabel="500 €"
            maxLabel="100.000 €"
            onChange={(v) => setAmount(v)}
          />
          <SliderField
            label={t.rateLabel}
            value={rate}
            unit="%"
            min={0}
            max={20}
            step={0.1}
            minLabel="0 %"
            maxLabel="20 %"
            format={(v) => v.toFixed(1)}
            onChange={(v) => setRate(v)}
          />
          <SliderField
            label={t.yearsLabel}
            value={years}
            unit={isEs ? "años" : "yr"}
            min={1}
            max={10}
            step={1}
            minLabel={isEs ? "1 año" : "1 yr"}
            maxLabel={isEs ? "10 años" : "10 yr"}
            onChange={(v) => setYears(v)}
          />
          <Button className="w-full" onClick={() => setCalculated(true)}>
            {t.calculateBtn}
          </Button>
        </CardContent>
      </Card>

      {calculated && valid && (
        <Card className="border-primary/30 bg-primary/5 mb-8">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground mb-1">{t.monthlyLabel}</p>
              <p className="text-4xl font-bold text-primary">{eur(monthly)}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">{t.capitalLabel}</p>
                <p className="text-lg font-semibold">{eur(amount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.interestLabel}</p>
                <p className="text-lg font-semibold">{eur(interest)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.totalLabel}</p>
                <p className="text-lg font-semibold">{eur(total)}</p>
              </div>
            </div>
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
