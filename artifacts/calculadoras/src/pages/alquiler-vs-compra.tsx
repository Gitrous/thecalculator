import React, { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Home } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLocale } from "@/lib/locale";

const T = {
  es: {
    backHome: "Volver al inicio",
    title: "Alquiler vs Compra",
    subtitle: "Compara el coste real a largo plazo de comprar una vivienda frente a vivir de alquiler invirtiendo la diferencia.",
    buyTitle: "Datos de Compra",
    priceLabel: "Precio de la vivienda (€)",
    downPayLabel: "Entrada (%)",
    interestLabel: "Interés (%)",
    yearsLabel: "Años hipoteca",
    feesLabel: "Gastos e impuestos (%)",
    rentTitle: "Datos de Alquiler",
    rentLabel: "Alquiler mensual (€)",
    rentIncLabel: "Incremento anual alquiler (%)",
    investRetLabel: "Rentabilidad inversión alternativa (%)",
    compareBtn: "Comparar Opciones",
    buyBetter: "Comprar será más rentable que alquilar a partir del",
    yearLabel: "Año",
    rentBetter: "En esta simulación a 30 años,",
    rentBetterBold: "alquilar",
    rentBetterEnd: "siempre resulta financieramente más favorable.",
    chartTitle: "Evolución del Coste Neto (Acumulado - Patrimonio)",
    chartNote: "Un coste negativo significa que tu patrimonio es mayor que lo gastado.",
    netBuyCost: "Coste Neto Compra",
    netRentCost: "Coste Neto Alquiler",
    placeholder: "Introduce los datos para comparar ambas opciones a largo plazo.",
  },
  en: {
    backHome: "Back to home",
    title: "Rent vs Buy",
    subtitle: "Compare the real long-term cost of buying a home versus renting and investing the difference.",
    buyTitle: "Purchase Data",
    priceLabel: "Property price (€)",
    downPayLabel: "Down payment (%)",
    interestLabel: "Interest rate (%)",
    yearsLabel: "Mortgage years",
    feesLabel: "Fees and taxes (%)",
    rentTitle: "Rental Data",
    rentLabel: "Monthly rent (€)",
    rentIncLabel: "Annual rent increase (%)",
    investRetLabel: "Alternative investment return (%)",
    compareBtn: "Compare Options",
    buyBetter: "Buying will be more profitable than renting from",
    yearLabel: "Year",
    rentBetter: "In this 30-year simulation,",
    rentBetterBold: "renting",
    rentBetterEnd: "is always financially more favourable.",
    chartTitle: "Net Cost Evolution (Cumulative – Wealth)",
    chartNote: "A negative cost means your wealth exceeds what you have spent.",
    netBuyCost: "Net Buy Cost",
    netRentCost: "Net Rent Cost",
    placeholder: "Enter the data to compare both options over the long term.",
  },
};

