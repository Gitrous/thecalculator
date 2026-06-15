import React, { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Briefcase } from "lucide-react";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { useLocale } from "@/lib/locale";

const T = {
  es: {
    backHome: "Volver al inicio",
    title: "Calculadora de Salario Neto",
    subtitle: "Descubre cuánto dinero te llegará realmente a la cuenta bancaria cada mes.",
    cardTitle: "Tu Nómina",
    grossLabel: "Salario bruto anual (€)",
    paymentsLabel: "Pagas al año",
    payment12: "12 pagas (Prorrateadas)",
    payment14: "14 pagas",
    contractLabel: "Tipo de contrato",
    indefinido: "Indefinido",
    temporal: "Temporal",
    calculateBtn: "Calcular Sueldo",
    monthlyNetLabel: "Neto Mensual",
    annualNetLabel: "Neto Anual",
    breakdownTitle: "Desglose del Salario Bruto",
    netSalary: "Sueldo Neto",
    incomeTax: "IRPF",
    socialSec: "Seguridad Social",
    placeholder: "Calcula tu sueldo neto completando el formulario.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Cuál es la diferencia entre salario bruto y salario neto?",
    a1: "El salario bruto es el importe total acordado con la empresa antes de cualquier deducción. El salario neto es lo que realmente recibes en tu cuenta bancaria después de descontar la retención de IRPF (impuesto sobre la renta) y la cotización a la Seguridad Social por parte del trabajador.",
    q2: "¿Qué porcentaje se descuenta por Seguridad Social al trabajador?",
    a2: "En 2024, la cotización del trabajador a la Seguridad Social es aproximadamente del 6,35 % del salario bruto (4,70 % por contingencias comunes, 1,55 % por desempleo y 0,10 % por formación profesional). Para contratos temporales el porcentaje es ligeramente superior.",
    q3: "¿Por qué el tipo de IRPF varía entre personas con el mismo sueldo?",
    a3: "El IRPF es un impuesto progresivo y personalizado. Depende de factores como la comunidad autónoma de residencia, la situación familiar (hijos, discapacidad), si tienes rentas de varios pagadores o si aplicas deducciones específicas. Por eso dos personas con el mismo salario bruto pueden tener retenciones distintas.",
  },
  en: {
    backHome: "Back to home",
    title: "Net Salary Calculator",
    subtitle: "Discover how much money will actually reach your bank account each month.",
    cardTitle: "Your Payslip",
    grossLabel: "Annual gross salary (€)",
    paymentsLabel: "Payments per year",
    payment12: "12 payments (pro-rated)",
    payment14: "14 payments",
    contractLabel: "Contract type",
    indefinido: "Permanent",
    temporal: "Temporary",
    calculateBtn: "Calculate Salary",
    monthlyNetLabel: "Monthly Net",
    annualNetLabel: "Annual Net",
    breakdownTitle: "Gross Salary Breakdown",
    netSalary: "Net Salary",
    incomeTax: "Income Tax",
    socialSec: "Social Security",
    placeholder: "Calculate your net salary by completing the form.",
    faqTitle: "Frequently asked questions",
    q1: "What is the difference between gross and net salary?",
    a1: "Gross salary is the total amount agreed with your employer before any deductions. Net salary is what you actually receive in your bank account after deducting income tax (IRPF) withholding and the employee's Social Security contributions.",
    q2: "What percentage is deducted for Social Security contributions?",
    a2: "In 2024, the employee's Social Security contribution is approximately 6.35% of gross salary (4.70% for common contingencies, 1.55% for unemployment and 0.10% for vocational training). The percentage is slightly higher for temporary contracts.",
    q3: "Why does the income tax rate vary between people with the same salary?",
    a3: "Income tax (IRPF) is a progressive and personalised tax. It depends on factors such as your autonomous community of residence, family situation (children, disability), whether you have income from multiple payers, or whether specific deductions apply. That is why two people with the same gross salary can have different withholding rates.",
  },
};

export default function SalarioNeto() {
  const locale = useLocale();
  const t = T[locale];

  const [bruto, setBruto] = useState("30000");
  const [pagas, setPagas] = useState("12");
  const [contrato, setContrato] = useState("indefinido");

  const [results, setResults] = useState<{
    netoMensual: number;
    netoAnual: number;
    ss: number;
    irpf: number;
  } | null>(null);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const b = parseFloat(bruto);
    if (isNaN(b) || b <= 0) return;

    const ssPercent = contrato === "indefinido" ? 0.0635 : 0.0640;
    const ssAmount = b * ssPercent;

    let irpfPercent = 0;
    if (b < 15000) irpfPercent = 0.02;
    else if (b < 20000) irpfPercent = 0.12;
    else if (b < 30000) irpfPercent = 0.16;
    else if (b < 45000) irpfPercent = 0.20;
    else if (b < 60000) irpfPercent = 0.25;
    else irpfPercent = 0.30;

    const irpfAmount = b * irpfPercent;
    const netoAnual = b - ssAmount - irpfAmount;
    const p = parseFloat(pagas);

    setResults({
      netoMensual: netoAnual / p,
      netoAnual,
      ss: ssAmount,
      irpf: irpfAmount
    });
  };

  const pieData = results ? [
    { name: t.netSalary, value: results.netoAnual, color: "#0FA958" },
    { name: t.incomeTax, value: results.irpf, color: "#ef4444" },
    { name: t.socialSec, value: results.ss, color: "#f59e0b" }
  ] : [];

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
            <form onSubmit={calculate} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bruto">{t.grossLabel}</Label>
                <Input
                  id="bruto"
                  type="number"
                  value={bruto}
                  onChange={(e) => setBruto(e.target.value)}
                  required
                />
              </div>
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
              <div className="space-y-2">
                <Label>{t.contractLabel}</Label>
                <Select value={contrato} onValueChange={setContrato}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indefinido">{t.indefinido}</SelectItem>
                    <SelectItem value="temporal">{t.temporal}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">{t.calculateBtn}</Button>
            </form>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-8">
          {results ? (
            <div className="space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">{t.monthlyNetLabel} ({pagas} pagas)</p>
                    <p className="text-4xl font-bold text-primary">
                      {results.netoMensual.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">{t.annualNetLabel}</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {results.netoAnual.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t.breakdownTitle}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row items-center">
                  <div className="h-[250px] w-full md:w-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full md:w-1/2 space-y-4">
                    {pieData.map((item) => (
                      <div key={item.name} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <span className="font-semibold">
                          {item.value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
