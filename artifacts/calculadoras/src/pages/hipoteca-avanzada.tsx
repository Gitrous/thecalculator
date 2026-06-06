import React, { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { ArrowLeft, Calculator } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function HipotecaAvanzada() {
  const [capital, setCapital] = useState("150000");
  const [interestRate, setInterestRate] = useState("3.5");
  const [years, setYears] = useState("25");
  const [mortgageType, setMortgageType] = useState("fijo");
  const [results, setResults] = useState<{
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
    schedule: AmortizationRow[];
  } | null>(null);
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  const calculateMortgage = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(capital);
    const r = parseFloat(interestRate) / 100 / 12;
    const n = parseFloat(years) * 12;

    if (isNaN(p) || isNaN(r) || isNaN(n) || p <= 0 || n <= 0) return;

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

      schedule.push({
        month: i,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: balance,
      });
    }

    setResults({
      monthlyPayment,
      totalPayment: p + totalInterest,
      totalInterest,
      schedule,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Volver al inicio
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 flex items-center gap-3">
          <Calculator className="w-8 h-8 text-primary" />
          Simulador de Hipoteca Avanzada
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Calcula la cuota mensual de tu hipoteca, los intereses totales y obtén tu cuadro de amortización completo.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Datos del Préstamo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={calculateMortgage} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="capital">Capital prestado (€)</Label>
                <Input
                  id="capital"
                  type="number"
                  value={capital}
                  onChange={(e) => setCapital(e.target.value)}
                  required
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interest">Tipo de interés anual (%)</Label>
                <Input
                  id="interest"
                  type="number"
                  step="0.01"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  required
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="years">Plazo (años)</Label>
                <Input
                  id="years"
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  required
                  min="1"
                  max="50"
                />
              </div>
              <div className="space-y-3">
                <Label>Tipo de hipoteca</Label>
                <RadioGroup value={mortgageType} onValueChange={setMortgageType} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fijo" id="fijo" />
                    <Label htmlFor="fijo" className="font-normal cursor-pointer">Fija</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="variable" id="variable" />
                    <Label htmlFor="variable" className="font-normal cursor-pointer">Variable</Label>
                  </div>
                </RadioGroup>
                {mortgageType === 'variable' && (
                  <p className="text-xs text-amber-600 mt-1">
                    Nota: El cálculo para hipoteca variable asume que el interés se mantiene constante.
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">Calcular Hipoteca</Button>
            </form>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-8">
          {results ? (
            <div className="space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Cuota Mensual</p>
                    <p className="text-3xl font-bold text-primary">
                      {results.monthlyPayment.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Intereses</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {results.totalInterest.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Total a Pagar</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {results.totalPayment.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Evolución del Capital Pendiente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={results.schedule.filter((_, i) => i % 12 === 0 || i === results.schedule.length - 1)}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                        <XAxis 
                          dataKey="month" 
                          tickFormatter={(val) => `Año ${Math.ceil(val/12)}`} 
                          style={{ fontSize: '12px' }}
                        />
                        <YAxis 
                          tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} 
                          style={{ fontSize: '12px' }}
                        />
                        <Tooltip 
                          formatter={(value: number) => value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                          labelFormatter={(label) => `Mes ${label}`}
                        />
                        <Line type="monotone" dataKey="balance" name="Capital Pendiente" stroke="#0FA958" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Cuadro de Amortización</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setShowFullSchedule(!showFullSchedule)}>
                    {showFullSchedule ? "Mostrar menos" : "Ver todo"}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mes</TableHead>
                          <TableHead className="text-right">Cuota</TableHead>
                          <TableHead className="text-right">Principal</TableHead>
                          <TableHead className="text-right">Intereses</TableHead>
                          <TableHead className="text-right">Pendiente</TableHead>
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
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[400px] border-dashed">
              <CardContent className="text-center text-gray-500">
                <Calculator className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Introduce los datos y pulsa Calcular para ver los resultados.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <AdUnit slot={AD_SLOTS.midContent} className="my-10" />

      <div className="pt-12 mt-12 border-t">
        <h2 className="text-2xl font-bold mb-6">Preguntas Frecuentes sobre Hipotecas</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>¿Qué es el sistema de amortización francés?</AccordionTrigger>
            <AccordionContent>
              Es el sistema más utilizado en España. Se caracteriza por mantener una cuota mensual constante durante todo el préstamo (si el tipo de interés no varía). Al principio se pagan más intereses y se amortiza menos capital, y al final del préstamo ocurre lo contrario.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>¿Es mejor una hipoteca a tipo fijo o variable?</AccordionTrigger>
            <AccordionContent>
              Depende de tu perfil de riesgo. El tipo fijo te da seguridad de pagar siempre lo mismo, aunque suele tener un interés inicial más alto. El tipo variable (ligado al Euríbor) puede ser más barato inicialmente pero asumes el riesgo de que la cuota suba si los tipos de interés aumentan.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>¿Qué gastos adicionales tiene comprar una casa?</AccordionTrigger>
            <AccordionContent>
              Además del capital prestado, debes contar con gastos de compraventa (notaría, registro, gestoría, impuestos como ITP o IVA) que suelen rondar entre el 10% y el 12% del valor de la vivienda. También están los gastos de tasación y posibles comisiones de apertura de la hipoteca.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
