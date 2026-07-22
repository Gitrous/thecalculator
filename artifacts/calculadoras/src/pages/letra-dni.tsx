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
    q4: "¿Por qué se excluyen algunas letras del alfabeto?",
    a4: "La tabla de control TRWAGMYFPDXBNJZSQVHLCKE omite deliberadamente las letras I, Ñ, O y U. La I y la O se descartan porque se confunden visualmente con los dígitos 1 y 0, algo especialmente problemático en documentos escaneados o rellenados a mano. La U se excluye por su parecido con la V, y la Ñ porque no existe en muchos teclados y sistemas informáticos internacionales, lo que causaría problemas de compatibilidad. El resultado son 23 letras inequívocas, un número que además es primo y resulta ideal para el algoritmo de módulo.",
    q5: "¿Puede haber dos DNI con el mismo número y distinta letra?",
    a5: "No. Para un número de DNI dado, la letra es única y está determinada matemáticamente por el resto de dividir ese número entre 23. Es decir, la letra no aporta información nueva ni identifica a nadie: es puramente un dígito de control que sirve para detectar errores de transcripción. Si alguien teclea mal una cifra, lo más probable es que la letra deje de cuadrar y el sistema rechace el dato antes de guardarlo. Ese es exactamente el propósito para el que se diseñó en 1990, cuando se añadió la letra al Documento Nacional de Identidad.",
    q6: "¿Es lo mismo el DNI que el NIF?",
    a6: "Para una persona física española, el NIF (Número de Identificación Fiscal) coincide con el número del DNI seguido de su letra de control, por lo que en la práctica son el mismo identificador usado en contextos distintos. El NIF es el término que emplea la Agencia Tributaria en el ámbito fiscal, mientras que DNI designa el documento físico. Para extranjeros residentes el identificador equivalente es el NIE, y para empresas y entidades jurídicas existe un NIF propio que empieza por una letra que indica la forma jurídica (A para sociedades anónimas, B para limitadas, G para asociaciones, entre otras).",
    deepTitle: "El algoritmo de la letra del DNI paso a paso",
    deep: "El cálculo se basa en una operación de módulo, muy habitual en los sistemas de dígitos de control. El procedimiento consta de tres pasos. Primero se toma el número del DNI completo, sin la letra, como un número entero de hasta ocho cifras. Segundo, se divide ese número entre 23 y se conserva únicamente el resto de la división, que necesariamente será un valor entre 0 y 22. Tercero, ese resto se usa como índice dentro de la cadena de control TRWAGMYFPDXBNJZSQVHLCKE, contando desde la posición 0. La letra que ocupa esa posición es la letra del DNI. En el caso del NIE, la letra inicial X, Y o Z se sustituye previamente por 0, 1 o 2 y después se aplica el mismo procedimiento.",
    exampleTitle: "Ejemplo resuelto",
    example: "Tomemos el número 12345678. Lo dividimos entre 23: 12345678 / 23 = 536768 con un resto de 14, ya que 536768 × 23 = 12345664 y 12345678 − 12345664 = 14. Ahora buscamos la posición 14 en la cadena TRWAGMYFPDXBNJZSQVHLCKE, contando desde cero: T(0), R(1), W(2), A(3), G(4), M(5), Y(6), F(7), P(8), D(9), X(10), B(11), N(12), J(13), Z(14). La letra es la Z, de modo que el DNI completo sería 12345678-Z.",
    tableTitle: "Tabla de control: resto y letra correspondiente",
    tableColRest: "Resto",
    tableColLetter: "Letra",
    interpretTitle: "Para qué sirve realmente la letra",
    interpret: "La letra del DNI es un dígito de control, no un dato identificativo. Su única función es detectar errores al teclear o transcribir el número, y lo hace con notable eficacia: si te equivocas en una sola cifra, la probabilidad de que la letra siga cuadrando es de aproximadamente 1 entre 23, es decir, en torno al 4 %. Esto significa que el sistema detecta alrededor del 96 % de los errores de un solo dígito antes de que lleguen a una base de datos. Por eso los formularios de bancos, administraciones y comercios electrónicos validan la letra en el momento de introducir el número. Ten en cuenta, no obstante, que la validación de la letra solo confirma que el número es coherente, no que corresponda a una persona realmente existente.",
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
    q4: "Why are some letters of the alphabet excluded?",
    a4: "The control table TRWAGMYFPDXBNJZSQVHLCKE deliberately omits the letters I, Ñ, O and U. I and O are dropped because they are visually confused with the digits 1 and 0, which is especially problematic on scanned or handwritten documents. U is excluded for its resemblance to V, and Ñ because it does not exist on many international keyboards and computer systems, which would cause compatibility problems. The result is 23 unambiguous letters — a number that is also prime, making it ideal for the modulo algorithm.",
    q5: "Can two DNIs share a number with different letters?",
    a5: "No. For a given DNI number, the letter is unique and mathematically determined by the remainder of dividing that number by 23. In other words, the letter carries no new information and identifies nobody: it is purely a check digit used to detect transcription errors. If someone mistypes a figure, the letter will most likely stop matching and the system will reject the entry before storing it. That is exactly the purpose it was designed for in 1990, when the letter was added to the Spanish National Identity Document.",
    q6: "Are the DNI and the NIF the same thing?",
    a6: "For a Spanish individual, the NIF (Tax Identification Number) is the DNI number followed by its control letter, so in practice they are the same identifier used in different contexts. NIF is the term the tax authority uses in fiscal matters, while DNI refers to the physical document. For foreign residents the equivalent identifier is the NIE, and companies and legal entities have their own NIF starting with a letter that indicates the legal form (A for public limited companies, B for limited companies, G for associations, among others).",
    deepTitle: "The DNI letter algorithm step by step",
    deep: "The calculation is based on a modulo operation, very common in check-digit systems. The procedure has three steps. First, take the full DNI number, without the letter, as an integer of up to eight digits. Second, divide that number by 23 and keep only the remainder, which will necessarily be a value between 0 and 22. Third, use that remainder as an index into the control string TRWAGMYFPDXBNJZSQVHLCKE, counting from position 0. The letter at that position is the DNI letter. In the case of the NIE, the leading letter X, Y or Z is first replaced by 0, 1 or 2 and then the same procedure is applied.",
    exampleTitle: "Worked example",
    example: "Take the number 12345678. We divide it by 23: 12345678 / 23 = 536768 with a remainder of 14, since 536768 × 23 = 12345664 and 12345678 − 12345664 = 14. Now we look up position 14 in the string TRWAGMYFPDXBNJZSQVHLCKE, counting from zero: T(0), R(1), W(2), A(3), G(4), M(5), Y(6), F(7), P(8), D(9), X(10), B(11), N(12), J(13), Z(14). The letter is Z, so the complete DNI would be 12345678-Z.",
    tableTitle: "Control table: remainder and matching letter",
    tableColRest: "Remainder",
    tableColLetter: "Letter",
    interpretTitle: "What the letter is actually for",
    interpret: "The DNI letter is a check digit, not identifying data. Its only function is to detect errors when typing or transcribing the number, and it does so remarkably well: if you get a single digit wrong, the probability that the letter still matches is roughly 1 in 23, around 4%. That means the system catches about 96% of single-digit errors before they reach a database. This is why forms at banks, public administrations and online shops validate the letter as soon as you enter the number. Bear in mind, however, that validating the letter only confirms the number is internally consistent, not that it belongs to a real person.",
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

      <section className="mt-10 prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t.deepTitle}</h2>
        <p>{t.deep}</p>
        <h3 className="text-base font-semibold mt-6 mb-2 text-gray-900 dark:text-white">{t.exampleTitle}</h3>
        <p>{t.example}</p>
      </section>

      <div className="mt-8">
        <h3 className="text-base font-semibold mb-3 text-gray-900 dark:text-white">{t.tableTitle}</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {LETTERS.split("").map((letter, i) => (
            <div
              key={letter}
              className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-2 py-2 text-center"
            >
              <p className="text-xs text-gray-500 dark:text-white/50">{t.tableColRest} {i}</p>
              <p className="text-lg font-bold font-mono text-primary">{letter}</p>
            </div>
          ))}
        </div>
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
