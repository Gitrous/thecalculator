import React, { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Coins } from "lucide-react";

export default function InteresCompuesto() {
  const [initial, setInitial] = useState("10000");
  const [monthly, setMonthly] = useState("200");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("20");
  
  const [results, setResults] = useState<{
    finalAmount: number;
    totalContributions: number;
    totalInterest: number;
    data: any[];
  } | null>(null);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(initial);
    const m = parseFloat(monthly);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(years);

    if (isNaN(p) || isNaN(m) || isNaN(r) || isNaN(t)) return;

    let currentAmount = p;
    let totalContrib = p;
    const data = [];

    for (let i = 0; i <= t; i++) {
      data.push({
        year: i,
        Aportaciones: totalContrib,
        Intereses: currentAmount - totalContrib,
        Total: currentAmount
      });

      // Calculate next year
      if (i < t) {
        for (let month = 1; month <= 12; month++) {
          currentAmount += m;
          currentAmount *= (1 + r / 12);
        }
        totalContrib += m * 12;
      }
    }

    setResults({
      finalAmount: currentAmount,
      totalContributions: totalContrib,
      totalInterest: currentAmount - totalContrib,
      data
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Volver al inicio
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 flex items-center gap-3">
          <Coins className="w-8 h-8 text-primary" />
          Calculadora de Interés Compuesto
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Descubre el poder del tiempo y cómo tus inversiones pueden crecer de forma exponencial.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Datos de la Inversión</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={calculate} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="initial">Capital Inicial (€)</Label>
                <Input
                  id="initial"
                  type="number"
                  value={initial}
                  onChange={(e) => setInitial(e.target.value)}
                  required
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly">Aportación Mensual (€)</Label>
                <Input
                  id="monthly"
                  type="number"
                  value={monthly}
                  onChange={(e) => setMonthly(e.target.value)}
                  required
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">Interés Anual Estimado (%)</Label>
                <Input
                  id="rate"
                  type="number"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="years">Años de Inversión</Label>
                <Input
                  id="years"
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  required
                  min="1"
                  max="100"
                />
              </div>
              <Button type="submit" className="w-full">Calcular Crecimiento</Button>
            </form>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-8">
          {results ? (
            <div className="space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Capital Final</p>
                    <p className="text-3xl font-bold text-primary">
                      {results.finalAmount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Aportado</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {results.totalContributions.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Intereses Generados</p>
                    <p className="text-2xl font-semibold text-primary">
                      +{results.totalInterest.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Proyección a lo largo del tiempo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={results.data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                        <XAxis 
                          dataKey="year" 
                          tickFormatter={(val) => `Año ${val}`} 
                          style={{ fontSize: '12px' }}
                        />
                        <YAxis 
                          tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} 
                          style={{ fontSize: '12px' }}
                        />
                        <Tooltip 
                          formatter={(value: number) => value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                          labelFormatter={(label) => `Año ${label}`}
                        />
                        <Legend />
                        <Area type="monotone" dataKey="Aportaciones" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="Intereses" stackId="1" stroke="#0FA958" fill="#0FA958" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[400px] border-dashed">
              <CardContent className="text-center text-gray-500">
                <Coins className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Introduce los datos y pulsa Calcular para ver la proyección.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="pt-12 mt-12 border-t">
        <h2 className="text-2xl font-bold mb-6">Información sobre Interés Compuesto</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>¿Qué es el interés compuesto?</AccordionTrigger>
            <AccordionContent>
              El interés compuesto es la suma de los intereses generados sobre el capital inicial más los intereses que se van acumulando con el tiempo. Es decir, los intereses generan nuevos intereses, creando un efecto de bola de nieve.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>¿Por qué es importante empezar pronto?</AccordionTrigger>
            <AccordionContent>
              El factor más importante en el interés compuesto es el tiempo. Empezar a invertir 10 años antes con cantidades menores suele resultar en un capital final mucho mayor que empezar más tarde aportando cantidades mayores.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