export default function AlquilerVsCompra() {
  const locale = useLocale();
  const t = T[locale];

  const [precioVivienda, setPrecioVivienda] = useState("200000");
  const [entradaPerc, setEntradaPerc] = useState("20");
  const [interesHipoteca, setInteresHipoteca] = useState("3.0");
  const [anosHipoteca, setAñosHipoteca] = useState("25");
  const [gastosCompra, setGastosCompra] = useState("10");

  const [alquiler, setAlquiler] = useState("800");
  const [incrementoAlquiler, setIncrementoAlquiler] = useState("2");
  const [rentabilidadInversion, setRentabilidadInversion] = useState("5");

  const [results, setResults] = useState<{
    data: any[];
    breakEvenYear: number | null;
  } | null>(null);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();

    const pCasa = parseFloat(precioVivienda);
    const entrada = pCasa * (parseFloat(entradaPerc) / 100);
    const gastosIniciales = pCasa * (parseFloat(gastosCompra) / 100);
    const prestamo = pCasa - entrada;
    const rHipoteca = parseFloat(interesHipoteca) / 100 / 12;
    const meses = parseFloat(anosHipoteca) * 12;

    const alqInicial = parseFloat(alquiler);
    const incAlq = parseFloat(incrementoAlquiler) / 100;
    const rInv = parseFloat(rentabilidadInversion) / 100;

    let cuotaHipoteca = 0;
    if (rHipoteca > 0) {
      cuotaHipoteca = prestamo * (rHipoteca * Math.pow(1 + rHipoteca, meses)) / (Math.pow(1 + rHipoteca, meses) - 1);
    } else {
      cuotaHipoteca = prestamo / meses;
    }

    const data = [];
    let costeAcumuladoCompra = entrada + gastosIniciales;
    let costeAcumuladoAlquiler = 0;
    let inversionAlternativa = entrada + gastosIniciales;
    let alqMensual = alqInicial;

    let breakEvenYear = null;

    for (let year = 1; year <= 30; year++) {
      let pagoAnualHipoteca = 0;
      if (year <= parseFloat(anosHipoteca)) {
        pagoAnualHipoteca = cuotaHipoteca * 12;
        costeAcumuladoCompra += pagoAnualHipoteca;
      }
      const mantenimiento = pCasa * 0.01;
      costeAcumuladoCompra += mantenimiento;

      const pagoAnualAlquiler = alqMensual * 12;
      costeAcumuladoAlquiler += pagoAnualAlquiler;

      const diferencia = (pagoAnualHipoteca + mantenimiento) - pagoAnualAlquiler;
      inversionAlternativa = inversionAlternativa * (1 + rInv) + diferencia;

      alqMensual *= (1 + incAlq);

      const valorCasa = pCasa * Math.pow(1.02, year);

      let capitalPendiente = 0;
      if (year <= parseFloat(anosHipoteca)) {
        const mesesRestantes = meses - (year * 12);
        if (rHipoteca > 0) {
          capitalPendiente = cuotaHipoteca * (Math.pow(1 + rHipoteca, mesesRestantes) - 1) / (rHipoteca * Math.pow(1 + rHipoteca, mesesRestantes));
        }
      }

      const patrimonioCompra = valorCasa - capitalPendiente;
      const costeNetoCompra = costeAcumuladoCompra - patrimonioCompra;
      const costeNetoAlquiler = costeAcumuladoAlquiler - inversionAlternativa + (entrada + gastosIniciales);

      data.push({
        year,
        [t.netBuyCost]: costeNetoCompra,
        [t.netRentCost]: costeNetoAlquiler,
      });

      if (breakEvenYear === null && costeNetoCompra < costeNetoAlquiler) {
        breakEvenYear = year;
      }
    }

    setResults({ data, breakEvenYear });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Link href={locale === "en" ? "/en" : "/"} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> {t.backHome}
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 flex items-center gap-3">
          <Home className="w-8 h-8 text-primary" />
          {t.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{t.subtitle}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <form onSubmit={calculate} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.buyTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t.priceLabel}</Label>
                  <Input type="number" value={precioVivienda} onChange={e => setPrecioVivienda(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>{t.downPayLabel}</Label>
                  <Input type="number" value={entradaPerc} onChange={e => setEntradaPerc(e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t.interestLabel}</Label>
                    <Input type="number" step="0.1" value={interesHipoteca} onChange={e => setInteresHipoteca(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.yearsLabel}</Label>
                    <Input type="number" value={anosHipoteca} onChange={e => setAñosHipoteca(e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t.feesLabel}</Label>
                  <Input type="number" value={gastosCompra} onChange={e => setGastosCompra(e.target.value)} required />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.rentTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t.rentLabel}</Label>
                  <Input type="number" value={alquiler} onChange={e => setAlquiler(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>{t.rentIncLabel}</Label>
                  <Input type="number" step="0.1" value={incrementoAlquiler} onChange={e => setIncrementoAlquiler(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>{t.investRetLabel}</Label>
                  <Input type="number" step="0.1" value={rentabilidadInversion} onChange={e => setRentabilidadInversion(e.target.value)} required />
                </div>
              </CardContent>
            </Card>
            <Button type="submit" className="w-full">{t.compareBtn}</Button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {results ? (
            <div className="space-y-8 animate-in fade-in zoom-in duration-500">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  {results.breakEvenYear ? (
                    <div>
                      <p className="text-lg text-gray-800 dark:text-gray-200">{t.buyBetter}</p>
                      <p className="text-3xl font-bold text-primary mt-2">
                        {t.yearLabel} {results.breakEvenYear}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg text-gray-800 dark:text-gray-200">
                        {t.rentBetter} <span className="font-bold text-primary">{t.rentBetterBold}</span> {t.rentBetterEnd}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t.chartTitle}</CardTitle>
                  <p className="text-sm text-gray-500">{t.chartNote}</p>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={results.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                        <XAxis dataKey="year" tickFormatter={(v) => `${t.yearLabel} ${v}`} />
                        <YAxis tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
                        <Tooltip
                          formatter={(value: number) => value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                          labelFormatter={(label) => `${t.yearLabel} ${label}`}
                        />
                        <Legend />
                        <Line type="monotone" dataKey={t.netBuyCost} stroke="#0FA958" strokeWidth={3} dot={false} />
                        <Line type="monotone" dataKey={t.netRentCost} stroke="#ef4444" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[400px] border-dashed">
              <CardContent className="text-center text-gray-500">
                <Home className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>{t.placeholder}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
