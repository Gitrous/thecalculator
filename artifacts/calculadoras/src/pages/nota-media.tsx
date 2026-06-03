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

interface Subject {
  id: number;
  name: string;
  grade: string;
  credits: string;
}

let nextId = 4;

export default function NotaMedia() {
  const [weighted, setWeighted] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: "Asignatura 1", grade: "", credits: "6" },
    { id: 2, name: "Asignatura 2", grade: "", credits: "6" },
    { id: 3, name: "Asignatura 3", grade: "", credits: "6" },
  ]);

  const update = (id: number, field: keyof Subject, value: string) =>
    setSubjects((s) =>
      s.map((x) => (x.id === id ? { ...x, [field]: value } : x)),
    );
  const add = () =>
    setSubjects((s) => [
      ...s,
      { id: nextId++, name: `Asignatura ${s.length + 1}`, grade: "", credits: "6" },
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
        <h1 className="text-3xl font-bold tracking-tight">
          Calculadora de Nota Media
        </h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Calcula tu nota media simple o ponderada por créditos ECTS.
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Asignaturas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Switch id="weighted" checked={weighted} onCheckedChange={setWeighted} />
            <Label htmlFor="weighted">Ponderar por créditos (ECTS)</Label>
          </div>

          <div className="space-y-3">
            {subjects.map((s) => (
              <div key={s.id} className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label className="text-xs">Asignatura</Label>
                  <Input
                    value={s.name}
                    onChange={(e) => update(s.id, "name", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="w-20">
                  <Label className="text-xs">Nota</Label>
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
                    <Label className="text-xs">Créditos</Label>
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
            <Plus className="h-4 w-4" /> Añadir asignatura
          </Button>
        </CardContent>
      </Card>

      {average !== null && (
        <Card className="border-primary/30 bg-primary/5 mb-8">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">
              Nota media {weighted ? "ponderada" : "simple"}
            </p>
            <p className="text-4xl font-bold text-primary">
              {average.toLocaleString("es-ES", { maximumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
      )}

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Preguntas frecuentes</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="q1">
            <AccordionTrigger>¿Qué es la media ponderada por créditos?</AccordionTrigger>
            <AccordionContent>
              Cada asignatura pesa según sus créditos ECTS. Se multiplica la nota
              por los créditos, se suman todos y se divide entre el total de
              créditos. Es la media oficial del expediente universitario.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
