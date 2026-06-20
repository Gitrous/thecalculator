import React, { useState, useMemo } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { ArrowLeft, Calculator } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLocale } from "@/lib/locale";

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

const T = {
  es: {
    backHome: "Volver al inicio",
    title: "Simulador de Hipoteca Avanzada",
    subtitle: "Calcula la cuota mensual de tu hipoteca, los intereses totales y obtén tu cuadro de amortización completo.",
    cardTitle: "Datos del Préstamo",
    capitalLabel: "Capital prestado (€)",
    rateLabel: "Tipo de interés anual (%)",
    yearsLabel: "Plazo (años)",
    typeLabel: "Tipo de hipoteca",
    fixed: "Fija",
    variable: "Variable",
    variableNote: "Nota: El cálculo para hipoteca variable asume que el interés se mantiene constante.",
    calculateBtn: "Calcular Hipoteca",
    monthlyPayment: "Cuota Mensual",
    totalInterest: "Total Intereses",
    totalPayment: "Total a Pagar",
    chartTitle: "Evolución del Capital Pendiente",
    yearLabel: "Año",
    tableTitle: "Cuadro de Amortización",
    showMore: "Ver todo",
    showLess: "Mostrar menos",
    colMonth: "Mes",
    colPayment: "Cuota",
    colPrincipal: "Principal",
    colInterest: "Intereses",
    colBalance: "Pendiente",
    outstanding: "Capital Pendiente",
    placeholder: "Introduce los datos y pulsa Calcular para ver los resultados.",
    faqTitle: "Preguntas Frecuentes sobre Hipotecas",
    q1: "¿Qué es el sistema de amortización francés?",
    a1: "Es el sistema más utilizado en España. Se caracteriza por mantener una cuota mensual constante durante todo el préstamo (si el tipo de interés no varía). Al principio se pagan más intereses y se amortiza menos capital, y al final del préstamo ocurre lo contrario.",
    q2: "¿Es mejor una hipoteca a tipo fijo o variable?",
    a2: "Depende de tu perfil de riesgo. El tipo fijo te da seguridad de pagar siempre lo mismo, aunque suele tener un interés inicial más alto. El tipo variable (ligado al Euríbor) puede ser más barato inicialmente pero asumes el riesgo de que la cuota suba si los tipos de interés aumentan.",
    q3: "¿Qué gastos adicionales tiene comprar una casa?",
    a3: "Además del capital prestado, debes contar con gastos de compraventa (notaría, registro, gestoría, impuestos como ITP o IVA) que suelen rondar entre el 10% y el 12% del valor de la vivienda. También están los gastos de tasación y posibles comisiones de apertura de la hipoteca.",
  },
  en: {
    backHome: "Back to home",
    title: "Advanced Mortgage Simulator",
    subtitle: "Calculate your monthly mortgage payment, total interest and get your full amortisation schedule.",
    cardTitle: "Loan Details",
    capitalLabel: "Principal amount (€)",
    rateLabel: "Annual interest rate (%)",
    yearsLabel: "Term (years)",
    typeLabel: "Mortgage type",
    fixed: "Fixed",
    variable: "Variable",
    variableNote: "Note: The calculation for a variable mortgage assumes the interest rate stays constant.",
    calculateBtn: "Calculate Mortgage",
    monthlyPayment: "Monthly Payment",
    totalInterest: "Total Interest",
    totalPayment: "Total to Pay",
    chartTitle: "Outstanding Capital Evolution",
    yearLabel: "Year",
    tableTitle: "Amortisation Schedule",
    showMore: "Show all",
    showLess: "Show less",
    colMonth: "Month",
    colPayment: "Payment",
    colPrincipal: "Principal",
    colInterest: "Interest",
    colBalance: "Balance",
    outstanding: "Outstanding Balance",
    placeholder: "Enter the data and press Calculate to see the results.",
    faqTitle: "Frequently Asked Questions about Mortgages",
    q1: "What is the French amortisation system?",
    a1: "It is the most widely used system in Spain. It keeps a constant monthly payment throughout the loan (if the interest rate does not change). At the beginning you pay more interest and less capital, and at the end of the loan the opposite occurs.",
    q2: "Is a fixed or variable mortgage better?",
    a2: "It depends on your risk profile. The fixed rate gives you certainty of always paying the same amount, although it usually has a higher initial interest rate. The variable rate (linked to Euribor) may be cheaper initially but you take on the risk that the payment rises if interest rates increase.",
    q3: "What additional costs does buying a house involve?",
    a3: "In addition to the principal, you must account for purchase costs (notary, land registry, taxes such as ITP or VAT) which typically range between 10% and 12% of the property value. There are also valuation fees and possible mortgage arrangement fees.",
  },
};

