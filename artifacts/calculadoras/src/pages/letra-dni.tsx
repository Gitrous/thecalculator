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
import { AdUnit } from "@/components/ad-unit";
import { AD_SLOTS } from "@/lib/ads";
import { useLocale } from "@/lib/locale";

const LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";
const NIE_PREFIX: Record<string, string> = { X: "0", Y: "1", Z: "2" };

function computeLetter(input: string): { letter: string; full: string } | null {
  let raw = input.trim().toUpperCase().replace(/[\s-]/g, "");
  if (!raw) return null;

  let prefix = "";
  if (NIE_PREFIX[raw[0]] !== undefined) {
    prefix = raw[0];
    raw = NIE_PREFIX[raw[0]] + raw.slice(1);
  }

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

const T = {
  es: {
    title: "Calculadora Letra del DNI",
    subtitle: "Introduce los números de tu DNI o NIE y obtén la letra correcta al instante. El cálculo se hace en tu navegador.",
    cardTitle: "Número de DNI o NIE",
    inputLabel: "Número (8 dígitos para DNI, X/Y/Z + 7 para NIE)",
    fullDocLabel: "Documento completo",
    letterText: (l: string) => <>La letra es <span className="font-semibold">{l}</span></>,
    invalid: "Introduce un número válido (7-8 dígitos, o X/Y/Z para NIE).",
    howTitle: "¿Cómo se calcula la letra?",
    howText: (<>Se divide el número del DNI entre 23 y se toma el resto. Ese resto (de 0 a 22) corresponde a una letra según la tabla oficial <span className="font-mono"> TRWAGMYFPDXBNJZSQVHLCKE</span>. En el NIE, la letra inicial X, Y o Z se sustituye por 0, 1 o 2 antes de calcular.</>),
    faqTitle: "Preguntas frecuentes",
    q1: "¿Sirve también para el NIE?",
    a1: "Sí. Si el documento empieza por X, Y o Z, se convierte en 0, 1 o 2 respectivamente y se aplica el mismo cálculo módulo 23.",
    q2: "¿Por qué se divide entre 23?",
    a2: "Porque hay 23 letras posibles en la tabla de control. El resto de dividir entre 23 garantiza un único carácter de verificación.",
  },
  en: {
    title: "Spanish DNI Letter Calculator",
    subtitle: "Enter the numbers of your Spanish DNI or NIE and get the correct check letter instantly. Calculation is done in your browser.",
    cardTitle: "DNI or NIE number",
    inputLabel: "Number (8 digits for DNI, X/Y/Z + 7 for NIE)",
    fullDocLabel: "Complete document",
    letterText: (l: string) => <>The letter is <span className="font-semibold">{l}</span></>,
    invalid: "Enter a valid number (7-8 digits, or X/Y/Z for NIE).",
    howTitle: "How is the letter calculated?",
    howText: (<>The DNI number is divided by 23 and the remainder is taken. That remainder (0 to 22) corresponds to a letter according to the official table <span className="font-mono"> TRWAGMYFPDXBNJZSQVHLCKE</span>. For the NIE, the initial letter X, Y or Z is replaced by 0, 1 or 2 before calculating.</>),
    faqTitle: "Frequently asked questions",
    q1: "Does it also work for the NIE?",
    a1: "Yes. If the document starts with X, Y or Z, it is converted to 0, 1 or 2 respectively and the same modulo 23 calculation is applied.",
    q2: "Why is it divided by 23?",
    a2: "Because there are 23 possible letters in the control table. The remainder of dividing by 23 guarantees a unique verification character.",
  },
};

export default function LetraDni() {
  const locale = useLocale();
  const t = T[locale];

  const [value, setValue] = useState("");
  const result = computeLetter(value);

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <IdCard className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
      </div>
      <p className="text-muted-foreground mb-8">{t.subtitle}</p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t.cardTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="dni">{t.inputLabel}</Label>
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
                <p className="text-sm text-muted-foreground mb-1">{t.fullDocLabel}</p>
                <p className="text-4xl font-bold text-primary tracking-widest">{result.full}</p>
                <p className="mt-2 text-muted-foreground">{t.letterText(result.letter)}</p>
              </>
            ) : (
              <p className="text-destructive">{t.invalid}</p>
            )}
          </CardContent>
        </Card>
      )}

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">{t.howTitle}</h2>
        <p className="text-muted-foreground mb-4">{t.howText}</p>
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
        </Accordion>
      </section>
    </div>
  );
}
