import React, { useState, useRef } from "react";
import { ReviewedNote } from "@/components/reviewed-note";
import { registerFaq } from "@/lib/faq-schema";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, RadialBarChart, RadialBar } from "recharts";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Briefcase, Download } from "lucide-react";
import { downloadChart } from "@/lib/chart-download";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { COUNTRIES, getCountry, calcIncomeTax, calcSS, fmtCurrency } from "@/lib/countries";
import { useLocale } from "@/lib/locale";

const T = {
  es: {
    backHome: "Volver al inicio",
    title: "Calculadora de Salario Neto",
    subtitle: "Descubre cuánto dinero te llegará realmente a la cuenta bancaria cada mes según el país.",
    intro1: "El salario neto es la cantidad real que percibes en tu cuenta bancaria una vez descontadas las cotizaciones a la Seguridad Social y la retención del IRPF. La diferencia entre bruto y neto puede ser muy significativa: en España, para un salario bruto de 30.000 € anuales, el neto puede rondar los 23.000–24.000 €, dependiendo de las circunstancias personales y las deducciones aplicables.",
    intro2: "Esta calculadora estima el salario neto aproximado en varios países, teniendo en cuenta los tipos impositivos principales y las cotizaciones sociales de cada sistema. Es especialmente útil para comparar ofertas de trabajo en distintos países o para planificar una mudanza internacional, aunque hay que tener en cuenta que los cálculos son estimativos y no contemplan todas las particularidades de cada situación personal.",
    disclaimer: "Cálculo orientativo. Para tu declaración de la renta o nómina real consulta a un gestor o usa el simulador oficial de la AEAT.",
    cardTitle: "Tu Nómina",
    countryLabel: "País",
    grossLabel: "Salario bruto anual",
    paymentsLabel: "Pagas al año",
    payment12: "12 pagas",
    payment14: "14 pagas (España)",
    calculateBtn: "Calcular Sueldo",
    monthlyNetLabel: "Neto Mensual",
    annualNetLabel: "Neto Anual",
    grossLabel2: "Bruto Anual",
    breakdownTitle: "Desglose del Salario Bruto",
    netSalary: "Sueldo Neto",
    incomeTax: "IRPF / Income Tax",
    socialSec: "Seguridad Social",
    placeholder: "Calcula tu sueldo neto completando el formulario.",
    approxNote: "Estimación simplificada basada en los tramos nacionales del IRPF. No incluye deducciones autonómicas, personales ni regímenes especiales, y la retención en nómina no es idéntica a la cuota final de tu declaración de la renta.",
    bars: "Barras",
    horizontal: "Horizontal",
    pie: "Tarta",
    radial: "Radial",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Cuál es la diferencia entre salario bruto y salario neto?",
    a1: "El salario bruto es el importe total acordado antes de deducciones. El neto es lo que recibes en cuenta después de descontar el impuesto sobre la renta y las cotizaciones sociales del trabajador.",
    q2: "¿Varía mucho la presión fiscal entre países?",
    a2: "Sí, enormemente. Países como Bélgica o los Países Bajos superan el 50% en los tramos altos. En el extremo opuesto, Singapur aplica tipos que arrancan en el 2%, y Rusia tiene un impuesto plano del 13%. EE.UU. solo refleja el impuesto federal; los impuestos estatales pueden añadir entre un 0% y un 13% adicional.",
    q3: "¿Por qué el resultado es orientativo?",
    a3: "Cada país tiene su propio sistema de deducciones personales, mínimos exentos, tramos regionales y cotizaciones especiales. Este calculador usa los tramos nacionales principales para dar una estimación rápida. Para un cálculo exacto, consulta a un asesor fiscal local.",
    q4: "¿Cómo afectan las pagas extra al salario neto?",
    a4: "El número de pagas no cambia el total anual que percibes, solo cómo se reparte a lo largo del año. Con 12 pagas, el salario anual se divide en doce mensualidades iguales y más altas. Con 14 pagas (dos extraordinarias, habitualmente en junio y diciembre), cada mensualidad ordinaria es menor pero recibes dos pagos adicionales. En España las pagas extra pueden estar prorrateadas —repartidas dentro de las doce nóminas— o abonarse por separado. A efectos de IRPF, Hacienda calcula la retención sobre el total anual, así que el neto que acabas percibiendo en el conjunto del año es prácticamente el mismo en ambos casos.",
    q5: "¿Qué se descuenta exactamente de mi nómina?",
    a5: "De tu salario bruto se descuentan dos bloques. El primero son las cotizaciones a la Seguridad Social a cargo del trabajador, que en España rondan el 6,35 %: un 4,70 % por contingencias comunes, un 1,55 % por desempleo y un 0,10 % por formación profesional, más el mecanismo de equidad intergeneracional. El segundo es la retención a cuenta del IRPF, que es progresiva y depende de tu salario, tu situación familiar, el número de hijos y otras circunstancias personales. La empresa cotiza además por ti una cantidad mucho mayor, en torno al 30 % del bruto, pero ese importe no se descuenta de tu nómina.",
    howTitle: "Cómo se calcula el salario neto",
    how1: "El cálculo se hace en dos pasos. Primero se restan al salario bruto las cotizaciones a la Seguridad Social que corresponden al trabajador, un porcentaje fijo que en España ronda el 6,35 %. Sobre el importe resultante se aplica la retención del IRPF, que no es un porcentaje único sino una escala progresiva por tramos: cada porción del salario tributa al tipo de su tramo, no todo el salario al tipo más alto. Antes de aplicar la escala se descuentan además el mínimo personal y familiar y la reducción por rendimientos del trabajo, que reducen la base sobre la que se calcula el impuesto.",
    exampleTitle: "Ejemplo resuelto",
    example: "Para un salario bruto de 30.000 € anuales en España: se descuentan primero unos 1.905 € de cotizaciones sociales (6,35 %), lo que deja una base en torno a 28.095 €. Sobre ella se aplica la escala por tramos y se restan el mínimo personal y las reducciones por rendimientos del trabajo, de modo que la retención efectiva se sitúa alrededor del 15-17 %. El resultado es un salario neto aproximado de 23.500-24.000 € al año, es decir, unos 1.960-2.000 € al mes repartidos en 12 pagas.",
    tableTitle: "Tramos del IRPF en España (escala general)",
    tableCol1: "Base liquidable",
    tableCol2: "Tipo aplicable",
    interpretTitle: "Cómo interpretar el resultado",
    interpret: "El neto mensual que obtienes es la cifra que realmente puedes presupuestar, pero conviene leerla con dos matices. Primero, es una estimación basada en los tramos nacionales: tu retención real depende de tu comunidad autónoma, tu situación familiar, los hijos a cargo, una posible discapacidad o las aportaciones a planes de pensiones, factores que pueden mover el resultado varios cientos de euros al año. Segundo, la retención que te aplica la empresa es un pago a cuenta: en la declaración de la renta se ajusta, y por eso el resultado final puede salirte a devolver o a pagar. Si comparas ofertas entre países, recuerda además que un neto mayor no siempre significa mayor poder adquisitivo: hay que ponderarlo con el coste de la vida y con la cobertura sanitaria y social de cada país.",
    example2Title:
      "Segundo ejemplo: 45.000 € con 14 pagas",
    example2:
      "Con 45.000 € brutos anuales y catorce pagas, el cálculo no cambia de método, solo de cifras. Las cotizaciones del trabajador rondan los 2.858 € (6,35 %), de modo que quedan unos 42.142 €. Sobre esa cantidad se aplica la escala por tramos, que es progresiva: los primeros 12.450 € tributan al 19 %, la porción que va de 12.450 a 20.200 € al 24 %, la siguiente hasta 35.200 € al 30 % y solo el tramo restante al 37 %. Tras restar el mínimo personal y la reducción por rendimientos del trabajo, la retención efectiva se sitúa en torno al 19-21 %, lo que deja un neto aproximado de 33.000-34.000 € al año. Con catorce pagas, eso son unos 2.400 € en cada mensualidad ordinaria más dos pagas extra de importe similar en junio y diciembre; con doce pagas prorrateadas, unos 2.800 € cada mes. El total anual es el mismo.",
    ssTableTitle:
      "Qué se descuenta de tu nómina (trabajador por cuenta ajena)",
    ssCol1:
      "Concepto",
    ssCol2:
      "Tipo sobre la base",
    limitsTitle:
      "Qué no incluye este cálculo",
    limits:
      "Conviene saber dónde deja de ser fiable la estimación. No incluye las escalas autonómicas: la parte autonómica del IRPF la fija cada comunidad y puede separarse varios puntos de la estatal, de modo que dos personas con el mismo bruto cobran distinto según dónde residan. Tampoco recoge tu situación familiar concreta (hijos a cargo, ascendientes, discapacidad, familia monoparental), que eleva el mínimo exento y baja la retención. Quedan fuera las retribuciones en especie (seguro médico, ticket restaurante, vehículo de empresa), las aportaciones a planes de pensiones de empresa, las deducciones por alquiler o vivienda habitual, y los regímenes especiales como el de trabajadores desplazados, conocido como ley Beckham. Si cobras una parte importante en variable o bonus, el resultado también se desvía: la empresa suele calcular la retención sobre la previsión anual y ajustarla después.",
    casesTitle:
      "Casos particulares que confunden a mucha gente",
    cases:
      "Hay cuatro situaciones que generan casi todas las dudas. La primera es el cambio de trabajo a mitad de año: cada empresa retiene según lo que ella te paga, así que dos medios sueldos retienen menos que un sueldo entero y la declaración suele salir a pagar. La segunda es la regularización: si tu salario sube, la empresa recalcula la retención con el total anual previsto y la ajusta en las nóminas que quedan, por lo que puedes ver bajar tu neto sin que te hayan bajado el sueldo. La tercera son las horas extra, que cotizan y tributan como salario, aunque las de fuerza mayor cotizan de forma distinta. Y la cuarta es el finiquito: las cantidades que lo componen (vacaciones no disfrutadas, parte proporcional de las pagas extra) tributan como salario, mientras que la indemnización por despido está exenta hasta el límite que fija la ley.",
    q6:
      "¿Por qué me han bajado el neto sin bajarme el sueldo?",
    a6:
      "Lo más habitual es una regularización de la retención. La empresa calcula el porcentaje de IRPF al principio del año sobre lo que prevé pagarte; si esa previsión cambia (una subida, un ascenso, un bonus, una paga atrasada), recalcula el tipo con el total anual actualizado y aplica la diferencia en las nóminas que quedan, que son menos meses para repartir el ajuste. También puede ocurrir al revés, y ver subir el neto, si comunicas un cambio que reduce la retención, como el nacimiento de un hijo. No es dinero perdido: la retención es un pago a cuenta y todo se ajusta en la declaración de la renta, donde saldrá a devolver o a pagar según lo retenido de más o de menos durante el año.",
    q7:
      "¿Me conviene cobrar en 12 o en 14 pagas?",
    a7:
      "A efectos de dinero total no cambia nada: el bruto anual es el mismo y la retención se calcula sobre ese total anual, no sobre cada mensualidad. La diferencia es de tesorería personal. Con doce pagas prorrateadas cobras más cada mes y te organizas con una cantidad estable. Con catorce, cada mensualidad ordinaria es menor pero recibes dos pagos extraordinarios, habitualmente en junio y diciembre, que a mucha gente le funcionan como un ahorro forzoso para las vacaciones o los gastos de final de año. Elijas lo que elijas, el neto que acabas percibiendo en el conjunto del año es prácticamente idéntico. Ten en cuenta que no siempre se puede elegir: el convenio colectivo o el contrato pueden fijar el número de pagas.",
  },
  en: {
    backHome: "Back to home",
    title: "Net Salary Calculator",
    subtitle: "Discover how much money will actually reach your bank account each month based on your country.",
    intro1: "Net salary is the actual amount you receive in your bank account after deducting social security contributions and income tax withholding. The difference between gross and net can be very significant: in Spain, for a gross salary of €30,000 per year, the net can be around €23,000–€24,000, depending on personal circumstances and applicable deductions.",
    intro2: "This calculator estimates the approximate net salary in various countries, taking into account the main tax rates and social contributions of each system. It is particularly useful for comparing job offers in different countries or planning an international move, although the calculations are estimates and do not account for all the particulars of each personal situation.",
    disclaimer: "Indicative calculation. For your tax return or actual payslip, consult an accountant or use the AEAT official simulator.",
    cardTitle: "Your Payslip",
    countryLabel: "Country",
    grossLabel: "Annual gross salary",
    paymentsLabel: "Payments per year",
    payment12: "12 payments",
    payment14: "14 payments (Spain)",
    calculateBtn: "Calculate Salary",
    monthlyNetLabel: "Monthly Net",
    annualNetLabel: "Annual Net",
    grossLabel2: "Annual Gross",
    breakdownTitle: "Gross Salary Breakdown",
    netSalary: "Net Salary",
    incomeTax: "Income Tax",
    socialSec: "Social Security",
    placeholder: "Calculate your net salary by completing the form.",
    approxNote: "Simplified estimate based on the national income-tax brackets. It does not include regional or personal deductions or special regimes, and the withholding on your payslip is not identical to the final tax due in your annual return.",
    bars: "Bars",
    horizontal: "Horizontal",
    pie: "Pie",
    radial: "Radial",
    faqTitle: "Frequently asked questions",
    q1: "What is the difference between gross and net salary?",
    a1: "Gross salary is the total amount agreed before any deductions. Net salary is what you actually receive in your account after deducting income tax and employee social contributions.",
    q2: "Does the tax burden vary a lot between countries?",
    a2: "Yes, enormously. Countries like Belgium or the Netherlands exceed 50% at higher brackets. At the other end, Singapore starts at 2%, and Russia has a flat 13% rate. The US only reflects federal tax; state taxes can add 0–13% on top.",
    q3: "Why is the result indicative?",
    a3: "Each country has its own personal deductions, exempt minimums, regional brackets and special contributions. This calculator uses the main national brackets for a quick estimate. For an exact calculation, consult a local tax adviser.",
    q4: "How do extra payments affect net salary?",
    a4: "The number of payments does not change the annual total you receive, only how it is spread across the year. With 12 payments, the annual salary is divided into twelve equal, higher monthly amounts. With 14 payments (two extraordinary ones, usually in June and December), each ordinary month is smaller but you receive two additional payments. In Spain these extra payments can be prorated — spread across the twelve payslips — or paid separately. For income tax purposes, the tax authority calculates withholding on the annual total, so the net amount you end up receiving over the year is practically the same either way.",
    q5: "What exactly is deducted from my payslip?",
    a5: "Two blocks are deducted from your gross salary. The first is the employee's social security contributions, which in Spain are around 6.35%: 4.70% for common contingencies, 1.55% for unemployment and 0.10% for vocational training, plus the intergenerational equity mechanism. The second is the income tax withholding, which is progressive and depends on your salary, family situation, number of children and other personal circumstances. Your employer also contributes a much larger amount on your behalf, around 30% of gross pay, but that is not deducted from your payslip.",
    howTitle: "How net salary is calculated",
    how1: "The calculation happens in two steps. First, the employee's social security contributions are subtracted from gross pay — a fixed percentage that in Spain is around 6.35%. Income tax withholding is then applied to the remaining amount, and this is not a single percentage but a progressive bracket scale: each portion of the salary is taxed at its own bracket's rate, not the whole salary at the highest rate. Before applying the scale, the personal and family allowance and the earned-income reduction are also deducted, lowering the base on which the tax is computed.",
    exampleTitle: "Worked example",
    example: "For a gross salary of €30,000 a year in Spain: around €1,905 of social contributions (6.35%) is deducted first, leaving a base of about €28,095. The bracket scale is then applied and the personal allowance and earned-income reductions subtracted, so the effective withholding lands at roughly 15-17%. The result is a net salary of approximately €23,500-24,000 per year — about €1,960-2,000 a month spread over 12 payments.",
    tableTitle: "Spanish income tax brackets (general scale)",
    tableCol1: "Taxable base",
    tableCol2: "Rate",
    interpretTitle: "How to interpret the result",
    interpret: "The monthly net figure is what you can actually budget with, but read it with two caveats. First, it is an estimate based on national brackets: your real withholding depends on your autonomous region, family situation, dependent children, any disability or pension plan contributions — factors that can shift the result by several hundred euros a year. Second, the withholding your employer applies is a payment on account: it is reconciled in your annual tax return, which is why you may end up with a refund or an extra payment. If you are comparing offers between countries, also remember that a higher net figure does not always mean greater purchasing power: you need to weigh it against the cost of living and each country's healthcare and social coverage.",
    example2Title:
      "Second example: €45,000 over 14 payments",
    example2:
      "With a gross salary of €45,000 a year and fourteen payments, the method does not change, only the figures. Employee contributions come to about €2,858 (6.35%), leaving roughly €42,142. The progressive scale then applies to that amount: the first €12,450 is taxed at 19%, the portion from €12,450 to €20,200 at 24%, the next up to €35,200 at 30% and only the remainder at 37%. After the personal allowance and the earned-income reduction, effective withholding lands around 19-21%, leaving a net of approximately €33,000-34,000 a year. With fourteen payments that is about €2,400 in each ordinary month plus two similar extra payments in June and December; with twelve prorated payments, about €2,800 a month. The annual total is the same.",
    ssTableTitle:
      "What is deducted from your payslip (employees)",
    ssCol1:
      "Item",
    ssCol2:
      "Rate on the contribution base",
    limitsTitle:
      "What this calculation does not include",
    limits:
      "It is worth knowing where the estimate stops being reliable. It does not include regional scales: each autonomous community sets its own half of the income tax and it can diverge several points from the state scale, so two people on the same gross salary take home different amounts depending on where they live. Nor does it reflect your specific family situation (dependent children, dependent parents, disability, single-parent family), which raises the exempt minimum and lowers withholding. It leaves out benefits in kind (health insurance, meal vouchers, company car), employer pension plan contributions, rent or main-residence deductions, and special regimes such as the one for posted workers, known as the Beckham law. If a significant part of your pay is variable or bonus-based, the result also drifts: employers usually compute withholding on the annual forecast and adjust it afterwards.",
    casesTitle:
      "Particular cases that confuse most people",
    cases:
      "Four situations generate nearly all the questions. The first is changing jobs mid-year: each employer withholds based on what it pays you, so two half salaries withhold less than one full salary and the tax return usually ends in a payment. The second is regularisation: if your salary goes up, the employer recalculates withholding using the new annual forecast and adjusts it over the remaining payslips, so you can see your net pay fall without any pay cut. The third is overtime, which contributes and is taxed as salary, although force-majeure overtime contributes differently. The fourth is the final settlement: its components (untaken holidays, the proportional part of extra payments) are taxed as salary, whereas severance pay is exempt up to the limit set by law.",
    q6:
      "Why has my net pay fallen without a pay cut?",
    a6:
      "The usual reason is a withholding regularisation. Your employer sets the income-tax percentage at the start of the year based on what it expects to pay you; if that forecast changes (a raise, a promotion, a bonus, back pay), it recalculates the rate on the updated annual total and applies the difference over the remaining payslips, which are fewer months to spread the adjustment over. It can also work the other way, raising your net pay, if you report a change that reduces withholding, such as the birth of a child. The money is not lost: withholding is a payment on account and everything is reconciled in the annual tax return, which will end in a refund or a payment depending on whether too much or too little was withheld.",
    q7:
      "Is it better to be paid over 12 or 14 payments?",
    a7:
      "In terms of total money it makes no difference: the annual gross is the same and withholding is computed on that annual total, not on each month. The difference is personal cash flow. With twelve prorated payments you receive more each month and plan with a stable amount. With fourteen, each ordinary month is smaller but you receive two extraordinary payments, usually in June and December, which many people treat as forced savings for holidays or year-end expenses. Either way, the net amount you receive over the year is practically identical. Bear in mind that you cannot always choose: the collective agreement or your contract may set the number of payments.",
  },
};

