import React, { useState, useRef } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Coins, TrendingUp, Download } from "lucide-react";
import { downloadChart } from "@/lib/chart-download";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { useLocale } from "@/lib/locale";

/**
 * Fondos/índices famosos con su rentabilidad anual media histórica (nominal, en
 * euros/dólares sin descontar inflación). Son medias de largo plazo orientativas;
 * rentabilidades pasadas no garantizan rentabilidades futuras.
 */
type Fund = {
  id: string;
  name: string;
  rate: number;
  riskEs: string;
  riskEn: string;
  descEs: string;
  descEn: string;
};

const FUNDS: Fund[] = [
  { id: "sp500", name: "S&P 500", rate: 10, riskEs: "Alto", riskEn: "High", descEs: "Las 500 mayores empresas cotizadas de EE. UU. Referencia mundial; rentabilidad media histórica cercana al 10% anual.", descEn: "The 500 largest listed companies in the US. Global benchmark; historical average return close to 10% per year." },
  { id: "msci-world", name: "MSCI World", rate: 8, riskEs: "Alto", riskEn: "High", descEs: "Unas 1.500 grandes y medianas empresas de 23 países desarrollados. El fondo indexado global más popular.", descEn: "About 1,500 large and mid-cap companies from 23 developed countries. The world's most popular index fund." },
  { id: "nasdaq100", name: "Nasdaq 100", rate: 13.5, riskEs: "Muy alto", riskEn: "Very high", descEs: "Las 100 mayores empresas tecnológicas no financieras de EE. UU. Mayor rentabilidad reciente, pero más volátil.", descEn: "The 100 largest non-financial tech companies in the US. Higher recent returns but more volatile." },
  { id: "ftse-all-world", name: "FTSE All-World", rate: 8, riskEs: "Alto", riskEn: "High", descEs: "Más de 4.000 empresas de mercados desarrollados y emergentes. Diversificación global máxima.", descEn: "More than 4,000 companies from developed and emerging markets. Maximum global diversification." },
  { id: "msci-em", name: "MSCI Emerging Markets", rate: 6, riskEs: "Muy alto", riskEn: "Very high", descEs: "Mercados emergentes (China, India, Taiwán, Brasil...). Mayor potencial y mayor volatilidad.", descEn: "Emerging markets (China, India, Taiwan, Brazil...). Greater potential and greater volatility." },
  { id: "msci-world-small", name: "MSCI World Small Cap", rate: 9, riskEs: "Muy alto", riskEn: "Very high", descEs: "Empresas de pequeña capitalización de países desarrollados. Históricamente más rentables y volátiles.", descEn: "Small-cap companies from developed countries. Historically more profitable and volatile." },
  { id: "eurostoxx50", name: "Euro Stoxx 50", rate: 6.5, riskEs: "Alto", riskEn: "High", descEs: "Las 50 mayores empresas de la eurozona (Alemania, Francia, España...).", descEn: "The 50 largest companies in the eurozone (Germany, France, Spain...)." },
  { id: "dowjones", name: "Dow Jones", rate: 8, riskEs: "Alto", riskEn: "High", descEs: "30 grandes empresas industriales y de consumo de EE. UU. El índice más antiguo.", descEn: "30 large industrial and consumer companies in the US. The oldest index." },
  { id: "nikkei225", name: "Nikkei 225", rate: 5.5, riskEs: "Alto", riskEn: "High", descEs: "225 grandes empresas de la Bolsa de Tokio. Principal referencia de la renta variable japonesa.", descEn: "225 large companies listed on the Tokyo Stock Exchange. The main Japanese equity benchmark." },
  { id: "ibex35", name: "IBEX 35", rate: 4, riskEs: "Alto", riskEn: "High", descEs: "Las 35 empresas más líquidas de la Bolsa española. Fuerte peso de banca y energía.", descEn: "The 35 most liquid companies on the Spanish stock exchange. Heavy weighting in banking and energy." },
];

const CUSTOM = "custom";

