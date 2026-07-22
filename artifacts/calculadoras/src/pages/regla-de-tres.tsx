import { useState } from "react";
import { GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
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

type Kind = "directa" | "inversa";

function fmt(n: number): string {
  return n.toLocaleString("es-ES", { maximumFractionDigits: 4 });
}

const T = {
  es: {
    title: "Calculadora Regla de Tres",
    subtitle: "Resuelve la regla de tres directa e inversa. Si A es a B, entonces C es a X.",
    intro1: "La regla de tres es un procedimiento matemático para encontrar un valor desconocido cuando se conocen tres valores relacionados proporcionalmente. Es una de las herramientas más utilizadas en matemáticas prácticas: desde calcular precios al por mayor hasta escalar ingredientes de una receta, convertir divisas o calcular distancias en un mapa.",
    intro2: "Existen dos tipos: la regla de tres directa (cuando ambas magnitudes crecen o decrecen en la misma proporción) y la regla de tres inversa (cuando una magnitud aumenta mientras la otra disminuye). Esta calculadora resuelve ambos casos de forma inmediata: introduce los tres valores conocidos, selecciona el tipo y obtendrás el resultado al instante.",
    disclaimer: "Los resultados son exactos matemáticamente. Si A es 0, la operación es indefinida. Verifica el tipo de proporción antes de aplicar el resultado.",
    cardTitle: "Tipo de proporción",
    directBtn: "Directa",
    inverseBtn: "Inversa",
    result: "X (resultado)",
    howTitle: "Qué es la regla de tres y cómo se resuelve",
    how1:
      "La regla de tres es un método para hallar un valor desconocido a partir de tres valores conocidos que mantienen una proporción. Se parte de una relación «A es a B» y se busca el término que completa «C es a X». Es directa cuando ambas magnitudes crecen o decrecen juntas, e inversa cuando una sube mientras la otra baja.",
    how2:
      "En la proporción directa se calcula X = (B × C) / A. En la inversa se calcula X = (A × B) / C. Elige el tipo según la relación entre las magnitudes y la calculadora aplica la fórmula correspondiente.",
    exampleTitle: "Ejemplo",
    example:
      "Directa: si 5 kg cuestan 20 €, 8 kg cuestan X = (20 × 8) / 5 = 32 €. Inversa: si 4 obreros tardan 10 días, 8 obreros tardan X = (4 × 10) / 8 = 5 días.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Cuándo es directa o inversa?",
    a1: "En la proporción directa, al aumentar una magnitud la otra también aumenta en la misma proporción: si compramos más kg, pagamos más. En la inversa, al aumentar una, la otra disminuye: si más obreros trabajan en la misma obra, se tarda menos días. Identificar el tipo es el primer paso para resolver correctamente cualquier problema de proporcionalidad.",
    q2: "¿Cómo se calculan los valores?",
    a2: "En proporción directa: X = (B × C) / A. En proporción inversa: X = (A × B) / C. Ejemplo directo: si 5 kg cuestan 20 €, ¿cuánto cuestan 8 kg? X = (20 × 8) / 5 = 32 €. Ejemplo inverso: si 4 obreros tardan 10 días, ¿cuánto tardan 8? X = (4 × 10) / 8 = 5 días.",
    q3: "¿Para qué sirve en la vida cotidiana?",
    a3: "La regla de tres es la base de cálculos habituales: convertir divisas o unidades (si 1 € son 1,08 $, ¿cuántos $ son 250 €?), escalar recetas de cocina, calcular velocidades medias o repartir proporciones en un presupuesto. También es el fundamento de los cálculos de porcentaje e interés simple.",
    q4: "¿Cómo se plantea una regla de tres compuesta?",
    a4: "Se utiliza cuando intervienen tres o más magnitudes relacionadas entre sí. El procedimiento consiste en analizar por separado cómo afecta cada magnitud a la incógnita y decidir si la relación es directa o inversa en cada caso. Por ejemplo, si 4 obreros levantan 20 metros de muro en 6 días, ¿cuántos metros levantarán 6 obreros en 9 días? Más obreros implican más muro (directa) y más días también implican más muro (directa), así que se multiplica: 20 × (6/4) × (9/6) = 45 metros. La clave está en no mezclar las relaciones y comprobar el sentido de cada una antes de operar.",
    q5: "¿Qué errores son los más frecuentes al aplicarla?",
    a5: "El error más habitual es aplicar una regla directa cuando la relación es inversa, o al revés. Antes de operar conviene preguntarse siempre: si una magnitud aumenta, ¿la otra sube o baja? Si sube, es directa; si baja, es inversa. El segundo error frecuente es no comprobar la coherencia de las unidades: no se pueden mezclar kilómetros con metros ni horas con minutos dentro del mismo planteamiento. Por último, conviene verificar que el resultado tenga sentido: si has pedido una cantidad menor y el resultado sale mayor, algo se ha planteado al revés.",
    deepTitle: "Regla de tres directa e inversa: cómo distinguirlas",
    deep: "En una regla de tres directa, las dos magnitudes crecen o decrecen a la vez: si compras el doble de kilos de fruta, pagas el doble de dinero. La incógnita se despeja multiplicando en cruz, con la fórmula x = (b × c) / a. En una regla de tres inversa, cuando una magnitud aumenta la otra disminuye en la misma proporción: si pones el doble de obreros en una obra, tardas la mitad de tiempo. Aquí la operación cambia y se multiplican los dos datos conocidos de la misma magnitud: x = (a × b) / c. Identificar correctamente el tipo de relación antes de operar es el paso que determina que el resultado sea correcto.",
    workedTitle: "Ejemplo resuelto",
    worked: "Directa: si 3 kilos de manzanas cuestan 4,50 €, ¿cuánto cuestan 5 kilos? Como más kilos implican más dinero, es directa: x = (4,50 × 5) / 3 = 22,50 / 3 = 7,50 €. Inversa: si 4 pintores tardan 9 días en pintar un edificio, ¿cuánto tardarán 6 pintores? Como más pintores implican menos días, es inversa: x = (4 × 9) / 6 = 36 / 6 = 6 días. Fíjate en que en la directa se multiplica en cruz y en la inversa se multiplican los dos datos de la misma fila.",
    tableTitle: "Relaciones directas e inversas más habituales",
    tableCol1: "Situación",
    tableCol2: "Tipo de relación",
    interpretTitle: "Cómo comprobar que el resultado es correcto",
    interpret: "Una verificación rápida y muy fiable consiste en comparar la magnitud del resultado con la del dato de partida. En una relación directa, si el valor que introduces es mayor que el de referencia, el resultado también debe ser mayor; si es menor, el resultado debe ser menor. En una relación inversa ocurre justo al contrario. Si obtienes un resultado que va en la dirección opuesta a la esperada, casi con seguridad has confundido el tipo de proporcionalidad. Otra comprobación útil es calcular la constante de proporcionalidad: en una regla directa, el cociente entre las dos magnitudes debe mantenerse constante, mientras que en una inversa lo que permanece constante es el producto.",
  },
  en: {
    title: "Rule of Three Calculator",
    subtitle: "Solve direct and inverse proportions. If A is to B, then C is to X.",
    intro1: "The rule of three is a mathematical procedure for finding an unknown value when three proportionally related values are known. It is one of the most widely used tools in practical mathematics: from calculating wholesale prices to scaling recipe ingredients, converting currencies or calculating distances on a map.",
    intro2: "There are two types: the direct rule of three (when both quantities grow or decrease in the same proportion) and the inverse rule of three (when one quantity increases while the other decreases). This calculator solves both cases immediately: enter the three known values, select the type and you will get the result instantly.",
    disclaimer: "Results are mathematically exact. If A is 0, the operation is undefined. Verify the type of proportion before applying the result.",
    cardTitle: "Type of proportion",
    directBtn: "Direct",
    inverseBtn: "Inverse",
    result: "X (result)",
    howTitle: "What the rule of three is and how to solve it",
    how1:
      "The rule of three is a method for finding an unknown value from three known values that share a proportion. You start from a relationship 'A is to B' and look for the term that completes 'C is to X'. It is direct when both quantities grow or shrink together, and inverse when one rises while the other falls.",
    how2:
      "For a direct proportion you calculate X = (B × C) / A. For an inverse one you calculate X = (A × B) / C. Choose the type according to the relationship between the quantities and the calculator applies the matching formula.",
    exampleTitle: "Example",
    example:
      "Direct: if 5 kg cost €20, then 8 kg cost X = (20 × 8) / 5 = €32. Inverse: if 4 workers take 10 days, then 8 workers take X = (4 × 10) / 8 = 5 days.",
    faqTitle: "Frequently asked questions",
    q1: "When is it direct or inverse?",
    a1: "In a direct proportion, increasing one quantity increases the other at the same rate: buying more kg means paying more. In an inverse proportion, increasing one decreases the other: more workers on the same job means fewer days needed. Identifying the type is the first step to solving any proportion problem correctly.",
    q2: "How is the result calculated?",
    a2: "Direct proportion: X = (B × C) / A. Inverse proportion: X = (A × B) / C. Direct example: if 5 kg cost €20, how much do 8 kg cost? X = (20 × 8) / 5 = €32. Inverse example: if 4 workers take 10 days, how long do 8 workers take? X = (4 × 10) / 8 = 5 days.",
    q3: "What is it used for in everyday life?",
    a3: "The rule of three underlies many daily calculations: converting currencies or units (if €1 = $1.08, how many dollars are €250?), scaling recipes, calculating average speeds, or splitting proportional shares in a budget. It is also the foundation of percentage and simple interest calculations.",
    q4: "How do you set up a compound rule of three?",
    a4: "It is used when three or more related quantities are involved. The procedure consists of analysing separately how each quantity affects the unknown and deciding whether the relationship is direct or inverse in each case. For example, if 4 workers build 20 metres of wall in 6 days, how many metres will 6 workers build in 9 days? More workers means more wall (direct) and more days also means more wall (direct), so you multiply: 20 × (6/4) × (9/6) = 45 metres. The key is not to mix up the relationships and to check the direction of each one before calculating.",
    q5: "What are the most common mistakes?",
    a5: "The most frequent error is applying a direct rule when the relationship is inverse, or the other way round. Before calculating, always ask yourself: if one quantity increases, does the other go up or down? If it goes up, it is direct; if it goes down, it is inverse. The second common error is failing to check unit consistency: you cannot mix kilometres with metres or hours with minutes within the same setup. Finally, it is worth checking that the result makes sense: if you asked for a smaller quantity and the result comes out larger, something has been set up backwards.",
    deepTitle: "Direct and inverse rule of three: how to tell them apart",
    deep: "In a direct rule of three, both quantities grow or shrink together: if you buy twice as many kilos of fruit, you pay twice as much. The unknown is solved by cross-multiplying, with the formula x = (b × c) / a. In an inverse rule of three, when one quantity increases the other decreases in the same proportion: if you put twice as many workers on a job, it takes half the time. Here the operation changes and you multiply the two known figures of the same quantity: x = (a × b) / c. Correctly identifying the type of relationship before calculating is the step that determines whether the result is right.",
    workedTitle: "Worked example",
    worked: "Direct: if 3 kilos of apples cost €4.50, how much do 5 kilos cost? Since more kilos means more money, it is direct: x = (4.50 × 5) / 3 = 22.50 / 3 = €7.50. Inverse: if 4 painters take 9 days to paint a building, how long will 6 painters take? Since more painters means fewer days, it is inverse: x = (4 × 9) / 6 = 36 / 6 = 6 days. Note that in the direct case you cross-multiply and in the inverse case you multiply the two figures on the same row.",
    tableTitle: "Most common direct and inverse relationships",
    tableCol1: "Situation",
    tableCol2: "Type of relationship",
    interpretTitle: "How to check the result is correct",
    interpret: "A quick and very reliable check is to compare the size of the result with the reference figure. In a direct relationship, if the value you enter is larger than the reference, the result must also be larger; if it is smaller, the result must be smaller. In an inverse relationship exactly the opposite happens. If you get a result that goes in the opposite direction to what you expected, you have almost certainly confused the type of proportionality. Another useful check is to calculate the constant of proportionality: in a direct rule, the ratio between the two quantities must stay constant, while in an inverse rule what stays constant is the product.",
  },
};

const R3_TABLE = [
  { es: "Kilos de fruta y precio pagado", en: "Kilos of fruit and price paid", tipo: "Directa" , tipoEn: "Direct" },
  { es: "Litros de gasolina y kilómetros recorridos", en: "Litres of fuel and distance covered", tipo: "Directa", tipoEn: "Direct" },
  { es: "Horas trabajadas y salario cobrado", en: "Hours worked and wages earned", tipo: "Directa", tipoEn: "Direct" },
  { es: "Número de obreros y días de obra", en: "Number of workers and days of work", tipo: "Inversa", tipoEn: "Inverse" },
  { es: "Velocidad y tiempo de un trayecto", en: "Speed and journey time", tipo: "Inversa", tipoEn: "Inverse" },
  { es: "Grifos abiertos y tiempo en llenar", en: "Taps open and time to fill", tipo: "Inversa", tipoEn: "Inverse" },
];

export default function ReglaDeTres() {
  const locale = useLocale();
  const t = T[locale];

  const [kind, setKind] = useState<Kind>("directa");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");

  const A = parseFloat(a);
  const B = parseFloat(b);
  const C = parseFloat(c);
  const valid = !isNaN(A) && !isNaN(B) && !isNaN(C) && A !== 0;

  let x: number | null = null;
  if (valid) {
    x = kind === "directa" ? (B * C) / A : (A * B) / C;
    if (kind === "inversa" && C === 0) x = null;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <GitCompare className="h-6 w-6 text-primary" />
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
          <div className="flex gap-2 mb-6">
            <Button
              variant={kind === "directa" ? "default" : "outline"}
              onClick={() => setKind("directa")}
            >
              {t.directBtn}
            </Button>
            <Button
              variant={kind === "inversa" ? "default" : "outline"}
              onClick={() => setKind("inversa")}
            >
              {t.inverseBtn}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 items-end">
            <div>
              <Label htmlFor="a">A</Label>
              <Input id="a" type="number" value={a} onChange={(e) => setA(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="b">B</Label>
              <Input id="b" type="number" value={b} onChange={(e) => setB(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="c">C</Label>
              <Input id="c" type="number" value={c} onChange={(e) => setC(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>{t.result}</Label>
              <div className="mt-1 h-9 flex items-center px-3 rounded-md border bg-muted/40 font-semibold">
                {x !== null ? fmt(x) : "—"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {x !== null && (
        <Card className="border-primary/30 bg-primary/5 mb-8">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">
              {kind === "directa" ? "X = (B × C) / A" : "X = (A × B) / C"}
            </p>
            <p className="text-4xl font-bold text-primary">{fmt(x)}</p>
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
            {R3_TABLE.map((row) => (
              <tr key={row.es} className="border-b border-gray-100 dark:border-white/5">
                <td className="py-2 pr-4 text-gray-900 dark:text-white">{locale === "en" ? row.en : row.es}</td>
                <td className="py-2 font-semibold text-primary whitespace-nowrap">{locale === "en" ? row.tipoEn : row.tipo}</td>
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