const SS_TABLE = [
  { es: "Contingencias comunes", en: "Common contingencies", tipo: "4,70 %" },
  { es: "Desempleo (contrato indefinido)", en: "Unemployment (permanent contract)", tipo: "1,55 %" },
  { es: "Desempleo (contrato temporal)", en: "Unemployment (temporary contract)", tipo: "1,60 %" },
  { es: "Formación profesional", en: "Vocational training", tipo: "0,10 %" },
  { es: "Mecanismo de equidad intergeneracional (MEI)", en: "Intergenerational equity mechanism (MEI)", tipo: "≈ 0,1 %" },
];

const IRPF_TABLE = [
  { es: "Hasta 12.450 €", en: "Up to €12,450", tipo: "19 %" },
  { es: "12.450 – 20.200 €", en: "€12,450 – €20,200", tipo: "24 %" },
  { es: "20.200 – 35.200 €", en: "€20,200 – €35,200", tipo: "30 %" },
  { es: "35.200 – 60.000 €", en: "€35,200 – €60,000", tipo: "37 %" },
  { es: "60.000 – 300.000 €", en: "€60,000 – €300,000", tipo: "45 %" },
  { es: "Más de 300.000 €", en: "Over €300,000", tipo: "47 %" },
];

export default function SalarioNeto() {
  const locale = useLocale();
  const t = T[locale];

  const [countryCode, setCountryCode] = useState("es");
  const country = getCountry(countryCode);

  const [bruto, setBruto] = useState(String(country.defaultSalary));
  const [pagas, setPagas] = useState("12");

  const handleCountryChange = (code: string) => {
    const c = getCountry(code);
    setCountryCode(code);
    setBruto(String(c.defaultSalary));
    setResults(null);
  };

  const [results, setResults] = useState<{
    netoMensual: number;
    netoAnual: number;
    ss: number;
    tax: number;
  } | null>(null);
  const [chartType, setChartType] = useState<"barras" | "horizontal" | "tarta" | "radial">("tarta");
  const chartRef = useRef<HTMLDivElement>(null);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const b = parseFloat(bruto);
    if (isNaN(b) || b <= 0) return;

    const taxAmount = calcIncomeTax(b, country.incomeTaxBrackets);
    const ssAmount = calcSS(b, country.ssRate, country.ssCap);
    const netoAnual = b - taxAmount - ssAmount;
    const p = parseFloat(pagas);

    setResults({
      netoMensual: netoAnual / p,
      netoAnual,
      ss: ssAmount,
      tax: taxAmount,
    });
  };

  const fmt = (n: number) => fmtCurrency(n, country.currency, country.numberLocale);

  const pieData = results ? [
    { name: t.netSalary, value: results.netoAnual, color: "#0FA958" },
    { name: t.incomeTax, value: results.tax, color: "#ef4444" },
    { name: t.socialSec, value: results.ss, color: "#f59e0b" },
  ].filter((d) => d.value > 0) : [];

  const isSpain = countryCode === "es";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link href={locale === "en" ? "/en" : "/"} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> {t.backHome}
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-primary" />
          {t.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{t.subtitle}</p>
      <ReviewedNote
        date="05/09/2026"
        sources={[
          { label: "AEAT", href: "https://sede.agenciatributaria.gob.es/" },
          { label: "Seguridad Social", href: "https://www.seg-social.es/" },
        ]}
        scope={
          locale === "en"
            ? "The date and sources refer to the data for Spain. The other 16 countries offered by this calculator use approximate tax tables, with no official source attached and no verified review date, and some correspond to earlier tax years: treat them as an order of magnitude only."
            : "La fecha y las fuentes se refieren a los datos de España. Los otros 16 países que ofrece esta calculadora usan tablas fiscales aproximadas, sin fuente oficial asociada ni fecha de revisión verificada, y algunas corresponden a ejercicios anteriores: úsalas solo como orden de magnitud."
        }
        className="mb-6"
      />
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none my-6 space-y-3 text-gray-700 dark:text-gray-300">
        <p>{t.intro1}</p>
        <p>{t.intro2}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>{t.cardTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={calculate} className="space-y-5">
              <div className="space-y-2">
                <Label>{t.countryLabel}</Label>
                <Select value={countryCode} onValueChange={handleCountryChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {locale === "es" ? c.nameEs : c.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bruto">
                  {t.grossLabel} ({country.currencySymbol})
                </Label>
                <Input
                  id="bruto"
                  type="number"
                  value={bruto}
                  onChange={(e) => setBruto(e.target.value)}
                  required
                />
              </div>

              {isSpain && (
                <div className="space-y-2">
                  <Label>{t.paymentsLabel}</Label>
                  <Select value={pagas} onValueChange={setPagas}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">{t.payment12}</SelectItem>
                      <SelectItem value="14">{t.payment14}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button type="submit" className="w-full">{t.calculateBtn}</Button>
            </form>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          {results ? (
            <div className="space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      {t.monthlyNetLabel} ({isSpain ? pagas : "12"} {locale === "es" ? "pagas" : "payments"})
                    </p>
                    <p className="text-4xl font-bold text-primary">{fmt(results.netoMensual)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">{t.annualNetLabel}</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">{fmt(results.netoAnual)}</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-lg">{t.breakdownTitle} — {fmt(parseFloat(bruto))}</CardTitle>
                  <div className="flex flex-wrap gap-1 rounded-lg border p-1">
                    {(["barras", "horizontal", "tarta", "radial"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setChartType(type)}
                        className={cn(
                          "px-3 py-1 text-xs rounded-md transition-colors capitalize",
                          chartType === type
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                        )}
                      >
                        {t[type === "barras" ? "bars" : type === "tarta" ? "pie" : type]}
                      </button>
                    ))}
                    <button
                      onClick={() => downloadChart(chartRef.current, "grafico-salario-neto")}
                      title={locale === "en" ? "Download chart" : "Descargar gráfico"}
                      className="p-1 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div ref={chartRef} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === "barras" ? (
                        <BarChart data={[{ name: locale === "en" ? "Salary" : "Salario", [t.netSalary]: results!.netoAnual, [t.incomeTax]: results!.tax, [t.socialSec]: results!.ss }]}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                          <XAxis dataKey="name" />
                          <YAxis tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
                          <Tooltip formatter={(v: number) => fmt(v)} />
                          <Legend />
                          <Bar dataKey={t.netSalary} stackId="a" fill="#0FA958" />
                          <Bar dataKey={t.incomeTax} stackId="a" fill="#ef4444" />
                          <Bar dataKey={t.socialSec} stackId="a" fill="#f59e0b" />
                        </BarChart>
                      ) : chartType === "horizontal" ? (
                        <BarChart layout="vertical" data={[{ name: locale === "en" ? "Salary" : "Salario", [t.netSalary]: results!.netoAnual, [t.incomeTax]: results!.tax, [t.socialSec]: results!.ss }]} margin={{ left: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                          <XAxis type="number" tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
                          <YAxis type="category" dataKey="name" width={55} />
                          <Tooltip formatter={(v: number) => fmt(v)} />
                          <Legend />
                          <Bar dataKey={t.netSalary} stackId="a" fill="#0FA958" />
                          <Bar dataKey={t.incomeTax} stackId="a" fill="#ef4444" />
                          <Bar dataKey={t.socialSec} stackId="a" fill="#f59e0b" />
                        </BarChart>
                      ) : chartType === "tarta" ? (
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={110} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`} labelLine>
                            {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                          </Pie>
                          <Tooltip formatter={(v: number, _n: string, props: { payload?: { name?: string } }) => [fmt(v), props.payload?.name ?? _n]} />
                          <Legend />
                        </PieChart>
                      ) : (
                        <RadialBarChart cx="50%" cy="50%" innerRadius={30} outerRadius={120} data={[
                          { name: t.socialSec, value: results!.ss, fill: "#f59e0b" },
                          { name: t.incomeTax, value: results!.tax, fill: "#ef4444" },
                          { name: t.netSalary, value: results!.netoAnual, fill: "#0FA958" },
                        ]} startAngle={90} endAngle={-270}>
                          <RadialBar dataKey="value" label={{ position: "insideStart", fill: "#fff", fontSize: 11 }} />
                          <Tooltip formatter={(v: number, _n: string, props: { payload?: { name?: string } }) => [fmt(v), props.payload?.name ?? _n]} />
                          <Legend />
                        </RadialBarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <p className="text-xs text-muted-foreground">{t.approxNote}</p>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[300px] border-dashed">
              <CardContent className="text-center text-gray-500">
                <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>{t.placeholder}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground italic mt-4 mb-2">{t.disclaimer}</p>

      <section className="mt-12 prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t.howTitle}</h2>
        <p>{t.how1}</p>
        <h3 className="text-base font-semibold mt-6 mb-2 text-gray-900 dark:text-white">{t.exampleTitle}</h3>
        <p>{t.example}</p>

        <h3 className="text-base font-semibold mt-6 mb-2 text-gray-900 dark:text-white">{t.example2Title}</h3>
        <p>{t.example2}</p>
      </section>

      <div className="mt-8 overflow-x-auto">
        <h3 className="text-base font-semibold mb-3 text-gray-900 dark:text-white">{t.ssTableTitle}</h3>
        <table className="w-full text-sm border-collapse max-w-md">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10 text-left text-gray-500 dark:text-white/50">
              <th className="py-2 pr-4 font-medium">{t.ssCol1}</th>
              <th className="py-2 font-medium">{t.ssCol2}</th>
            </tr>
          </thead>
          <tbody>
            {SS_TABLE.map((row) => (
              <tr key={row.es} className="border-b border-gray-100 dark:border-white/5">
                <td className="py-2 pr-4 text-gray-900 dark:text-white">{locale === "en" ? row.en : row.es}</td>
                <td className="py-2 font-semibold text-primary whitespace-nowrap">{row.tipo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 overflow-x-auto">
        <h3 className="text-base font-semibold mb-3 text-gray-900 dark:text-white">{t.tableTitle}</h3>
        <table className="w-full text-sm border-collapse max-w-md">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10 text-left text-gray-500 dark:text-white/50">
              <th className="py-2 pr-4 font-medium">{t.tableCol1}</th>
              <th className="py-2 font-medium">{t.tableCol2}</th>
            </tr>
          </thead>
          <tbody>
            {IRPF_TABLE.map((row) => (
              <tr key={row.tipo} className="border-b border-gray-100 dark:border-white/5">
                <td className="py-2 pr-4 text-gray-900 dark:text-white whitespace-nowrap">{locale === "en" ? row.en : row.es}</td>
                <td className="py-2 font-semibold text-primary whitespace-nowrap">{row.tipo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-8 prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t.limitsTitle}</h2>
        <p>{t.limits}</p>
        <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">{t.casesTitle}</h2>
        <p>{t.cases}</p>
      </section>

      <section className="mt-8 prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t.interpretTitle}</h2>
        <p>{t.interpret}</p>
      </section>

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
          <AccordionItem value="q4">
            <AccordionTrigger>{t.q4}</AccordionTrigger>
            <AccordionContent>{t.a4}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="q5">
            <AccordionTrigger>{t.q5}</AccordionTrigger>
            <AccordionContent>{t.a5}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="q6">
            <AccordionTrigger>{t.q6}</AccordionTrigger>
            <AccordionContent>{t.a6}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="q7">
            <AccordionTrigger>{t.q7}</AccordionTrigger>
            <AccordionContent>{t.a7}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}

registerFaq("finanzas/salario-neto", T);
