import { useState } from "react";
import { CalendarDays, Briefcase, GraduationCap, Clock } from "lucide-react";
import {
  differenceInCalendarDays,
  differenceInBusinessDays,
  differenceInMonths,
  differenceInWeeks,
  addMonths,
  addWeeks,
  addDays,
} from "date-fns";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { useLocale } from "@/lib/locale";

function Toggle({
  checked, onChange, label,
}: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors focus:outline-none ${
          checked ? "bg-primary" : "bg-gray-200 dark:bg-white/20"
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
      <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
    </label>
  );
}

const T = {
  es: {
    title: "Calculadora de Días entre Fechas",
    subtitle: "Calcula cuántos días, semanas, meses y días laborables hay entre dos fechas.",
    intro1: "Calcular el número exacto de días entre dos fechas es una necesidad habitual en contextos legales, laborales y personales: plazos para presentar recursos administrativos, duración de contratos temporales, días de vacaciones consumidos o tiempo que falta para un evento. La diferencia entre 'días naturales' y 'días laborables' (excluyendo fines de semana) es clave en muchos de estos contextos.",
    intro2: "Esta calculadora te da en un solo clic los días totales, las semanas, los meses aproximados y los días laborables entre dos fechas. Útil para calcular plazos legales, duración de bajas médicas, períodos de prueba en contratos de trabajo o simplemente saber cuánto tiempo queda para unas vacaciones o un acontecimiento especial.",
    startLabel: "Fecha de inicio",
    endLabel: "Fecha de fin",
    includeEnd: "Incluir el día final en el cálculo",
    workdaysOnly: "Mostrar solo días laborables (lun–vie)",
    totalDuration: "DURACIÓN TOTAL",
    days: "días",
    workdays: "días laborables",
    breakdownTitle: "Desglose",
    breakdownDesc: "Meses, semanas y días restantes.",
    productivityTitle: "Productividad",
    productivityDesc: "Días hábiles excluyendo fines de semana.",
    progressTitle: "Progreso de hoy",
    progressDesc: (day: number, year: number, pct: number) =>
      `Es el día ${day} de ${year}. Has completado el ${pct}% del año.`,
    presetsTitle: "Intervalos habituales",
    p1Title: "Período de prueba",
    p1Desc: "Calcula cuándo acaba el período de prueba de un contrato laboral (6 meses habitual).",
    p1Cta: "Usar preset",
    p2Title: "Plazo de proyecto",
    p2Desc: "Establece plazos realistas descontando fines de semana. Equivale a 30 días laborables.",
    p2Cta: "Aplicar",
    p3Title: "Semestre académico",
    p3Desc: "Calcula cuántos días quedan para los exámenes finales o el final del semestre.",
    p3Cta: "Calcular",
    disclaimer: "Los días laborables excluyen fines de semana pero no festivos locales ni nacionales. Para plazos legales exactos, consulta el calendario oficial.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Se incluyen los dos extremos?",
    a1: "Por defecto, el cálculo usa la diferencia estricta entre ambas fechas: si el inicio y el final son el mismo día, el resultado es 0. Activa la opción 'Incluir el día final' para contar también el último día. Para una estancia del 1 al 7 de enero, sin inclusión son 6 días; incluyendo el final, son 7.",
    q2: "¿Los días laborables tienen en cuenta festivos?",
    a2: "Se excluyen sábados y domingos, pero no los festivos locales o nacionales, ya que varían según la comunidad autónoma y el municipio. Si necesitas el cómputo exacto con festivos —para un contrato, una baja laboral o un plazo administrativo—, consulta el calendario laboral oficial de tu provincia.",
    q3: "¿Para qué se usa habitualmente?",
    a3: "Este cálculo es útil en muchos contextos: saber cuántos días quedan para un evento, comprobar si un plazo legal ha vencido (los recursos administrativos suelen tener 15 o 30 días hábiles), calcular el período de prueba de un contrato laboral, estimar el tiempo entre dos hitos de un proyecto o verificar cuántos días de vacaciones han transcurrido.",
  },
  en: {
    title: "Days Between Dates Calculator",
    subtitle: "Calculate how many days, weeks, months and working days there are between two dates.",
    intro1: "Calculating the exact number of days between two dates is a common need in legal, work and personal contexts: deadlines for administrative appeals, duration of temporary contracts, holidays used or time until an event. The distinction between 'calendar days' and 'working days' (excluding weekends) is key in many of these contexts.",
    intro2: "This calculator gives you in one click the total days, weeks, approximate months and working days between two dates. Useful for calculating legal deadlines, duration of sick leave, probationary periods in employment contracts or simply knowing how long it is until a holiday or special event.",
    startLabel: "Start Date",
    endLabel: "End Date",
    includeEnd: "Include end date in calculation",
    workdaysOnly: "Calculate workdays only (Mon–Fri)",
    totalDuration: "TOTAL DURATION",
    days: "days",
    workdays: "business days",
    breakdownTitle: "Breakdown",
    breakdownDesc: "Months, weeks, and remaining days.",
    productivityTitle: "Productivity",
    productivityDesc: "Business days excluding weekends.",
    progressTitle: "Today's Progress",
    progressDesc: (day: number, year: number, pct: number) =>
      `It's day ${day} of ${year}. You've already completed ${pct}% of the year!`,
    presetsTitle: "Common Intervals",
    p1Title: "Probationary Period",
    p1Desc: "Calculate when a typical 6-month employment probationary period ends.",
    p1Cta: "Use preset",
    p2Title: "Project Deadline",
    p2Desc: "Set realistic deadlines by counting 30 working days from today.",
    p2Cta: "Apply",
    p3Title: "Academic Semester",
    p3Desc: "Track the number of weeks remaining before final exams or end of semester.",
    p3Cta: "Calculate",
    disclaimer: "Working days exclude weekends but not local or national public holidays, which vary by region. For exact legal deadlines, consult the official calendar.",
    faqTitle: "Frequently asked questions",
    q1: "Are both endpoints included?",
    a1: "By default, the calculation uses the strict difference between the two dates: if the start and end are the same day, the result is 0. Enable 'Include end date' to also count the last day. For a stay from 1 to 7 January, without inclusion it is 6 days; including the end, it is 7.",
    q2: "Do working days account for public holidays?",
    a2: "Saturdays and Sundays are excluded, but not local or national public holidays, which vary by region and municipality. If you need the exact count including public holidays—for a contract, sick leave or an administrative deadline—consult the official labour calendar for your province.",
    q3: "What is it typically used for?",
    a3: "This calculation is useful in many situations: finding out how many days are left until an event, checking whether a legal deadline has passed (administrative appeals usually allow 15 or 30 working days), calculating the probationary period of a contract, estimating the time between two project milestones, or verifying how many holiday days have elapsed.",
  },
};

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function DiasEntreFechas() {
  const locale = useLocale();
  const isEn = locale === "en";
  const t = T[locale];

  const todayStr = toDateStr(new Date());
  const [start, setStart] = useState(todayStr);
  const [end, setEnd] = useState(todayStr);
  const [includeEnd, setIncludeEnd] = useState(false);
  const [workdaysOnly, setWorkdaysOnly] = useState(false);

  const d1 = new Date(start + "T00:00:00");
  const d2 = new Date(end + "T00:00:00");
  const valid = !isNaN(d1.getTime()) && !isNaN(d2.getTime());
  const [from, to] = d1 <= d2 ? [d1, d2] : [d2, d1];

  const extra = includeEnd ? 1 : 0;
  const calDays = valid ? differenceInCalendarDays(to, from) + extra : 0;
  const bizDays = valid ? differenceInBusinessDays(to, from) + extra : 0;
  const mainDays = workdaysOnly ? bizDays : calDays;

  // Breakdown: Xm Xw Xd
  const bMonths = valid ? differenceInMonths(to, from) : 0;
  const afterM = addMonths(from, bMonths);
  const bWeeks = valid ? differenceInWeeks(to, afterM) : 0;
  const afterW = addWeeks(afterM, bWeeks);
  const bDays = valid ? differenceInCalendarDays(to, afterW) + extra : 0;

  // Today's progress in the year
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = differenceInCalendarDays(now, startOfYear) + 1;
  const totalDaysInYear = now.getFullYear() % 4 === 0 ? 366 : 365;
  const yearPct = Math.round((dayOfYear / totalDaysInYear) * 100);

  // Timeline progress bar (today within start–end range)
  const rangeDays = valid ? differenceInCalendarDays(to, from) : 0;
  const daysElapsed = valid ? Math.max(0, differenceInCalendarDays(now, from)) : 0;
  const timelinePct = rangeDays > 0 ? Math.min(100, Math.round((daysElapsed / rangeDays) * 100)) : 0;

  const fmtDate = (d: Date) =>
    d.toLocaleDateString(isEn ? "en-GB" : "es-ES", { day: "numeric", month: "short", year: "numeric" });

  // Presets
  const applyPreset = (months?: number, workDays?: number, calendarDays?: number) => {
    const s = new Date();
    setStart(toDateStr(s));
    if (months) setEnd(toDateStr(addMonths(s, months)));
    else if (workDays) {
      let d = s, count = 0;
      while (count < workDays) { d = addDays(d, 1); if (d.getDay() !== 0 && d.getDay() !== 6) count++; }
      setEnd(toDateStr(d));
    } else if (calendarDays) setEnd(toDateStr(addDays(s, calendarDays)));
  };

  const presets = [
    {
      icon: <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      bg: "bg-blue-100 dark:bg-blue-900/30",
      title: t.p1Title,
      desc: t.p1Desc,
      cta: t.p1Cta,
      action: () => applyPreset(6),
    },
    {
      icon: <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      bg: "bg-purple-100 dark:bg-purple-900/30",
      title: t.p2Title,
      desc: t.p2Desc,
      cta: t.p2Cta,
      action: () => applyPreset(undefined, 30),
    },
    {
      icon: <GraduationCap className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      bg: "bg-amber-100 dark:bg-amber-900/30",
      title: t.p3Title,
      desc: t.p3Desc,
      cta: t.p3Cta,
      action: () => applyPreset(undefined, undefined, 90),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <CalendarDays className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
      </div>
      <p className="text-muted-foreground mb-6">{t.subtitle}</p>

      <div className="prose prose-sm dark:prose-invert max-w-none mb-8 space-y-3 text-gray-700 dark:text-gray-300">
        <p>{t.intro1}</p>
        <p>{t.intro2}</p>
      </div>

      {/* ── Main two-column layout ── */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">

        {/* LEFT: inputs */}
        <div className="w-full lg:w-64 shrink-0 space-y-4">

          {/* Date inputs */}
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-5 space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                {t.startLabel}
              </Label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
                <Input
                  type="date"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="pl-9 bg-white dark:bg-white/5"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                {t.endLabel}
              </Label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
                <Input
                  type="date"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="pl-9 bg-white dark:bg-white/5"
                />
              </div>
            </div>
            <div className="pt-2 space-y-3 border-t border-gray-100 dark:border-white/10">
              <Toggle checked={includeEnd} onChange={setIncludeEnd} label={t.includeEnd} />
              <Toggle checked={workdaysOnly} onChange={setWorkdaysOnly} label={t.workdaysOnly} />
            </div>
          </div>

          {/* Today's Progress */}
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-amber-50 dark:bg-amber-900/10 p-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
                <span className="text-base">📅</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{t.progressTitle}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t.progressDesc(dayOfYear, now.getFullYear(), yearPct)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: results */}
        <div className="flex-1 min-w-0 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 space-y-6">

          {/* Main number */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">{t.totalDuration}</p>
            <div className="flex items-baseline gap-3">
              <span className="text-7xl font-bold text-gray-900 dark:text-white leading-none">{mainDays}</span>
              <span className="text-2xl text-gray-400 font-light">
                {workdaysOnly ? t.workdays : t.days}
              </span>
            </div>
          </div>

          {/* Sub-stats */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-white/10">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <CalendarDays className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-primary">{t.breakdownTitle}</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {bMonths}m, {bWeeks}w, {bDays}d
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{t.breakdownDesc}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{t.productivityTitle}</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{bizDays} {t.workdays}</p>
              <p className="text-xs text-gray-400 mt-0.5">{t.productivityDesc}</p>
            </div>
          </div>

          {/* Timeline progress bar */}
          {valid && rangeDays > 0 && (
            <div className="pt-2">
              <div className="h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(timelinePct, 2)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                <span>{fmtDate(from)}</span>
                <span>{fmtDate(to)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Common Intervals / Presets ── */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-5 text-gray-900 dark:text-white">{t.presetsTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {presets.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-5 flex flex-col"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${p.bg}`}>
                {p.icon}
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{p.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex-1 mb-4">{p.desc}</p>
              <button
                onClick={p.action}
                className="flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
              >
                {p.cta} <span>›</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-muted-foreground italic mt-8 mb-2">{t.disclaimer}</p>

      <AdUnit slot={AD_SLOTS.midContent} className="my-10" />

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">{t.faqTitle}</h2>
        <Accordion type="single" collapsible className="w-full">
          {(["q1", "q2", "q3"] as const).map((q) => (
            <AccordionItem key={q} value={q}>
              <AccordionTrigger>{t[q]}</AccordionTrigger>
              <AccordionContent>{t[`a${q.slice(1)}` as keyof typeof t]}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}
