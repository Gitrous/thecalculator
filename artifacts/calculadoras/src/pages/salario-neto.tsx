import React, { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ArrowLeft, Briefcase } from "lucide-react";

export default function SalarioNeto() {
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

    // Approximate IRPF
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
    { name: "Sueldo Neto", value: results.netoAnual, color: "#0FA958" },
    { name: "IRPF", value: results.irpf, color: "#ef4444" },
    { name: "Seguridad Social", value: results.ss, color: "#f59e0b" }
  ] : [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Volver al inicio
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-primary" />
          Calculadora de Salario Neto
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Descubre cuánto dinero te llegará realmente a la cuenta bancaria cada mes.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Tu Nómina</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={calculate} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bruto">Salario bruto anual (€)</Label>
                <Input
                  id="bruto"
                  type="number"
                  value={bruto}
                  onChange={(e) => setBruto(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Pagas al año</Label>
                <Select value={pagas} onValueChange={setPagas}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 pagas (Prorrateadas)</SelectItem>
                    <SelectItem value="14">14 pagas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tipo de contrato</Label>
                <Select value={contrato} onValueChange={setContrato}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indefinido">Indefinido</SelectItem>
                    <SelectItem value="temporal">Temporal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Calcular Sueldo</Button>
            </form>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-8">
          {results ? (
            <div className="space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Neto Mensual ({pagas} pagas)</p>
                    <p className="text-4xl font-bold text-primary">
                      {results.netoMensual.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Neto Anual</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {results.netoAnual.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Desglose del Salario Bruto</CardTitle>
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
                <p>Calcula tu sueldo neto completando el formulario.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
