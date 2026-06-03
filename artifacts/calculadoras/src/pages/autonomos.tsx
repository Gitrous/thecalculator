import { useState } from "react";
import { UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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

// RETA 2025 – tramos por rendimientos netos mensuales (base mínima de cotización).
// La cuota se estima aplicando el tipo de cotización general (~31,4%) a la base
// mínima de cada tramo.
const RATE = 0.314;
const FLAT_RATE = 87.61; // Tarifa plana 2025 (primeros 12 meses).

interface Tramo {
  max: number; // rendimiento neto mensual máximo del tramo (€)
  base: number; // base mínima de cotización (€)
  label: string;
}

const TRAMOS: Tramo[] = [
  { max: 670, base: 653.59, label: "≤ 670 €" },
  { max: 900, base: 718.95, label: "670 – 900 €" },
  { max: 1166.7, base: 849.67, label: "900 – 1.166,70 €" },
  { max: 1300, base: 950.98, label: "1.166,70 – 1.300 €" },
  { max: 1500, base: 960.78, label: "1.300 – 1.500 €" },
  { max: 1700, base: 960.78, label: "1.500 – 1.700 €" },
  { max: 1850, base: 1143.79, label: "1.700 – 1.850 €" },
  { max: 2030, base: 1209.15, label: "1.850 – 2.030 €" },
  { max: 2330, base: 1274.51, label: "2.030 – 2.330 €" },
  { max: 2760, base: 1356.21, label: "2.330 – 2.760 €" },
  { max: 3190, base: 1437.91, label: "2.760 – 3.190 €" },
  { max: 3620, base: 1519.61, label: "3.190 – 3.620 €" },
  { max: 4050, base: 1601.31, label: "3.620 – 4.050 €" },
  { max: 6000, base: 1732.03, label: "4.050 – 6.000 €" },
  { max: Infinity, base: 1928.1, label: "> 6.000 €" },
];

function findTramo(net: number): Tramo {
  return TRAMOS.find((t) => net <= t.max) ?? TRAMOS[TRAMOS.length - 1];
}

export default function Autonomos() {
  const [net, setNet] = useState("1500");
  const [flat, setFlat] = useState(false);

  const value = parseFloat(net) || 0;
  const tramo = findTramo(value);
  const fee = flat ? FLAT_RATE : tramo.base * RATE;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <UserCheck className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Calculadora Cuota Autónomos 2025
        </h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Estima tu cuota mensual al RETA según el sistema de tramos por
        rendimientos netos reales de 2025. Incluye la tarifa plana.
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Datos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="net">Rendimiento neto mensual (€)</Label>
            <Input
              id="net"
              type="number"
              value={net}
              onChange={(e) => setNet(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex items-center gap-3">
            <Switch id="flat" checked={flat} onCheckedChange={setFlat} />
            <Label htmlFor="flat">Aplicar tarifa plana (primeros 12 meses)</Label>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/30 bg-primary/5 mb-6">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground mb-1">Cuota mensual estimada</p>
            <p className="text-4xl font-bold text-primary">{eur(fee)}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Tramo</p>
              <p className="text-lg font-semibold">{tramo.label}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Base mínima</p>
              <p className="text-lg font-semibold">{eur(tramo.base)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8 text-sm text-amber-800 dark:text-amber-300">
        Estimación sobre la base mínima de cada tramo aplicando el tipo general
        (~31,4%). Puedes cotizar por una base superior y la cuota real puede
        variar. Verifica los importes vigentes en la Seguridad Social.
      </div>

      <section className="mt-4">
        <h2 className="text-xl font-semibold mb-4">Preguntas frecuentes</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="q1">
            <AccordionTrigger>¿Qué son los rendimientos netos?</AccordionTrigger>
            <AccordionContent>
              Son los ingresos menos los gastos deducibles de la actividad, menos
              una deducción adicional del 7% (3% para autónomos societarios). El
              tramo se determina según ese rendimiento neto mensual.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>¿Cuánto dura la tarifa plana?</AccordionTrigger>
            <AccordionContent>
              En 2025 la tarifa plana es de 87,61 €/mes durante los primeros 12
              meses, prorrogable otros 12 si los rendimientos netos quedan por
              debajo del SMI.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
