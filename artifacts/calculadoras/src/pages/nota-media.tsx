import { useState } from "react";
import { GraduationCap, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface Subject {
  id: number;
  name: string;
  grade: string;
  credits: string;
}

let nextId = 4;

const T = {
  es: {
    title: "Calculadora de Nota Media",
    subtitle: "Calcula tu nota media simple o ponderada por créditos ECTS.",
    intro1: "La nota media del expediente académico es un indicador clave para acceder a becas, másteres con plazas limitadas y oposiciones que puntúan el historial académico. En España, la mayoría de universidades la calculan como la media ponderada por créditos ECTS, lo que significa que las asignaturas con más créditos tienen mayor impacto en la nota final. Una asignatura de 6 créditos cuenta el doble que una de 3.",
    intro2: "Esta calculadora permite calcular tanto la media simple (todas las asignaturas pesan igual) como la media ponderada por créditos ECTS. Puedes añadir tantas asignaturas como necesites, personalizar el nombre de cada una y modificar los créditos. El resultado se actualiza automáticamente conforme introduces las notas.",
    disclaimer: "El cálculo es orientativo. La nota media oficial del expediente la emite la secretaría de tu universidad, que puede aplicar criterios específicos adicionales.",
    cardTitle: "Asignaturas",
    weightedLabel: "Ponderar por créditos (ECTS)",
    subjectLabel: "Asignatura",
    gradeLabel: "Nota",
    creditsLabel: "Créditos",
    addBtn: "Añadir asignatura",
    subjectDefault: (n: number) => `Asignatura ${n}`,
    weightedAvg: "ponderada",
    simpleAvg: "simple",
    avgLabel: (type: string) => `Nota media ${type}`,
    howTitle: "Cómo se calcula la nota media",
    how1:
      "La nota media resume tu rendimiento académico en una sola cifra. Hay dos formas de calcularla: la media simple, que suma todas las notas y las divide entre el número de asignaturas, y la media ponderada, que tiene en cuenta los créditos ECTS de cada asignatura para que las de mayor peso influyan más.",
    how2:
      "Para la media ponderada se multiplica cada nota por sus créditos, se suman todos esos productos y el total se divide entre la suma de créditos. Es la fórmula que usan las universidades en el expediente oficial, y la que piden becas, másteres y oposiciones.",
    exampleTitle: "Ejemplo",
    example:
      "Con un 9 en una asignatura de 6 créditos y un 6 en otra de 3 créditos: media ponderada = (9 × 6 + 6 × 3) / (6 + 3) = 72 / 9 = 8. La media simple sería (9 + 6) / 2 = 7,5.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Qué es la media ponderada por créditos?",
    a1: "Cada asignatura pesa según sus créditos ECTS en lugar de contar igual. Por ejemplo, una asignatura de 6 créditos con un 9 contribuye más al promedio que una de 3 créditos con un 9. Se calcula multiplicando cada nota por sus créditos, sumando todos los productos y dividiéndolos entre el total de créditos cursados.",
    q2: "¿Cuándo conviene usar la media simple?",
    a2: "La media simple —suma de notas dividida entre el número de asignaturas— es útil cuando todas las materias tienen el mismo peso o cuando solo quieres una referencia rápida. Sin embargo, para becas, solicitudes de máster u oposiciones, lo habitual es pedir la nota media oficial del expediente, que siempre es la ponderada por créditos ECTS.",
    q3: "¿Cómo puede afectar la nota media a tu carrera?",
    a3: "La nota media importa en convocatorias de becas (como las del MEC, que suelen exigir un mínimo de 6,5 o 7), en el acceso a másteres con plazas limitadas y en oposiciones que valoran el expediente académico. Mejorar una asignatura de muchos créditos tiene mayor impacto que subir una de pocos, por eso merece la pena identificar las de más peso antes de ir a recuperación.",
    q4: "¿Cómo se convierte la nota media al sistema GPA anglosajón?",
    a4: "No existe una conversión oficial única, pero la equivalencia más aceptada por las universidades toma como referencia que el GPA estadounidense va de 0 a 4. La correspondencia orientativa es: un 9-10 español equivale a un GPA de 4,0; un 7-8,9 se sitúa en torno a 3,0-3,7; un 6-6,9 ronda el 2,3-2,7; y un 5-5,9 equivale aproximadamente a 2,0. Muchas universidades exigen que la conversión la realice un organismo homologador como WES o similar, porque cada institución aplica sus propias tablas y la equivalencia directa puede no ser aceptada en un proceso de admisión formal.",
    q5: "¿Cuentan los suspensos en la nota media?",
    a5: "Depende del sistema. En la universidad española, el baremo oficial del Real Decreto 1125/2003 establece que la nota media se calcula sobre las asignaturas superadas, ponderadas por créditos, de modo que los suspensos no computan una vez que apruebas la asignatura: solo cuenta la calificación con la que finalmente la superas. En bachillerato y ESO, en cambio, la nota media del curso sí puede incluir las asignaturas pendientes con su calificación negativa hasta que se recuperen. Para expedientes académicos y notas de corte se utiliza siempre la media de asignaturas superadas.",
    deepTitle: "Media simple frente a media ponderada por créditos",
    deep: "La media simple suma todas las calificaciones y divide entre el número de asignaturas, tratando a todas por igual. La media ponderada multiplica cada nota por los créditos de su asignatura, suma esos productos y divide entre el total de créditos, de modo que las asignaturas de mayor carga pesan más en el resultado. La fórmula es: media = Σ(nota × créditos) / Σ(créditos). En el ámbito universitario español la ponderada es la oficial, porque refleja mejor el esfuerzo real: no tiene sentido que una asignatura de 3 créditos influya igual que un trabajo de fin de grado de 12.",
    workedTitle: "Ejemplo resuelto",
    worked: "Un estudiante cursa tres asignaturas: Matemáticas (6 créditos, nota 7), Física (9 créditos, nota 5) y Programación (3 créditos, nota 9). La media simple sería (7 + 5 + 9) / 3 = 7,0. La ponderada, en cambio, es (7×6 + 5×9 + 9×3) / (6+9+3) = (42 + 45 + 27) / 18 = 114 / 18 = 6,33. La diferencia de casi siete décimas se explica porque Física, la asignatura con peor nota, es también la de mayor carga en créditos y por tanto arrastra la media hacia abajo.",
    tableTitle: "Equivalencia entre nota numérica y calificación",
    tableCol1: "Nota numérica",
    tableCol2: "Calificación",
    interpretTitle: "Cómo interpretar el resultado",
    interpret: "La nota media que obtienes es el dato que aparecerá en tu expediente y el que se usará para baremar becas, prácticas, másteres y convocatorias públicas. Como referencia práctica, las becas del Ministerio suelen exigir un mínimo de 6,5 en la mayoría de titulaciones, los másteres competitivos se mueven por encima del 7 y los programas de doctorado o las becas de excelencia piden habitualmente más de 8. Si tu media está por debajo del objetivo que persigues, ten en cuenta que las asignaturas con más créditos son las que más pueden moverla: mejorar una nota en un trabajo de fin de grado de 12 créditos tiene mucho más impacto que hacerlo en una optativa de 3.",
  },
  en: {
    title: "Grade Average Calculator",
    subtitle: "Calculate your simple or ECTS credit-weighted average grade.",
    intro1: "The average grade on your academic transcript is a key indicator for accessing scholarships, oversubscribed master's programmes and public-sector exams that award points for academic records. In Spain, most universities calculate it as the credit-weighted average by ECTS, meaning that subjects with more credits have a greater impact on the final grade. A 6-credit subject counts twice as much as a 3-credit one.",
    intro2: "This calculator lets you calculate both the simple average (all subjects count equally) and the ECTS credit-weighted average. You can add as many subjects as you need, customise the name of each one and adjust the credits. The result updates automatically as you enter the grades.",
    disclaimer: "The calculation is indicative. The official transcript average is issued by your university's administrative office, which may apply additional specific criteria.",
    cardTitle: "Subjects",
    weightedLabel: "Weight by credits (ECTS)",
    subjectLabel: "Subject",
    gradeLabel: "Grade",
    creditsLabel: "Credits",
    addBtn: "Add subject",
    subjectDefault: (n: number) => `Subject ${n}`,
    weightedAvg: "weighted",
    simpleAvg: "simple",
    avgLabel: (type: string) => `${type.charAt(0).toUpperCase() + type.slice(1)} average`,
    howTitle: "How the average grade is calculated",
    how1:
      "The average grade sums up your academic performance in a single figure. There are two ways to work it out: the simple average, which adds all the grades and divides by the number of subjects, and the weighted average, which takes each subject's ECTS credits into account so that the heavier ones count for more.",
    how2:
      "For the weighted average you multiply each grade by its credits, add all those products and divide the total by the sum of credits. It is the formula universities use on the official transcript, and the one required by scholarships, master's programmes and public-sector exams.",
    exampleTitle: "Example",
    example:
      "With a 9 in a 6-credit subject and a 6 in a 3-credit subject: weighted average = (9 × 6 + 6 × 3) / (6 + 3) = 72 / 9 = 8. The simple average would be (9 + 6) / 2 = 7.5.",
    faqTitle: "Frequently asked questions",
    q1: "What is the credit-weighted average?",
    a1: "Each subject is weighted by its ECTS credits rather than counting equally. For example, a 6-credit subject with a grade of 9 contributes more to the average than a 3-credit subject with a 9. It is calculated by multiplying each grade by its credits, adding all the products, and dividing by the total credits taken.",
    q2: "When should I use the simple average?",
    a2: "The simple average—the sum of grades divided by the number of subjects—is useful when all subjects carry the same weight or when you just want a quick reference. However, for scholarship applications, master's programmes or public-sector exams, the official transcript average is always the credit-weighted one.",
    q3: "How does the grade average affect your career?",
    a3: "Your transcript average matters for scholarship applications (government grants typically require a minimum of 6.5 or 7), access to oversubscribed master's programmes, and public-sector exams that reward academic records. Improving a high-credit subject has more impact than raising a low-credit one, so it is worth identifying the heaviest subjects before a resit.",
    q4: "How do you convert the Spanish average to a GPA?",
    a4: "There is no single official conversion, but the equivalence most widely accepted by universities takes the US GPA scale of 0 to 4 as reference. The indicative correspondence is: a Spanish 9-10 equals a GPA of 4.0; a 7-8.9 sits around 3.0-3.7; a 6-6.9 is roughly 2.3-2.7; and a 5-5.9 equals approximately 2.0. Many universities require the conversion to be carried out by an accrediting body such as WES or similar, because each institution applies its own tables and a direct equivalence may not be accepted in a formal admissions process.",
    q5: "Do failed subjects count towards the average?",
    a5: "It depends on the system. In Spanish universities, the official scale set by Royal Decree 1125/2003 establishes that the average is calculated on passed subjects, weighted by credits, so failures do not count once you pass the subject: only the grade with which you finally pass it counts. In secondary education, by contrast, the year's average can include outstanding subjects with their negative grade until they are retaken. For academic transcripts and entry cut-off marks, the average of passed subjects is always used.",
    deepTitle: "Simple average versus credit-weighted average",
    deep: "The simple average adds up all grades and divides by the number of subjects, treating them all equally. The weighted average multiplies each grade by its subject's credits, adds those products and divides by the total credits, so heavier subjects carry more weight in the result. The formula is: average = Σ(grade × credits) / Σ(credits). In Spanish higher education the weighted average is the official one, because it better reflects actual effort: it makes no sense for a 3-credit subject to count the same as a 12-credit final project.",
    workedTitle: "Worked example",
    worked: "A student takes three subjects: Mathematics (6 credits, grade 7), Physics (9 credits, grade 5) and Programming (3 credits, grade 9). The simple average would be (7 + 5 + 9) / 3 = 7.0. The weighted average, however, is (7×6 + 5×9 + 9×3) / (6+9+3) = (42 + 45 + 27) / 18 = 114 / 18 = 6.33. The difference of almost seven tenths is explained because Physics, the subject with the lowest grade, is also the one with the greatest credit load and therefore drags the average down.",
    tableTitle: "Numeric grade and its qualitative equivalent",
    tableCol1: "Numeric grade",
    tableCol2: "Qualification",
    interpretTitle: "How to interpret the result",
    interpret: "The average you obtain is the figure that will appear on your transcript and the one used to rank applications for grants, internships, master's programmes and public competitions. As a practical reference, government scholarships usually require a minimum of 6.5 in most degrees, competitive master's programmes sit above 7, and doctoral programmes or excellence grants typically ask for more than 8. If your average falls below the target you are aiming for, bear in mind that subjects with more credits are the ones that can move it most: improving a grade in a 12-credit final project has far more impact than doing so in a 3-credit elective.",
  },
};

const GRADE_TABLE = [
  { es: "0 – 4,9", en: "0 – 4.9", cal: "Suspenso", calEn: "Fail" },
  { es: "5,0 – 6,9", en: "5.0 – 6.9", cal: "Aprobado", calEn: "Pass" },
  { es: "7,0 – 8,9", en: "7.0 – 8.9", cal: "Notable", calEn: "Good" },
  { es: "9,0 – 10", en: "9.0 – 10", cal: "Sobresaliente", calEn: "Outstanding" },
  { es: "9,0 – 10 con mención", en: "9.0 – 10 with distinction", cal: "Matrícula de Honor", calEn: "Distinction" },
];

export default function NotaMedia() {
  const locale = useLocale();
  const t = T[locale];

  const [weighted, setWeighted] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: locale === "en" ? "Subject 1" : "Asignatura 1", grade: "", credits: "6" },
    { id: 2, name: locale === "en" ? "Subject 2" : "Asignatura 2", grade: "", credits: "6" },
    { id: 3, name: locale === "en" ? "Subject 3" : "Asignatura 3", grade: "", credits: "6" },
  ]);

  const update = (id: number, field: keyof Subject, value: string) =>
    setSubjects((s) =>
      s.map((x) => (x.id === id ? { ...x, [field]: value } : x)),
    );
  const add = () =>
    setSubjects((s) => [
      ...s,
      { id: nextId++, name: t.subjectDefault(s.length + 1), grade: "", credits: "6" },
    ]);
  const remove = (id: number) =>
    setSubjects((s) => s.filter((x) => x.id !== id));

  let totalWeight = 0;
  let sum = 0;
  for (const s of subjects) {
    const g = parseFloat(s.grade);
    const c = weighted ? parseFloat(s.credits) : 1;
    if (isNaN(g) || isNaN(c) || c <= 0) continue;
    sum += g * c;
    totalWeight += c;
  }
  const average = totalWeight > 0 ? sum / totalWeight : null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <GraduationCap className="h-6 w-6 text-primary" />
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
          <div className="flex items-center gap-3">
            <Switch id="weighted" checked={weighted} onCheckedChange={setWeighted} />
            <Label htmlFor="weighted">{t.weightedLabel}</Label>
          </div>

          <div className="space-y-3">
            {subjects.map((s) => (
              <div key={s.id} className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label className="text-xs">{t.subjectLabel}</Label>
                  <Input
                    value={s.name}
                    onChange={(e) => update(s.id, "name", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="w-20">
                  <Label className="text-xs">{t.gradeLabel}</Label>
                  <Input
                    type="number"
                    value={s.grade}
                    onChange={(e) => update(s.id, "grade", e.target.value)}
                    className="mt-1"
                    placeholder="0-10"
                  />
                </div>
                {weighted && (
                  <div className="w-20">
                    <Label className="text-xs">{t.creditsLabel}</Label>
                    <Input
                      type="number"
                      value={s.credits}
                      onChange={(e) => update(s.id, "credits", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(s.id)}
                  aria-label="Eliminar"
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>

          <Button variant="outline" onClick={add} className="gap-1">
            <Plus className="h-4 w-4" /> {t.addBtn}
          </Button>
        </CardContent>
      </Card>

      {average !== null && (
        <Card className="border-primary/30 bg-primary/5 mb-8">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">
              {t.avgLabel(weighted ? t.weightedAvg : t.simpleAvg)}
            </p>
            <p className="text-4xl font-bold text-primary">
              {average.toLocaleString("es-ES", { maximumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
      )}

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
            {GRADE_TABLE.map((row) => (
              <tr key={row.es} className="border-b border-gray-100 dark:border-white/5">
                <td className="py-2 pr-4 text-gray-900 dark:text-white">{locale === "en" ? row.en : row.es}</td>
                <td className="py-2 font-semibold text-primary whitespace-nowrap">{locale === "en" ? row.calEn : row.cal}</td>
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

      <section className="mt-12">
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
