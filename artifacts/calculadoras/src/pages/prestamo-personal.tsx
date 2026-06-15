import { useState } from "react";
import { Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
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

function eur(n: number): string {
  return n.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  });
}

const T = {
  es: {
    title: "Calculadora de Préstamo Personal",
    subtitle: "Calcula la cuota mensual de tu préstamo, los intereses totales y el coste final con el sistema de amortización francés.",
    cardTitle: "Datos del préstamo",
    amountLabel: "Importe (€)",
    rateLabel: "Interés anual (TIN %)",
    yearsLabel: "Plazo (años)",
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
    amountLabel: "Amount (€)",
    rateLabel: "Annual interest rate (TIN %)",
    yearsLabel: "Term (years)",
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
  const [amount, setAmount] = useState("10000");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("5");

  const P = parseFloat(amount);
  const annual = parseFloat(rate);
  const n = Math.round(parseFloat(years) * 12);

  const valid = P > 0 && annual >= 0 && n > 0;

  let monthly = 0;
  let total = 0;
  let interest = 0;
  if (valid) {
    const i = annual / 100 / 12;
    monthly = i === 0 ? P / n : (P * i) / (1 - Math.pow(1 + i, -n));
    total = monthly * n;
    interest = total - P;
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
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="amount">{t.amountLabel}</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="rate">{t.rateLabel}</Label>
            <Input
              id="rate"
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="years">{t.yearsLabel}</Label>
            <Input
              id="years"
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {valid && (
        <Card className="border-primary/30 bg-primary/5 mb-8">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground mb-1">{t.monthlyLabel}</p>
              <p className="text-4xl font-bold text-primary">{eur(monthly)}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">{t.capitalLabel}</p>
                <p className="text-lg font-semibold">{eur(P)}</p>
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
    </div>
  );
}
