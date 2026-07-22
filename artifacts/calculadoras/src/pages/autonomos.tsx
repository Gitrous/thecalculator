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
    intro1: "Desde 2023, las cuotas de los trabajadores autónomos en España se calculan según los rendimientos netos reales, sustituyendo el antiguo sistema de base libre. El nuevo sistema divide a los autónomos en 15 tramos según su renta mensual, con cuotas que van desde los 230 € hasta los 590 € mensuales. El objetivo es que quien más gana, más cotice.",
    intro2: "Esta calculadora te muestra la cuota estimada para 2026 según el tramo al que perteneces, incluyendo la opción de la tarifa plana de 80 €/mes para los nuevos autónomos durante los primeros 12 meses. Recuerda que puedes solicitar cambios de base hasta 6 veces al año para ajustar tu cotización si tu renta real cambia.",
    disclaimer: "Estimación orientativa. Los importes exactos pueden variar. Consulta los tramos actualizados en la web de la Seguridad Social.",
    cardTitle: "Datos",
    netLabel: "Rendimiento neto mensual (€)",
    flatLabel: "Aplicar tarifa plana (primeros 12 meses)",
    feeLabel: "Cuota mensual estimada",
    tramoLabel: "Tramo",
    baseLabel: "Base mínima",
    note: "Estimación sobre la base mínima de cada tramo aplicando el tipo general (~31,4%). Puedes cotizar por una base superior y la cuota real puede variar. Verifica los importes vigentes en la Seguridad Social.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Qué son los rendimientos netos?",
    a1: "Los rendimientos netos son los ingresos de tu actividad menos los gastos deducibles, y sobre ese resultado se aplica una deducción adicional del 7 % en concepto de gastos genéricos (3 % si eres autónomo societario). El importe obtenido, dividido entre doce, es el rendimiento neto mensual que determina tu tramo de cotización. Es importante entender que no se cotiza sobre la facturación bruta sino sobre el beneficio real: si facturas 3.000 € al mes pero tienes 1.000 € de gastos deducibles, tu rendimiento neto rondará los 1.860 € tras aplicar la deducción del 7 %, no los 3.000 € facturados.",
    q2: "¿Cuánto dura la tarifa plana?",
    a2: "En 2026 la tarifa plana consiste en una cuota reducida de 80 € al mes más el mecanismo de equidad intergeneracional (0,9 %), lo que supone unos 88,64 € mensuales en total. Se aplica durante los primeros 12 meses de alta en el RETA y puede prorrogarse otros 12 meses adicionales siempre que tus rendimientos netos se mantengan por debajo del salario mínimo interprofesional (1.221 €/mes en 2026). Para acceder a ella no puedes haber estado de alta como autónomo en los dos años anteriores, o tres si ya disfrutaste de la tarifa plana en el pasado.",
    q3: "¿Puedo cambiar mi base de cotización durante el año?",
    a3: "Sí, y es una de las claves del sistema actual. Puedes solicitar hasta seis cambios de base de cotización al año, con efectos bimestrales: los cambios solicitados entre enero y febrero se aplican en marzo, los de marzo y abril en mayo, y así sucesivamente. Esta flexibilidad existe porque los ingresos de un autónomo pueden variar mucho de un mes a otro, y el sistema pretende que la cotización se ajuste a la realidad de cada momento. Conviene revisar tus previsiones al menos un par de veces al año para no cotizar de más ni quedarte corto.",
    q4: "¿Qué cubre la cuota de autónomos?",
    a4: "La cuota del RETA cubre varias contingencias. Incluye la asistencia sanitaria, la prestación por incapacidad temporal (baja por enfermedad o accidente), las contingencias profesionales, el cese de actividad —el equivalente al paro de los asalariados— y la cotización que genera tu futura pensión de jubilación. Desde 2019 todas estas coberturas son obligatorias, cuando antes algunas eran opcionales. Cuanto mayor sea la base por la que cotices, mayores serán tanto las prestaciones por baja como tu pensión futura, algo que conviene tener presente si eliges siempre la base mínima.",
    q5: "¿Qué pasa si mis rendimientos reales no coinciden con lo que declaré?",
    a5: "El sistema se regulariza al año siguiente. La Seguridad Social cruza los datos con la Agencia Tributaria una vez presentada tu declaración de la renta y compara lo que cotizaste con lo que realmente ganaste. Si cotizaste por debajo del tramo que te correspondía, tendrás que abonar la diferencia; si cotizaste por encima, te devolverán el exceso de oficio. Por eso no es grave equivocarse en la previsión inicial, pero sí conviene ajustarla a lo largo del año para evitar encontrarte con una regularización elevada.",
    deepTitle: "Cómo funciona el sistema de cotización por tramos",
    deep: "Desde 2023 la cuota de autónomos ya no se elige libremente, sino que depende de los rendimientos netos que prevés obtener. El sistema define quince tramos de renta, cada uno con una base mínima de cotización asociada. El procedimiento es el siguiente: calculas tu rendimiento neto mensual previsto, localizas el tramo en el que encaja y aplicas el tipo de cotización general —en torno al 31,4 %— sobre la base mínima de ese tramo. Puedes elegir cotizar por una base superior a la mínima de tu tramo si quieres mejorar tus prestaciones futuras, pero nunca por debajo de ella.",
    exampleTitle: "Ejemplo resuelto",
    example: "Supongamos un autónomo que factura 2.500 € al mes y tiene 400 € de gastos deducibles. Su rendimiento antes de la deducción genérica es de 2.100 €; aplicando el 7 % de deducción adicional (147 €), el rendimiento neto queda en 1.953 €. Ese importe cae en el tramo de 1.850 a 2.030 €, cuya base mínima es de 1.209,15 €. Aplicando el tipo del 31,4 %, la cuota mensual estimada es de unos 380 €. Si ese mismo autónomo fuera nuevo y tuviera derecho a la tarifa plana, pagaría solo 88,64 € durante los primeros doce meses.",
    tableTitle: "Tramos de cotización y cuota estimada (2026)",
    tableCol1: "Rendimiento neto mensual",
    tableCol2: "Base mínima",
    tableCol3: "Cuota estimada",
    interpretTitle: "Cómo interpretar el resultado",
    interpret: "La cuota que obtienes es una estimación calculada sobre la base mínima de tu tramo, que es lo que paga la mayoría de autónomos. Conviene tener en cuenta tres matices. Primero, se trata de una previsión: la cifra definitiva se regulariza cuando Hacienda comunique tus rendimientos reales. Segundo, cotizar siempre por la base mínima abarata tu cuota hoy pero reduce tu futura pensión y tus prestaciones por baja, así que si tu actividad es estable puede compensar elegir una base algo superior. Tercero, la cuota es un gasto deducible en tu declaración de IRPF, por lo que su coste efectivo real es menor que el importe que abonas cada mes.",
  },
  en: {
    title: "Spanish Freelancer Social Security Calculator 2026",
    subtitle: "Estimate your monthly RETA contribution based on the 2026 income bracket system. Includes the flat rate.",
    intro1: "Since 2023, self-employed worker contributions in Spain have been calculated based on actual net income, replacing the old free-base system. The new system divides the self-employed into 15 brackets according to monthly income, with contributions ranging from €230 to €590 per month. The aim is for those who earn more to contribute more.",
    intro2: "This calculator shows you the estimated contribution for 2026 according to your bracket, including the option of the flat rate of €80/month for new self-employed workers during the first 12 months. Remember that you can apply to change your contribution base up to 6 times a year to adjust your contributions if your actual income changes.",
    disclaimer: "Indicative estimate. Exact amounts may vary. Check the updated brackets on the Social Security website.",
    cardTitle: "Data",
    netLabel: "Monthly net income (€)",
    flatLabel: "Apply flat rate (first 12 months)",
    feeLabel: "Estimated monthly contribution",
    tramoLabel: "Income bracket",
    baseLabel: "Minimum base",
    note: "Estimate based on the minimum base for each bracket applying the general rate (~31.4%). You can contribute on a higher base and the actual fee may vary. Check the current amounts at the Social Security.",
    faqTitle: "Frequently asked questions",
    q1: "What is net income?",
    a1: "Net income is your business revenue minus deductible expenses, with an additional 7% deduction applied to that result for generic expenses (3% for company-based self-employed workers). The resulting amount, divided by twelve, is the monthly net income that determines your contribution bracket. It is important to understand that contributions are not based on gross invoicing but on actual profit: if you invoice €3,000 a month but have €1,000 of deductible expenses, your net income will be around €1,860 after the 7% deduction, not the €3,000 invoiced.",
    q2: "How long does the flat rate last?",
    a2: "In 2026 the flat rate is a reduced fee of €80 per month plus the intergenerational equity mechanism (0.9%), around €88.64 per month in total. It applies during the first 12 months registered with the RETA scheme and can be extended for another 12 months provided your net income stays below the national minimum wage (€1,221/month in 2026). To qualify, you must not have been registered as self-employed in the previous two years, or three if you already benefited from the flat rate in the past.",
    q3: "Can I change my contribution base during the year?",
    a3: "Yes, and it is one of the key features of the current system. You can request up to six changes of contribution base per year, taking effect every two months: changes requested in January and February apply from March, those in March and April from May, and so on. This flexibility exists because a self-employed worker's income can vary a lot from month to month, and the system aims for contributions to match reality. It is worth reviewing your forecast at least twice a year so you neither overpay nor fall short.",
    q4: "What does the self-employed contribution cover?",
    a4: "The RETA contribution covers several contingencies. It includes healthcare, temporary incapacity benefit (sick leave through illness or accident), occupational contingencies, cessation of activity — the equivalent of unemployment benefit for employees — and the contributions that build your future retirement pension. Since 2019 all these coverages are compulsory, whereas some used to be optional. The higher the base you contribute on, the higher both your sick-leave benefits and your future pension will be, something worth bearing in mind if you always choose the minimum base.",
    q5: "What if my actual income doesn't match what I declared?",
    a5: "The system is reconciled the following year. Social Security cross-checks data with the tax authority once you have filed your income tax return and compares what you contributed with what you actually earned. If you contributed below the bracket that applied to you, you will have to pay the difference; if you contributed above it, the excess is refunded automatically. That is why getting the initial forecast wrong is not serious, but it is still worth adjusting it during the year to avoid a large reconciliation bill.",
    deepTitle: "How the bracket-based contribution system works",
    deep: "Since 2023 the self-employed contribution is no longer freely chosen but depends on the net income you expect to earn. The system defines fifteen income brackets, each with an associated minimum contribution base. The procedure is as follows: you calculate your expected monthly net income, find the bracket it falls into, and apply the general contribution rate — around 31.4% — to that bracket's minimum base. You may choose to contribute on a base higher than your bracket's minimum if you want to improve your future benefits, but never below it.",
    exampleTitle: "Worked example",
    example: "Take a self-employed worker who invoices €2,500 a month and has €400 of deductible expenses. Their income before the generic deduction is €2,100; applying the additional 7% deduction (€147), net income comes to €1,953. That amount falls in the €1,850–2,030 bracket, whose minimum base is €1,209.15. Applying the 31.4% rate, the estimated monthly contribution is about €380. If that same worker were newly registered and entitled to the flat rate, they would pay only €88.64 during the first twelve months.",
    tableTitle: "Contribution brackets and estimated fee (2026)",
    tableCol1: "Monthly net income",
    tableCol2: "Minimum base",
    tableCol3: "Estimated fee",
    interpretTitle: "How to interpret the result",
    interpret: "The fee you get is an estimate calculated on your bracket's minimum base, which is what most self-employed workers pay. Three caveats are worth keeping in mind. First, it is a forecast: the definitive figure is reconciled once the tax authority reports your actual income. Second, always contributing on the minimum base lowers your fee today but reduces your future pension and sick-leave benefits, so if your activity is stable it may pay to choose a somewhat higher base. Third, the contribution is a deductible expense on your income tax return, so its real effective cost is lower than the amount you pay each month.",
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
      <p className="text-muted-foreground mb-6">{t.subtitle}</p>

      <div className="prose prose-sm dark:prose-invert max-w-none mb-8 space-y-3 text-gray-700 dark:text-gray-300">
        <p>{t.intro1}</p>
        <p>{t.intro2}</p>
      </div>

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
            {TRAMOS.map((tramo) => (
              <tr key={tramo.label} className="border-b border-gray-100 dark:border-white/5">
                <td className="py-2 pr-4 text-gray-900 dark:text-white whitespace-nowrap">{tramo.label}</td>
                <td className="py-2 pr-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">{eur(tramo.base)}</td>
                <td className="py-2 font-semibold text-primary whitespace-nowrap">{eur(tramo.base * RATE)}</td>
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