export default function HipotecaAvanzada() {
  const locale = useLocale();
  const t = T[locale];

  const [capital, setCapital] = useState(150000);
  const [interestRate, setInterestRate] = useState(3.5);
  const [years, setYears] = useState(25);
  const [mortgageType, setMortgageType] = useState("fijo");
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  const results = useMemo(() => {
    const p = capital;
    const r = interestRate / 100 / 12;
    const n = years * 12;
    if (p <= 0 || n <= 0) return null;

    let monthlyPayment = 0;
    if (r === 0) {
      monthlyPayment = p / n;
    } else {
      monthlyPayment = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    let balance = p;
    let totalInterest = 0;
    const schedule: AmortizationRow[] = [];

    for (let i = 1; i <= n; i++) {
      const interestPayment = balance * r;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      if (balance < 0) balance = 0;
      totalInterest += interestPayment;
      schedule.push({ month: i, payment: monthlyPayment, principal: principalPayment, interest: interestPayment, balance });
    }

    return { monthlyPayment, totalPayment: p + totalInterest, totalInterest, schedule };
  }, [capital, interestRate, years]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link href={locale === "en" ? "/en" : "/"} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> {t.backHome}
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 flex items-center gap-3">
          <Calculator className="w-8 h-8 text-primary" />
          {t.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{t.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>{t.cardTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-7">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>{t.capitalLabel}</Label>
                <span className="text-sm font-semibold text-primary">
                  {capital.toLocaleString('es-ES')} €
                </span>
              </div>
              <Slider
                min={10000} max={1000000} step={5000}
                value={[capital]}
                onValueChange={([v]) => setCapital(v)}
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>10.000 €</span><span>1.000.000 €</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>{t.rateLabel}</Label>
                <span className="text-sm font-semibold text-primary">{interestRate.toFixed(1)} %</span>
              </div>
              <Slider
                min={0} max={15} step={0.1}
                value={[interestRate]}
                onValueChange={([v]) => setInterestRate(v)}
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0 %</span><span>15 %</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>{t.yearsLabel}</Label>
                <span className="text-sm font-semibold text-primary">{years} {locale === 'en' ? 'yr' : 'años'}</span>
              </div>
              <Slider
                min={1} max={40} step={1}
                value={[years]}
                onValueChange={([v]) => setYears(v)}
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>1</span><span>40</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label>{t.typeLabel}</Label>
              <RadioGroup value={mortgageType} onValueChange={setMortgageType} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fijo" id="fijo" />
                  <Label htmlFor="fijo" className="font-normal cursor-pointer">{t.fixed}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="variable" id="variable" />
                  <Label htmlFor="variable" className="font-normal cursor-pointer">{t.variable}</Label>
                </div>
              </RadioGroup>
              {mortgageType === 'variable' && (
                <p className="text-xs text-amber-600 mt-1">{t.variableNote}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-8">
          {results && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">{t.monthlyPayment}</p>
                    <p className="text-3xl font-bold text-primary">
                      {results.monthlyPayment.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">{t.totalInterest}</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {results.totalInterest.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">{t.totalPayment}</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {results.totalPayment.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t.chartTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={results.schedule.filter((_, i) => i % 12 === 0 || i === results.schedule.length - 1)}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                        <XAxis
                          dataKey="month"
                          tickFormatter={(val) => `${t.yearLabel} ${Math.ceil(val/12)}`}
                          style={{ fontSize: '12px' }}
                        />
                        <YAxis
                          tickFormatter={(val) => `${(val/1000).toFixed(0)}k`}
                          style={{ fontSize: '12px' }}
                        />
                        <Tooltip
                          formatter={(value: number) => value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                          labelFormatter={(label) => `${t.colMonth} ${label}`}
                        />
                        <Line type="monotone" dataKey="balance" name={t.outstanding} stroke="#0FA958" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">{t.tableTitle}</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setShowFullSchedule(!showFullSchedule)}>
                    {showFullSchedule ? t.showLess : t.showMore}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t.colMonth}</TableHead>
                          <TableHead className="text-right">{t.colPayment}</TableHead>
                          <TableHead className="text-right">{t.colPrincipal}</TableHead>
                          <TableHead className="text-right">{t.colInterest}</TableHead>
                          <TableHead className="text-right">{t.colBalance}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(showFullSchedule ? results.schedule : results.schedule.slice(0, 12)).map((row) => (
                          <TableRow key={row.month}>
                            <TableCell>{row.month}</TableCell>
                            <TableCell className="text-right font-medium">{row.payment.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</TableCell>
                            <TableCell className="text-right text-gray-600">{row.principal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</TableCell>
                            <TableCell className="text-right text-red-500">{row.interest.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</TableCell>
                            <TableCell className="text-right text-primary font-medium">{row.balance.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <AdUnit slot={AD_SLOTS.midContent} className="my-10" />

      <div className="pt-12 mt-12 border-t">
        <h2 className="text-2xl font-bold mb-6">{t.faqTitle}</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>{t.q1}</AccordionTrigger>
            <AccordionContent>{t.a1}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>{t.q2}</AccordionTrigger>
            <AccordionContent>{t.a2}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>{t.q3}</AccordionTrigger>
            <AccordionContent>{t.a3}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}
