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
    faqTitle: "Preguntas frecuentes",
    q1: "¿Qué es la media ponderada por créditos?",
    a1: "Cada asignatura pesa según sus créditos ECTS en lugar de contar igual. Por ejemplo, una asignatura de 6 créditos con un 9 contribuye más al promedio que una de 3 créditos con un 9. Se calcula multiplicando cada nota por sus créditos, sumando todos los productos y dividiéndolos entre el total de créditos cursados.",
    q2: "¿Cuándo conviene usar la media simple?",
    a2: "La media simple —suma de notas dividida entre el número de asignaturas— es útil cuando todas las materias tienen el mismo peso o cuando solo quieres una referencia rápida. Sin embargo, para becas, solicitudes de máster u oposiciones, lo habitual es pedir la nota media oficial del expediente, que siempre es la ponderada por créditos ECTS.",
    q3: "¿Cómo puede afectar la nota media a tu carrera?",
    a3: "La nota media importa en convocatorias de becas (como las del MEC, que suelen exigir un mínimo de 6,5 o 7), en el acceso a másteres con plazas limitadas y en oposiciones que valoran el expediente académico. Mejorar una asignatura de muchos créditos tiene mayor impacto que subir una de pocos, por eso merece la pena identificar las de más peso antes de ir a recuperación.",
  },
  en: {
    title: "Grade Average Calculator",
    subtitle: "Calculate your simple or ECTS credit-weighted average grade.",
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
    faqTitle: "Frequently asked questions",
    q1: "What is the credit-weighted average?",
    a1: "Each subject is weighted by its ECTS credits rather than counting equally. For example, a 6-credit subject with a grade of 9 contributes more to the average than a 3-credit subject with a 9. It is calculated by multiplying each grade by its credits, adding all the products, and dividing by the total credits taken.",
    q2: "When should I use the simple average?",
    a2: "The simple average—the sum of grades divided by the number of subjects—is useful when all subjects carry the same weight or when you just want a quick reference. However, for scholarship applications, master's programmes or public-sector exams, the official transcript average is always the credit-weighted one.",
    q3: "How does the grade average affect your career?",
    a3: "Your transcript average matters for scholarship applications (government grants typically require a minimum of 6.5 or 7), access to oversubscribed master's programmes, and public-sector exams that reward academic records. Improving a high-credit subject has more impact than raising a low-credit one, so it is worth identifying the heaviest subjects before a resit.",
  },
};

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
      <p className="text-muted-foreground mb-8">{t.subtitle}</p>

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
        </Accordion>
      </section>

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}
