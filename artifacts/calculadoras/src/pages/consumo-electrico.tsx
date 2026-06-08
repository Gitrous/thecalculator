import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Plus, Trash2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useLocale } from "@/lib/locale";

interface Appliance {
  id: number;
  name: string;
  watts: string;
  hoursPerDay: string;
}

interface Result {
  daily: number;
  monthly: number;
  annual: number;
  breakdown: { name: string; kwh: number; cost: number }[];
}

const COLORS = ["#0FA958", "#0C7A42", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5"];

const T = {
  es: {
    backHome: "Volver al inicio",
    title: "Calculadora de Consumo Eléctrico",
    subtitle: "Calcula el gasto eléctrico de tus electrodomésticos y encuentra oportunidades de ahorro.",
    priceCardTitle: "Precio de la energía",
    priceLabel: "Precio por kWh (€)",
    priceHint: "Precio medio en España ~0.12 €/kWh",
    appliancesCardTitle: "Electrodomésticos",
    addBtn: "Añadir",
    colAppliance: "Electrodoméstico",
    colWatts: "Vatios (W)",
    colHours: "Horas/día",
    appliancePlaceholder: "Nombre",
    dailyLabelDefault: "Lunes",
    errPrice: "El precio del kWh debe ser un número positivo.",
    errNoAppliances: "Añade al menos un electrodoméstico.",
    errInvalidAppliance: "Al menos un electrodoméstico debe tener nombre, vatios y horas válidos.",
    calculateBtn: "Calcular consumo",
    dailyConsumption: "Consumo diario",
    monthlyCost: "Coste mensual",
    annualCost: "Coste anual",
    chartTitle: "Consumo por electrodoméstico (kWh/día)",
    tableTitle: "Desglose por electrodoméstico",
    colKwh: "kWh/día",
    colMonthCost: "€/mes",
    colYearCost: "€/año",
    dailyChartLabel: "Consumo diario",
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
    priceCardTitle: "Energy price",
    priceLabel: "Price per kWh (€)",
    priceHint: "Average price in Spain ~0.12 €/kWh",
    appliancesCardTitle: "Appliances",
    addBtn: "Add",
    colAppliance: "Appliance",
    colWatts: "Watts (W)",
    colHours: "Hours/day",
    appliancePlaceholder: "Name",
    dailyLabelDefault: "Monday",
    errPrice: "The kWh price must be a positive number.",
    errNoAppliances: "Add at least one appliance.",
    errInvalidAppliance: "At least one appliance must have a valid name, watts and hours.",
    calculateBtn: "Calculate consumption",
    dailyConsumption: "Daily consumption",
    monthlyCost: "Monthly cost",
    annualCost: "Annual cost",
    chartTitle: "Consumption per appliance (kWh/day)",
    tableTitle: "Breakdown by appliance",
    colKwh: "kWh/day",
    colMonthCost: "€/month",
    colYearCost: "€/year",
    dailyChartLabel: "Daily consumption",
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
  const [appliances, setAppliances] = useState<Appliance[]>([
    { id: 1, name: "Nevera", watts: "150", hoursPerDay: "24" },
    { id: 2, name: "Lavadora", watts: "2000", hoursPerDay: "1" },
    { id: 3, name: "Televisor", watts: "100", hoursPerDay: "4" },
  ]);
  const [priceKwh, setPriceKwh] = useState("0.12");
  const [result, setResult] = useState<Result | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

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

  const calculate = () => {
    const errs: string[] = [];
    const price = parseFloat(priceKwh);
    if (isNaN(price) || price <= 0) errs.push(t.errPrice);
    if (appliances.length === 0) errs.push(t.errNoAppliances);

    const validAppliances = appliances.filter((a) => {
      const w = parseFloat(a.watts);
      const h = parseFloat(a.hoursPerDay);
      return a.name && !isNaN(w) && w > 0 && !isNaN(h) && h > 0 && h <= 24;
    });
    if (validAppliances.length === 0)
      errs.push(t.errInvalidAppliance);

    setErrors(errs);
    if (errs.length > 0) return;

    const breakdown = validAppliances.map((a) => {
      const w = parseFloat(a.watts);
      const h = parseFloat(a.hoursPerDay);
      const kwhPerDay = (w * h) / 1000;
      return { name: a.name, kwh: kwhPerDay, cost: kwhPerDay * price };
    });

    const daily = breakdown.reduce((s, b) => s + b.kwh, 0);
    setResult({ daily, monthly: daily * 30, annual: daily * 365, breakdown });
  };

  const fmt = (n: number, dec = 2) =>
    n.toLocaleString("es-ES", { minimumFractionDigits: dec, maximumFractionDigits: dec });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href={locale === "en" ? "/en" : "/"} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
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
      <p className="text-muted-foreground mb-8">{t.subtitle}</p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t.priceCardTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label htmlFor="price-kwh">{t.priceLabel}</Label>
              <Input
                id="price-kwh"
                data-testid="input-price-kwh"
                type="number"
                step="0.01"
                value={priceKwh}
                onChange={(e) => setPriceKwh(e.target.value)}
                placeholder="0.12"
                className="mt-1"
              />
            </div>
            <p className="text-xs text-muted-foreground pb-2">{t.priceHint}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t.appliancesCardTitle}</CardTitle>
          <Button data-testid="button-add-appliance" variant="outline" size="sm" onClick={addAppliance}>
            <Plus className="h-4 w-4 mr-1" />
            {t.addBtn}
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-1 mb-1">
            <span className="col-span-5">{t.colAppliance}</span>
            <span className="col-span-3">{t.colWatts}</span>
            <span className="col-span-3">{t.colHours}</span>
            <span className="col-span-1"></span>
          </div>
          {appliances.map((a) => (
            <div key={a.id} className="grid grid-cols-12 gap-2 items-center">
              <Input
                data-testid={`input-appliance-name-${a.id}`}
                className="col-span-5"
                placeholder={t.appliancePlaceholder}
                value={a.name}
                onChange={(e) => updateAppliance(a.id, "name", e.target.value)}
              />
              <Input
                data-testid={`input-appliance-watts-${a.id}`}
                className="col-span-3"
                type="number"
                placeholder="W"
                value={a.watts}
                onChange={(e) => updateAppliance(a.id, "watts", e.target.value)}
              />
              <Input
                data-testid={`input-appliance-hours-${a.id}`}
                className="col-span-3"
                type="number"
                placeholder="h"
                min="0"
                max="24"
                value={a.hoursPerDay}
                onChange={(e) => updateAppliance(a.id, "hoursPerDay", e.target.value)}
              />
              <Button
                data-testid={`button-remove-appliance-${a.id}`}
                variant="ghost"
                size="icon"
                className="col-span-1 text-muted-foreground hover:text-destructive"
                onClick={() => removeAppliance(a.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {errors.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-4">
          {errors.map((e, i) => (
            <p key={i} className="text-sm text-destructive">{e}</p>
          ))}
        </div>
      )}

      <Button data-testid="button-calculate" onClick={calculate} className="w-full mb-8" size="lg">
        {t.calculateBtn}
      </Button>

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">{t.dailyConsumption}</p>
                <p className="text-2xl font-bold text-primary">{fmt(result.daily)} kWh</p>
                <p className="text-sm text-muted-foreground">{fmt(result.daily * parseFloat(priceKwh))} €/día</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">{t.monthlyCost}</p>
                <p className="text-2xl font-bold text-primary">{fmt(result.monthly * parseFloat(priceKwh))} €</p>
                <p className="text-sm text-muted-foreground">{fmt(result.monthly)} kWh/mes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">{t.annualCost}</p>
                <p className="text-2xl font-bold text-primary">{fmt(result.annual * parseFloat(priceKwh))} €</p>
                <p className="text-sm text-muted-foreground">{fmt(result.annual)} kWh/año</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t.chartTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={result.breakdown} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-30} textAnchor="end" />
                  <YAxis tick={{ fontSize: 12 }} unit=" kWh" />
                  <Tooltip
                    formatter={(v: number) => [`${fmt(v)} kWh`, t.dailyChartLabel]}
                  />
                  <Bar dataKey="kwh" radius={[4, 4, 0, 0]}>
                    {result.breakdown.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>{t.tableTitle}</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">{t.colAppliance}</th>
                      <th className="text-right py-2">{t.colKwh}</th>
                      <th className="text-right py-2">{t.colMonthCost}</th>
                      <th className="text-right py-2">{t.colYearCost}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.breakdown.map((b, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2 font-medium">{b.name}</td>
                        <td className="text-right py-2">{fmt(b.kwh)}</td>
                        <td className="text-right py-2">{fmt(b.cost * 30)}</td>
                        <td className="text-right py-2">{fmt(b.cost * 365)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">{t.howTitle}</h2>
        <p className="text-muted-foreground mb-4">{t.howText}</p>
        <div className="bg-accent/50 rounded-lg p-4 font-mono text-sm mb-4">
          {t.formula}
        </div>
        <p className="text-muted-foreground">{t.howText2}</p>
      </section>

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
    </div>
  );
}
