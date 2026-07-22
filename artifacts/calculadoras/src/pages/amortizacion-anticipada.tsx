import { useState } from "react";
import { Building } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { useLocale } from "@/lib/locale";

function eur(n: number) {
  return n.toLocaleString("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });
}

function calcCuota(capital: number, tipoMensual: number, meses: number): number {
  if (tipoMensual === 0) return capital / meses;
  return (capital * tipoMensual) / (1 - Math.pow(1 + tipoMensual, -meses));
}

function totalIntereses(capital: number, tipoMensual: number, meses: number): number {
  return calcCuota(capital, tipoMensual, meses) * meses - capital;
}

function calcMesesNuevos(capital: number, tipoMensual: number, cuota: number): number {
  if (tipoMensual === 0) return Math.ceil(capital / cuota);
  return Math.ceil(
    -Math.log(1 - (capital * tipoMensual) / cuota) / Math.log(1 + tipoMensual),
  );
}

const T = {
  es: {
    title: "Calculadora de Amortización Anticipada de Hipoteca",
    subtitle: "Calcula cuánto ahorras en intereses amortizando anticipadamente tu hipoteca, y elige entre reducir la cuota mensual o acortar el plazo.",
    intro1: "La amortización anticipada de hipoteca consiste en devolver al banco parte del capital pendiente antes de lo estipulado en el contrato. Esto reduce la deuda viva y, por tanto, los intereses futuros. Las dos grandes opciones son: reducir la cuota mensual (manteniendo el plazo original) o acortar el plazo total de la hipoteca (manteniendo la misma cuota). La mayoría de expertos recomienda reducir plazo porque el ahorro total en intereses es significativamente mayor.",
    intro2: "Esta calculadora te muestra de forma detallada cuánto ahorrarías en cada escenario, incluyendo la comisión por amortización anticipada aplicable según la Ley 5/2019 para hipotecas fijas y variables. Introduce el capital pendiente, el tipo de interés y los meses que te quedan, y obtendrás un comparativo claro entre seguir con el plan original o amortizar.",
    disclaimer: "Los cálculos son orientativos. La comisión exacta puede variar según las condiciones particulares de tu contrato hipotecario.",
    card1Title: "Tu hipoteca actual",
    card2Title: "Amortización anticipada",
    capitalLabel: "Capital pendiente (€)",
    tipoLabel: "Tipo de interés anual (%)",
    mesesLabel: "Meses restantes",
    tipoHipotecaLabel: "Tipo de hipoteca",
    variable: "Variable",
    fija: "Fija",
    importeLabel: "Importe a amortizar (€)",
    opcionLabel: "Destino de la amortización",
    reducirPlazo: "Reducir plazo (misma cuota)",
    reducirCuota: "Reducir cuota (mismo plazo)",
    cuotaActualLabel: "Cuota actual",
    nuevaCuotaLabel: "Nueva cuota",
    plazoNuevoLabel: "Plazo nuevo",
    ahorroLabel: "Ahorro en intereses",
    comisionLabel: "Comisión estimada",
    comparativaTitle: "Comparativa",
    sinAmortizar: "Sin amortizar",
    conAmortizacion: "Con amortización",
    rowLabels: ["Cuota mensual", "Plazo restante", "Intereses restantes", "Capital pendiente"],
    note: (<><strong>Comisión indicativa:</strong> Hipoteca variable: 0,15% (primeros 3 años) o 0,25% (años 4–5), 0% desde el 6.º año. Hipoteca fija: 2% (primeros 10 años), 1,5% desde el 11.º año (Ley 5/2019). Esta calculadora aplica el máximo vigente como referencia.</>),
    faqTitle: "Preguntas frecuentes",
    q1: "¿Es mejor reducir cuota o plazo?",
    a1: (<>Reducir el <strong>plazo</strong> ahorra más en intereses totales porque el capital queda menos tiempo generando intereses. Reducir la <strong>cuota</strong> da más liquidez mensual pero el ahorro es menor. Si tienes margen económico, lo óptimo suele ser reducir plazo.</>),
    q2: "¿Cuándo es rentable amortizar anticipadamente?",
    a2: "Es rentable cuando el tipo de interés de tu hipoteca supera la rentabilidad que obtendrías invirtiendo ese dinero. Con tipos altos (≥ 3,5%), amortizar suele ser mejor que productos de ahorro conservadores. Con tipos bajos, puede ser preferible invertir.",
    q3: "¿Hay deducción fiscal por amortizar la hipoteca?",
    a3: "La deducción por adquisición de vivienda habitual solo aplica a hipotecas contratadas antes del 1 de enero de 2013. Si tu hipoteca es posterior a esa fecha, no tendrás deducción en la declaración de la renta por las amortizaciones.",
    q4: "¿Qué comisión pueden cobrarme por amortizar anticipadamente?",
    a4: "La Ley 5/2019 reguladora de los contratos de crédito inmobiliario fijó topes claros. En hipotecas a tipo variable, la compensación no puede superar el 0,25 % del capital amortizado durante los 3 primeros años, ni el 0,15 % durante los 5 primeros, según lo pactado, y es cero a partir de ese momento. En hipotecas a tipo fijo, el límite es del 2 % durante los 10 primeros años y del 1,5 % después. Además, la entidad solo puede cobrar la comisión si acredita una pérdida financiera real, y nunca puede superar ese perjuicio. Para hipotecas anteriores a 2019 se aplican los topes vigentes cuando se firmaron.",
    q5: "¿Conviene amortizar la hipoteca o invertir ese dinero?",
    a5: "La comparación se reduce a contrastar el tipo de interés de tu hipoteca con la rentabilidad neta que esperas de la inversión. Si tu hipoteca está al 3 % y esperas obtener un 6 % invirtiendo, matemáticamente sale mejor invertir, aunque debes descontar la fiscalidad del ahorro (entre el 19 % y el 30 %), lo que reduce ese 6 % a algo más de un 4,5 % neto. Amortizar, en cambio, ofrece una rentabilidad segura y libre de impuestos equivalente al tipo de tu préstamo. Con hipotecas por encima del 4 % suele compensar amortizar; por debajo del 2,5 %, invertir. Entre medias entra en juego tu tolerancia al riesgo y el valor que des a la tranquilidad de deber menos.",
    deepTitle: "Reducir cuota o reducir plazo: cómo funciona",
    deep: "Al amortizar anticipadamente entregas un capital que se descuenta directamente de la deuda pendiente, y a partir de ahí puedes elegir entre dos efectos. Si reduces cuota, el plazo se mantiene y la mensualidad baja, lo que alivia tu presupuesto mensual pero sigues pagando intereses durante los mismos años. Si reduces plazo, la cuota se mantiene igual y lo que se acorta es el número de mensualidades restantes, con lo que dejas de pagar intereses en los últimos años del préstamo. Como los intereses se calculan sobre el capital pendiente a lo largo del tiempo, eliminar años completos de deuda ahorra bastante más que rebajar ligeramente cada mensualidad.",
    exampleTitle: "Ejemplo resuelto",
    example: "Partimos de una hipoteca de 150.000 € al 3 % a 25 años, con una cuota mensual de unos 711 € y un coste total en intereses de unos 63.400 €. Si amortizas 10.000 € al comienzo y eliges reducir cuota, la mensualidad baja a unos 664 € y el ahorro total en intereses ronda los 4.200 €. Si en cambio eliges reducir plazo, mantienes la cuota de 711 € pero terminas de pagar 29 meses antes, y el ahorro en intereses asciende a unos 10.600 €. Con la misma aportación, reducir plazo ahorra aquí más del doble.",
    tableTitle: "Efecto de amortizar 10.000 € (hipoteca de 150.000 € al 3 % a 25 años)",
    tableCol1: "Modalidad",
    tableCol2: "Ahorro en intereses",
    interpretTitle: "Cómo interpretar el resultado",
    interpret: "Reducir plazo ahorra más intereses casi siempre, pero reducir cuota da más margen de maniobra en el presupuesto mensual, algo valioso si tus ingresos son variables o si prevés gastos importantes a corto plazo. Una estrategia intermedia habitual consiste en reducir plazo mientras la situación económica sea holgada y cambiar a reducir cuota si aparecen dificultades. Ten en cuenta además dos factores prácticos: amortizar es más rentable cuanto antes se hace, porque en los primeros años la mayor parte de la cuota son intereses, y conviene no vaciar el colchón de emergencia para amortizar, ya que recuperar ese dinero después exigiría pedir un préstamo nuevo, casi con seguridad más caro que la hipoteca.",
  },
  en: {
    title: "Early Mortgage Repayment Calculator",
    subtitle: "Calculate how much interest you save by repaying your mortgage early, and choose between reducing the monthly payment or shortening the term.",
    intro1: "Early mortgage repayment consists of returning part of the outstanding capital to the bank before the term stipulated in the contract. This reduces the outstanding debt and therefore future interest. The two main options are: reducing the monthly payment (keeping the original term) or shortening the total mortgage term (keeping the same payment). Most experts recommend shortening the term because the total savings in interest are significantly greater.",
    intro2: "This calculator shows you in detail how much you would save in each scenario, including the early repayment fee applicable under Spanish Law 5/2019 for fixed and variable mortgages. Enter the outstanding balance, interest rate and months remaining, and you will get a clear comparison between continuing with the original plan or making an early repayment.",
    disclaimer: "Calculations are indicative. The exact fee may vary depending on the specific terms of your mortgage contract.",
    card1Title: "Your current mortgage",
    card2Title: "Early repayment",
    capitalLabel: "Outstanding balance (€)",
    tipoLabel: "Annual interest rate (%)",
    mesesLabel: "Months remaining",
    tipoHipotecaLabel: "Mortgage type",
    variable: "Variable",
    fija: "Fixed",
    importeLabel: "Amount to repay (€)",
    opcionLabel: "Use of repayment",
    reducirPlazo: "Reduce term (same payment)",
    reducirCuota: "Reduce payment (same term)",
    cuotaActualLabel: "Current payment",
    nuevaCuotaLabel: "New payment",
    plazoNuevoLabel: "New term",
    ahorroLabel: "Interest saved",
    comisionLabel: "Estimated fee",
    comparativaTitle: "Comparison",
    sinAmortizar: "Without repayment",
    conAmortizacion: "With repayment",
    rowLabels: ["Monthly payment", "Remaining term", "Remaining interest", "Outstanding balance"],
    note: (<><strong>Indicative fee:</strong> Variable mortgage: 0.15% (first 3 years) or 0.25% (years 4–5), 0% from year 6. Fixed mortgage: 2% (first 10 years), 1.5% from year 11 (Law 5/2019). This calculator applies the current maximum as a reference.</>),
    faqTitle: "Frequently asked questions",
    q1: "Is it better to reduce the payment or the term?",
    a1: (<>Reducing the <strong>term</strong> saves more in total interest because the capital generates interest for less time. Reducing the <strong>payment</strong> gives more monthly liquidity but less savings. If you have financial room, reducing the term is usually optimal.</>),
    q2: "When is early repayment worthwhile?",
    a2: "It is worthwhile when your mortgage interest rate exceeds the return you would get by investing that money. With high rates (≥ 3.5%), early repayment is usually better than conservative savings products. With low rates, investing may be preferable.",
    q3: "Is there a tax deduction for repaying the mortgage?",
    a3: "The main residence acquisition deduction only applies to mortgages taken out before 1 January 2013. If your mortgage is later than that date, there is no income tax deduction for repayments.",
    q4: "What fee can I be charged for early repayment?",
    a4: "Law 5/2019 on real estate credit contracts set clear caps. On variable-rate mortgages, the compensation cannot exceed 0.25% of the amount repaid during the first 3 years, or 0.15% during the first 5, depending on what was agreed, and is zero thereafter. On fixed-rate mortgages, the limit is 2% during the first 10 years and 1.5% afterwards. In addition, the lender can only charge the fee if it can demonstrate an actual financial loss, and it can never exceed that loss. For mortgages signed before 2019, the caps in force at the time of signing apply.",
    q5: "Should I repay the mortgage early or invest the money?",
    a5: "The comparison boils down to contrasting your mortgage rate with the net return you expect from the investment. If your mortgage is at 3% and you expect 6% from investing, mathematically investing wins, though you must deduct savings taxation (between 19% and 30%), which cuts that 6% to just over 4.5% net. Early repayment, by contrast, offers a certain, tax-free return equal to your loan's rate. With mortgages above 4% repaying usually pays off; below 2.5%, investing does. In between, your risk tolerance and the value you place on owing less come into play.",
    deepTitle: "Reducing the payment or the term: how it works",
    deep: "When you repay early you hand over capital that is deducted directly from the outstanding debt, and from there you can choose between two effects. If you reduce the payment, the term stays the same and the monthly amount falls, easing your monthly budget but you keep paying interest for the same number of years. If you reduce the term, the payment stays the same and what shortens is the number of remaining instalments, so you stop paying interest in the loan's final years. Since interest is calculated on the outstanding capital over time, eliminating whole years of debt saves considerably more than slightly lowering each monthly payment.",
    exampleTitle: "Worked example",
    example: "Start from a €150,000 mortgage at 3% over 25 years, with a monthly payment of about €711 and a total interest cost of roughly €63,400. If you repay €10,000 at the start and choose to reduce the payment, the monthly amount falls to about €664 and total interest savings come to around €4,200. If instead you choose to reduce the term, you keep the €711 payment but finish 29 months earlier, and interest savings rise to about €10,600. With the same contribution, reducing the term saves more than twice as much here.",
    tableTitle: "Effect of repaying €10,000 (€150,000 mortgage at 3% over 25 years)",
    tableCol1: "Option",
    tableCol2: "Interest saved",
    interpretTitle: "How to interpret the result",
    interpret: "Reducing the term saves more interest almost always, but reducing the payment gives more room in your monthly budget, which is valuable if your income is variable or you anticipate significant short-term expenses. A common middle strategy is to reduce the term while your finances are comfortable and switch to reducing the payment if difficulties arise. Bear in mind two practical factors as well: repaying early is more profitable the sooner you do it, because in the first years most of the payment is interest, and it is unwise to drain your emergency fund to repay, since getting that money back later would mean taking out a new loan, almost certainly more expensive than the mortgage.",
  },
};

const AMORT_TABLE = [
  { es: "Reducir cuota", en: "Reduce payment", ahorro: "≈ 4.200 €", efecto: "Cuota de 711 € a 664 €", efectoEn: "Payment from €711 to €664" },
  { es: "Reducir plazo", en: "Reduce term", ahorro: "≈ 10.600 €", efecto: "29 meses menos de hipoteca", efectoEn: "29 months less of mortgage" },
];

export default function AmortizacionAnticipada() {
  const locale = useLocale();
  const t = T[locale];

  const [capital, setCapital] = useState("150000");
  const [tipo, setTipo] = useState("3.5");
  const [meses, setMeses] = useState("240");
  const [tipoHipoteca, setTipoHipoteca] = useState("variable");
  const [importe, setImporte] = useState("10000");
  const [opcion, setOpcion] = useState("plazo");

  const C = parseFloat(capital) || 0;
  const r = (parseFloat(tipo) || 0) / 100 / 12;
  const M = parseInt(meses) || 0;
  const A = parseFloat(importe) || 0;

  const valid = C > 0 && M > 0 && A > 0 && A < C;

  const cuotaActual = valid ? calcCuota(C, r, M) : 0;
  const interesesActuales = valid ? totalIntereses(C, r, M) : 0;
  const capitalNuevo = C - A;

  const comisionPct = tipoHipoteca === "variable" ? 0.0015 : 0.02;
  const comision = A * comisionPct;

  let cuotaNueva = 0;
  let mesesNuevos = 0;
  let interesesNuevos = 0;
  let ahorro = 0;

  if (valid) {
    if (opcion === "cuota") {
      mesesNuevos = M;
      cuotaNueva = calcCuota(capitalNuevo, r, M);
      interesesNuevos = totalIntereses(capitalNuevo, r, M);
    } else {
      cuotaNueva = cuotaActual;
      mesesNuevos = calcMesesNuevos(capitalNuevo, r, cuotaActual);
      interesesNuevos = cuotaNueva * mesesNuevos - capitalNuevo;
    }
    ahorro = interesesActuales - interesesNuevos - comision;
  }

  const añosActuales = Math.floor(M / 12);
  const mesesActualesResto = M % 12;
  const añosNuevos = Math.floor(mesesNuevos / 12);
  const mesesNuevosResto = mesesNuevos % 12;

  const termStr = (y: number, m: number) => `${y}a ${m}m`;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Building className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
      </div>
      <p className="text-muted-foreground mb-6">{t.subtitle}</p>

      <div className="prose prose-sm dark:prose-invert max-w-none mb-8 space-y-3 text-gray-700 dark:text-gray-300">
        <p>{t.intro1}</p>
        <p>{t.intro2}</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t.card1Title}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="capital">{t.capitalLabel}</Label>
            <Input id="capital" type="number" value={capital} onChange={(e) => setCapital(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="tipo">{t.tipoLabel}</Label>
            <Input id="tipo" type="number" step="0.01" value={tipo} onChange={(e) => setTipo(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="meses">{t.mesesLabel}</Label>
            <Input id="meses" type="number" value={meses} onChange={(e) => setMeses(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="tipoHipoteca">{t.tipoHipotecaLabel}</Label>
            <Select value={tipoHipoteca} onValueChange={setTipoHipoteca}>
              <SelectTrigger id="tipoHipoteca" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="variable">{t.variable}</SelectItem>
                <SelectItem value="fija">{t.fija}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t.card2Title}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="importe">{t.importeLabel}</Label>
            <Input id="importe" type="number" value={importe} onChange={(e) => setImporte(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="opcion">{t.opcionLabel}</Label>
            <Select value={opcion} onValueChange={setOpcion}>
              <SelectTrigger id="opcion" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plazo">{t.reducirPlazo}</SelectItem>
                <SelectItem value="cuota">{t.reducirCuota}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {valid && (
        <>
          <Card className="border-primary/30 bg-primary/5 mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">{t.cuotaActualLabel}</p>
                  <p className="text-xl font-bold">{eur(cuotaActual)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {opcion === "cuota" ? t.nuevaCuotaLabel : t.plazoNuevoLabel}
                  </p>
                  <p className="text-xl font-bold text-primary">
                    {opcion === "cuota"
                      ? eur(cuotaNueva)
                      : termStr(añosNuevos, mesesNuevosResto)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.ahorroLabel}</p>
                  <p className="text-xl font-bold text-emerald-600">{eur(ahorro)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.comisionLabel}</p>
                  <p className="text-xl font-bold text-amber-600">{eur(comision)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t.comparativaTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm text-center font-medium border-b pb-2 mb-2">
                <span></span>
                <span className="text-muted-foreground">{t.sinAmortizar}</span>
                <span className="text-primary">{t.conAmortizacion}</span>
              </div>
              {[
                [t.rowLabels[0], eur(cuotaActual), eur(cuotaNueva)],
                [t.rowLabels[1], termStr(añosActuales, mesesActualesResto), termStr(añosNuevos, mesesNuevosResto)],
                [t.rowLabels[2], eur(interesesActuales), eur(interesesNuevos)],
                [t.rowLabels[3], eur(C), eur(capitalNuevo)],
              ].map(([label, antes, despues]) => (
                <div key={label} className="grid grid-cols-3 gap-4 text-sm py-2 border-b">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-center">{antes}</span>
                  <span className="text-center font-semibold text-primary">{despues}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8 text-sm text-amber-800 dark:text-amber-300">
        {t.note}
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
              <th className="py-2 font-medium">{t.tableCol2}</th>
            </tr>
          </thead>
          <tbody>
            {AMORT_TABLE.map((row) => (
              <tr key={row.es} className="border-b border-gray-100 dark:border-white/5">
                <td className="py-2 pr-4 text-gray-900 dark:text-white">{locale === "en" ? row.en : row.es}</td>
                <td className="py-2 font-semibold text-primary whitespace-nowrap">{row.ahorro}</td>
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
        </Accordion>
      </section>

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}
