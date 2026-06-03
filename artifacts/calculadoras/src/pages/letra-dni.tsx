import { useState } from "react";
import { IdCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";
const NIE_PREFIX: Record<string, string> = { X: "0", Y: "1", Z: "2" };

function computeLetter(input: string): { letter: string; full: string } | null {
  let raw = input.trim().toUpperCase().replace(/[\s-]/g, "");
  if (!raw) return null;

  // NIE: starts with X, Y or Z
  let prefix = "";
  if (NIE_PREFIX[raw[0]] !== undefined) {
    prefix = raw[0];
    raw = NIE_PREFIX[raw[0]] + raw.slice(1);
  }

  // Drop a trailing letter if the user typed the whole document.
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.length < 7 || digits.length > 8) return null;

  const number = parseInt(digits, 10);
  if (isNaN(number)) return null;

  const letter = LETTERS[number % 23];
  const shownNumber = prefix
    ? prefix + digits.slice(1).padStart(7, "0")
    : digits;
  return { letter, full: `${shownNumber}${letter}` };
}

export default function LetraDni() {
  const [value, setValue] = useState("");
  const result = computeLetter(value);

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <IdCard className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Calculadora Letra del DNI
        </h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Introduce los números de tu DNI o NIE y obtén la letra correcta al
        instante. El cálculo se hace en tu navegador.
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Número de DNI o NIE</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="dni">Número (8 dígitos para DNI, X/Y/Z + 7 para NIE)</Label>
          <Input
            id="dni"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mt-1 text-lg tracking-widest"
            placeholder="12345678"
            inputMode="text"
          />
        </CardContent>
      </Card>

      {value.trim() && (
        <Card className="border-primary/30 bg-primary/5 mb-8">
          <CardContent className="pt-6 text-center">
            {result ? (
              <>
                <p className="text-sm text-muted-foreground mb-1">
                  Documento completo
                </p>
                <p className="text-4xl font-bold text-primary tracking-widest">
                  {result.full}
                </p>
                <p className="mt-2 text-muted-foreground">
                  La letra es <span className="font-semibold">{result.letter}</span>
                </p>
              </>
            ) : (
              <p className="text-destructive">
                Introduce un número válido (7-8 dígitos, o X/Y/Z para NIE).
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">¿Cómo se calcula la letra?</h2>
        <p className="text-muted-foreground mb-4">
          Se divide el número del DNI entre 23 y se toma el resto. Ese resto
          (de 0 a 22) corresponde a una letra según la tabla oficial
          <span className="font-mono"> TRWAGMYFPDXBNJZSQVHLCKE</span>. En el NIE,
          la letra inicial X, Y o Z se sustituye por 0, 1 o 2 antes de calcular.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Preguntas frecuentes</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="q1">
            <AccordionTrigger>¿Sirve también para el NIE?</AccordionTrigger>
            <AccordionContent>
              Sí. Si el documento empieza por X, Y o Z, se convierte en 0, 1 o 2
              respectivamente y se aplica el mismo cálculo módulo 23.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>¿Por qué se divide entre 23?</AccordionTrigger>
            <AccordionContent>
              Porque hay 23 letras posibles en la tabla de control. El resto de
              dividir entre 23 garantiza un único carácter de verificación.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
