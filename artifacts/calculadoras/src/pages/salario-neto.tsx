import React, { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Briefcase } from "lucide-react";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { COUNTRIES, getCountry, calcIncomeTax, calcSS, fmtCurrency } from "@/lib/countries";
import { useLocale } from "@/lib/locale";

const T = {
  es: {
    backHome: "Volver al inicio",
    title: "Calculadora de Salario Neto",
    subtitle: "Descubre cuánto dinero te llegará realmente a la cuenta bancaria cada mes según el país.",
    cardTitle: "Tu Nómina",
    countryLabel: "País",
    grossLabel: "Salario bruto anual",
    paymentsLabel: "Pagas al año",
    payment12: "12 pagas",
    payment14: "14 pagas (España)",
    calculateBtn: "Calcular Sueldo",
    monthlyNetLabel: "Neto Mensual",
    annualNetLabel: "Neto Anual",
    grossLabel2: "Bruto Anual",
    breakdownTitle: "Desglose del Salario Bruto",
    netSalary: "Sueldo Neto",
    incomeTax: "IRPF / Income Tax",
    socialSec: "Seguridad Social",
    placeholder: "Calcula tu sueldo neto completando el formulario.",
    approxNote: "Cálculo orientativo basado en tramos nacionales simplificados. No incluye deducciones autonómicas, personales ni regímenes especiales.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Cuál es la diferencia entre salario bruto y salario neto?",
    a1: "El salario bruto es el importe total acordado antes de deducciones. El neto es lo que recibes en cuenta después de descontar el impuesto sobre la renta y las cotizaciones sociales del trabajador.",
    q2: "¿Varía mucho la presión fiscal entre países?",
    a2: "Sí, enormemente. Países como Bélgica o los Países Bajos superan el 50% en los tramos altos. En el extremo opuesto, Singapur aplica tipos que arrancan en el 2%, y Rusia tiene un impuesto plano del 13%. EE.UU. solo refleja el impuesto federal; los impuestos estatales pueden añadir entre un 0% y un 13% adicional.",
    q3: "¿Por qué el resultado es orientativo?",
    a3: "Cada país tiene su propio sistema de deducciones personales, mínimos exentos, tramos regionales y cotizaciones especiales. Este calculador usa los tramos nacionales principales para dar una estimación rápida. Para un cálculo exacto, consulta a un asesor fiscal local.",
  },
  en: {
    backHome: "Back to home",
    title: "Net Salary Calculator",
    subtitle: "Discover how much money will actually reach your bank account each month based on your country.",
    cardTitle: "Your Payslip",
    countryLabel: "Country",
    grossLabel: "Annual gross salary",
    paymentsLabel: "Payments per year",
    payment12: "12 payments",
    payment14: "14 payments (Spain)",
    calculateBtn: "Calculate Salary",
    monthlyNetLabel: "Monthly Net",
    annualNetLabel: "Annual Net",
    grossLabel2: "Annual Gross",
    breakdownTitle: "Gross Salary Breakdown",
    netSalary: "Net Salary",
    incomeTax: "Income Tax",
    socialSec: "Social Security",
    placeholder: "Calculate your net salary by completing the form.",
    approxNote: "Indicative calculation based on simplified national brackets. Does not include regional, personal deductions or special regimes.",
    faqTitle: "Frequently asked questions",
    q1: "What is the difference between gross and net salary?",
    a1: "Gross salary is the total amount agreed before any deductions. Net salary is what you actually receive in your account after deducting income tax and employee social contributions.",
    q2: "Does the tax burden vary a lot between countries?",
    a2: "Yes, enormously. Countries like Belgium or the Netherlands exceed 50% at higher brackets. At the other end, Singapore starts at 2%, and Russia has a flat 13% rate. The US only reflects federal tax; state taxes can add 0–13% on top.",
    q3: "Why is the result indicative?",
    a3: "Each country has its own personal deductions, exempt minimums, regional brackets and special contributions. This calculator uses the main national brackets for a quick estimate. For an exact calculation, consult a local tax adviser.",
  },
};

export default function SalarioNeto() {
  const locale = useLocale();
  const t = T[locale];

  const [countryCode, setCountryCode] = useState("es");
  const country = getCountry(countryCode);

  const [bruto, setBruto] = useState(String(country.defaultSalary));
  const [pagas, setPagas] = useState("12");

  const handleCountryChange = (code: string) => {
    const c = getCountry(code);
    setCountryCode(code);
    setBruto(String(c.defaultSalary));
    setResults(null);
  };

  const [results, setResults] = useState<{
    netoMensual: number;
    netoAnual: number;
    ss: number;
    tax: number;
  } | null>(null);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const b = parseFloat(bruto);
    if (isNaN(b) || b <= 0) return;

    const taxAmount = calcIncomeTax(b, country.incomeTaxBrackets);
    const ssAmount = calcSS(b, country.ssRate, country.ssCap);
    const netoAnual = b - taxAmount - ssAmount;
    const p = parseFloat(pagas);

    setResults({
      netoMensual: netoAnual / p,
      netoAnual,
      ss: ssAmount,
      tax: taxAmount,
    });
  };

  const fmt = (n: number) => fmtCurrency(n, country.currency, country.numberLocale);

  const pieData = results ? [
    { name: t.netSalary, value: results.netoAnual, color: "#0FA958" },
    { name: t.incomeTax, value: results.tax, color: "#ef4444" },
    { name: t.socialSec, value: results.ss, color: "#f59e0b" },
  ].filter((d) => d.value > 0) : [];

  const isSpain = countryCode === "es";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link href={locale === "en" ? "/en" : "/"} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> {t.backHome}
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-primary" />
          {t.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{t.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>{t.cardTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={calculate} className="space-y-5">
              <div className="space-y-2">
                <Label>{t.countryLabel}</Label>
                <Select value={countryCode} onValueChange={handleCountryChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {locale === "es" ? c.nameEs : c.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bruto">
                  {t.grossLabel} ({country.currencySymbol})
                </Label>
                <Input
                  id="bruto"
                  type="number"
                  value={bruto}
                  onChange={(e) => setBruto(e.target.value)}
                  required
                />
              </div>

              {isSpain && (
                <div className="space-y-2">
                  <Label>{t.paymentsLabel}</Label>
                  <Select value={pagas} onValueChange={setPagas}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">{t.payment12}</SelectItem>
                      <SelectItem value="14">{t.payment14}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button type="submit" className="w-full">{t.calculateBtn}</Button>
            </form>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          {results ? (
            <div className="space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      {t.monthlyNetLabel} ({isSpain ? pagas : "12"} {locale === "es" ? "pagas" : "payments"})
                    </p>
                    <p className="text-4xl font-bold text-primary">{fmt(results.netoMensual)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">{t.annualNetLabel}</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">{fmt(results.netoAnual)}</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t.breakdownTitle} — {fmt(parseFloat(bruto))}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row items-center gap-4">
                  <div className="h-[220px] w-full md:w-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="value">
                          {pieData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: number) => fmt(v)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full md:w-1/2 space-y-3">
                    {pieData.map((item) => (
                      <div key={item.name} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <span className="font-semibold text-sm">{fmt(item.value)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <p className="text-xs text-muted-foreground">{t.approxNote}</p>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[300px] border-dashed">
              <CardContent className="text-center text-gray-500">
                <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>{t.placeholder}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

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
