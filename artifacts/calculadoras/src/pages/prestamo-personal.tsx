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
    intro1: "Un préstamo personal es un crédito sin garantía real en el que una entidad te presta una cantidad de dinero que devuelves en cuotas mensuales durante un plazo acordado. A diferencia de la hipoteca, no está respaldado por un bien inmueble, por lo que los tipos de interés suelen ser más altos. La cuota mensual incluye tanto la amortización del capital como los intereses del período.",
    intro2: "Esta calculadora usa el sistema de amortización francés, el más común en España y Europa, en el que la cuota mensual permanece constante pero la proporción de capital e intereses varía cada mes. Te muestra el importe total de la deuda con intereses, para que puedas comparar distintas ofertas de forma objetiva.",
    disclaimer: "Los resultados son orientativos. Compara siempre la TAE (y no solo el TIN) entre distintas entidades antes de contratar un préstamo.",
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
    a1: "El TIN (Tipo de Interés Nominal) es el interés puro que el banco aplica al capital prestado, sin incluir comisiones ni gastos adicionales. La TAE (Tasa Anual Equivalente) es el indicador más completo: incorpora el TIN más todas las comisiones asociadas al préstamo (apertura, estudio, seguros vinculados, etc.) y se expresa en términos anuales. A la hora de comparar préstamos entre entidades, siempre debes fijarte en la TAE, no en el TIN, ya que un préstamo con TIN bajo puede ser más caro que otro si tiene muchas comisiones. Esta calculadora usa el TIN para el cálculo de la cuota mensual.",
    q2: "¿Cómo se calcula la cuota mensual?",
    a2: "Esta calculadora usa el sistema de amortización francés, el más habitual en España para préstamos al consumo. La fórmula es: cuota = C · i / (1 − (1+i)^−n), donde C es el capital prestado, i es el tipo de interés mensual (TIN anual dividido entre 12) y n es el número total de cuotas (años × 12). Con este sistema, la cuota es constante todos los meses, pero la proporción entre capital e intereses varía: al principio se pagan más intereses y menos capital, y hacia el final del préstamo ocurre lo contrario.",
    q3: "¿Qué pasa si dejo de pagar el préstamo?",
    a3: "Si dejas de pagar una cuota, el banco te cobrará intereses de demora (que en España no pueden superar 2,5 veces el interés legal del dinero, según la Ley de Crédito al Consumo). Si el impago se prolonga varios meses, la entidad puede dar por vencido el préstamo anticipadamente y reclamarte el total de la deuda pendiente. Además, tus datos podrán incluirse en ficheros de morosidad como ASNEF, lo que dificultará obtener financiación futura. Si prevés dificultades de pago, contacta con el banco antes de que se produzca el impago: muchas entidades ofrecen periodos de carencia o refinanciación.",
  },
  en: {
    title: "Personal Loan Calculator",
    subtitle: "Calculate your monthly loan payment, total interest and final cost using the French amortisation system.",
    intro1: "A personal loan is an unsecured credit in which a lender advances you a sum of money that you repay in monthly instalments over an agreed term. Unlike a mortgage, it is not backed by a property asset, so interest rates tend to be higher. The monthly payment includes both the repayment of principal and the interest for that period.",
    intro2: "This calculator uses the French amortisation system, the most common in Spain and Europe, in which the monthly payment stays constant but the split between principal and interest changes every month. It shows you the total cost of the loan including interest, so you can compare different offers objectively.",
    disclaimer: "Results are indicative. Always compare the APR (not just the nominal rate) between lenders before taking out a loan.",
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
    q1: "What is the difference between the nominal rate and APR?",
    a1: "The nominal interest rate (TIN) is the pure interest the bank charges on the borrowed capital, excluding fees and additional costs. The Annual Percentage Rate (APR or TAE) is the more complete indicator: it incorporates the nominal rate plus all associated charges (arrangement fees, processing fees, linked insurance, etc.) and is expressed on an annual basis. When comparing loans from different lenders, always look at the APR rather than the nominal rate, since a loan with a low nominal rate can end up more expensive if it carries many fees. This calculator uses the nominal rate to compute the monthly payment.",
    q2: "How is the monthly payment calculated?",
    a2: "This calculator uses the French amortisation system, the most common method for consumer loans in Spain. The formula is: payment = C · i / (1 − (1+i)^−n), where C is the loan principal, i is the monthly interest rate (annual rate divided by 12) and n is the total number of instalments (years × 12). With this system, the monthly payment is constant throughout the loan, but the split between principal and interest changes over time: in the early months you pay mostly interest and little principal, while towards the end the opposite is true.",
    q3: "What happens if I stop paying the loan?",
    a3: "If you miss a payment, the bank will charge default interest (which in Spain cannot exceed 2.5 times the legal interest rate, under the Consumer Credit Act). If missed payments continue for several months, the lender may accelerate the loan and demand the full outstanding balance immediately. Your details may also be listed in credit blacklists such as ASNEF, making it harder to obtain financing in the future. If you foresee payment difficulties, contact the bank before missing a payment — many lenders offer payment holidays or refinancing options.",
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
      <p className="text-muted-foreground mb-6">{t.subtitle}</p>

      <div className="prose prose-sm dark:prose-invert max-w-none mb-8 space-y-3 text-gray-700 dark:text-gray-300">
        <p>{t.intro1}</p>
        <p>{t.intro2}</p>
      </div>

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

      <p className="text-xs text-muted-foreground italic mt-4 mb-2">{t.disclaimer}</p>

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
