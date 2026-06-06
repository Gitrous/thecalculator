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

export default function AmortizacionAnticipada() {
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

  // Comisión por amortización anticipada (Ley 5/2019)
  const comisionPct = tipoHipoteca === "variable" ? 0.0015 : 0.02;
  const comision = A * comisionPct;

  let cuotaNueva = 0;
  let mesesNuevos = 0;
  let interesesNuevos = 0;
  let ahorro = 0;

  if (valid) {
    if (opcion === "cuota") {
      // Mantiene el plazo, reduce la cuota
      mesesNuevos = M;
      cuotaNueva = calcCuota(capitalNuevo, r, M);
      interesesNuevos = totalIntereses(capitalNuevo, r, M);
    } else {
      // Mantiene la cuota, reduce el plazo
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

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Building className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Calculadora de Amortización Anticipada de Hipoteca
        </h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Calcula cuánto ahorras en intereses amortizando anticipadamente tu
        hipoteca, y elige entre reducir la cuota mensual o acortar el plazo.
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Tu hipoteca actual</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="capital">Capital pendiente (€)</Label>
            <Input id="capital" type="number" value={capital} onChange={(e) => setCapital(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="tipo">Tipo de interés anual (%)</Label>
            <Input id="tipo" type="number" step="0.01" value={tipo} onChange={(e) => setTipo(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="meses">Meses restantes</Label>
            <Input id="meses" type="number" value={meses} onChange={(e) => setMeses(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="tipoHipoteca">Tipo de hipoteca</Label>
            <Select value={tipoHipoteca} onValueChange={setTipoHipoteca}>
              <SelectTrigger id="tipoHipoteca" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="variable">Variable</SelectItem>
                <SelectItem value="fija">Fija</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Amortización anticipada</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="importe">Importe a amortizar (€)</Label>
            <Input id="importe" type="number" value={importe} onChange={(e) => setImporte(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="opcion">Destino de la amortización</Label>
            <Select value={opcion} onValueChange={setOpcion}>
              <SelectTrigger id="opcion" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plazo">Reducir plazo (misma cuota)</SelectItem>
                <SelectItem value="cuota">Reducir cuota (mismo plazo)</SelectItem>
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
                  <p className="text-sm text-muted-foreground">Cuota actual</p>
                  <p className="text-xl font-bold">{eur(cuotaActual)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {opcion === "cuota" ? "Nueva cuota" : "Plazo nuevo"}
                  </p>
                  <p className="text-xl font-bold text-primary">
                    {opcion === "cuota"
                      ? eur(cuotaNueva)
                      : `${añosNuevos}a ${mesesNuevosResto}m`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ahorro en intereses</p>
                  <p className="text-xl font-bold text-emerald-600">{eur(ahorro)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Comisión estimada</p>
                  <p className="text-xl font-bold text-amber-600">{eur(comision)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Comparativa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm text-center font-medium border-b pb-2 mb-2">
                <span></span>
                <span className="text-muted-foreground">Sin amortizar</span>
                <span className="text-primary">Con amortización</span>
              </div>
              {[
                ["Cuota mensual", eur(cuotaActual), eur(cuotaNueva)],
                [
                  "Plazo restante",
                  `${añosActuales}a ${mesesActualesResto}m`,
                  `${añosNuevos}a ${mesesNuevosResto}m`,
                ],
                ["Intereses restantes", eur(interesesActuales), eur(interesesNuevos)],
                ["Capital pendiente", eur(C), eur(capitalNuevo)],
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
        <strong>Comisión indicativa:</strong> Hipoteca variable: 0,15% (primeros
        3 años) o 0,25% (años 4–5), 0% desde el 6.º año. Hipoteca fija: 2%
        (primeros 10 años), 1,5% desde el 11.º año (Ley 5/2019). Esta
        calculadora aplica el máximo vigente como referencia.
      </div>

      <section className="mt-4">
        <h2 className="text-xl font-semibold mb-4">Preguntas frecuentes</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="q1">
            <AccordionTrigger>¿Es mejor reducir cuota o plazo?</AccordionTrigger>
            <AccordionContent>
              Reducir el <strong>plazo</strong> ahorra más en intereses totales
              porque el capital queda menos tiempo generando intereses. Reducir la
              <strong> cuota</strong> da más liquidez mensual pero el ahorro es
              menor. Si tienes margen económico, lo óptimo suele ser reducir plazo.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>¿Cuándo es rentable amortizar anticipadamente?</AccordionTrigger>
            <AccordionContent>
              Es rentable cuando el tipo de interés de tu hipoteca supera la
              rentabilidad que obtendrías invirtiendo ese dinero. Con tipos altos
              (≥ 3,5%), amortizar suele ser mejor que productos de ahorro
              conservadores. Con tipos bajos, puede ser preferible invertir.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>¿Hay deducción fiscal por amortizar la hipoteca?</AccordionTrigger>
            <AccordionContent>
              La deducción por adquisición de vivienda habitual solo aplica a
              hipotecas contratadas antes del 1 de enero de 2013. Si tu hipoteca
              es posterior a esa fecha, no tendrás deducción en la declaración
              de la renta por las amortizaciones.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