const T = {
  es: {
    backHome: "Volver al inicio",
    title: "Calculadora de Interés Compuesto",
    subtitle: "Descubre el poder del tiempo y cómo tus inversiones pueden crecer de forma exponencial.",
    intro1: "El interés compuesto es uno de los principios fundamentales de las finanzas personales: los intereses que genera tu inversión se reinvierten y, a su vez, generan nuevos intereses. A largo plazo, este efecto acumulativo puede multiplicar de forma exponencial el capital inicial. Einstein lo describió como la 'octava maravilla del mundo': quien lo entiende lo gana, quien no lo entiende lo paga.",
    intro2: "Esta calculadora te permite proyectar el crecimiento de tus ahorros o inversiones a lo largo del tiempo, incluyendo aportaciones periódicas. Puedes seleccionar distintos fondos o índices de referencia (S&P 500, MSCI World, Nasdaq 100...) o introducir manualmente un tipo de interés estimado. El gráfico muestra la evolución mes a mes del capital total, diferenciando entre lo aportado y lo generado por intereses.",
    disclaimer: "Proyección orientativa basada en tipos históricos. Los mercados pueden comportarse de forma muy diferente en el futuro. Toda inversión conlleva riesgo de pérdida.",
    cardTitle: "Datos de la Inversión",
    initialLabel: "Capital Inicial (€)",
    monthlyLabel: "Aportación Mensual (€)",
    fundLabel: "Fondo de inversión",
    customFund: "Personalizado",
    riskLabel: "Riesgo",
    fundDisclaimer: "Rentabilidad media histórica orientativa. Rentabilidades pasadas no garantizan rentabilidades futuras.",
    rateLabel: "Interés Anual Estimado (%)",
    yearsLabel: "Años de Inversión",
    calculateBtn: "Calcular Crecimiento",
    finalCapital: "Capital Final",
    totalContrib: "Total Aportado",
    totalInterest: "Intereses Generados",
    chartTitle: "Proyección a lo largo del tiempo",
    yearLabel: "Año",
    contributions: "Aportaciones",
    interests: "Intereses",
    placeholder: "Introduce los datos y pulsa Calcular para ver la proyección.",
    faqTitle: "Información sobre Interés Compuesto",
    q1: "¿Qué es el interés compuesto?",
    a1: "El interés compuesto es el que se calcula sobre el capital inicial más todos los intereses acumulados hasta ese momento, en lugar de hacerlo solo sobre el capital de partida. Dicho de otro modo, los intereses generan a su vez nuevos intereses, lo que produce un crecimiento exponencial en forma de bola de nieve. Es la diferencia fundamental con el interés simple, en el que la rentabilidad se calcula siempre sobre el importe inicial y el crecimiento es lineal. A plazos cortos la diferencia entre ambos es pequeña, pero a veinte o treinta años resulta enorme.",
    q2: "¿Por qué es importante empezar pronto?",
    a2: "Porque el tiempo es la variable más determinante en el interés compuesto, por encima incluso del importe que aportas. El crecimiento no es lineal sino exponencial, de modo que los últimos años de una inversión larga aportan mucho más capital que los primeros. Empezar diez años antes con aportaciones modestas suele producir un capital final mayor que empezar tarde aportando cantidades muy superiores, simplemente porque el dinero ha tenido más ciclos para reinvertirse. Ese es el motivo por el que las aportaciones periódicas iniciadas pronto son tan eficaces.",
    q3: "¿De dónde salen las rentabilidades de los fondos?",
    a3: "Cada fondo o índice (S&P 500, MSCI World, Nasdaq 100...) tiene un porcentaje que refleja su rentabilidad media anual histórica de largo plazo, sin descontar la inflación. Son cifras orientativas para que veas cómo crecería tu inversión con un comportamiento similar al pasado. Al elegir un fondo, ese porcentaje se aplica automáticamente como interés estimado, pero puedes ajustarlo a mano cuando quieras. Recuerda: rentabilidades pasadas no garantizan rentabilidades futuras y toda inversión conlleva riesgo de pérdida.",
    q4: "¿Cómo afecta la inflación al resultado?",
    a4: "La calculadora muestra el capital en euros nominales, es decir, sin descontar la pérdida de poder adquisitivo. Con una inflación media del 2 % anual, 100.000 € dentro de 25 años comprarían aproximadamente lo mismo que 61.000 € hoy. Para razonar en términos reales conviene usar la rentabilidad real, que se obtiene restando la inflación a la rentabilidad nominal: si esperas un 7 % de rentabilidad y una inflación del 2 %, tu rentabilidad real ronda el 5 %. Introduciendo ese 5 % en la calculadora obtendrás el capital final expresado en poder adquisitivo de hoy, que suele ser la cifra más útil para planificar.",
    q5: "¿Qué diferencia hay entre interés simple y compuesto?",
    a5: "En el interés simple la rentabilidad se calcula siempre sobre el capital inicial, por lo que el crecimiento es lineal: 10.000 € al 7 % generan 700 € cada año, sin variación. En el interés compuesto los intereses se reinvierten y pasan a generar rentabilidad ellos mismos, de modo que la ganancia anual aumenta con el tiempo. En el ejemplo anterior, el segundo año se generarían 749 € en lugar de 700 €, el tercero 801 €, y así sucesivamente. A diez años el interés simple daría 17.000 € y el compuesto 19.672 €; a treinta años la diferencia se dispara hasta 31.000 € frente a 76.123 €.",
    q6: "¿Cada cuánto se capitalizan los intereses?",
    a6: "Depende del producto financiero. Un depósito bancario puede capitalizar de forma anual, trimestral o mensual; un fondo de inversión acumula el rendimiento de manera continua a través del valor liquidativo. Cuanto mayor es la frecuencia de capitalización, mayor es el capital final, aunque la diferencia es modesta: 10.000 € al 7 % durante 20 años dan 38.697 € con capitalización anual y unos 40.387 € con capitalización mensual. Esta calculadora emplea capitalización anual, que es la convención más habitual y la que usan la mayoría de simuladores para comparar productos.",
    deepTitle: "Cómo se calcula el interés compuesto",
    deep: "La fórmula básica es C = C₀ · (1 + i)^n, donde C₀ es el capital inicial, i el tipo de interés anual expresado en tanto por uno y n el número de años. El exponente es la clave de todo: cada año multiplica el capital acumulado, no solo el inicial, y por eso el crecimiento se acelera con el tiempo. Cuando además realizas aportaciones periódicas, al resultado anterior se le suma el valor futuro de esa serie de aportaciones, que se calcula con la expresión A · [((1 + i)^n − 1) / i]. La calculadora combina ambos términos para darte el capital final, el total aportado y los intereses generados por separado.",
    exampleTitle: "Ejemplo resuelto",
    example: "Supongamos 10.000 € iniciales invertidos al 7 % anual durante 20 años, sin aportaciones adicionales. Aplicamos C = 10.000 × (1 + 0,07)^20 = 10.000 × 3,8697 = 38.697 €. Has aportado 10.000 € y has generado 28.697 € en intereses, casi el triple de tu inversión inicial. Si además aportases 200 € cada mes (2.400 € al año), el valor futuro de esas aportaciones sería de unos 98.400 €, con lo que el capital final superaría los 137.000 € habiendo aportado 58.000 € de tu bolsillo.",
    tableTitle: "Crecimiento de 10.000 € al 7 % anual",
    tableCol1: "Años",
    tableCol2: "Capital acumulado",
    tableCol3: "Intereses generados",
    interpretTitle: "Cómo interpretar el resultado",
    interpret: "Fíjate sobre todo en la proporción entre lo que has aportado y los intereses generados, porque es la métrica que revela la fuerza del interés compuesto. En plazos cortos la mayor parte del capital final procede de tus aportaciones; a partir de los quince o veinte años los intereses empiezan a superarlas y el crecimiento se vuelve mucho más pronunciado. Ten presente además dos limitaciones: la calculadora asume una rentabilidad constante, mientras que los mercados reales fluctúan y pueden encadenar años negativos, y no descuenta ni la inflación ni la fiscalidad del ahorro, que en España grava las ganancias del capital entre el 19 % y el 30 % en el momento de recuperar la inversión.",
  },
  en: {
    backHome: "Back to home",
    title: "Compound Interest Calculator",
    subtitle: "Discover the power of time and how your investments can grow exponentially.",
    intro1: "Compound interest is one of the fundamental principles of personal finance: the interest your investment generates is reinvested and in turn generates new interest. Over the long term, this cumulative effect can exponentially multiply the initial capital. Einstein described it as the 'eighth wonder of the world': those who understand it earn it, those who don't understand it pay it.",
    intro2: "This calculator lets you project the growth of your savings or investments over time, including periodic contributions. You can select different reference funds or indices (S&P 500, MSCI World, Nasdaq 100...) or manually enter an estimated interest rate. The chart shows the month-by-month evolution of total capital, distinguishing between what has been contributed and what has been generated by interest.",
    disclaimer: "Indicative projection based on historical rates. Markets may behave very differently in the future. All investments carry risk of loss.",
    cardTitle: "Investment Details",
    initialLabel: "Initial Capital (€)",
    monthlyLabel: "Monthly Contribution (€)",
    fundLabel: "Investment fund",
    customFund: "Custom",
    riskLabel: "Risk",
    fundDisclaimer: "Indicative historical average return. Past performance does not guarantee future results.",
    rateLabel: "Estimated Annual Interest (%)",
    yearsLabel: "Investment Years",
    calculateBtn: "Calculate Growth",
    finalCapital: "Final Capital",
    totalContrib: "Total Contributed",
    totalInterest: "Interest Generated",
    chartTitle: "Projection over time",
    yearLabel: "Year",
    contributions: "Contributions",
    interests: "Interest",
    placeholder: "Enter the data and press Calculate to see the projection.",
    faqTitle: "About Compound Interest",
    q1: "What is compound interest?",
    a1: "Compound interest is calculated on the initial capital plus all the interest accumulated up to that point, rather than only on the starting amount. In other words, interest itself generates further interest, producing exponential, snowball-like growth. This is the fundamental difference from simple interest, where the return is always computed on the initial sum and growth is linear. Over short periods the difference between the two is small, but over twenty or thirty years it becomes enormous.",
    q2: "Why is it important to start early?",
    a2: "Because time is the most decisive variable in compound interest, even more than the amount you contribute. Growth is exponential rather than linear, so the final years of a long investment add far more capital than the early ones. Starting ten years earlier with modest contributions usually produces a larger final sum than starting late with much bigger ones, simply because the money has had more cycles to be reinvested. That is why regular contributions started early are so effective.",
    q3: "Where do the fund returns come from?",
    a3: "Each fund or index (S&P 500, MSCI World, Nasdaq 100...) has a percentage reflecting its historical long-term average annual return, without discounting inflation. These are indicative figures to show how your investment would grow with similar past performance. When you select a fund, that percentage is automatically applied as the estimated interest, but you can adjust it manually at any time. Remember: past performance does not guarantee future results and all investments carry risk of loss.",
    q4: "How does inflation affect the result?",
    a4: "The calculator shows capital in nominal euros, that is, without discounting the loss of purchasing power. With average inflation of 2% a year, €100,000 in 25 years would buy roughly what €61,000 buys today. To think in real terms it helps to use the real return, obtained by subtracting inflation from the nominal return: if you expect a 7% return and 2% inflation, your real return is around 5%. Entering that 5% into the calculator gives you the final capital expressed in today's purchasing power, which is usually the more useful figure for planning.",
    q5: "What is the difference between simple and compound interest?",
    a5: "With simple interest the return is always calculated on the initial capital, so growth is linear: €10,000 at 7% generates €700 every year, unchanged. With compound interest the returns are reinvested and start generating returns themselves, so the annual gain increases over time. In the example above, the second year would generate €749 instead of €700, the third €801, and so on. Over ten years simple interest would give €17,000 and compound interest €19,672; over thirty years the gap widens to €31,000 versus €76,123.",
    q6: "How often is interest compounded?",
    a6: "It depends on the financial product. A bank deposit may compound annually, quarterly or monthly; an investment fund accrues returns continuously through its net asset value. The higher the compounding frequency, the higher the final capital, though the difference is modest: €10,000 at 7% over 20 years gives €38,697 with annual compounding and about €40,387 with monthly compounding. This calculator uses annual compounding, the most common convention and the one most simulators use to compare products.",
    deepTitle: "How compound interest is calculated",
    deep: "The basic formula is C = C₀ · (1 + i)^n, where C₀ is the initial capital, i the annual interest rate expressed as a decimal and n the number of years. The exponent is what matters most: each year multiplies the accumulated capital, not just the initial amount, which is why growth accelerates over time. When you also make regular contributions, the future value of that series is added to the previous result, calculated with the expression A · [((1 + i)^n − 1) / i]. The calculator combines both terms to give you the final capital, the total contributed and the interest generated, separately.",
    exampleTitle: "Worked example",
    example: "Take €10,000 invested at 7% a year for 20 years, with no further contributions. We apply C = 10,000 × (1 + 0.07)^20 = 10,000 × 3.8697 = €38,697. You contributed €10,000 and generated €28,697 in interest, almost triple your initial investment. If you also contributed €200 a month (€2,400 a year), the future value of those contributions would be about €98,400, bringing the final capital above €137,000 having put in €58,000 of your own money.",
    tableTitle: "Growth of €10,000 at 7% a year",
    tableCol1: "Years",
    tableCol2: "Accumulated capital",
    tableCol3: "Interest generated",
    interpretTitle: "How to interpret the result",
    interpret: "Focus above all on the ratio between what you contributed and the interest generated, because that is the metric that reveals the power of compounding. Over short periods most of the final capital comes from your contributions; from around fifteen or twenty years onwards the interest starts to exceed them and growth becomes far steeper. Bear in mind two limitations as well: the calculator assumes a constant return, whereas real markets fluctuate and can string together negative years, and it discounts neither inflation nor the taxation of savings, which in Spain taxes capital gains at between 19% and 30% when you cash in the investment.",
  },
};

