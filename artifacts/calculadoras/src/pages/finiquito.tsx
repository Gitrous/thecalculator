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
    q4: "¿Puedo firmar el finiquito si no estoy de acuerdo?",
    a4: "Sí, pero debes hacerlo indicando expresamente «no conforme» junto a tu firma. Firmar sin esa mención puede interpretarse como que aceptas las cantidades y renuncias a reclamar, aunque la jurisprudencia matiza que el finiquito no tiene valor liberatorio si contiene errores objetivos o si se firmó con vicio del consentimiento. Añadiendo «no conforme» dejas constancia de que recibes el dinero pero conservas el derecho a impugnar. Tienes 20 días hábiles para reclamar un despido y un año para reclamar cantidades adeudadas, así que conviene revisar el documento con calma o consultarlo con un abogado laboralista o el sindicato antes de firmar.",
    q5: "¿Qué indemnización corresponde según el tipo de despido?",
    a5: "Depende de la causa de extinción del contrato. El despido objetivo, por causas económicas, técnicas, organizativas o de producción, da derecho a 20 días de salario por año trabajado con un tope de 12 mensualidades. El despido improcedente, declarado así por un juez o reconocido por la empresa, asciende a 33 días por año con un máximo de 24 mensualidades, aunque para la antigüedad anterior a febrero de 2012 se aplican 45 días por año. El despido disciplinario procedente y la baja voluntaria no generan indemnización alguna. La finalización de un contrato temporal da derecho a 12 días por año trabajado.",
    workedTitle: "Ejemplo resuelto",
    worked: "Un trabajador con un salario bruto anual de 30.000 € tiene un salario diario de 30.000 / 365 = 82,19 €. Si al finalizar el contrato le quedan 12 días de vacaciones no disfrutadas, le corresponden 12 × 82,19 = 986,28 €. Si además trabajó 10 días del mes en curso sin cobrar, suma otros 821,90 €. Y si las pagas extra no están prorrateadas y han transcurrido 5 meses desde la última, la parte proporcional sería aproximadamente (2.500 / 12) × 5 = 1.041,67 €. El finiquito bruto ascendería así a unos 2.849,85 €, sobre los que se aplicarán las retenciones correspondientes.",
    deepTitle: "Qué conceptos integran el finiquito",
    deep: "El finiquito liquida todo lo que la empresa te adeuda en el momento de extinguir el contrato, con independencia del motivo. Se compone de tres partidas principales. La primera son las vacaciones devengadas y no disfrutadas, que se calculan multiplicando los días pendientes por el salario diario. La segunda son los días efectivamente trabajados del mes en curso que aún no se han abonado. Y la tercera es la parte proporcional de las pagas extraordinarias, aplicable solo si no están prorrateadas en las nóminas mensuales. A estas tres partidas pueden sumarse conceptos como comisiones pendientes, horas extra no abonadas o bolsas de vacaciones, y en su caso la indemnización por despido, que es un concepto jurídicamente distinto del finiquito.",
    tableTitle: "Indemnización según el tipo de extinción",
    tableCol1: "Tipo de extinción",
    tableCol2: "Indemnización",
    interpretTitle: "Cómo interpretar el resultado",
    interpret: "La cifra obtenida es un importe bruto y orientativo. Sobre él se aplican la retención de IRPF y las cotizaciones a la Seguridad Social correspondientes a los conceptos salariales, aunque la indemnización por despido está exenta de tributación hasta 180.000 € cuando no supera los límites legales. Antes de dar el finiquito por bueno, comprueba tres cosas: que el salario diario utilizado incluya el prorrateo de pagas extra si procede, que los días de vacaciones pendientes coincidan con tu registro, y que se hayan incluido conceptos variables como comisiones o pluses. Si algo no cuadra, firma indicando «no conforme» y reclama dentro de los plazos legales.",
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
    q4: "Can I sign the settlement if I disagree with it?",
    a4: "Yes, but you must write 'no conforme' (not in agreement) next to your signature. Signing without that note can be read as accepting the amounts and waiving your right to claim, although case law qualifies that a settlement has no releasing effect if it contains objective errors or was signed under defective consent. By adding 'no conforme' you record that you are receiving the money but retain the right to challenge it. You have 20 working days to contest a dismissal and one year to claim unpaid amounts, so it is worth reviewing the document calmly or consulting an employment lawyer or your union before signing.",
    q5: "What indemnity applies for each type of dismissal?",
    a5: "It depends on the reason the contract ends. Objective dismissal, on economic, technical, organisational or production grounds, entitles you to 20 days' salary per year worked capped at 12 months' pay. Unfair dismissal, declared as such by a judge or acknowledged by the company, amounts to 33 days per year with a maximum of 24 months' pay, though 45 days per year applies to seniority accrued before February 2012. Justified disciplinary dismissal and voluntary resignation generate no indemnity at all. The expiry of a temporary contract entitles you to 12 days per year worked.",
    workedTitle: "Worked example",
    worked: "A worker with a gross annual salary of €30,000 has a daily wage of 30,000 / 365 = €82.19. If 12 days of untaken holiday remain when the contract ends, they are owed 12 × 82.19 = €986.28. If they also worked 10 unpaid days of the current month, that adds another €821.90. And if bonus payments are not pro-rated and 5 months have passed since the last one, the proportional share would be approximately (2,500 / 12) × 5 = €1,041.67. The gross settlement would therefore come to about €2,849.85, before the applicable withholdings.",
    deepTitle: "What the settlement is made up of",
    deep: "The settlement clears everything the company owes you when the contract ends, whatever the reason. It comprises three main items. The first is accrued but untaken holiday, calculated by multiplying the outstanding days by the daily wage. The second is the days actually worked in the current month that have not yet been paid. And the third is the proportional share of extraordinary bonus payments, applicable only if they are not already pro-rated in monthly payslips. To these three items you may add concepts such as outstanding commissions, unpaid overtime or holiday funds, and where applicable the dismissal indemnity, which is legally distinct from the settlement itself.",
    tableTitle: "Indemnity by type of contract termination",
    tableCol1: "Type of termination",
    tableCol2: "Indemnity",
    interpretTitle: "How to interpret the result",
    interpret: "The figure obtained is a gross, indicative amount. Income tax withholding and social security contributions apply to the salary components, although dismissal indemnity is tax-exempt up to €180,000 when it does not exceed the legal limits. Before accepting the settlement as correct, check three things: that the daily wage used includes the pro-rata of bonus payments where applicable, that the outstanding holiday days match your own record, and that variable items such as commissions or allowances have been included. If something does not add up, sign with 'no conforme' and claim within the legal deadlines.",
  },
};

