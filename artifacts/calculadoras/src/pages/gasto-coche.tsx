import React, { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Car } from "lucide-react";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { useLocale } from "@/lib/locale";

const T = {
  es: {
    backHome: "Volver al inicio",
    title: "Gasto Real del Coche",
    subtitle: "Calcula el coste total de mantener tu vehículo, incluyendo gastos ocultos y coste por kilómetro.",
    cardTitle: "Gastos del Vehículo",
    kmLabel: "Km anuales",
    financingLabel: "Letra/Financiación (€/mes)",
    fuelLabel: "Combustible (€/mes)",
    parkingLabel: "Aparcamiento/Garaje (€/mes)",
    insuranceLabel: "Seguro (€/año)",
    maintenanceLabel: "Mantenimiento (€/año)",
    taxLabel: "Impuesto de circulación (€/año)",
    MotLabel: "ITV (€/año)",
    calculateBtn: "Calcular Gasto Total",
    monthlyTotal: "Gasto Mensual Total",
    perKm: "Coste por km",
    breakdownTitle: "Desglose de Gastos Anuales",
    financing: "Financiación",
    fuel: "Combustible",
    insurance: "Seguro",
    maintenance: "Mantenimiento",
    parking: "Aparcamiento",
    other: "Otros (ITV, Impuestos)",
    placeholder: "Introduce tus gastos para conocer el coste real de tu coche.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Qué gastos incluye el coste real del coche?",
    a1: "El coste real incluye todos los gastos directos e indirectos: financiación o amortización del vehículo, combustible, seguro, mantenimiento y revisiones, aparcamiento o garaje, impuesto de circulación e ITV. Muchos conductores solo cuentan el combustible y el seguro, infravalorando el verdadero coste.",
    q2: "¿Cuánto cuesta de media mantener un coche en España?",
    a2: "Según la OCU y la DGT, el coste medio de mantenimiento de un turismo en España oscila entre 3.500 € y 6.500 € al año, dependiendo del modelo, los kilómetros recorridos y si el vehículo está financiado. El coste por kilómetro suele estar entre 0,20 € y 0,45 €.",
    q3: "¿Cuándo sale a cuenta tener coche frente al transporte público?",
    a3: "El vehículo propio resulta más económico cuando se recorren muchos kilómetros al año (más de 15.000-20.000), se vive en una zona con mala red de transporte público o se comparten trayectos. En ciudades con buenas redes de metro y autobús, el abono de transporte puede ser hasta 4 veces más barato.",
  },
  en: {
    backHome: "Back to home",
    title: "Real Car Costs",
    subtitle: "Calculate the total cost of owning your vehicle, including hidden costs and cost per kilometre.",
    cardTitle: "Vehicle Expenses",
    kmLabel: "Annual km",
    financingLabel: "Finance/Loan payment (€/month)",
    fuelLabel: "Fuel (€/month)",
    parkingLabel: "Parking/Garage (€/month)",
    insuranceLabel: "Insurance (€/year)",
    maintenanceLabel: "Maintenance (€/year)",
    taxLabel: "Vehicle tax (€/year)",
    MotLabel: "MOT/Roadworthiness test (€/year)",
    calculateBtn: "Calculate Total Cost",
    monthlyTotal: "Total Monthly Cost",
    perKm: "Cost per km",
    breakdownTitle: "Annual Expense Breakdown",
    financing: "Finance",
    fuel: "Fuel",
    insurance: "Insurance",
    maintenance: "Maintenance",
    parking: "Parking",
    other: "Other (MOT, Taxes)",
    placeholder: "Enter your expenses to find out the real cost of your car.",
    faqTitle: "Frequently asked questions",
    q1: "What expenses make up the real cost of a car?",
    a1: "The real cost includes all direct and indirect expenses: financing or depreciation, fuel, insurance, maintenance and servicing, parking or garage fees, road tax and MOT. Many drivers only count fuel and insurance, underestimating the true cost.",
    q2: "How much does it cost on average to run a car in Spain?",
    a2: "According to the OCU and DGT, the average cost of running a standard car in Spain ranges from €3,500 to €6,500 per year, depending on the model, kilometres driven and whether the vehicle is financed. The cost per kilometre is typically between €0.20 and €0.45.",
    q3: "When is owning a car cheaper than public transport?",
    a3: "A private vehicle is more economical when you cover a lot of kilometres per year (more than 15,000–20,000), you live in an area with poor public transport, or you share journeys. In cities with good metro and bus networks, a transit pass can be up to four times cheaper.",
  },
};

