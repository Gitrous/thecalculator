import { useState, useRef } from "react";
import { Link } from "wouter";
import { ArrowLeft, Plus, Trash2, Zap, Lightbulb, Download } from "lucide-react";
import { downloadChart } from "@/lib/chart-download";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES, getCountry, fmtCurrency } from "@/lib/countries";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { useLocale } from "@/lib/locale";

interface Appliance {
  id: number;
  name: string;
  watts: string;
  hoursPerDay: string;
}

const APPLIANCE_COLORS = [
  { bg: "bg-emerald-100 dark:bg-emerald-900/40", icon: "text-emerald-600 dark:text-emerald-400" },
  { bg: "bg-blue-100 dark:bg-blue-900/40", icon: "text-blue-600 dark:text-blue-400" },
  { bg: "bg-purple-100 dark:bg-purple-900/40", icon: "text-purple-600 dark:text-purple-400" },
  { bg: "bg-orange-100 dark:bg-orange-900/40", icon: "text-orange-600 dark:text-orange-400" },
  { bg: "bg-pink-100 dark:bg-pink-900/40", icon: "text-pink-600 dark:text-pink-400" },
  { bg: "bg-yellow-100 dark:bg-yellow-900/40", icon: "text-yellow-600 dark:text-yellow-400" },
];

const BAR_COLORS = ["#10b981", "#3b82f6", "#a855f7", "#f97316", "#ec4899", "#eab308"];