const COMPOUND_TABLE = [
  { years: "5", capital: "14.026 €", interes: "4.026 €" },
  { years: "10", capital: "19.672 €", interes: "9.672 €" },
  { years: "15", capital: "27.590 €", interes: "17.590 €" },
  { years: "20", capital: "38.697 €", interes: "28.697 €" },
  { years: "25", capital: "54.274 €", interes: "44.274 €" },
  { years: "30", capital: "76.123 €", interes: "66.123 €" },
];

export default function InteresCompuesto() {
  const locale = useLocale();
  const t = T[locale];

  const [chartType, setChartType] = useState<"area" | "line" | "bar">("area");
  const chartRef = useRef<HTMLDivElement>(null);
  const [initial, setInitial] = useState("10000");
  const [monthly, setMonthly] = useState("200");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("20");
  const [fund, setFund] = useState(CUSTOM);

  const selectedFund = FUNDS.find((f) => f.id === fund) ?? null;

  const handleFundChange = (id: string) => {
    setFund(id);
    const f = FUNDS.find((fund) => fund.id === id);
    if (f) setRate(String(f.rate));
  };

  const handleRateChange = (value: string) => {
    setRate(value);
    setFund(CUSTOM);
  };

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
    const ty = parseFloat(years);

    if (isNaN(p) || isNaN(m) || isNaN(r) || isNaN(ty)) return;

    let currentAmount = p;
    let totalContrib = p;
    const data = [];

    for (let i = 0; i <= ty; i++) {
      data.push({
        year: i,
        [t.contributions]: totalContrib,
        [t.interests]: currentAmount - totalContrib,
        Total: currentAmount
      });

      if (i < ty) {
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
      <Link href={locale === "en" ? "/en" : "/"} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> {t.backHome}
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 flex items-center gap-3">
          <Coins className="w-8 h-8 text-primary" />
          {t.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{t.subtitle}</p>
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
            <form onSubmit={calculate} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="initial">{t.initialLabel}</Label>
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
                <Label htmlFor="monthly">{t.monthlyLabel}</Label>
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
                <Label htmlFor="fund">{t.fundLabel}</Label>
                <Select value={fund} onValueChange={handleFundChange}>
                  <SelectTrigger id="fund" data-testid="select-fund">
                    <SelectValue placeholder={t.customFund} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CUSTOM}>{t.customFund}</SelectItem>
                    {FUNDS.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.name} · {f.rate}%
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedFund && (
                  <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-sm space-y-1">
                    <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      {selectedFund.name}
                      <span className="ml-auto text-xs font-normal text-gray-500">
                        {t.riskLabel}: {locale === "en" ? selectedFund.riskEn : selectedFund.riskEs}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{locale === "en" ? selectedFund.descEn : selectedFund.descEs}</p>
                    <p className="text-xs text-gray-400">{t.fundDisclaimer}</p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">{t.rateLabel}</Label>
                <Input
                  id="rate"
                  type="number"
                  step="0.1"
                  value={rate}
                  onChange={(e) => handleRateChange(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="years">{t.yearsLabel}</Label>
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
              <Button type="submit" className="w-full">{t.calculateBtn}</Button>
            </form>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-8">
          {results ? (
            <div className="space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">{t.finalCapital}</p>
                    <p className="text-3xl font-bold text-primary">
                      {results.finalAmount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">{t.totalContrib}</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {results.totalContributions.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">{t.totalInterest}</p>
                    <p className="text-2xl font-semibold text-primary">
                      +{results.totalInterest.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">{t.chartTitle}</CardTitle>
                  <div className="flex gap-1">
                    {(["area", "line", "bar"] as const).map((ct) => (
                      <button key={ct} onClick={() => setChartType(ct)}
                        className={`px-2 py-1 text-xs rounded-md font-medium transition-colors ${chartType === ct ? "bg-primary text-white" : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20"}`}>
                        {ct === "area" ? (locale === "en" ? "Area" : "Área") : ct === "line" ? (locale === "en" ? "Line" : "Línea") : (locale === "en" ? "Bars" : "Barras")}
                      </button>
                    ))}
                    <button
                      onClick={() => downloadChart(chartRef.current, "grafico-interes-compuesto")}
                      title={locale === "en" ? "Download chart" : "Descargar gráfico"}
                      className="p-1 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div ref={chartRef} className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === "area" ? (
                        <AreaChart data={results.data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                          <XAxis dataKey="year" tickFormatter={(val) => `${t.yearLabel} ${val}`} style={{ fontSize: '12px' }} />
                          <YAxis tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} style={{ fontSize: '12px' }} />
                          <Tooltip formatter={(value: number) => value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })} labelFormatter={(label) => `${t.yearLabel} ${label}`} />
                          <Legend />
                          <Area type="monotone" dataKey={t.contributions} stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                          <Area type="monotone" dataKey={t.interests} stackId="1" stroke="#0FA958" fill="#0FA958" fillOpacity={0.6} />
                        </AreaChart>
                      ) : chartType === "line" ? (
                        <LineChart data={results.data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                          <XAxis dataKey="year" tickFormatter={(val) => `${t.yearLabel} ${val}`} style={{ fontSize: '12px' }} />
                          <YAxis tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} style={{ fontSize: '12px' }} />
                          <Tooltip formatter={(value: number) => value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })} labelFormatter={(label) => `${t.yearLabel} ${label}`} />
                          <Legend />
                          <Line type="monotone" dataKey={t.contributions} stroke="#3b82f6" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey={t.interests} stroke="#0FA958" strokeWidth={2} dot={false} />
                        </LineChart>
                      ) : (
                        <BarChart data={results.data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                          <XAxis dataKey="year" tickFormatter={(val) => `${t.yearLabel} ${val}`} style={{ fontSize: '12px' }} />
                          <YAxis tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} style={{ fontSize: '12px' }} />
                          <Tooltip formatter={(value: number) => value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })} labelFormatter={(label) => `${t.yearLabel} ${label}`} />
                          <Legend />
                          <Bar dataKey={t.contributions} stackId="a" fill="#3b82f6" fillOpacity={0.8} />
                          <Bar dataKey={t.interests} stackId="a" fill="#0FA958" fillOpacity={0.8} />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[400px] border-dashed">
              <CardContent className="text-center text-gray-500">
                <Coins className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>{t.placeholder}</p>
              </CardContent>
            </Card>
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
        <h3 className="text-base font-semibold mb-3 text-gray-900 dark:text-white">{t.tableTitle}</h3>
        <table className="w-full text-sm border-collapse max-w-lg">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10 text-left text-gray-500 dark:text-white/50">
              <th className="py-2 pr-4 font-medium">{t.tableCol1}</th>
              <th className="py-2 pr-4 font-medium">{t.tableCol2}</th>
              <th className="py-2 font-medium">{t.tableCol3}</th>
            </tr>
          </thead>
          <tbody>
            {COMPOUND_TABLE.map((row) => (
              <tr key={row.years} className="border-b border-gray-100 dark:border-white/5">
                <td className="py-2 pr-4 text-gray-900 dark:text-white whitespace-nowrap">{row.years}</td>
                <td className="py-2 pr-4 font-semibold text-primary whitespace-nowrap">{row.capital}</td>
                <td className="py-2 text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.interes}</td>
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
          <AccordionItem value="item-6">
            <AccordionTrigger>{t.q6}</AccordionTrigger>
            <AccordionContent>{t.a6}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}
