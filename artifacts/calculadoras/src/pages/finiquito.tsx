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

const T = {
  es: {
    title: "Calculadora de Finiquito",
    subtitle: "Estima el finiquito que te corresponde: vacaciones no disfrutadas, días trabajados sin cobrar y parte proporcional de las pagas extra.",
    intro1: "El finiquito es la liquidación económica que la empresa está obligada a entregar al trabajador cuando se extingue el contrato laboral, sea por despido, renuncia voluntaria, fin del contrato o mutuo acuerdo. Recoge tres conceptos básicos: los días de vacaciones no disfrutados, los salarios del mes en curso pendientes de cobro y la parte proporcional de las pagas extraordinarias.",
    intro2: "Es importante distinguir el finiquito de la indemnización por despido: el finiquito siempre se cobra, mientras que la indemnización solo corresponde en determinados tipos de despido (improcedente: 33 días/año, objetivo: 20 días/año). Esta calculadora te ayuda a estimar el importe bruto del finiquito para que puedas verificar que el documento que te propone la empresa es correcto.",
    disclaimer: "Cálculo orientativo en bruto. No incluye la indemnización por despido ni las retenciones de IRPF. Consulta con un asesor laboral para el importe exacto.",
    cardTitle: "Datos",
    annualLabel: "Salario bruto anual (€)",
    vacLabel: "Días de vacaciones pendientes",
    workedLabel: "Días trabajados sin cobrar (mes en curso)",
    extraLabel: "Meses desde la última paga extra",
    totalLabel: "Finiquito estimado (bruto)",
    vacationsLabel: "Vacaciones",
    workedDaysLabel: "Días trabajados",
    bonusLabel: "Pagas extra",
    note: "Cálculo orientativo en bruto. No incluye la indemnización por despido (que depende del tipo de despido y la antigüedad) ni retenciones de IRPF. Consulta tu convenio o un asesor laboral para el importe exacto.",
    howTitle: "Qué es el finiquito y cómo se calcula",
    how1:
      "El finiquito es la cantidad que la empresa te debe al terminar el contrato, sea cual sea el motivo. Reúne tres conceptos: los días de vacaciones que no has disfrutado, los salarios devengados y aún no cobrados del mes en curso y la parte proporcional de las pagas extraordinarias acumulada desde la última paga.",
    how2:
      "Cada parte se calcula a partir del salario diario (salario bruto anual dividido entre 365). Las vacaciones pendientes y los días trabajados se multiplican por ese salario diario, y la prorrata de pagas extra se calcula según los meses transcurridos. Esta calculadora suma los tres conceptos para darte una estimación en bruto.",
    exampleTitle: "Ejemplo",
    example:
      "Con un salario bruto anual de 24.000 € (≈ 65,75 €/día), 10 días de vacaciones pendientes suponen unos 657 €, a los que se añaden los días trabajados sin cobrar y la parte proporcional de las pagas extra.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿El finiquito incluye la indemnización por despido?",
    a1: "No. Son dos conceptos distintos. El finiquito recoge las cantidades que la empresa te debe en el momento de la extinción del contrato: los días de vacaciones no disfrutadas, los salarios devengados y no cobrados del mes en curso y la parte proporcional de las pagas extraordinarias. La indemnización por despido, en cambio, es una compensación adicional que solo corresponde en determinados tipos de extinción: 33 días por año trabajado en despido improcedente y 20 días en despido por causas objetivas (económicas, técnicas, etc.). Puedes firmar el finiquito sin renunciar a reclamar la indemnización si no estás de acuerdo con el motivo del despido.",
    q2: "¿Las pagas extra van prorrateadas en mi nómina?",
    a2: "Depende de tu contrato y convenio colectivo. Algunas empresas pagan dos pagas extra íntegras (normalmente en julio y diciembre) mientras que otras las prorratean mensualmente, es decir, dividen el importe total entre 12 meses y lo incluyen en cada nómina. Si tus pagas ya están prorrateadas, debes introducir 0 meses en esta calculadora para evitar contarlas dos veces. Puedes comprobarlo mirando tu nómina: si aparece un concepto como 'parte proporcional pagas extra' o 'prorrata pagas', ya están incluidas.",
    q3: "¿Cuándo debe pagar la empresa el finiquito?",
    a3: "El finiquito debe abonarse en el momento de la firma o, como máximo, el último día de trabajo. En la práctica, muchas empresas lo liquidan en la siguiente fecha de pago de nóminas. Si la empresa se retrasa, el trabajador tiene derecho a reclamar un recargo del 10% anual sobre las cantidades pendientes. El finiquito se firma en presencia del trabajador, que puede pedir que un representante sindical esté presente antes de firmarlo. Nunca firmes un finiquito sin leerlo y verificar que los importes son correctos.",
  },
  en: {
    title: "Severance Pay Calculator (Spain)",
    subtitle: "Estimate your severance pay: unused holidays, unpaid worked days and pro-rata bonus payments.",
    intro1: "Severance pay (finiquito) is the financial settlement the company is obliged to give an employee when the employment contract ends, whether through dismissal, voluntary resignation, end of contract or mutual agreement. It covers three basic items: unused holiday days, wages for the current month not yet paid, and the pro-rata share of bonus payments.",
    intro2: "It is important to distinguish severance pay from dismissal compensation: severance pay is always owed, while compensation is only applicable in certain types of dismissal (unfair dismissal: 33 days/year, objective dismissal: 20 days/year). This calculator helps you estimate the gross severance amount so you can verify that the document proposed by the company is correct.",
    disclaimer: "Indicative gross estimate. Does not include dismissal compensation or income tax withholding. Consult a labour adviser for the exact amount.",
    cardTitle: "Data",
    annualLabel: "Annual gross salary (€)",
    vacLabel: "Pending holiday days",
    workedLabel: "Worked days not yet paid (current month)",
    extraLabel: "Months since last bonus payment",
    totalLabel: "Estimated severance pay (gross)",
    vacationsLabel: "Holidays",
    workedDaysLabel: "Worked days",
    bonusLabel: "Bonus payments",
    note: "Indicative gross estimate. Does not include severance indemnity (which depends on the type of dismissal and seniority) or income tax withholding. Consult your collective agreement or a labour adviser for the exact amount.",
    howTitle: "What severance pay is and how to calculate it",
    how1:
      "Severance pay (finiquito) is the amount the company owes you when the contract ends, whatever the reason. It brings together three items: the holiday days you have not taken, the wages accrued but not yet paid for the current month, and the pro-rata share of bonus payments built up since the last one.",
    how2:
      "Each part is calculated from the daily wage (annual gross salary divided by 365). Pending holidays and worked days are multiplied by that daily wage, and the bonus pro-rata is worked out from the months elapsed. This calculator adds the three items to give you a gross estimate.",
    exampleTitle: "Example",
    example:
      "With an annual gross salary of €24,000 (≈ €65.75/day), 10 pending holiday days come to about €657, on top of which you add the unpaid worked days and the pro-rata share of bonus payments.",
    faqTitle: "Frequently asked questions",
    q1: "Does severance pay include the dismissal indemnity?",
    a1: "No — they are two separate concepts. Severance pay (finiquito) covers amounts the company owes you at the time the contract ends: unused holiday days, wages accrued but not yet paid in the current month, and the pro-rata share of bonus payments. The dismissal indemnity, by contrast, is additional compensation that only applies in certain types of termination: 33 days per year worked for unfair dismissal and 20 days for objective dismissal (economic, technical, etc.). You can sign the severance document without waiving your right to claim the indemnity if you disagree with the reason for dismissal.",
    q2: "Are bonus payments already pro-rated in my salary?",
    a2: "It depends on your contract and collective agreement. Some companies pay two full bonus payments (typically in July and December), while others spread them across monthly pay by dividing the total amount by 12. If your bonuses are already pro-rated, enter 0 months in this calculator to avoid counting them twice. You can check your payslip: if you see a line such as 'pro-rata bonus' or 'parte proporcional pagas extra', they are already included in your monthly pay.",
    q3: "When does the company have to pay severance?",
    a3: "Severance pay must be settled on the day of signing or, at the latest, on the last working day. In practice, many companies process it on the next regular payroll date. If the company delays payment, the worker is entitled to claim a surcharge of 10% per year on the outstanding amounts. The severance document is signed in the presence of the worker, who may request that a trade union representative is present before signing. Never sign a severance document without reading it carefully and verifying that the amounts are correct.",
  },
};

