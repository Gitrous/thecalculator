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
    intro1: "La letra del DNI español no es aleatoria: es un dígito de verificación calculado matemáticamente a partir del número. Su función es detectar errores en la introducción del número (como sucede con el IBAN bancario o el ISBN de los libros). El algoritmo aplica el módulo 23 al número y el resultado se convierte en una letra mediante la tabla oficial TRWAGMYFPDXBNJZSQVHLCKE.",
    intro2: "Esta calculadora también funciona para el NIE (Número de Identidad de Extranjero), que comienza por X, Y o Z. Antes de aplicar el módulo, esas letras se sustituyen por 0, 1 y 2 respectivamente. El resultado es instantáneo y el cálculo se realiza en tu propio navegador, sin enviar ningún dato a ningún servidor.",
    disclaimer: "Esta herramienta es solo para verificar la letra. Para cualquier gestión oficial relacionada con el DNI, acude a las autoridades competentes.",
    cardTitle: "Número de DNI o NIE",
    inputLabel: "Número (8 dígitos para DNI, X/Y/Z + 7 para NIE)",
    fullDocLabel: "Documento completo",
    letterText: (l: string) => <>La letra es <span className="font-semibold">{l}</span></>,
    invalid: "Introduce un número válido (7-8 dígitos, o X/Y/Z para NIE).",
    howTitle: "¿Cómo se calcula la letra?",
    howText: (<>Se divide el número del DNI entre 23 y se toma el resto. Ese resto (de 0 a 22) corresponde a una letra según la tabla oficial <span className="font-mono"> TRWAGMYFPDXBNJZSQVHLCKE</span>. En el NIE, la letra inicial X, Y o Z se sustituye por 0, 1 o 2 antes de calcular.</>),
    faqTitle: "Preguntas frecuentes",
    q1: "¿Sirve también para el NIE?",
    a1: "Sí. Los NIE comienzan por X, Y o Z. Antes de aplicar el módulo 23, esa letra se convierte en 0, 1 o 2 respectivamente. Así, un NIE que empiece por Y se trata como si el número comenzara por 1, y se aplica exactamente el mismo algoritmo que para el DNI. Esta calculadora detecta automáticamente si introduces un NIE y realiza la sustitución por ti.",
    q2: "¿Por qué se divide entre 23?",
    a2: "Porque la tabla de control tiene exactamente 23 caracteres (TRWAGMYFPDXBNJZSQVHLCKE). El resto de dividir cualquier número entre 23 siempre da un valor de 0 a 22, que se mapea a una letra única. Se eligió 23 porque es primo, lo que minimiza la probabilidad de que dos números distintos tengan la misma letra de verificación.",
    q3: "¿Qué pasa si la letra de mi DNI no coincide?",
    a3: "Si la letra de tu DNI físico no coincide con la que calcula la herramienta, comprueba que hayas escrito todos los dígitos correctamente. Un error tipográfico es la causa más frecuente. Si la discrepancia persiste y estás seguro del número, puede ser que el documento contenga una errata; en ese caso, debes acudir a la Oficina del Censo Electoral o a la comisaría de tu ciudad para solicitar la rectificación.",
  },
  en: {
    title: "Spanish DNI Letter Calculator",
    subtitle: "Enter the numbers of your Spanish DNI or NIE and get the correct check letter instantly. Calculation is done in your browser.",
    intro1: "The letter on a Spanish DNI is not random: it is a check digit calculated mathematically from the number. Its purpose is to detect errors in number entry (as with bank IBANs or book ISBNs). The algorithm applies modulo 23 to the number and the result is converted to a letter using the official table TRWAGMYFPDXBNJZSQVHLCKE.",
    intro2: "This calculator also works for the NIE (Número de Identidad de Extranjero), which begins with X, Y or Z. Before applying the modulo, those letters are replaced by 0, 1 and 2 respectively. The result is instant and the calculation is done in your own browser, without sending any data to any server.",
    disclaimer: "This tool is only for verifying the letter. For any official matters related to the DNI, contact the relevant authorities.",
    cardTitle: "DNI or NIE number",
    inputLabel: "Number (8 digits for DNI, X/Y/Z + 7 for NIE)",
    fullDocLabel: "Complete document",
    letterText: (l: string) => <>The letter is <span className="font-semibold">{l}</span></>,
    invalid: "Enter a valid number (7-8 digits, or X/Y/Z for NIE).",
    howTitle: "How is the letter calculated?",
    howText: (<>The DNI number is divided by 23 and the remainder is taken. That remainder (0 to 22) corresponds to a letter according to the official table <span className="font-mono"> TRWAGMYFPDXBNJZSQVHLCKE</span>. For the NIE, the initial letter X, Y or Z is replaced by 0, 1 or 2 before calculating.</>),
    faqTitle: "Frequently asked questions",
    q1: "Does it also work for the NIE?",
    a1: "Yes. NIE numbers begin with X, Y or Z. Before applying modulo 23, that letter is converted to 0, 1 or 2 respectively. So an NIE starting with Y is treated as if the number started with 1, and the exact same algorithm as for the DNI is applied. This calculator automatically detects if you enter a NIE and performs the substitution for you.",
    q2: "Why is it divided by 23?",
    a2: "Because the control table has exactly 23 characters (TRWAGMYFPDXBNJZSQVHLCKE). The remainder of dividing any number by 23 always gives a value from 0 to 22, which maps to a unique letter. 23 was chosen because it is prime, which minimises the probability of two different numbers sharing the same verification letter.",
    q3: "What if the letter on my DNI doesn't match?",
    a3: "If the letter on your physical DNI does not match the one the tool calculates, check that you have typed all the digits correctly — a typo is the most common cause. If the discrepancy persists and you are sure of the number, the document may contain an error; in that case, visit your local Electoral Census Office or police station to request a correction.",
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
      <p className="text-muted-foreground mb-6">{t.subtitle}</p>

      <div className="prose prose-sm dark:prose-invert max-w-none mb-8 space-y-3 text-gray-700 dark:text-gray-300">
        <p>{t.intro1}</p>
        <p>{t.intro2}</p>
      </div>

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

      <p className="text-xs text-muted-foreground italic mt-4 mb-2">{t.disclaimer}</p>

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
