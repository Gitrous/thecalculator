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
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { useLocale } from "@/lib/locale";

function eur(n: number): string {
  return n.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  });
}

const RATE = 0.314;
const FLAT_RATE = 88.64;

interface Tramo {
  max: number;
  base: number;
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

const T = {
  es: {
    title: "Calculadora Cuota Autónomos 2026",
    subtitle: "Estima tu cuota mensual al RETA según el sistema de tramos por rendimientos netos reales de 2026. Incluye la tarifa plana.",
    cardTitle: "Datos",
    netLabel: "Rendimiento neto mensual (€)",
    flatLabel: "Aplicar tarifa plana (primeros 12 meses)",
    feeLabel: "Cuota mensual estimada",
    tramoLabel: "Tramo",
    baseLabel: "Base mínima",
    note: "Estimación sobre la base mínima de cada tramo aplicando el tipo general (~31,4%). Puedes cotizar por una base superior y la cuota real puede variar. Verifica los importes vigentes en la Seguridad Social.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Qué son los rendimientos netos?",
    a1: "Son los ingresos menos los gastos deducibles de la actividad, menos una deducción adicional del 7% (3% para autónomos societarios). El tramo se determina según ese rendimiento neto mensual.",
    q2: "¿Cuánto dura la tarifa plana?",
    a2: "En 2026 la tarifa plana es de 80 €/mes de cuota base más el MEI (0,9%), unos 88,64 €/mes en total, durante los primeros 12 meses, prorrogable otros 12 si los rendimientos netos quedan por debajo del SMI (1.221 €/mes en 2026).",
  },
  en: {
    title: "Spanish Freelancer Social Security Calculator 2026",
    subtitle: "Estimate your monthly RETA contribution based on the 2026 income bracket system. Includes the flat rate.",
    cardTitle: "Data",
    netLabel: "Monthly net income (€)",
    flatLabel: "Apply flat rate (first 12 months)",
    feeLabel: "Estimated monthly contribution",
    tramoLabel: "Income bracket",
    baseLabel: "Minimum base",
    note: "Estimate based on the minimum base for each bracket applying the general rate (~31.4%). You can contribute on a higher base and the actual fee may vary. Check the current amounts at the Social Security.",
    faqTitle: "Frequently asked questions",
    q1: "What is net income?",
    a1: "It is income minus deductible business expenses, minus an additional 7% deduction (3% for company-based self-employed). The bracket is determined based on this monthly net income.",
    q2: "How long does the flat rate last?",
    a2: "In 2026 the flat rate is €80/month base fee plus the MEI (0.9%), about €88.64/month in total, for the first 12 months, extendable for another 12 months if net income stays below the minimum wage (€1,221/month in 2026).",
  },
};

export default function Autonomos() {
  const locale = useLocale();
  const t = T[locale];

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
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
      </div>
      <p className="text-muted-foreground mb-8">{t.subtitle}</p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t.cardTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="net">{t.netLabel}</Label>
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
            <Label htmlFor="flat">{t.flatLabel}</Label>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/30 bg-primary/5 mb-6">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground mb-1">{t.feeLabel}</p>
            <p className="text-4xl font-bold text-primary">{eur(fee)}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">{t.tramoLabel}</p>
              <p className="text-lg font-semibold">{tramo.label}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t.baseLabel}</p>
              <p className="text-lg font-semibold">{eur(tramo.base)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
        </Accordion>
      </section>

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}
