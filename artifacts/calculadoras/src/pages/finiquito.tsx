import { useState } from "react";
import { FileText, ShieldCheck, Lock, Zap, Info, Sun, CreditCard, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { useLocale } from "@/lib/locale";

const T = {
  es: {
    title: "Calculadora de Finiquito",
    subtitle: "Estima el finiquito que te corresponde: vacaciones no disfrutadas, días trabajados sin cobrar y parte proporcional de las pagas extra.",
    intro1: "El finiquito es la liquidación económica que la empresa está obligada a entregar al trabajador cuando se extingue el contrato laboral, sea por despido, renuncia voluntaria, fin del contrato o mutuo acuerdo. Recoge tres conceptos básicos: los días de vacaciones no disfrutados, los salarios del mes en curso pendientes de cobro y la parte proporcional de las pagas extraordinarias.",
    intro2: "Es importante distinguir el finiquito de la indemnización por despido: el finiquito siempre se cobra, mientras que la indemnización solo corresponde en determinados tipos de despido (improcedente: 33 días/año, objetivo: 20 días/año). Esta calculadora te ayuda a estimar el importe bruto del finiquito para que puedas verificar que el documento que te propone la empresa es correcto.",
    disclaimer: "Cálculo orientativo en bruto. No incluye retenciones de IRPF. La indemnización por despido objetivo es de 20 días/año. Consulta con un asesor laboral para el importe exacto.",
    startDateLabel: "Fecha de inicio",
    endDateLabel: "Fecha de fin",
    monthlyLabel: "Salario bruto mensual (€)",
    vacLabel: "Vacaciones pendientes (días)",
    pagasProrrLabel: "Pagas extra prorrateadas",
    totalEstimado: "Total Estimado",
    indemnLabel: "Indemnización (20 días/año)",
    vacacionesLabel: "Vacaciones pendientes",
    pagasLabel: "Pagas extraordinarias",
    infoTitle: "Nota informativa",
    infoText: "Este cálculo es una estimación basada en 20 días por año (despido objetivo). Factores como el convenio colectivo, ausencias injustificadas o tipos de contrato específicos pueden variar el resultado final.",
    f1Title: "Legal Actualizado",
    f1Desc: "Algoritmos ajustados a la normativa laboral de 2024.",
    f2Title: "100% Privado",
    f2Desc: "Tus datos no salen de tu navegador. Sin rastreadores.",
    f3Title: "Cálculo Instantáneo",
    f3Desc: "Obtén resultados en tiempo real mientras modificas los valores.",
    howTitle: "Qué es el finiquito y cómo se calcula",
    how1: "El finiquito es la cantidad que la empresa te debe al terminar el contrato, sea cual sea el motivo. Reúne tres conceptos: los días de vacaciones que no has disfrutado, los salarios devengados y aún no cobrados del mes en curso y la parte proporcional de las pagas extraordinarias acumulada desde la última paga.",
    how2: "Cada parte se calcula a partir del salario diario (salario bruto anual dividido entre 365). Las vacaciones pendientes y los días trabajados se multiplican por ese salario diario, y la prorrata de pagas extra se calcula según los meses transcurridos desde la última paga. Esta calculadora suma los tres conceptos para darte una estimación en bruto.",
    exampleTitle: "Ejemplo",
    example: "Con un salario bruto mensual de 2.500 € (≈ 82,19 €/día), 10 días de vacaciones pendientes suponen unos 821,90 €, a los que se añaden los días trabajados sin cobrar y la parte proporcional de las pagas extra.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿El finiquito incluye la indemnización por despido?",
    a1: "En sentido estricto, el finiquito y la indemnización son conceptos distintos: el finiquito recoge las cantidades que la empresa te debe en el momento de la extinción (vacaciones, días trabajados, pagas extra proporcionales), mientras que la indemnización es una compensación adicional por el despido. Esta calculadora incluye la indemnización por despido objetivo (20 días/año) como referencia, pero puedes ignorarla si no te corresponde. En despido improcedente la indemnización sube a 33 días por año trabajado.",
    q2: "¿Las pagas extra van prorrateadas en mi nómina?",
    a2: "Depende de tu contrato y convenio colectivo. Algunas empresas pagan dos pagas extra íntegras (normalmente en julio y diciembre) mientras que otras las prorratean mensualmente, es decir, dividen el importe total entre 12 meses y lo incluyen en cada nómina. Si tus pagas ya están prorrateadas, activa el interruptor 'Pagas extra prorrateadas' para que la calculadora no las cuente dos veces. Puedes comprobarlo mirando tu nómina: si aparece un concepto como 'parte proporcional pagas extra', ya están incluidas.",
    q3: "¿Cuándo debe pagar la empresa el finiquito?",
    a3: "El finiquito debe abonarse en el momento de la firma o, como máximo, el último día de trabajo. En la práctica, muchas empresas lo liquidan en la siguiente fecha de pago de nóminas. Si la empresa se retrasa, el trabajador tiene derecho a reclamar un recargo del 10% anual sobre las cantidades pendientes. El finiquito se firma en presencia del trabajador, que puede pedir que un representante sindical esté presente antes de firmarlo. Nunca firmes un finiquito sin leerlo y verificar que los importes son correctos.",
  },
  en: {
    title: "Severance Pay Calculator (Spain)",
    subtitle: "Estimate your severance pay: unused holidays, unpaid worked days and pro-rata bonus payments.",
    intro1: "Severance pay (finiquito) is the financial settlement the company is obliged to give an employee when the employment contract ends, whether through dismissal, voluntary resignation, end of contract or mutual agreement. It covers three basic items: unused holiday days, wages for the current month not yet paid, and the pro-rata share of bonus payments.",
    intro2: "It is important to distinguish severance pay from dismissal compensation: severance pay is always owed, while compensation is only applicable in certain types of dismissal (unfair dismissal: 33 days/year, objective dismissal: 20 days/year). This calculator helps you estimate the gross severance amount so you can verify that the document proposed by the company is correct.",
    disclaimer: "Indicative gross estimate. Does not include income tax withholding. Objective dismissal compensation is 20 days/year. Consult a labour adviser for the exact amount.",
    startDateLabel: "Start date",
    endDateLabel: "End date",
    monthlyLabel: "Monthly gross salary (€)",
    vacLabel: "Pending holiday days",
    pagasProrrLabel: "Bonus payments already pro-rated",
    totalEstimado: "Total Estimated",
    indemnLabel: "Compensation (20 days/year)",
    vacacionesLabel: "Pending holidays",
    pagasLabel: "Bonus payments",
    infoTitle: "Informative note",
    infoText: "This calculation is an estimate based on 20 days per year (objective dismissal). Factors such as collective agreements, unjustified absences or specific contract types may alter the final result.",
    f1Title: "Legally Up to Date",
    f1Desc: "Algorithms aligned with 2024 labour regulations.",
    f2Title: "100% Private",
    f2Desc: "Your data never leaves your browser. No trackers.",
    f3Title: "Instant Calculation",
    f3Desc: "Get results in real time as you update the values.",
    howTitle: "What severance pay is and how to calculate it",
    how1: "Severance pay (finiquito) is the amount the company owes you when the contract ends, whatever the reason. It brings together three items: the holiday days you have not taken, the wages accrued but not yet paid for the current month, and the pro-rata share of bonus payments built up since the last one.",
    how2: "Each part is calculated from the daily wage (annual gross salary divided by 365). Pending holidays and worked days are multiplied by that daily wage, and the bonus pro-rata is worked out from the months elapsed. This calculator adds the three items to give you a gross estimate.",
    exampleTitle: "Example",
    example: "With a monthly gross salary of €2,500 (≈ €82.19/day), 10 pending holiday days come to about €821.90, on top of which you add the unpaid worked days and the pro-rata share of bonus payments.",
    faqTitle: "Frequently asked questions",
    q1: "Does severance pay include the dismissal indemnity?",
    a1: "Strictly speaking, severance pay and the dismissal indemnity are different: severance pay covers amounts the company owes at contract end (holidays, worked days, pro-rata bonuses), while the indemnity is additional compensation for the dismissal itself. This calculator includes the objective dismissal indemnity (20 days/year) as a reference, but you can disregard it if it does not apply to you. For unfair dismissal the indemnity rises to 33 days per year worked.",
    q2: "Are bonus payments already pro-rated in my salary?",
    a2: "It depends on your contract and collective agreement. Some companies pay two full bonus payments (typically in July and December), while others spread them across monthly pay by dividing the total amount by 12. If your bonuses are already pro-rated, enable the 'Bonus payments already pro-rated' toggle so the calculator does not count them twice. You can check your payslip: if you see a line such as 'pro-rata bonus', they are already included in your monthly pay.",
    q3: "When does the company have to pay severance?",
    a3: "Severance pay must be settled on the day of signing or, at the latest, on the last working day. In practice, many companies process it on the next regular payroll date. If the company delays payment, the worker is entitled to claim a surcharge of 10% per year on the outstanding amounts. The severance document is signed in the presence of the worker, who may request that a trade union representative is present before signing. Never sign a severance document without reading it carefully and verifying that the amounts are correct.",
  },
};

export default function Finiquito() {
  const locale = useLocale();
  const t = T[locale];
  const isEn = locale === "en";

  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState("2024-12-31");
  const [monthlySalary, setMonthlySalary] = useState("2500");
  const [vacDays, setVacDays] = useState("10");
  const [pagasProrrateadas, setPagasProrrateadas] = useState(false);

  // Calculations (live)
  const monthly = parseFloat(monthlySalary) || 0;
  const dailyRate = (monthly * 12) / 365;

  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : new Date();
  const yearsWorked =
    start ? Math.max(0, (end.getTime() - start.getTime()) / (365.25 * 24 * 3600 * 1000)) : 0;

  const indemnizacion = yearsWorked * 20 * dailyRate;
  const vacaciones = (parseFloat(vacDays) || 0) * dailyRate;

  let pagasExtra = 0;
  if (!pagasProrrateadas && endDate) {
    const endMonth = end.getMonth() + 1; // 1-12
    const monthsInSemester = endMonth <= 6 ? endMonth : endMonth - 6;
    pagasExtra = (monthsInSemester / 6) * monthly;
  }

  const total = indemnizacion + vacaciones + pagasExtra;

  const fmt = (n: number) =>
    n.toLocaleString(isEn ? "en-GB" : "es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="max-w-5xl mx-auto">
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

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* ── LEFT: Form ── */}
        <div className="flex-1 min-w-0 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 space-y-5">

          {/* Dates row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600 dark:text-gray-400 mb-1.5 block">
                {t.startDateLabel}
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/20 bg-white dark:bg-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm text-gray-600 dark:text-gray-400 mb-1.5 block">
                {t.endDateLabel}
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/20 bg-white dark:bg-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Salary + vacation row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600 dark:text-gray-400 mb-1.5 block">
                {t.monthlyLabel}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
                <Input
                  type="number"
                  value={monthlySalary}
                  onChange={(e) => setMonthlySalary(e.target.value)}
                  className="pl-7 bg-white dark:bg-white/10 border-gray-200 dark:border-white/20 rounded-xl"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm text-gray-600 dark:text-gray-400 mb-1.5 block">
                {t.vacLabel}
              </Label>
              <div className="relative">
                <Sun className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <Input
                  type="number"
                  value={vacDays}
                  onChange={(e) => setVacDays(e.target.value)}
                  className="pl-9 bg-white dark:bg-white/10 border-gray-200 dark:border-white/20 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Pagas extra toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {t.pagasProrrLabel}
              </span>
            </div>
            <button
              onClick={() => setPagasProrrateadas(!pagasProrrateadas)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                pagasProrrateadas ? "bg-primary" : "bg-gray-300 dark:bg-white/20"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                  pagasProrrateadas ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* ── RIGHT: Results ── */}
        <div className="w-full lg:w-96 shrink-0 space-y-4">

          {/* Total card */}
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
              {t.totalEstimado}
            </p>
            <p className="text-5xl font-bold text-primary mb-6 leading-none">
              {fmt(total)}{" "}
              <span className="text-2xl font-semibold text-primary/70">€</span>
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t.indemnLabel}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {fmt(indemnizacion)}€
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sun className="w-5 h-5 text-orange-400 shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t.vacacionesLabel}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {fmt(vacaciones)}€
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-5 h-5 text-purple-500 shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t.pagasLabel}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {fmt(pagasExtra)}€
                </span>
              </div>
            </div>
          </div>

          {/* Info note */}
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-blue-500 shrink-0" />
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {t.infoTitle}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {t.infoText}
            </p>
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <div className="rounded-2xl border-t-2 border-emerald-500 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-5">
          <ShieldCheck className="w-6 h-6 text-emerald-500 mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{t.f1Title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t.f1Desc}</p>
        </div>
        <div className="rounded-2xl border-t-2 border-blue-500 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-5">
          <Lock className="w-6 h-6 text-blue-500 mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{t.f2Title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t.f2Desc}</p>
        </div>
        <div className="rounded-2xl border-t-2 border-red-500 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-5">
          <Zap className="w-6 h-6 text-red-500 mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{t.f3Title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t.f3Desc}</p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground italic mt-8 mb-2">{t.disclaimer}</p>

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
