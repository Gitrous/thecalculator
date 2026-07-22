import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Clock, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { useLocale } from "@/lib/locale";

interface Interval {
  id: number;
  label: string;
  start: string;
  end: string;
}

interface Result {
  totalMinutes: number;
  contractualMinutes: number;
  extraMinutes: number;
  intervals: { label: string; minutes: number }[];
}

function parseTime(t: string): number | null {
  const match = t.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}

function formatDuration(minutes: number): string {
  const h = Math.floor(Math.abs(minutes) / 60);
  const m = Math.abs(minutes) % 60;
  const sign = minutes < 0 ? "-" : "";
  return `${sign}${h}h ${m.toString().padStart(2, "0")}m`;
}

const T = {
  es: {
    backHome: "Volver al inicio",
    title: "Calculadora de Horas Trabajadas",
    subtitle: "Calcula el total de horas trabajadas, horas extra o pendientes por día o semana.",
    intro1: "El registro de horas trabajadas es una obligación legal para las empresas en España desde 2019 (Real Decreto-ley 8/2019) y un derecho fundamental de los trabajadores para poder controlar su jornada laboral y reclamar las horas extra que no les son compensadas. Conocer el total de horas trabajadas cada semana es también esencial para detectar excesos de jornada.",
    intro2: "Esta calculadora te permite registrar las horas de entrada y salida de cada día de la semana y compararlas con tu jornada contractual. El resultado muestra si tienes horas extra pendientes de compensar o si te faltan horas para completar la jornada. Puedes añadir tantos días o turnos como necesites, incluyendo jornadas partidas.",
    disclaimer: "El cálculo no tiene en cuenta pausas intermedias no registradas ni festivos. Para el registro oficial de jornada, usa el sistema de tu empresa o un aplicativo homologado.",
    contractualCardTitle: "Horas contractuales por día",
    contractualLabel: "Horas diarias según contrato",
    intervalsCardTitle: "Intervalos de trabajo",
    addDayBtn: "Añadir día",
    colLabel: "Etiqueta (día)",
    colStart: "Hora inicio",
    colEnd: "Hora fin",
    labelPlaceholder: "Lunes",
    errContractual: "Las horas contractuales deben ser un número positivo.",
    errInvalidInterval: (label: string) => `Formato de hora inválido en "${label}". Usa HH:MM.`,
    intervalDefault: "Intervalo",
    errNoIntervals: "Añade al menos un intervalo válido.",
    calculateBtn: "Calcular horas",
    totalWorked: "Total trabajado",
    contractualHoursLabel: "Horas contractuales",
    extraHours: "Horas extra",
    pendingHours: "Horas pendientes",
    detailTitle: "Detalle por día",
    colDay: "Día",
    colWorked: "Horas trabajadas",
    colDiff: "Diff. contractual",
    howTitle: "Cómo funciona",
    howText: "Introduce la hora de entrada y salida para cada día de trabajo. La calculadora suma el tiempo de cada intervalo y lo compara con las horas contractuales configuradas. Las horas extra son las trabajadas por encima de la jornada pactada; las horas pendientes son las que faltan para completar la jornada.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Puedo incluir pausas para la comida?",
    a1: "Sí. Añade dos intervalos separados: uno de mañana y otro de tarde. El total será la suma de ambos sin contar el descanso.",
    q2: "¿Qué pasa si trabajo de noche (turno que cruza la medianoche)?",
    a2: "La calculadora detecta automáticamente que la hora de fin es anterior a la de inicio y suma 24 horas. Por ejemplo, de 22:00 a 06:00 calculará 8 horas.",
    q3: "¿Qué paga se percibe por horas extra en España?",
    a3: "Según el Estatuto de los Trabajadores, las horas extra pueden compensarse con tiempo libre o remunerarse económicamente. Si se pagan, no puede ser inferior al valor de la hora ordinaria. El límite máximo es 80 horas extra al año.",
    q4: "¿Cuántas horas es la jornada ordinaria en España?",
    a4: "La jornada máxima ordinaria es de 40 horas semanales de promedio en cómputo anual, lo que permite distribuciones irregulares siempre que se respete esa media. Con la nueva legislación prevista, se reducirá a 37,5 horas semanales. La jornada diaria máxima es de 9 horas ordinarias, salvo que el convenio colectivo establezca otra distribución respetando el descanso mínimo de 12 horas entre el fin de una jornada y el inicio de la siguiente. Los menores de 18 años tienen un límite inferior, de 8 horas diarias.",
    q5: "¿Es obligatorio el registro de jornada?",
    a5: "Sí. Desde mayo de 2019, el Real Decreto-ley 8/2019 obliga a todas las empresas españolas a registrar diariamente la jornada de cada trabajador, incluyendo la hora concreta de inicio y de finalización. El registro debe conservarse durante cuatro años y estar a disposición de los trabajadores, sus representantes y la Inspección de Trabajo. La norma nació para combatir las horas extra no remuneradas y su incumplimiento puede acarrear sanciones de entre 751 y 7.500 euros. No existe un formato obligatorio: vale desde una hoja firmada hasta una aplicación digital, siempre que sea fiable y no manipulable.",
    q6: "¿Cómo se calcula el precio de mi hora de trabajo?",
    a6: "Divide tu salario bruto anual entre las horas efectivas de trabajo al año. Para una jornada completa de 40 horas semanales, el cómputo anual ronda las 1.760 horas una vez descontadas las vacaciones y los festivos: 40 horas × 52 semanas son 2.080 horas, menos unas 240 horas de vacaciones y 80 de festivos. Con un salario bruto de 30.000 €, el precio de la hora sería de unos 17 €. Este cálculo resulta útil para valorar si compensa una hora extra, para presupuestar trabajos por cuenta propia o para comparar ofertas con jornadas distintas.",
    deepTitle: "Cómo se calculan las horas trabajadas",
    deep: "El cálculo consiste en restar la hora de entrada a la de salida y descontar las pausas no retribuidas. La particularidad está en el manejo del tiempo sexagesimal: las horas se dividen en 60 minutos, no en 100, por lo que no se pueden restar como números decimales corrientes. Un turno de 09:15 a 17:45 no son 8,30 horas sino 8 horas y 30 minutos, que en formato decimal equivalen a 8,5 horas. Para convertir minutos a decimales se dividen entre 60: 30 minutos son 0,5 horas y 45 minutos son 0,75. Esta conversión es imprescindible cuando quieres multiplicar el tiempo trabajado por un precio por hora.",
    exampleTitle: "Ejemplo resuelto",
    example: "Una jornada partida de 09:00 a 14:00 y de 15:30 a 18:30. El tramo de mañana suma 5 horas exactas. El de tarde va de 15:30 a 18:30, es decir, 3 horas. El total es de 8 horas efectivas, sin contar la hora y media de pausa para comer, que no es tiempo de trabajo. Si el turno fuese nocturno, de 22:00 a 06:00, el cálculo detecta que la hora de fin es menor que la de inicio y suma 24 horas: 06:00 + 24 = 30:00, y 30:00 − 22:00 arroja las 8 horas correctas.",
    tableTitle: "Límites de jornada en la legislación española",
    tableCol1: "Concepto",
    tableCol2: "Límite legal",
    interpretTitle: "Cómo interpretar el resultado",
    interpret: "El total en horas y minutos sirve para el registro de jornada, mientras que el equivalente decimal es el que necesitas para cualquier cálculo económico. Ten presente que no todo el tiempo de presencia computa como jornada efectiva: las pausas para comer solo cuentan si el convenio las considera tiempo de trabajo, mientras que el descanso de quince minutos en jornadas continuadas superiores a seis horas sí suele computar. Si al sumar tu semana superas las 40 horas de promedio, ese exceso son horas extraordinarias y deben registrarse como tales, compensarse con descanso en los cuatro meses siguientes o abonarse, con un tope legal de 80 horas al año.",
  },
  en: {
    backHome: "Back to home",
    title: "Working Hours Calculator",
    subtitle: "Calculate total hours worked, overtime or pending hours per day or week.",
    intro1: "Recording hours worked has been a legal obligation for companies in Spain since 2019 (Royal Decree-Law 8/2019) and a fundamental right of workers to control their working hours and claim overtime that is not being compensated. Knowing the total hours worked each week is also essential for detecting excessive working hours.",
    intro2: "This calculator lets you record clock-in and clock-out times for each day of the week and compare them with your contractual hours. The result shows whether you have overtime to be compensated or hours to make up to complete your shift. You can add as many days or shifts as you need, including split shifts.",
    disclaimer: "The calculation does not account for unrecorded intermediate breaks or public holidays. For official time recording, use your company's system or approved software.",
    contractualCardTitle: "Contractual hours per day",
    contractualLabel: "Daily hours according to contract",
    intervalsCardTitle: "Work intervals",
    addDayBtn: "Add day",
    colLabel: "Label (day)",
    colStart: "Start time",
    colEnd: "End time",
    labelPlaceholder: "Monday",
    errContractual: "Contractual hours must be a positive number.",
    errInvalidInterval: (label: string) => `Invalid time format in "${label}". Use HH:MM.`,
    intervalDefault: "Interval",
    errNoIntervals: "Add at least one valid interval.",
    calculateBtn: "Calculate hours",
    totalWorked: "Total worked",
    contractualHoursLabel: "Contractual hours",
    extraHours: "Overtime",
    pendingHours: "Pending hours",
    detailTitle: "Daily breakdown",
    colDay: "Day",
    colWorked: "Hours worked",
    colDiff: "Contractual diff.",
    howTitle: "How it works",
    howText: "Enter the start and end time for each working day. The calculator adds up the time for each interval and compares it with the configured contractual hours. Overtime is the time worked above the agreed shift; pending hours are what remain to complete the shift.",
    faqTitle: "Frequently asked questions",
    q1: "Can I include lunch breaks?",
    a1: "Yes. Add two separate intervals: one for the morning and one for the afternoon. The total will be the sum of both without counting the break.",
    q2: "What if I work nights (a shift that crosses midnight)?",
    a2: "The calculator automatically detects that the end time is earlier than the start time and adds 24 hours. For example, from 22:00 to 06:00 it will calculate 8 hours.",
    q3: "How is overtime paid in Spain?",
    a3: "According to the Workers' Statute, overtime can be compensated with time off or paid financially. If paid, it cannot be less than the value of an ordinary hour. The maximum limit is 80 hours of overtime per year.",
    q4: "How many hours is the standard working day in Spain?",
    a4: "The maximum ordinary working week is 40 hours averaged over the year, which allows irregular distributions as long as that average is respected. With the new planned legislation, it will be reduced to 37.5 hours per week. The maximum ordinary working day is 9 hours, unless the collective agreement establishes a different distribution while respecting the minimum 12-hour rest between the end of one day and the start of the next. Workers under 18 have a lower limit of 8 hours a day.",
    q5: "Is time tracking mandatory?",
    a5: "Yes. Since May 2019, Royal Decree-Law 8/2019 requires all Spanish companies to record each worker's hours daily, including the specific start and finish times. The record must be kept for four years and be available to workers, their representatives and the Labour Inspectorate. The rule was created to combat unpaid overtime and non-compliance can carry fines of between €751 and €7,500. There is no mandatory format: anything from a signed sheet to a digital app is valid, as long as it is reliable and tamper-proof.",
    q6: "How do I work out my hourly rate?",
    a6: "Divide your gross annual salary by your effective working hours per year. For a full-time 40-hour week, the annual count is around 1,760 hours once holidays and public holidays are deducted: 40 hours × 52 weeks is 2,080 hours, minus about 240 hours of holiday and 80 of public holidays. On a gross salary of €30,000, the hourly rate would be about €17. This calculation is useful for judging whether overtime is worth it, for pricing freelance work, or for comparing offers with different working hours.",
    deepTitle: "How worked hours are calculated",
    deep: "The calculation consists of subtracting the start time from the finish time and deducting unpaid breaks. The catch lies in handling sexagesimal time: hours are divided into 60 minutes, not 100, so they cannot be subtracted like ordinary decimal numbers. A shift from 09:15 to 17:45 is not 8.30 hours but 8 hours and 30 minutes, which in decimal format equals 8.5 hours. To convert minutes to decimals you divide by 60: 30 minutes is 0.5 hours and 45 minutes is 0.75. This conversion is essential when you want to multiply time worked by an hourly rate.",
    exampleTitle: "Worked example",
    example: "A split shift from 09:00 to 14:00 and from 15:30 to 18:30. The morning stretch adds up to exactly 5 hours. The afternoon runs from 15:30 to 18:30, that is, 3 hours. The total is 8 effective hours, not counting the hour and a half lunch break, which is not working time. If the shift were a night one, from 22:00 to 06:00, the calculation detects that the finish time is earlier than the start and adds 24 hours: 06:00 + 24 = 30:00, and 30:00 − 22:00 gives the correct 8 hours.",
    tableTitle: "Working time limits under Spanish law",
    tableCol1: "Item",
    tableCol2: "Legal limit",
    interpretTitle: "How to interpret the result",
    interpret: "The total in hours and minutes is what you need for the time record, while the decimal equivalent is what you need for any financial calculation. Bear in mind that not all time on site counts as effective working time: lunch breaks only count if the collective agreement treats them as working time, whereas the fifteen-minute break in continuous shifts longer than six hours usually does count. If your weekly total exceeds an average of 40 hours, that excess is overtime and must be recorded as such, compensated with time off within the following four months or paid, with a legal cap of 80 hours a year.",
  },
};