const T = {
  es: {
    backHome: "Volver al inicio",
    title: "Calculadora de Consumo Eléctrico",
    subtitle: "Calcula el gasto eléctrico de tus electrodomésticos y encuentra oportunidades de ahorro.",
    intro1: "El consumo eléctrico del hogar representa una parte significativa de la factura mensual y conocerlo con precisión es el primer paso para reducirlo. Cada electrodoméstico tiene una potencia en vatios (W) que, multiplicada por las horas de uso diario, determina el consumo en kilovatios hora (kWh). El precio del kWh varía según el país, la comercializadora y la tarifa contratada.",
    intro2: "Esta calculadora suma el consumo de todos los electrodomésticos que introduces y te muestra el coste diario, mensual y anual. El desglose por aparato te permite identificar rápidamente cuáles son los más costosos y dónde puedes ahorrar. Especialmente útil para optimizar el uso de calefactores eléctricos, aires acondicionados y electrodomésticos de gran consumo.",
    disclaimer: "Los resultados son estimaciones basadas en la potencia nominal y el uso declarado. El consumo real puede variar. Consulta tu factura eléctrica para el precio exacto del kWh.",
    tarifaTitle: "Tarifa Eléctrica",
    countryLabel: "País",
    priceLabel: "Precio por kWh (€)",
    priceHint: "Calculado según el mercado promedio actual.",
    addAppliance: "Añadir Electrodoméstico",
    appliancePlaceholder: "Nombre del electrodoméstico",
    colWatts: "Potencia (W)",
    colHours: "Horas/día",
    resumenGasto: "Resumen de Gasto",
    consumoDiario: "Consumo Diario",
    costoMensual: "Costo Mensual Est.",
    costoAnual: "Costo Anual Est.",
    distribucion: "Distribución de Consumo",
    tipProTitle: "Tip Pro",
    tipProText: "Usa electrodomésticos de clase A+++ para reducir tu consumo hasta un 60% comparado con modelos antiguos.",
    savingsTipFn: (name: string, saving: string) =>
      `Reduce un 10% el uso de ${name} para ahorrar ${saving} al mes.`,
    emptyChart: "Añade electrodomésticos para ver la distribución.",
    howTitle: "Cómo funciona",
    howText: "Esta calculadora estima el consumo eléctrico sumando el gasto de cada electrodoméstico según su potencia en vatios (W) y las horas de uso diarias. La fórmula es:",
    formula: "kWh/día = (Vatios × Horas) / 1000",
    howText2: "Multiplica por el precio del kWh para obtener el coste. El precio medio en España en 2026 ronda los 0,12 €/kWh, aunque varía según la tarifa contratada.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Dónde encuentro la potencia de mis electrodomésticos?",
    a1: "En la etiqueta energética del aparato, en el manual o buscando el modelo en internet. También puede aparecer en la placa que suele estar en la parte trasera o inferior del electrodoméstico.",
    q2: "¿Qué electrodomésticos consumen más?",
    a2: "Los más consumidores suelen ser: calefactores eléctricos (1000-3000 W), secadoras (2000-3000 W), lavavajillas (1200-2400 W), hornos eléctricos (2000-3000 W) y aires acondicionados (800-3000 W).",
    q3: "¿Cómo puedo reducir mi factura eléctrica?",
    a3: "Algunas formas de ahorrar: usar electrodomésticos en horas valle (normalmente de 10pm a 8am), aprovechar la luz natural, usar bombillas LED, desenchufar aparatos en standby y ajustar el termostato al mínimo necesario.",
    q4: "¿El precio del kWh es siempre 0,12 €?",
    a4: "No, el precio varía según la tarifa, el comercializador y la franja horaria. Con tarifa PVPC (mercado regulado) el precio fluctúa cada hora. Con tarifa fija, el precio es constante. Consulta tu factura para saber tu precio exacto.",
  },
  en: {
    backHome: "Back to home",
    title: "Electricity Consumption Calculator",
    subtitle: "Calculate the electricity cost of your appliances and find savings opportunities.",
    intro1: "Household electricity consumption represents a significant part of the monthly bill, and knowing it precisely is the first step to reducing it. Each appliance has a power rating in watts (W) which, multiplied by daily hours of use, determines consumption in kilowatt-hours (kWh). The price per kWh varies by country, supplier and tariff contracted.",
    intro2: "This calculator adds up the consumption of all the appliances you enter and shows you the daily, monthly and annual cost. The breakdown by appliance lets you quickly identify which are the most expensive and where you can save. Particularly useful for optimising the use of electric heaters, air conditioners and high-consumption appliances.",
    disclaimer: "Results are estimates based on nominal power and declared usage. Actual consumption may vary. Check your electricity bill for the exact price per kWh.",
    tarifaTitle: "Electricity Tariff",
    countryLabel: "Country",
    priceLabel: "Price per kWh (€)",
    priceHint: "Calculated based on current average market prices.",
    addAppliance: "Add Appliance",
    appliancePlaceholder: "Appliance name",
    colWatts: "Power (W)",
    colHours: "Hours/day",
    resumenGasto: "Cost Summary",
    consumoDiario: "Daily Consumption",
    costoMensual: "Est. Monthly Cost",
    costoAnual: "Est. Annual Cost",
    distribucion: "Consumption Distribution",
    tipProTitle: "Pro Tip",
    tipProText: "Use A+++ rated appliances to reduce your consumption by up to 60% compared to older models.",
    savingsTipFn: (name: string, saving: string) =>
      `Reduce ${name} usage by 10% to save ${saving} per month.`,
    emptyChart: "Add appliances to see the distribution.",
    howTitle: "How it works",
    howText: "This calculator estimates electricity consumption by adding up the usage of each appliance based on its power in watts (W) and daily hours of use. The formula is:",
    formula: "kWh/day = (Watts × Hours) / 1000",
    howText2: "Multiply by the kWh price to get the cost. The average price in Spain in 2026 is around €0.12/kWh, although it varies depending on the contracted tariff.",
    faqTitle: "Frequently asked questions",
    q1: "Where can I find the power of my appliances?",
    a1: "On the appliance's energy label, in the manual, or by searching for the model online. It may also appear on the plate usually located on the back or bottom of the appliance.",
    q2: "Which appliances use the most electricity?",
    a2: "The biggest consumers are usually: electric heaters (1000-3000 W), tumble dryers (2000-3000 W), dishwashers (1200-2400 W), electric ovens (2000-3000 W) and air conditioners (800-3000 W).",
    q3: "How can I reduce my electricity bill?",
    a3: "Some ways to save: use appliances during off-peak hours (usually 10pm to 8am), make the most of natural light, use LED bulbs, unplug devices on standby and set the thermostat to the minimum necessary.",
    q4: "Is the kWh price always €0.12?",
    a4: "No, the price varies depending on the tariff, the supplier and the time of day. With a PVPC tariff (regulated market) the price fluctuates every hour. With a fixed tariff, the price is constant. Check your bill for your exact price.",
  },
};

