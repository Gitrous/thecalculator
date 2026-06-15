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
  },
  en: {
    title: "Early Mortgage Repayment Calculator",
    subtitle: "Calculate how much interest you save by repaying your mortgage early, and choose between reducing the monthly payment or shortening the term.",
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
  },
};

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
      <p className="text-muted-foreground mb-8">{t.subtitle}</p>

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
        </Accordion>
      </section>
    </div>
  );
}