const LIMITS_TABLE = [
  { es: "Jornada máxima semanal", en: "Maximum weekly hours", limite: "40 h (promedio anual)", limiteEn: "40 h (annual average)" },
  { es: "Jornada máxima diaria", en: "Maximum daily hours", limite: "9 h ordinarias", limiteEn: "9 ordinary hours" },
  { es: "Descanso entre jornadas", en: "Rest between working days", limite: "12 h mínimo", limiteEn: "12 h minimum" },
  { es: "Descanso semanal", en: "Weekly rest", limite: "1,5 días ininterrumpidos", limiteEn: "1.5 uninterrupted days" },
  { es: "Pausa en jornada > 6 h", en: "Break in shifts over 6 h", limite: "15 min", limiteEn: "15 min" },
  { es: "Horas extra máximas", en: "Maximum overtime", limite: "80 h al año", limiteEn: "80 h per year" },
  { es: "Vacaciones anuales", en: "Annual holiday", limite: "30 días naturales", limiteEn: "30 calendar days" },
];

export default function HorasTrabajadas() {
  const locale = useLocale();
  const t = T[locale];

  const [intervals, setIntervals] = useState<Interval[]>([
    { id: 1, label: locale === "en" ? "Monday" : "Lunes", start: "09:00", end: "17:00" },
    { id: 2, label: locale === "en" ? "Tuesday" : "Martes", start: "09:00", end: "17:00" },
  ]);
  const [contractualHours, setContractualHours] = useState("8");
  const [result, setResult] = useState<Result | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const addInterval = () => {
    setIntervals((prev) => [
      ...prev,
      { id: Date.now(), label: "", start: "", end: "" },
    ]);
  };

  const removeInterval = (id: number) => {
    setIntervals((prev) => prev.filter((i) => i.id !== id));
  };

  const updateInterval = (id: number, field: keyof Interval, value: string) => {
    setIntervals((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const calculate = () => {
    const errs: string[] = [];
    const contractual = parseFloat(contractualHours);
    if (isNaN(contractual) || contractual <= 0)
      errs.push(t.errContractual);

    const computed: { label: string; minutes: number }[] = [];
    for (const iv of intervals) {
      const s = parseTime(iv.start);
      const e = parseTime(iv.end);
      if (s === null || e === null) {
        if (iv.start || iv.end)
          errs.push(t.errInvalidInterval(iv.label || t.intervalDefault));
        continue;
      }
      let diff = e - s;
      if (diff < 0) diff += 24 * 60; // overnight
      computed.push({ label: iv.label || t.intervalDefault, minutes: diff });
    }

    if (computed.length === 0) errs.push(t.errNoIntervals);
    setErrors(errs);
    if (errs.length > 0) return;

    const totalMinutes = computed.reduce((s, c) => s + c.minutes, 0);
    const contractualMinutes = contractual * 60 * computed.length;
    const extraMinutes = totalMinutes - contractualMinutes;
    setResult({ totalMinutes, contractualMinutes, extraMinutes, intervals: computed });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href={locale === "en" ? "/en" : "/"} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
          {t.backHome}
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Clock className="h-6 w-6 text-primary" />
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
          <CardTitle>{t.contractualCardTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs">
            <Label htmlFor="contractual-hours">{t.contractualLabel}</Label>
            <Input
              id="contractual-hours"
              data-testid="input-contractual-hours"
              type="number"
              step="0.5"
              value={contractualHours}
              onChange={(e) => setContractualHours(e.target.value)}
              placeholder="8"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t.intervalsCardTitle}</CardTitle>
          <Button data-testid="button-add-interval" variant="outline" size="sm" onClick={addInterval}>
            <Plus className="h-4 w-4 mr-1" />
            {t.addDayBtn}
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-10 gap-2 text-xs font-medium text-muted-foreground px-1 mb-1">
            <span className="col-span-4">{t.colLabel}</span>
            <span className="col-span-3">{t.colStart}</span>
            <span className="col-span-3">{t.colEnd}</span>
          </div>
          {intervals.map((iv) => (
            <div key={iv.id} className="grid grid-cols-10 gap-2 items-center">
              <Input
                data-testid={`input-interval-label-${iv.id}`}
                className="col-span-4"
                placeholder={t.labelPlaceholder}
                value={iv.label}
                onChange={(e) => updateInterval(iv.id, "label", e.target.value)}
              />
              <Input
                data-testid={`input-interval-start-${iv.id}`}
                className="col-span-3"
                type="time"
                value={iv.start}
                onChange={(e) => updateInterval(iv.id, "start", e.target.value)}
              />
              <Input
                data-testid={`input-interval-end-${iv.id}`}
                className="col-span-2"
                type="time"
                value={iv.end}
                onChange={(e) => updateInterval(iv.id, "end", e.target.value)}
              />
              <Button
                data-testid={`button-remove-interval-${iv.id}`}
                variant="ghost"
                size="icon"
                className="col-span-1 text-muted-foreground hover:text-destructive"
                onClick={() => removeInterval(iv.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {errors.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-4">
          {errors.map((e, i) => (
            <p key={i} className="text-sm text-destructive">{e}</p>
          ))}
        </div>
      )}

      <Button data-testid="button-calculate" onClick={calculate} className="w-full mb-8" size="lg">
        {t.calculateBtn}
      </Button>

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">{t.totalWorked}</p>
                <p className="text-2xl font-bold text-primary">{formatDuration(result.totalMinutes)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">{t.contractualHoursLabel}</p>
                <p className="text-2xl font-bold text-gray-700">{formatDuration(result.contractualMinutes)}</p>
              </CardContent>
            </Card>
            <Card className={result.extraMinutes >= 0 ? "border-primary/30 bg-primary/5" : "border-destructive/30 bg-destructive/5"}>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  {result.extraMinutes >= 0 ? t.extraHours : t.pendingHours}
                </p>
                <p className={`text-2xl font-bold ${result.extraMinutes >= 0 ? "text-primary" : "text-destructive"}`}>
                  {formatDuration(result.extraMinutes)}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>{t.detailTitle}</CardTitle></CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">{t.colDay}</th>
                    <th className="text-right py-2">{t.colWorked}</th>
                    <th className="text-right py-2">{t.colDiff}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.intervals.map((iv, i) => {
                    const contractMin = parseFloat(contractualHours) * 60;
                    const diff = iv.minutes - contractMin;
                    return (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2 font-medium">{iv.label}</td>
                        <td className="text-right py-2">{formatDuration(iv.minutes)}</td>
                        <td className={`text-right py-2 ${diff >= 0 ? "text-primary" : "text-destructive"}`}>
                          {diff >= 0 ? "+" : ""}{formatDuration(diff)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      <p className="text-xs text-muted-foreground italic mt-4 mb-2">{t.disclaimer}</p>

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">{t.howTitle}</h2>
        <p className="text-muted-foreground">{t.howText}</p>
      </section>

      <section className="mt-10 prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t.deepTitle}</h2>
        <p>{t.deep}</p>
        <h3 className="text-base font-semibold mt-6 mb-2 text-gray-900 dark:text-white">{t.exampleTitle}</h3>
        <p>{t.example}</p>
      </section>

      <div className="mt-8 overflow-x-auto">
        <h3 className="text-base font-semibold mb-3 text-gray-900 dark:text-white">{t.tableTitle}</h3>
        <table className="w-full text-sm border-collapse max-w-md">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10 text-left text-gray-500 dark:text-white/50">
              <th className="py-2 pr-4 font-medium">{t.tableCol1}</th>
              <th className="py-2 font-medium">{t.tableCol2}</th>
            </tr>
          </thead>
          <tbody>
            {LIMITS_TABLE.map((row) => (
              <tr key={row.en} className="border-b border-gray-100 dark:border-white/5">
                <td className="py-2 pr-4 text-gray-900 dark:text-white">{locale === "en" ? row.en : row.es}</td>
                <td className="py-2 font-semibold text-primary whitespace-nowrap">{locale === "en" ? row.limiteEn : row.limite}</td>
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

      <section className="mt-10">
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
          <AccordionItem value="q6">
            <AccordionTrigger>{t.q6}</AccordionTrigger>
            <AccordionContent>{t.a6}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}
