import React, { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Calculator, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function IRPF() {
  const [bruto, setBruto] = useState("30000");
  const [ccaa, setCcaa] = useState("Madrid");
  const [openCcaa, setOpenCcaa] = useState(false);
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

    // Simplified IRPF logic
    const minimoPersonal = 5550;
    let baseImponible = b - minimoPersonal;
    if (baseImponible < 0) baseImponible = 0;

    let cuotaIntegral = 0;
    
    // Tramos simplificados
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

    // SS estimation
    const ss = b > 0 ? b * 0.0635 : 0;
    
    // Simplification for CCAA (adding slight variations just for simulation feel)
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Volver al inicio
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 flex items-center gap-3">
          <Calculator className="w-8 h-8 text-primary" />
          Calculadora IRPF
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Calcula tu sueldo neto y las retenciones de IRPF según tu Comunidad Autónoma.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Tus Datos</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={calculateIRPF} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bruto">Salario bruto anual (€)</Label>
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
                <Label htmlFor="ccaa">Comunidad Autónoma</Label>
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
                      {ccaa || "Selecciona una comunidad..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput
                        data-testid="input-ccaa-search"
                        placeholder="Buscar comunidad..."
                      />
                      <CommandList className="max-h-60 overflow-y-auto">
                        <CommandEmpty>No se encontró ninguna comunidad.</CommandEmpty>
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
              <Button type="submit" className="w-full">Calcular IRPF</Button>
            </form>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-8">
          {results ? (
            <div className="space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Sueldo Neto Mensual (12 pagas)</p>
                    <p className="text-3xl font-bold text-primary">
                      {results.netoMensual12.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Sueldo Neto Anual</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {results.netoAnual.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Tipo Efectivo</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {results.tipoEfectivo.toFixed(2)}%
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Comparativa Bruto vs Neto</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[{
                        name: "Salario",
                        Neto: results.netoAnual,
                        Impuestos: results.retencion,
                        SeguridadSocial: results.bruto * 0.0635
                      }]}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
                        <Tooltip 
                          formatter={(value: number) => value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        />
                        <Legend />
                        <Bar dataKey="Neto" stackId="a" fill="#0FA958" />
                        <Bar dataKey="Impuestos" stackId="a" fill="#ef4444" />
                        <Bar dataKey="SeguridadSocial" stackId="a" fill="#f59e0b" name="Seg. Social" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[400px] border-dashed">
              <CardContent className="text-center text-gray-500">
                <Calculator className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Introduce tu salario bruto para calcular tu sueldo neto y retenciones.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="pt-12 mt-12 border-t">
        <h2 className="text-2xl font-bold mb-6">Preguntas Frecuentes sobre el IRPF</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>¿Qué es el IRPF?</AccordionTrigger>
            <AccordionContent>
              El IRPF (Impuesto sobre la Renta de las Personas Físicas) es un impuesto que pagan todos los residentes en España por los ingresos obtenidos durante un año (salarios, alquileres, inversiones, etc.).
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>¿Qué diferencia hay entre salario bruto y neto?</AccordionTrigger>
            <AccordionContent>
              El salario bruto es el dinero total que la empresa te paga antes de descontar impuestos y cotizaciones. El salario neto es la cantidad final que recibes en tu cuenta bancaria tras aplicar las retenciones de IRPF y las cotizaciones a la Seguridad Social.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
