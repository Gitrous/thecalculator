import React, { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, RadialBarChart, RadialBar } from "recharts";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { ArrowLeft, Calculator, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/locale";

const T = {
  es: {
    backHome: "Volver al inicio",
    title: "Calculadora IRPF",
    subtitle: "Calcula tu sueldo neto y las retenciones de IRPF según tu Comunidad Autónoma.",
    cardTitle: "Tus Datos",
    grossLabel: "Salario bruto anual (€)",
    ccaaLabel: "Comunidad Autónoma",
    ccaaPlaceholder: "Selecciona una comunidad...",
    ccaaSearch: "Buscar comunidad...",
    ccaaNotFound: "No se encontró ninguna comunidad.",
    calculateBtn: "Calcular IRPF",
    monthlyNet12: "Sueldo Neto Mensual (12 pagas)",
    annualNet: "Sueldo Neto Anual",
    effectiveRate: "Tipo Efectivo",
    chartTitle: "Comparativa Bruto vs Neto",
    net: "Neto",
    taxes: "Impuestos",
    socialSec: "Seg. Social",
    bars: "Barras",
    horizontal: "Horizontal",
    pie: "Tarta",
    radial: "Radial",
    placeholder: "Introduce tu salario bruto para calcular tu sueldo neto y retenciones.",
    faqTitle: "Preguntas Frecuentes sobre el IRPF",
    q1: "¿Qué es el IRPF?",
    a1: "El IRPF (Impuesto sobre la Renta de las Personas Físicas) es un impuesto que pagan todos los residentes en España por los ingresos obtenidos durante un año (salarios, alquileres, inversiones, etc.).",
    q2: "¿Qué diferencia hay entre salario bruto y neto?",
    a2: "El salario bruto es el dinero total que la empresa te paga antes de descontar impuestos y cotizaciones. El salario neto es la cantidad final que recibes en tu cuenta bancaria tras aplicar las retenciones de IRPF y las cotizaciones a la Seguridad Social.",
  },
  en: {
    backHome: "Back to home",
    title: "Spanish Income Tax Calculator",
    subtitle: "Calculate your net salary and income tax withholding according to your Autonomous Community.",
    cardTitle: "Your Details",
    grossLabel: "Annual gross salary (€)",
    ccaaLabel: "Autonomous Community",
    ccaaPlaceholder: "Select a community...",
    ccaaSearch: "Search community...",
    ccaaNotFound: "No community found.",
    calculateBtn: "Calculate Income Tax",
    monthlyNet12: "Monthly Net Salary (12 payments)",
    annualNet: "Annual Net Salary",
    effectiveRate: "Effective Rate",
    chartTitle: "Gross vs Net Comparison",
    net: "Net",
    taxes: "Taxes",
    socialSec: "Soc. Security",
    bars: "Bars",
    horizontal: "Horizontal",
    pie: "Pie",
    radial: "Radial",
    placeholder: "Enter your gross salary to calculate your net salary and withholding.",
    faqTitle: "Frequently Asked Questions about Income Tax",
    q1: "What is IRPF?",
    a1: "IRPF (Impuesto sobre la Renta de las Personas Físicas) is the Spanish personal income tax paid by all residents in Spain on income earned during a year (salaries, rents, investments, etc.).",
    q2: "What is the difference between gross and net salary?",
    a2: "Gross salary is the total amount the company pays you before deducting taxes and contributions. Net salary is the final amount you receive in your bank account after applying income tax withholding and Social Security contributions.",
  },
};

export default function IRPF() {
  const locale = useLocale();
  const t = T[locale];

  const [bruto, setBruto] = useState("30000");
  const [ccaa, setCcaa] = useState("Madrid");
  const [openCcaa, setOpenCcaa] = useState(false);
  const [chartType, setChartType] = useState<"barras" | "tarta" | "horizontal" | "radial">("barras");
  const [results, setResults] = useState<{
    bruto: number;
    netoAnual: number;
    netoMensual12: number;
    retencion: number;
    tipoEfectivo: number;
  } | null>(null);

  const ccaas = [
    "Andalucía", "Aragón", "Asturias", "Baleares", "Canarias", "Cantabria",
    "Castilla-La Mancha", "Castilla y León", "Cataluña", "Extremadura",
    "Galicia", "Madrid", "Murcia", "Navarra", "País Vasco", "Rioja", "Valencia"
  ];

  const calculateIRPF = (e: React.FormEvent) => {
    e.preventDefault();
    const b = parseFloat(bruto);
    if (isNaN(b) || b <= 0) return;

    const minimoPersonal = 5550;
    let baseImponible = b - minimoPersonal;
    if (baseImponible < 0) baseImponible = 0;

    let cuotaIntegral = 0;

    if (baseImponible <= 12450) {
      cuotaIntegral = baseImponible * 0.19;
    } else if (baseImponible <= 20200) {
      cuotaIntegral = 12450 * 0.19 + (baseImponible - 12450) * 0.24;
    } else if (baseImponible <= 35200) {
      cuotaIntegral = 12450 * 0.19 + (20200 - 12450) * 0.24 + (baseImponible - 20200) * 0.30;
    } else if (baseImponible <= 60000) {
      cuotaIntegral = 12450 * 0.19 + (20200 - 12450) * 0.24 + (35200 - 20200) * 0.30 + (baseImponible - 35200) * 0.37;
    } else if (baseImponible <= 300000) {
      cuotaIntegral = 12450 * 0.19 + (20200 - 12450) * 0.24 + (35200 - 20200) * 0.30 + (60000 - 35200) * 0.37 + (baseImponible - 60000) * 0.45;
    } else {
      cuotaIntegral = 12450 * 0.19 + (20200 - 12450) * 0.24 + (35200 - 20200) * 0.30 + (60000 - 35200) * 0.37 + (300000 - 60000) * 0.45 + (baseImponible - 300000) * 0.47;
    }

    const ss = b > 0 ? b * 0.0635 : 0;

    let ajusteCCAA = 1;
    if (ccaa === "Madrid") ajusteCCAA = 0.95;
    else if (ccaa === "Cataluña") ajusteCCAA = 1.05;
    else if (ccaa === "Andalucía") ajusteCCAA = 0.98;
    else if (ccaa === "País Vasco" || ccaa === "Navarra") ajusteCCAA = 0.9;

    const retencionTotal = cuotaIntegral * ajusteCCAA;
    const netoAnual = b - retencionTotal - ss;

    setResults({
      bruto: b,
      netoAnual,
      netoMensual12: netoAnual / 12,
      retencion: retencionTotal,
      tipoEfectivo: (retencionTotal / b) * 100
    });
  };

  const chartTypeLabels: Record<"barras" | "tarta" | "horizontal" | "radial", string> = {
    barras: t.bars,
    horizontal: t.horizontal,
    tarta: t.pie,
    radial: t.radial,
  };

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
          <CardContent>
            <form onSubmit={calculateIRPF} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bruto">{t.grossLabel}</Label>
                <Input
                  id="bruto"
                  type="number"
                  value={bruto}
                  onChange={(e) => setBruto(e.target.value)}
                  required
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ccaa">{t.ccaaLabel}</Label>
                <Popover open={openCcaa} onOpenChange={setOpenCcaa}>
                  <PopoverTrigger asChild>
                    <Button
                      id="ccaa"
                      data-testid="button-ccaa-selector"
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCcaa}
                      className="w-full justify-between font-normal"
                    >
                      {ccaa || t.ccaaPlaceholder}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput
                        data-testid="input-ccaa-search"
                        placeholder={t.ccaaSearch}
                      />
                      <CommandList className="max-h-60 overflow-y-auto">
                        <CommandEmpty>{t.ccaaNotFound}</CommandEmpty>
                        <CommandGroup>
                          {ccaas.map((c) => (
                            <CommandItem
                              key={c}
                              value={c}
                              onSelect={(val) => {
                                const match = ccaas.find(x => x.toLowerCase() === val.toLowerCase()) || val;
                                setCcaa(match);
                                setOpenCcaa(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  ccaa === c ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {c}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <Button type="submit" className="w-full">{t.calculateBtn}</Button>
            </form>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-8">
          {results ? (
            <div className="space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">{t.monthlyNet12}</p>
                    <p className="text-3xl font-bold text-primary">
                      {results.netoMensual12.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">{t.annualNet}</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {results.netoAnual.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">{t.effectiveRate}</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {results.tipoEfectivo.toFixed(2)}%
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-lg">{t.chartTitle}</CardTitle>
                  <div className="flex flex-wrap gap-1 rounded-lg border p-1">
                    {(["barras", "horizontal", "tarta", "radial"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setChartType(type)}
                        className={cn(
                          "px-3 py-1 text-xs rounded-md transition-colors capitalize",
                          chartType === type
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                        )}
                      >
                        {chartTypeLabels[type]}
                      </button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === "barras" ? (
                        <BarChart data={[{
                          name: locale === "en" ? "Salary" : "Salario",
                          [t.net]: results.netoAnual,
                          [t.taxes]: results.retencion,
                          [t.socialSec]: results.bruto * 0.0635
                        }]}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                          <XAxis dataKey="name" />
                          <YAxis tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
                          <Tooltip formatter={(value: number) => value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })} />
                          <Legend />
                          <Bar dataKey={t.net} stackId="a" fill="#0FA958" />
                          <Bar dataKey={t.taxes} stackId="a" fill="#ef4444" />
                          <Bar dataKey={t.socialSec} stackId="a" fill="#f59e0b" />
                        </BarChart>
                      ) : chartType === "horizontal" ? (
                        <BarChart
                          layout="vertical"
                          data={[{
                            name: locale === "en" ? "Salary" : "Salario",
                            [t.net]: results.netoAnual,
                            [t.taxes]: results.retencion,
                            [t.socialSec]: results.bruto * 0.0635
                          }]}
                          margin={{ left: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                          <XAxis type="number" tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
                          <YAxis type="category" dataKey="name" width={55} />
                          <Tooltip formatter={(value: number) => value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })} />
                          <Legend />
                          <Bar dataKey={t.net} stackId="a" fill="#0FA958" />
                          <Bar dataKey={t.taxes} stackId="a" fill="#ef4444" />
                          <Bar dataKey={t.socialSec} stackId="a" fill="#f59e0b" />
                        </BarChart>
                      ) : chartType === "tarta" ? (
                        <PieChart>
                          <Pie
                            data={[
                              { name: t.net, value: results.netoAnual },
                              { name: t.taxes, value: results.retencion },
                              { name: t.socialSec, value: results.bruto * 0.0635 },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={110}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                            labelLine={true}
                          >
                            <Cell fill="#0FA958" />
                            <Cell fill="#ef4444" />
                            <Cell fill="#f59e0b" />
                          </Pie>
                          <Tooltip formatter={(value: number, _name: string, props: { payload?: { name?: string } }) => [value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), props.payload?.name ?? _name]} />
                          <Legend />
                        </PieChart>
                      ) : (
                        <RadialBarChart
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={120}
                          data={[
                            { name: t.socialSec, value: results.bruto * 0.0635, fill: "#f59e0b" },
                            { name: t.taxes, value: results.retencion, fill: "#ef4444" },
                            { name: t.net, value: results.netoAnual, fill: "#0FA958" },
                          ]}
                          startAngle={90}
                          endAngle={-270}
                        >
                          <RadialBar dataKey="value" label={{ position: "insideStart", fill: "#fff", fontSize: 11 }} />
                          <Tooltip formatter={(value: number, _name: string, props: { payload?: { name?: string } }) => [value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), props.payload?.name ?? _name]} />
                          <Legend />
                        </RadialBarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[400px] border-dashed">
              <CardContent className="text-center text-gray-500">
                <Calculator className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>{t.placeholder}</p>
              </CardContent>
            </Card>
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
        </Accordion>
      </div>
    </div>
  );
}
