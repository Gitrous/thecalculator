import React, { useState, useMemo, useRef } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { ArrowLeft, Calculator, Download } from "lucide-react";
import { downloadChart } from "@/lib/chart-download";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLocale } from "@/lib/locale";

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

const T = {
  es: {
    backHome: "Volver al inicio",
    title: "Simulador de Hipoteca Avanzada",
    subtitle: "Calcula la cuota mensual de tu hipoteca, los intereses totales y obtén tu cuadro de amortización completo.",
    intro1: "Una hipoteca es el préstamo a largo plazo más importante que contratará la mayoría de familias a lo largo de su vida. El simulador avanzado te permite calcular la cuota mensual exacta, el total de intereses pagados y visualizar el cuadro de amortización completo, mes a mes. El sistema de amortización francés, que es el más habitual en España, mantiene la cuota constante a lo largo del tiempo aunque el peso de capital e intereses varía cada mes.",
    intro2: "La calculadora diferencia entre hipoteca fija y variable. En la variable, el cálculo asume un tipo de interés constante (el que introduces tú) para proyectar las cuotas, aunque en la práctica el Euríbor cambia cada año en la revisión. Esto te permite hacer una estimación realista y comparar distintos escenarios antes de firmar con el banco.",
    disclaimer: "Los resultados son orientativos. Consulta siempre la FEIN y la FIAE que te entrega el banco antes de firmar cualquier hipoteca.",
    cardTitle: "Datos del Préstamo",
    capitalLabel: "Capital prestado (€)",
    rateLabel: "Tipo de interés anual (%)",
    yearsLabel: "Plazo (años)",
    typeLabel: "Tipo de hipoteca",
    fixed: "Fija",
    variable: "Variable",
    variableNote: "Nota: El cálculo para hipoteca variable asume que el interés se mantiene constante.",
    calculateBtn: "Calcular Hipoteca",
    monthlyPayment: "Cuota Mensual",
    totalInterest: "Total Intereses",
    totalPayment: "Total a Pagar",
    chartTitle: "Evolución del Capital Pendiente",
    yearLabel: "Año",
    tableTitle: "Cuadro de Amortización",
    showMore: "Ver todo",
    showLess: "Mostrar menos",
    colMonth: "Mes",
    colPayment: "Cuota",
    colPrincipal: "Principal",
    colInterest: "Intereses",
    colBalance: "Pendiente",
    outstanding: "Capital Pendiente",
    placeholder: "Introduce los datos y pulsa Calcular para ver los resultados.",
    faqTitle: "Preguntas Frecuentes sobre Hipotecas",
    q1: "¿Qué es el sistema de amortización francés?",
    a1: "Es el sistema más utilizado en España. Se caracteriza por mantener una cuota mensual constante durante todo el préstamo (si el tipo de interés no varía). Al principio se pagan más intereses y se amortiza menos capital, y al final del préstamo ocurre lo contrario.",
    q2: "¿Es mejor una hipoteca a tipo fijo o variable?",
    a2: "Depende de tu perfil de riesgo. El tipo fijo te da seguridad de pagar siempre lo mismo, aunque suele tener un interés inicial más alto. El tipo variable (ligado al Euríbor) puede ser más barato inicialmente pero asumes el riesgo de que la cuota suba si los tipos de interés aumentan.",
    q3: "¿Qué gastos adicionales tiene comprar una casa?",
    a3: "Además del capital prestado, debes contar con gastos de compraventa (notaría, registro, gestoría, impuestos como ITP o IVA) que suelen rondar entre el 10% y el 12% del valor de la vivienda. También están los gastos de tasación y posibles comisiones de apertura de la hipoteca.",
    q4: "¿Cuánto puedo pedir según mis ingresos?",
    a4: "La referencia que aplican los bancos es que la cuota mensual no supere el 30-35 % de tus ingresos netos, sumando cualquier otra deuda que tengas. Con unos ingresos netos de 2.500 € al mes, eso significa una cuota máxima en torno a 875 €, lo que al 3 % a treinta años permite una hipoteca de unos 207.000 €. A esa capacidad hay que añadir que las entidades financian normalmente el 80 % del valor de tasación, por lo que necesitarás aportar el 20 % restante más los gastos de compraventa. La antigüedad laboral, el tipo de contrato y la existencia de avales también influyen en la decisión final.",
    q5: "¿Qué es el Euríbor y cómo afecta a mi cuota?",
    a5: "El Euríbor es el tipo de interés medio al que las principales entidades europeas se prestan dinero entre sí, y funciona como índice de referencia para la mayoría de hipotecas variables en España. En una hipoteca variable, tu tipo se calcula sumando el Euríbor vigente más un diferencial fijo pactado en la escritura, por ejemplo Euríbor + 0,9 %. La revisión se hace normalmente cada seis o doce meses, momento en que la cuota se recalcula con el nuevo valor del índice. Por eso una hipoteca variable puede encarecerse de forma notable si el Euríbor sube: un incremento de un punto sobre 200.000 € a treinta años añade en torno a 110 € a la cuota mensual.",
    deepTitle: "Cómo funciona el sistema de amortización francés",
    deep: "Es el método utilizado por prácticamente todas las hipotecas en España y se caracteriza por una cuota mensual constante durante toda la vida del préstamo. Lo que varía mes a mes es su composición interna. Cada mes se calculan primero los intereses aplicando el tipo mensual al capital pendiente; el resto de la cuota se destina a amortizar principal. Como el capital pendiente disminuye con cada pago, los intereses del mes siguiente son menores y la parte destinada a amortizar aumenta. El resultado es que al principio del préstamo pagas sobre todo intereses y muy poco capital, mientras que en los últimos años ocurre lo contrario. Esa es la razón por la que amortizar anticipadamente resulta mucho más rentable en los primeros años.",
    exampleTitle: "Ejemplo resuelto",
    example: "Para una hipoteca de 200.000 € al 3 % a 30 años, la cuota mensual es de unos 843 €. En el primer recibo, los intereses son 200.000 × 0,03 / 12 = 500 €, de modo que solo 343 € amortizan capital. Diez años después, con un capital pendiente cercano a 152.000 €, los intereses del mes bajan a unos 380 € y la amortización sube a 463 €. En el último año de la hipoteca, prácticamente la totalidad de la cuota se destina a capital. A lo largo de los treinta años habrás pagado unos 103.500 € solo en intereses.",
    refTableTitle: "Cuota e intereses según el plazo (200.000 € al 3 %)",
    tableCol1: "Plazo",
    tableCol2: "Cuota mensual",
    tableCol3: "Intereses totales",
    interpretTitle: "Cómo interpretar el cuadro de amortización",
    interpret: "El cuadro te permite ver con exactitud cuánto debes en cada momento, algo imprescindible si te planteas amortizar anticipadamente o vender la vivienda antes de terminar de pagarla. Fíjate especialmente en la columna de capital pendiente: mucha gente se sorprende al comprobar que después de diez años pagando todavía debe más del 75 % del préstamo original. Compara también el total de intereses entre distintos plazos: alargar de veinte a treinta años reduce la cuota unos 266 € al mes pero encarece el préstamo en más de 37.000 €. Como regla práctica, elige el plazo más corto que tu presupuesto soporte con holgura, y recuerda que siempre puedes amortizar anticipadamente si tu situación mejora.",
  },
  en: {
    backHome: "Back to home",
    title: "Advanced Mortgage Simulator",
    subtitle: "Calculate your monthly mortgage payment, total interest and get your full amortisation schedule.",
    intro1: "A mortgage is the most important long-term loan most families will ever take out. The advanced simulator lets you calculate the exact monthly payment, total interest paid and visualise the full amortisation schedule, month by month. The French amortisation system, the most common in Spain, keeps the monthly payment constant throughout the loan although the split between principal and interest changes each month.",
    intro2: "The calculator distinguishes between fixed and variable rate mortgages. For variable mortgages, the calculation assumes a constant interest rate (the one you enter) to project the payments, although in practice the Euribor changes at each annual review. This lets you make a realistic estimate and compare different scenarios before signing with the bank.",
    disclaimer: "Results are indicative. Always consult the FEIN and FIAE documents your bank provides before signing any mortgage.",
    cardTitle: "Loan Details",
    capitalLabel: "Principal amount (€)",
    rateLabel: "Annual interest rate (%)",
    yearsLabel: "Term (years)",
    typeLabel: "Mortgage type",
    fixed: "Fixed",
    variable: "Variable",
    variableNote: "Note: The calculation for a variable mortgage assumes the interest rate stays constant.",
    calculateBtn: "Calculate Mortgage",
    monthlyPayment: "Monthly Payment",
    totalInterest: "Total Interest",
    totalPayment: "Total to Pay",
    chartTitle: "Outstanding Capital Evolution",
    yearLabel: "Year",
    tableTitle: "Amortisation Schedule",
    showMore: "Show all",
    showLess: "Show less",
    colMonth: "Month",
    colPayment: "Payment",
    colPrincipal: "Principal",
    colInterest: "Interest",
    colBalance: "Balance",
    outstanding: "Outstanding Balance",
    placeholder: "Enter the data and press Calculate to see the results.",
    faqTitle: "Frequently Asked Questions about Mortgages",
    q1: "What is the French amortisation system?",
    a1: "It is the most widely used system in Spain. It keeps a constant monthly payment throughout the loan (if the interest rate does not change). At the beginning you pay more interest and less capital, and at the end of the loan the opposite occurs.",
    q2: "Is a fixed or variable mortgage better?",
    a2: "It depends on your risk profile. The fixed rate gives you certainty of always paying the same amount, although it usually has a higher initial interest rate. The variable rate (linked to Euribor) may be cheaper initially but you take on the risk that the payment rises if interest rates increase.",
    q3: "What additional costs does buying a house involve?",
    a3: "In addition to the principal, you must account for purchase costs (notary, land registry, taxes such as ITP or VAT) which typically range between 10% and 12% of the property value. There are also valuation fees and possible mortgage arrangement fees.",
    q4: "How much can I borrow based on my income?",
    a4: "The benchmark banks apply is that the monthly payment should not exceed 30-35% of your net income, including any other debt you have. On a net income of €2,500 a month, that means a maximum payment of around €875, which at 3% over thirty years allows a mortgage of about €207,000. On top of that capacity, lenders normally finance 80% of the appraised value, so you will need to contribute the remaining 20% plus the transaction costs. Length of employment, type of contract and the availability of guarantors also influence the final decision.",
    q5: "What is the Euribor and how does it affect my payment?",
    a5: "The Euribor is the average interest rate at which major European banks lend to each other, and it serves as the reference index for most variable-rate mortgages in Spain. On a variable mortgage, your rate is calculated by adding the current Euribor to a fixed spread agreed in the deed, for example Euribor + 0.9%. The review is normally done every six or twelve months, at which point the payment is recalculated with the new index value. That is why a variable mortgage can become considerably more expensive if the Euribor rises: a one-point increase on €200,000 over thirty years adds around €110 to the monthly payment.",
    deepTitle: "How the French amortisation system works",
    deep: "This is the method used by practically all mortgages in Spain and is characterised by a constant monthly payment throughout the life of the loan. What varies month to month is its internal composition. Each month the interest is calculated first by applying the monthly rate to the outstanding capital; the rest of the payment goes towards repaying principal. Since the outstanding capital falls with each payment, the following month's interest is lower and the portion repaying principal rises. The result is that at the start of the loan you pay mostly interest and very little capital, while in the final years the opposite happens. That is why early repayment is far more profitable in the first years.",
    exampleTitle: "Worked example",
    example: "For a €200,000 mortgage at 3% over 30 years, the monthly payment is about €843. On the first instalment, interest is 200,000 × 0.03 / 12 = €500, so only €343 repays capital. Ten years later, with outstanding capital near €152,000, the month's interest falls to about €380 and repayment rises to €463. In the mortgage's final year, virtually the entire payment goes to capital. Over the thirty years you will have paid roughly €103,500 in interest alone.",
    refTableTitle: "Payment and interest by term (€200,000 at 3%)",
    tableCol1: "Term",
    tableCol2: "Monthly payment",
    tableCol3: "Total interest",
    interpretTitle: "How to read the amortisation schedule",
    interpret: "The schedule lets you see exactly how much you owe at any point, which is essential if you are considering early repayment or selling the property before paying it off. Pay particular attention to the outstanding capital column: many people are surprised to find that after ten years of payments they still owe more than 75% of the original loan. Compare the total interest across different terms too: extending from twenty to thirty years reduces the payment by about €266 a month but makes the loan more than €37,000 more expensive. As a practical rule, choose the shortest term your budget can comfortably bear, and remember you can always repay early if your situation improves.",
  },
};

