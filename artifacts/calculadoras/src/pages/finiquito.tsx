import { useState } from "react";
import { FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function eur(n: number): string {
  return n.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  });
}

export default function Finiquito() {
  const [annual, setAnnual] = useState("24000");
  const [vacDays, setVacDays] = useState("10");
  const [workedDays, setWorkedDays] = useState("15");
  const [monthsSinceExtra, setMonthsSinceExtra] = useState("3");

  const salaryAnnual = parseFloat(annual) || 0;
  const dailyRate = salaryAnnual / 365;
  const vac = (parseFloat(vacDays) || 0) * dailyRate;
  const worked = (parseFloat(workedDays) || 0) * dailyRate;

  // Two extra payments per year → each accrues over 6 months.
  const monthlyGross = salaryAnnual / 14; // 12 monthly + 2 extra
  const extra =
    ((parseFloat(monthsSinceExtra) || 0) / 6) * monthlyGross;

  const total = vac + worked + extra;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Calculadora de Finiquito
        </h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Estima el finiquito que te corresponde: vacaciones no disfrutadas, días
        trabajados sin cobrar y parte proporcional de las pagas extra.
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Datos</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="annual">Salario bruto anual (€)</Label>
            <Input
              id="annual"
              type="number"
              value={annual}
              onChange={(e) => setAnnual(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="vac">Días de vacaciones pendientes</Label>
            <Input
              id="vac"
              type="number"
              value={vacDays}
              onChange={(e) => setVacDays(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="worked">Días trabajados sin cobrar (mes en curso)</Label>
            <Input
              id="worked"
              type="number"
              value={workedDays}
              onChange={(e) => setWorkedDays(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="extra">Meses desde la última paga extra</Label>
            <Input
              id="extra"
              type="number"
              value={monthsSinceExtra}
              onChange={(e) => setMonthsSinceExtra(e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/30 bg-primary/5 mb-6">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground mb-1">
              Finiquito estimado (bruto)
            </p>
            <p className="text-4xl font-bold text-primary">{eur(total)}</p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Vacaciones</p>
              <p className="text-lg font-semibold">{eur(vac)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Días trabajados</p>
              <p className="text-lg font-semibold">{eur(worked)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pagas extra</p>
              <p className="text-lg font-semibold">{eur(extra)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8 text-sm text-amber-800 dark:text-amber-300">
        Cálculo orientativo en bruto. No incluye la indemnización por despido
        (que depende del tipo de despido y la antigüedad) ni retenciones de IRPF.
        Consulta tu convenio o un asesor laboral para el importe exacto.
      </div>

      <section className="mt-4">
        <h2 className="text-xl font-semibold mb-4">Preguntas frecuentes</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="q1">
            <AccordionTrigger>¿El finiquito incluye la indemnización?</AccordionTrigger>
            <AccordionContent>
              No necesariamente. El finiquito son las cantidades pendientes
              (vacaciones, días trabajados, pagas extra). La indemnización por
              despido improcedente u objetivo se calcula y paga aparte.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>¿Las pagas extra van prorrateadas?</AccordionTrigger>
            <AccordionContent>
              Si tu nómina ya incluye las pagas prorrateadas cada mes, no se suman
              de nuevo en el finiquito. Pon 0 meses en ese caso.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
