import React, { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowLeft, Car } from "lucide-react";

export default function GastoCoche() {
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
      { name: "Financiación", value: costeFinanciacion, color: "#3b82f6" },
      { name: "Combustible", value: costeCombustible, color: "#ef4444" },
      { name: "Seguro", value: costeSeguro, color: "#f59e0b" },
      { name: "Mantenimiento", value: costeMantenimiento, color: "#10b981" },
      { name: "Aparcamiento", value: costeAparcamiento, color: "#8b5cf6" },
      { name: "Otros (ITV, Impuestos)", value: costeImpuesto + costeItv, color: "#6b7280" }
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
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Volver al inicio
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 flex items-center gap-3">
          <Car className="w-8 h-8 text-primary" />
          Gasto Real del Coche
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Calcula el coste total de mantener tu vehículo, incluyendo gastos ocultos y coste por kilómetro.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Gastos del Vehículo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={calculate} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Km anuales</Label>
                  <Input type="number" value={km} onChange={e => setKm(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Letra/Financiación (€/mes)</Label>
                  <Input type="number" value={financiacion} onChange={e => setFinanciacion(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Combustible (€/mes)</Label>
                  <Input type="number" value={combustible} onChange={e => setCombustible(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Aparcamiento/Garaje (€/mes)</Label>
                  <Input type="number" value={aparcamiento} onChange={e => setAparcamiento(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Seguro (€/año)</Label>
                  <Input type="number" value={seguro} onChange={e => setSeguro(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Mantenimiento (€/año)</Label>
                  <Input type="number" value={mantenimiento} onChange={e => setMantenimiento(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Impuesto de circulación (€/año)</Label>
                  <Input type="number" value={impuesto} onChange={e => setImpuesto(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>ITV (€/año)</Label>
                  <Input type="number" value={itv} onChange={e => setItv(e.target.value)} />
                </div>
              </div>
              <Button type="submit" className="w-full">Calcular Gasto Total</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {results ? (
            <div className="space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-red-50 border-red-100 dark:bg-red-950/30 dark:border-red-900/50">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Gasto Mensual Total</p>
                    <p className="text-3xl font-bold text-red-700 dark:text-red-300">
                      {results.mensual.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Coste por km</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {results.porKm.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 3 })}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Desglose de Gastos Anuales: {results.anual.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</CardTitle>
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
                <p>Introduce tus gastos para conocer el coste real de tu coche.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