const SEVERANCE_TABLE = [
  { es: "Despido improcedente", en: "Unfair dismissal", ind: "33 días/año (máx. 24 mensualidades)", indEn: "33 days/year (max. 24 months)" },
  { es: "Despido objetivo", en: "Objective dismissal", ind: "20 días/año (máx. 12 mensualidades)", indEn: "20 days/year (max. 12 months)" },
  { es: "Despido colectivo (ERE)", en: "Collective redundancy", ind: "20 días/año (máx. 12 mensualidades)", indEn: "20 days/year (max. 12 months)" },
  { es: "Fin de contrato temporal", en: "End of temporary contract", ind: "12 días/año", indEn: "12 days/year" },
  { es: "Despido disciplinario procedente", en: "Justified disciplinary dismissal", ind: "Sin indemnización", indEn: "No indemnity" },
  { es: "Baja voluntaria", en: "Voluntary resignation", ind: "Sin indemnización", indEn: "No indemnity" },
];

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

      <section className="mt-12 prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t.deepTitle}</h2>
        <p>{t.deep}</p>
        <h3 className="text-base font-semibold mt-6 mb-2 text-gray-900 dark:text-white">{t.workedTitle}</h3>
        <p>{t.worked}</p>
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
            {SEVERANCE_TABLE.map((row) => (
              <tr key={row.es} className="border-b border-gray-100 dark:border-white/5">
                <td className="py-2 pr-4 text-gray-900 dark:text-white">{locale === "en" ? row.en : row.es}</td>
                <td className="py-2 font-semibold text-primary whitespace-nowrap">{locale === "en" ? row.indEn : row.ind}</td>
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