export default function Finiquito() {
  const locale = useLocale();
  const t = T[locale];

  const [annual, setAnnual] = useState("24000");
  const [vacDays, setVacDays] = useState("10");
  const [workedDays, setWorkedDays] = useState("15");
  const [monthsSinceExtra, setMonthsSinceExtra] = useState("3");

  const salaryAnnual = parseFloat(annual) || 0;
  const dailyRate = salaryAnnual / 365;
  const vac = (parseFloat(vacDays) || 0) * dailyRate;
  const worked = (parseFloat(workedDays) || 0) * dailyRate;

  const monthlyGross = salaryAnnual / 14;
  const extra = ((parseFloat(monthsSinceExtra) || 0) / 6) * monthlyGross;

  const total = vac + worked + extra;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <FileText className="h-6 w-6 text-primary" />
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
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="annual">{t.annualLabel}</Label>
            <Input id="annual" type="number" value={annual} onChange={(e) => setAnnual(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="vac">{t.vacLabel}</Label>
            <Input id="vac" type="number" value={vacDays} onChange={(e) => setVacDays(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="worked">{t.workedLabel}</Label>
            <Input id="worked" type="number" value={workedDays} onChange={(e) => setWorkedDays(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="extra">{t.extraLabel}</Label>
            <Input id="extra" type="number" value={monthsSinceExtra} onChange={(e) => setMonthsSinceExtra(e.target.value)} className="mt-1" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/30 bg-primary/5 mb-6">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground mb-1">{t.totalLabel}</p>
            <p className="text-4xl font-bold text-primary">{eur(total)}</p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">{t.vacationsLabel}</p>
              <p className="text-lg font-semibold">{eur(vac)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t.workedDaysLabel}</p>
              <p className="text-lg font-semibold">{eur(worked)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t.bonusLabel}</p>
              <p className="text-lg font-semibold">{eur(extra)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8 text-sm text-amber-800 dark:text-amber-300">
        {t.note}
      </div>

      <p className="text-xs text-muted-foreground italic mt-4 mb-2">{t.disclaimer}</p>

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">{t.howTitle}</h2>
        <p className="text-muted-foreground mb-4">{t.how1}</p>
        <p className="text-muted-foreground mb-4">{t.how2}</p>
        <h3 className="text-lg font-semibold mb-2">{t.exampleTitle}</h3>
        <p className="text-muted-foreground">{t.example}</p>
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
        </Accordion>
      </section>

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}