const MORTGAGE_TABLE = [
  { es: "15 años", en: "15 years", cuota: "1.381 €", int: "48.598 €" },
  { es: "20 años", en: "20 years", cuota: "1.109 €", int: "66.208 €" },
  { es: "25 años", en: "25 years", cuota: "948 €", int: "84.520 €" },
  { es: "30 años", en: "30 years", cuota: "843 €", int: "103.552 €" },
  { es: "35 años", en: "35 years", cuota: "770 €", int: "123.274 €" },
  { es: "40 años", en: "40 years", cuota: "716 €", int: "143.632 €" },
];

export default function HipotecaAvanzada() {
  const locale = useLocale();
  const isEn = locale === "en";
  const t = T[locale];
  const [chartType, setChartType] = useState<"line" | "area" | "bar">("line");
  const chartRef = useRef<HTMLDivElement>(null);

  const [capital, setCapital] = useState(150000);
  const [interestRate, setInterestRate] = useState(3.5);
  const [years, setYears] = useState(25);
  const [mortgageType, setMortgageType] = useState("fijo");
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  const results = useMemo(() => {
    const p = capital;
    const r = interestRate / 100 / 12;
    const n = years * 12;
    if (p <= 0 || n <= 0) return null;

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
      schedule.push({ month: i, payment: monthlyPayment, principal: principalPayment, interest: interestPayment, balance });
    }

    return { monthlyPayment, totalPayment: p + totalInterest, totalInterest, schedule };
  }, [capital, interestRate, years]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link href={locale === "en" ? "/en" : "/"} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> {t.backHome}
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 flex items-center gap-3">
          <Calculator className="w-8 h-8 text-primary" />
          {t.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{t.subtitle}</p>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none my-6 space-y-3 text-gray-700 dark:text-gray-300">
        <p>{t.intro1}</p>
        <p>{t.intro2}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <Card className="w-full md:w-72 shrink-0">
          <CardHeader>
            <CardTitle>{t.cardTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-7">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>{t.capitalLabel}</Label>
                <span className="text-sm font-semibold text-primary">
                  {capital.toLocaleString('es-ES')} €
                </span>
              </div>
              <Slider
                min={10000} max={1000000} step={5000}
                value={[capital]}
                onValueChange={([v]) => setCapital(v)}
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>10.000 €</span><span>1.000.000 €</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>{t.rateLabel}</Label>
                <span className="text-sm font-semibold text-primary">{interestRate.toFixed(1)} %</span>
              </div>
              <Slider
                min={0} max={15} step={0.1}
                value={[interestRate]}
                onValueChange={([v]) => setInterestRate(v)}
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>0 %</span><span>15 %</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>{t.yearsLabel}</Label>
                <span className="text-sm font-semibold text-primary">{years} {locale === 'en' ? 'yr' : 'años'}</span>
              </div>
              <Slider
                min={1} max={40} step={1}
                value={[years]}
                onValueChange={([v]) => setYears(v)}
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>1</span><span>40</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label>{t.typeLabel}</Label>
              <RadioGroup value={mortgageType} onValueChange={setMortgageType} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fijo" id="fijo" />
                  <Label htmlFor="fijo" className="font-normal cursor-pointer">{t.fixed}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="variable" id="variable" />
                  <Label htmlFor="variable" className="font-normal cursor-pointer">{t.variable}</Label>
                </div>
              </RadioGroup>
              {mortgageType === 'variable' && (
                <p className="text-xs text-amber-600 mt-1">{t.variableNote}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex-1 min-w-0 space-y-8">
          {results && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">{t.monthlyPayment}</p>
                    <p className="text-3xl font-bold text-primary">
                      {results.monthlyPayment.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">{t.totalInterest}</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {results.totalInterest.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">{t.totalPayment}</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {results.totalPayment.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">{t.chartTitle}</CardTitle>
                  <div className="flex gap-1">
                    {(["line", "area", "bar"] as const).map((ct) => (
                      <button key={ct} onClick={() => setChartType(ct)}
                        className={`px-2 py-1 text-xs rounded-md font-medium transition-colors ${chartType === ct ? "bg-primary text-white" : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20"}`}>
                        {ct === "line" ? (isEn ? "Line" : "Línea") : ct === "area" ? (isEn ? "Area" : "Área") : (isEn ? "Bars" : "Barras")}
                      </button>
                    ))}
                    <button
                      onClick={() => downloadChart(chartRef.current, "grafico-hipoteca")}
                      title={isEn ? "Download chart" : "Descargar gráfico"}
                      className="p-1 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const data = results.schedule.filter((_, i) => i % 12 === 0 || i === results.schedule.length - 1);
                    const axes = <>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                      <XAxis dataKey="month" tickFormatter={(val) => `${t.yearLabel} ${Math.ceil(val/12)}`} style={{ fontSize: '12px' }} />
                      <YAxis tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} style={{ fontSize: '12px' }} />
                      <Tooltip formatter={(value: number) => value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })} labelFormatter={(label) => `${t.colMonth} ${label}`} />
                    </>;
                    return (
                      <div ref={chartRef} className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          {chartType === "line" ? (
                            <LineChart data={data}>{axes}<Line type="monotone" dataKey="balance" name={t.outstanding} stroke="#0FA958" strokeWidth={3} dot={false} /></LineChart>
                          ) : chartType === "area" ? (
                            <AreaChart data={data}>{axes}<Area type="monotone" dataKey="balance" name={t.outstanding} stroke="#0FA958" fill="#0FA958" fillOpacity={0.3} strokeWidth={2} dot={false} /></AreaChart>
                          ) : (
                            <BarChart data={data}>{axes}<Bar dataKey="balance" name={t.outstanding} fill="#0FA958" fillOpacity={0.8} /></BarChart>
                          )}
                        </ResponsiveContainer>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">{t.tableTitle}</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setShowFullSchedule(!showFullSchedule)}>
                    {showFullSchedule ? t.showLess : t.showMore}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t.colMonth}</TableHead>
                          <TableHead className="text-right">{t.colPayment}</TableHead>
                          <TableHead className="text-right">{t.colPrincipal}</TableHead>
                          <TableHead className="text-right">{t.colInterest}</TableHead>
                          <TableHead className="text-right">{t.colBalance}</TableHead>
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
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground italic mt-4 mb-2">{t.disclaimer}</p>

      <section className="mt-12 prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t.deepTitle}</h2>
        <p>{t.deep}</p>
        <h3 className="text-base font-semibold mt-6 mb-2 text-gray-900 dark:text-white">{t.exampleTitle}</h3>
        <p>{t.example}</p>
      </section>

      <div className="mt-8 overflow-x-auto">
        <h3 className="text-base font-semibold mb-3 text-gray-900 dark:text-white">{t.refTableTitle}</h3>
        <table className="w-full text-sm border-collapse max-w-lg">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10 text-left text-gray-500 dark:text-white/50">
              <th className="py-2 pr-4 font-medium">{t.tableCol1}</th>
              <th className="py-2 pr-4 font-medium">{t.tableCol2}</th>
              <th className="py-2 font-medium">{t.tableCol3}</th>
            </tr>
          </thead>
          <tbody>
            {MORTGAGE_TABLE.map((row) => (
              <tr key={row.es} className="border-b border-gray-100 dark:border-white/5">
                <td className="py-2 pr-4 text-gray-900 dark:text-white">{locale === "en" ? row.en : row.es}</td>
                <td className="py-2 pr-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.cuota}</td>
                <td className="py-2 font-semibold text-primary whitespace-nowrap">{row.int}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-8 prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t.interpretTitle}</h2>
        <p>{t.interpret}</p>
      </section>

      <AdUnit slot={AD_SLOTS.midContent} className="my-10" />

      <div className="pt-12 mt-12 border-t">
        <h2 className="text-2xl font-bold mb-6">{t.faqTitle}</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>{t.q1}</AccordionTrigger>
            <AccordionContent>{t.a1}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>{t.q2}</AccordionTrigger>
            <AccordionContent>{t.a2}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>{t.q3}</AccordionTrigger>
            <AccordionContent>{t.a3}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>{t.q4}</AccordionTrigger>
            <AccordionContent>{t.a4}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>{t.q5}</AccordionTrigger>
            <AccordionContent>{t.a5}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}
