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

export default function ConsumoElectrico() {
  const [appliances, setAppliances] = useState<Appliance[]>([
    { id: 1, name: "Nevera", watts: "150", hoursPerDay: "24" },
    { id: 2, name: "Lavadora", watts: "2000", hoursPerDay: "1" },
    { id: 3, name: "Televisor", watts: "100", hoursPerDay: "4" },
  ]);
  const [priceKwh, setPriceKwh] = useState("0.18");
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
    if (isNaN(price) || price <= 0) errs.push("El precio del kWh debe ser un número positivo.");
    if (appliances.length === 0) errs.push("Añade al menos un electrodoméstico.");

    const validAppliances = appliances.filter((a) => {
      const w = parseFloat(a.watts);
      const h = parseFloat(a.hoursPerDay);
      return a.name && !isNaN(w) && w > 0 && !isNaN(h) && h > 0 && h <= 24;
    });
    if (validAppliances.length === 0)
      errs.push("Al menos un electrodoméstico debe tener nombre, vatios y horas válidos.");

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
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Zap className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Calculadora de Consumo Eléctrico</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Calcula el gasto eléctrico de tus electrodomésticos y encuentra oportunidades de ahorro.
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Precio de la energía</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Label htmlFor="price-kwh">Precio por kWh (€)</Label>
              <Input
                id="price-kwh"
                data-testid="input-price-kwh"
                type="number"
                step="0.01"
                value={priceKwh}
                onChange={(e) => setPriceKwh(e.target.value)}
                placeholder="0.18"
                className="mt-1"
              />
            </div>
            <p className="text-xs text-muted-foreground pb-2">Precio medio en España ~0.18 €/kWh</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Electrodomésticos</CardTitle>
          <Button data-testid="button-add-appliance" variant="outline" size="sm" onClick={addAppliance}>
            <Plus className="h-4 w-4 mr-1" />
            Añadir
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-1 mb-1">
            <span className="col-span-5">Electrodoméstico</span>
            <span className="col-span-3">Vatios (W)</span>
            <span className="col-span-3">Horas/día</span>
            <span className="col-span-1"></span>
          </div>
          {appliances.map((a) => (
            <div key={a.id} className="grid grid-cols-12 gap-2 items-center">
              <Input
                data-testid={`input-appliance-name-${a.id}`}
                className="col-span-5"
                placeholder="Nombre"
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
        Calcular consumo
      </Button>

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">Consumo diario</p>
                <p className="text-2xl font-bold text-primary">{fmt(result.daily)} kWh</p>
                <p className="text-sm text-muted-foreground">{fmt(result.daily * parseFloat(priceKwh))} €/día</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">Coste mensual</p>
                <p className="text-2xl font-bold text-primary">{fmt(result.monthly * parseFloat(priceKwh))} €</p>
                <p className="text-sm text-muted-foreground">{fmt(result.monthly)} kWh/mes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">Coste anual</p>
                <p className="text-2xl font-bold text-primary">{fmt(result.annual * parseFloat(priceKwh))} €</p>
                <p className="text-sm text-muted-foreground">{fmt(result.annual)} kWh/año</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Consumo por electrodoméstico (kWh/día)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={result.breakdown} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-30} textAnchor="end" />
                  <YAxis tick={{ fontSize: 12 }} unit=" kWh" />
                  <Tooltip
                    formatter={(v: number) => [`${fmt(v)} kWh`, "Consumo diario"]}
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
            <CardHeader><CardTitle>Desglose por electrodoméstico</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Electrodoméstico</th>
                      <th className="text-right py-2">kWh/día</th>
                      <th className="text-right py-2">€/mes</th>
                      <th className="text-right py-2">€/año</th>
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
        <h2 className="text-xl font-semibold mb-4">Cómo funciona</h2>
        <p className="text-muted-foreground mb-4">
          Esta calculadora estima el consumo eléctrico sumando el gasto de cada electrodoméstico
          según su potencia en vatios (W) y las horas de uso diarias. La fórmula es:
        </p>
        <div className="bg-accent/50 rounded-lg p-4 font-mono text-sm mb-4">
          kWh/día = (Vatios × Horas) / 1000
        </div>
        <p className="text-muted-foreground">
          Multiplica por el precio del kWh para obtener el coste. El precio medio en España en 2024
          ronda los 0,18 €/kWh, aunque varía según la tarifa contratada.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Preguntas frecuentes</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="q1">
            <AccordionTrigger>¿Dónde encuentro la potencia de mis electrodomésticos?</AccordionTrigger>
            <AccordionContent>
              En la etiqueta energética del aparato, en el manual o buscando el modelo en internet. También puede
              aparecer en la placa que suele estar en la parte trasera o inferior del electrodoméstico.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>¿Qué electrodomésticos consumen más?</AccordionTrigger>
            <AccordionContent>
              Los más consumidores suelen ser: calefactores eléctricos (1000-3000 W), secadoras (2000-3000 W),
              lavavajillas (1200-2400 W), hornos eléctricos (2000-3000 W) y aires acondicionados (800-3000 W).
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>¿Cómo puedo reducir mi factura eléctrica?</AccordionTrigger>
            <AccordionContent>
              Algunas formas de ahorrar: usar electrodomésticos en horas valle (normalmente de 10pm a 8am),
              aprovechar la luz natural, usar bombillas LED, desenchufar aparatos en standby y ajustar el
              termostato al mínimo necesario.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q4">
            <AccordionTrigger>¿El precio del kWh es siempre 0,18 €?</AccordionTrigger>
            <AccordionContent>
              No, el precio varía según la tarifa, el comercializador y la franja horaria. Con tarifa PVPC
              (mercado regulado) el precio fluctúa cada hora. Con tarifa fija, el precio es constante.
              Consulta tu factura para saber tu precio exacto.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