export default function ConsumoElectrico() {
  const locale = useLocale();
  const t = T[locale];
  const isEn = locale === "en";
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");
  const chartRef = useRef<HTMLDivElement>(null);

  const [countryCode, setCountryCode] = useState("es");
  const [appliances, setAppliances] = useState<Appliance[]>([
    { id: 1, name: isEn ? "Fridge" : "Nevera", watts: "150", hoursPerDay: "24" },
    { id: 2, name: isEn ? "Air Conditioning" : "Aire Acondicionado", watts: "1500", hoursPerDay: "4" },
    { id: 3, name: isEn ? "LED TV" : "Televisor LED", watts: "100", hoursPerDay: "6" },
    { id: 4, name: isEn ? "Washing Machine" : "Lavadora", watts: "500", hoursPerDay: "1" },
  ]);

  const country = getCountry(countryCode);
  const [priceKwh, setPriceKwh] = useState(String(country.electricityKwh));

  const handleCountryChange = (code: string) => {
    const c = getCountry(code);
    setCountryCode(code);
    setPriceKwh(String(c.electricityKwh));
  };

  const addAppliance = () => {
    setAppliances((prev) => [
      ...prev,
      { id: Date.now(), name: "", watts: "", hoursPerDay: "" },
    ]);
  };

  const removeAppliance = (id: number) => {
    setAppliances((prev) => prev.filter((a) => a.id !== id));
  };

  const updateAppliance = (id: number, field: keyof Appliance, value: string) => {
    setAppliances((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  // Live calculation
  const price = parseFloat(priceKwh) || 0;
  const breakdown = appliances
    .filter((a) => {
      const w = parseFloat(a.watts);
      const h = parseFloat(a.hoursPerDay);
      return a.name && !isNaN(w) && w > 0 && !isNaN(h) && h > 0;
    })
    .map((a) => {
      const kwh = (parseFloat(a.watts) * parseFloat(a.hoursPerDay)) / 1000;
      return { name: a.name, kwh, cost: kwh * price };
    });

  const totalDaily = breakdown.reduce((s, b) => s + b.kwh, 0);
  const totalMonthly = totalDaily * 30 * price;
  const totalAnnual = totalDaily * 365 * price;

  const biggest = breakdown.length > 0
    ? breakdown.reduce((max, b) => (b.cost > max.cost ? b : max), breakdown[0])
    : null;

  const fmt = (n: number, dec = 2) =>
    n.toLocaleString(isEn ? "en-GB" : "es-ES", {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec,
    });

  const sym = country.currencySymbol;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link
          href={isEn ? "/en" : "/"}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.backHome}
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Zap className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
      </div>
      <p className="text-muted-foreground mb-6">{t.subtitle}</p>

      <div className="prose prose-sm dark:prose-invert max-w-none mb-8 space-y-3 text-gray-700 dark:text-gray-300">
        <p>{t.intro1}</p>
        <p>{t.intro2}</p>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* ── LEFT COLUMN ── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Tarifa section */}
          <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">{t.tarifaTitle}</span>
            </div>
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t.priceLabel}
            </Label>
            <div className="flex gap-3 mt-1">
              <div className="relative flex-1">
                <Input
                  type="number"
                  step="0.01"
                  value={priceKwh}
                  onChange={(e) => setPriceKwh(e.target.value)}
                  className="pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {sym}
                </span>
              </div>
              <Select value={countryCode} onValueChange={handleCountryChange}>
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {isEn ? c.nameEn : c.nameEs}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground italic mt-2">{t.priceHint}</p>
          </div>

          {/* Appliance list */}
          <div className="space-y-3">
            {appliances.map((a, idx) => {
              const color = APPLIANCE_COLORS[idx % APPLIANCE_COLORS.length];
              return (
                <div
                  key={a.id}
                  className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color.bg}`}
                    >
                      <Zap className={`w-5 h-5 ${color.icon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Input
                        placeholder={t.appliancePlaceholder}
                        value={a.name}
                        onChange={(e) => updateAppliance(a.id, "name", e.target.value)}
                        className="mb-3 font-semibold border-0 border-b border-gray-200 dark:border-white/10 rounded-none px-0 focus-visible:ring-0 bg-transparent"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {t.colWatts}
                          </Label>
                          <Input
                            type="number"
                            placeholder="W"
                            value={a.watts}
                            onChange={(e) => updateAppliance(a.id, "watts", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {t.colHours}
                          </Label>
                          <Input
                            type="number"
                            placeholder="h"
                            min="0"
                            max="24"
                            value={a.hoursPerDay}
                            onChange={(e) => updateAppliance(a.id, "hoursPerDay", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeAppliance(a.id)}
                      className="mt-1 text-gray-300 hover:text-red-500 dark:text-white/20 dark:hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add button */}
          <button
            onClick={addAppliance}
            className="w-full py-3.5 rounded-xl border-2 border-dashed border-gray-300 dark:border-white/20 text-sm text-gray-500 dark:text-gray-400 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-colors flex items-center justify-center gap-2 bg-white dark:bg-white/5"
          >
            <Plus className="w-4 h-4" />
            {t.addAppliance}
          </button>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="w-full lg:w-80 shrink-0 space-y-4 lg:sticky lg:top-24">

          {/* Resumen de Gasto */}
          <div className="rounded-2xl bg-gray-900 dark:bg-zinc-900 p-5 space-y-1">
            <h3 className="text-white font-semibold text-base mb-4">{t.resumenGasto}</h3>

            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <span className="text-gray-400 text-sm">{t.consumoDiario}</span>
              <div>
                <span className="text-white text-2xl font-bold">{fmt(totalDaily)}</span>
                <span className="text-gray-400 text-sm ml-1">kWh</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <span className="text-gray-400 text-sm">{t.costoMensual}</span>
              <span className="text-emerald-400 text-2xl font-bold">
                {sym} {fmt(totalMonthly)}
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-gray-400 text-sm">{t.costoAnual}</span>
              <span className="text-emerald-400 text-2xl font-bold">
                {sym} {fmt(totalAnnual)}
              </span>
            </div>

            {biggest && biggest.cost > 0 && (
              <div className="flex gap-2 bg-white/5 rounded-xl p-3 mt-2">
                <span className="text-emerald-400 text-base mt-0.5">🌱</span>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {t.savingsTipFn(biggest.name, `${sym}${fmt(biggest.cost * 30 * 0.1)}`)}
                </p>
              </div>
            )}
          </div>

          {/* Distribution chart */}
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{t.distribucion}</h3>
              <div className="flex gap-1">
                {(["bar", "pie"] as const).map((ct) => (
                  <button key={ct} onClick={() => setChartType(ct)}
                    className={`px-2 py-0.5 text-xs rounded-md font-medium transition-colors ${chartType === ct ? "bg-primary text-white" : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20"}`}>
                    {ct === "bar" ? (isEn ? "Bars" : "Barras") : (isEn ? "Pie" : "Tarta")}
                  </button>
                ))}
                <button
                  onClick={() => downloadChart(chartRef.current, "grafico-consumo-electrico")}
                  title={isEn ? "Download chart" : "Descargar gráfico"}
                  className="p-1 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            {breakdown.length > 0 ? (
              <>
                <div ref={chartRef}>
                <ResponsiveContainer width="100%" height={180}>
                  {chartType === "bar" ? (
                    <BarChart data={breakdown} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                      <Tooltip formatter={(v: number) => [`${fmt(v)} kWh`, ""]} contentStyle={{ background: "#1f2937", border: "none", borderRadius: 8, color: "#fff", fontSize: 12 }} />
                      <Bar dataKey="kwh" radius={[6, 6, 0, 0]}>
                        {breakdown.map((_, i) => (<Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />))}
                      </Bar>
                    </BarChart>
                  ) : (
                    <PieChart>
                      <Pie data={breakdown} dataKey="kwh" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={3}>
                        {breakdown.map((_, i) => (<Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />))}
                      </Pie>
                      <Tooltip formatter={(v: number) => [`${fmt(v)} kWh`, ""]} contentStyle={{ background: "#1f2937", border: "none", borderRadius: 8, color: "#fff", fontSize: 12 }} />
                    </PieChart>
                  )}
                </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-1 mt-3">
                  {breakdown.map((b, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400"
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: BAR_COLORS[i % BAR_COLORS.length] }}
                      />
                      <span className="truncate">{b.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-8">{t.emptyChart}</p>
            )}
          </div>

          {/* Tip Pro */}
          <div className="rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                {t.tipProTitle}
              </span>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
              {t.tipProText}
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground italic mt-8 mb-2">{t.disclaimer}</p>

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">{t.howTitle}</h2>
        <p className="text-muted-foreground mb-4">{t.howText}</p>
        <div className="bg-accent/50 rounded-lg p-4 font-mono text-sm mb-4">
          {t.formula}
        </div>
        <p className="text-muted-foreground">{t.howText2}</p>
      </section>

      <AdUnit slot={AD_SLOTS.midContent} className="my-10" />

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">{t.faqTitle}</h2>
        <Accordion type="single" collapsible className="w-full">
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
          <AccordionItem value="q4">
            <AccordionTrigger>{t.q4}</AccordionTrigger>
            <AccordionContent>{t.a4}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}