export default function GastoCoche() {
  const locale = useLocale();
  const t = T[locale];

  const [km, setKm] = useState("15000");
  const [financiacion, setFinanciacion] = useState("200");
  const [seguro, setSeguro] = useState("600");
  const [combustible, setCombustible] = useState("120");
  const [mantenimiento, setMantenimiento] = useState("300");
  const [impuesto, setImpuesto] = useState("100");
  const [itv, setItv] = useState("50");
  const [aparcamiento, setAparcamiento] = useState("50");

  const [results, setResults] = useState<{
    mensual: number;
    anual: number;
    porKm: number;
    breakdown: any[];
  } | null>(null);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();

    const kmAno = parseFloat(km) || 0;
    const costeFinanciacion = (parseFloat(financiacion) || 0) * 12;
    const costeSeguro = parseFloat(seguro) || 0;
    const costeCombustible = (parseFloat(combustible) || 0) * 12;
    const costeMantenimiento = parseFloat(mantenimiento) || 0;
    const costeImpuesto = parseFloat(impuesto) || 0;
    const costeItv = parseFloat(itv) || 0;
    const costeAparcamiento = (parseFloat(aparcamiento) || 0) * 12;

    const totalAnual = costeFinanciacion + costeSeguro + costeCombustible + costeMantenimiento + costeImpuesto + costeItv + costeAparcamiento;
    const totalMensual = totalAnual / 12;
    const porKm = kmAno > 0 ? totalAnual / kmAno : 0;

    const breakdown = [
      { name: t.financing, value: costeFinanciacion, color: "#3b82f6" },
      { name: t.fuel, value: costeCombustible, color: "#ef4444" },
      { name: t.insurance, value: costeSeguro, color: "#f59e0b" },
      { name: t.maintenance, value: costeMantenimiento, color: "#10b981" },
      { name: t.parking, value: costeAparcamiento, color: "#8b5cf6" },
      { name: t.other, value: costeImpuesto + costeItv, color: "#6b7280" }
    ].filter(item => item.value > 0);

    setResults({
      mensual: totalMensual,
      anual: totalAnual,
      porKm,
      breakdown
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Link href={locale === "en" ? "/en" : "/"} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> {t.backHome}
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 flex items-center gap-3">
          <Car className="w-8 h-8 text-primary" />
          {t.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{t.subtitle}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{t.cardTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={calculate} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t.kmLabel}</Label>
                  <Input type="number" value={km} onChange={e => setKm(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>{t.financingLabel}</Label>
                  <Input type="number" value={financiacion} onChange={e => setFinanciacion(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t.fuelLabel}</Label>
                  <Input type="number" value={combustible} onChange={e => setCombustible(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t.parkingLabel}</Label>
                  <Input type="number" value={aparcamiento} onChange={e => setAparcamiento(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t.insuranceLabel}</Label>
                  <Input type="number" value={seguro} onChange={e => setSeguro(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t.maintenanceLabel}</Label>
                  <Input type="number" value={mantenimiento} onChange={e => setMantenimiento(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t.taxLabel}</Label>
                  <Input type="number" value={impuesto} onChange={e => setImpuesto(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t.MotLabel}</Label>
                  <Input type="number" value={itv} onChange={e => setItv(e.target.value)} />
                </div>
              </div>
              <Button type="submit" className="w-full">{t.calculateBtn}</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {results ? (
            <div className="space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-red-50 border-red-100 dark:bg-red-950/30 dark:border-red-900/50">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">{t.monthlyTotal}</p>
                    <p className="text-3xl font-bold text-red-700 dark:text-red-300">
                      {results.mensual.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">{t.perKm}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {results.porKm.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 3 })}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t.breakdownTitle}: {results.anual.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={results.breakdown}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {results.breakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full grid grid-cols-2 gap-2 mt-4">
                    {results.breakdown.map((item) => (
                      <div key={item.name} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-gray-600">{item.name}</span>
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
                <Car className="w-12 h-12 mx-auto mb-4 opacity-20" />
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
