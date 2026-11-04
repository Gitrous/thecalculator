import { useState } from "react";
import { registerFaq } from "@/lib/faq-schema";
import { Sigma } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
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

export interface DispersionResult {
  n: number;
  mean: number;
  sumSquares: number;
  variance: number;
  sd: number;
}

/** Parses numbers separated by commas, semicolons, spaces or line breaks.
 * Returns null if any token is not a finite number. */
export function parseValues(text: string): number[] | null {
  const tokens = text.split(/[\s,;]+/).filter((t) => t.length > 0);
  const values: number[] = [];
  for (const token of tokens) {
    const value = Number(token);
    if (!Number.isFinite(value)) return null;
    values.push(value);
  }
  return values;
}

/** Mean, variance and standard deviation. The sample version divides the sum of
 * squared deviations by n - 1; the population version divides by N. Both use the
 * mean of the data, so the sum of squares is computed from it directly. */
export function computeDispersion(values: number[], sample: boolean): DispersionResult | null {
  const n = values.length;
  if (sample ? n < 2 : n < 1) return null;
  const mean = values.reduce((acc, v) => acc + v, 0) / n;
  const sumSquares = values.reduce((acc, v) => acc + (v - mean) ** 2, 0);
  const variance = sumSquares / (sample ? n - 1 : n);
  return { n, mean, sumSquares, variance, sd: Math.sqrt(variance) };
}

const SOURCE_URL =
  "https://openstax.org/books/introducci%C3%B3n-estad%C3%ADstica/pages/2-7-medidas-de-la-dispersion-de-los-datos";

const T = {
  es: {
    title: "Calculadora de Desviación Típica",
    subtitle: "Introduce una lista de datos y calcula su media, su varianza y su desviación típica, como muestra o como población completa.",
    intro1: "La desviación típica mide cuánto se alejan, en promedio, los datos de su media. Cuanto más pequeña es, más agrupados están los valores alrededor de la media; cuanto más grande es, más dispersos están.",
    intro2: "Escribe los datos separados por comas, espacios o saltos de línea. Elige si son una muestra (se divide entre n − 1) o toda la población (se divide entre N). El cálculo se hace en tu navegador.",
    cardTitle: "Datos",
    dataLabel: "Datos (números)",
    typeLabel: "Tipo de datos",
    sampleOption: "Muestra (divide entre n − 1)",
    populationOption: "Población completa (divide entre N)",
    invalid: "Revisa los datos: todos deben ser números, y hacen falta al menos 2 para una muestra o 1 para una población.",
    nLabel: "Datos (n)",
    meanLabel: "Media",
    varianceLabel: "Varianza",
    sdLabel: "Desviación típica",
    howTitle: "Fórmula",
    howText: "Se calcula la media, se restan la media a cada dato y se elevan al cuadrado las diferencias. Su suma se divide entre n − 1 (muestra) o entre N (población) para obtener la varianza, y la desviación típica es la raíz cuadrada de la varianza. Para una muestra, s = √(Σ(x − x̄)² / (n − 1)); para una población, σ = √(Σ(x − μ)² / N).",
    deepTitle: "Por qué una muestra se divide entre n − 1",
    deep: "Cuando los datos son una muestra y lo que quieres es estimar la dispersión de un grupo mayor, la división entre n − 1 es la corrección habitual, y es la que aplica el texto de referencia de esta página. Si los datos son todos los que existen, por ejemplo las notas de todos los alumnos de una clase, la cifra correcta es la de población, que divide entre N. La diferencia entre ambas es pequeña con muchos datos y grande con pocos.",
    exampleTitle: "Ejemplo resuelto",
    example: "Datos: 2, 4, 4, 4, 5, 5, 7, 9. Son n = 8 datos y su media es 5. La suma de los cuadrados de las diferencias con la media es 32. Como población, la varianza es 32 / 8 = 4 y la desviación típica es 2. Como muestra, la varianza es 32 / 7 ≈ 4,57 y la desviación típica ≈ 2,14.",
    sourceTitle: "Fuente de las fórmulas",
    sourceText: "OpenStax, Introducción a la estadística, sección 2.7 «Medidas de la dispersión de los datos». Es un libro de texto abierto, no una publicación oficial.",
    faqTitle: "Preguntas frecuentes",
    q1: "¿Cuál es la diferencia entre desviación típica y varianza?",
    a1: "La varianza es el promedio de los cuadrados de las diferencias respecto a la media. La desviación típica es su raíz cuadrada. La varianza se expresa en unidades al cuadrado, por ejemplo euros al cuadrado si los datos son euros, mientras que la desviación típica está en las mismas unidades que los datos. Por eso la desviación típica es la medida que se suele comunicar. Ambas miden lo mismo, la dispersión, y la desviación típica la expresa de forma más fácil de interpretar.",
    q2: "¿Cuándo uso muestra y cuándo población?",
    a2: "Usa población cuando tienes todos los datos que te interesan, por ejemplo las notas de todos los alumnos de un curso o las ventas completas de un mes. Usa muestra cuando los datos son una parte de un grupo mayor que quieres estudiar, como una encuesta a algunas personas para estimar la opinión de todo un país. En una muestra el resultado se usa como estimación de la población, y por eso se divide entre n − 1. Si dudas, pregúntate si quieres describir solo esos datos (población) o extrapolar al grupo del que proceden (muestra).",
    q3: "¿Qué significa que la desviación típica sea grande o pequeña?",
    a3: "Solo tiene sentido comparada con la media y con las unidades de los datos. Una desviación típica de 2 es muy grande si las medidas rondan 3 y muy pequeña si rondan 300. Una desviación pequeña indica que la mayoría de los valores están cerca de la media, y una grande indica que se reparten en un rango amplio. Para comparar la dispersión de dos conjuntos con medias muy diferentes, conviene usar otras medidas relativas, como el coeficiente de variación.",
    q4: "¿Puedo usar números negativos o decimales?",
    a4: "Sí. La desviación típica se calcula con cualquier número real, positivo, negativo o decimal. La varianza nunca es negativa porque es una suma de cuadrados, así que la desviación típica tampoco. Además, si sumas la misma cantidad a todos los datos, la media cambia pero la desviación típica no, porque las diferencias respecto a la media siguen siendo las mismas. Escribe los decimales con punto (2.5), porque la coma separa los datos.",
    q5: "¿Se guardan los datos que introduzco?",
    a5: "No. El cálculo se hace en tu propio navegador con el código que ya se ha cargado en la página. Los datos no se envían a ningún servidor ni se almacenan en la web. Si cierras la pestaña, el resultado desaparece con ella.",
  },
  en: {
    title: "Standard Deviation Calculator",
    subtitle: "Enter a list of data and calculate its mean, variance and standard deviation, as a sample or as a full population.",
    intro1: "The standard deviation measures how far the data lie from their mean on average. The smaller it is, the more tightly the values cluster around the mean; the larger it is, the more spread out they are.",
    intro2: "Enter the data separated by commas, spaces or line breaks. Choose whether it is a sample (divided by n − 1) or the whole population (divided by N). The calculation runs in your browser.",
    cardTitle: "Data",
    dataLabel: "Data (numbers)",
    typeLabel: "Type of data",
    sampleOption: "Sample (divide by n − 1)",
    populationOption: "Full population (divide by N)",
    invalid: "Check the data: all values must be numbers, and you need at least 2 for a sample or 1 for a population.",
    nLabel: "Data points (n)",
    meanLabel: "Mean",
    varianceLabel: "Variance",
    sdLabel: "Standard deviation",
    howTitle: "Formula",
    howText: "Calculate the mean, subtract it from each value and square the differences. Their sum is divided by n − 1 (sample) or by N (population) to get the variance, and the standard deviation is the square root of the variance. For a sample, s = √(Σ(x − x̄)² / (n − 1)); for a population, σ = √(Σ(x − μ)² / N).",
    deepTitle: "Why a sample is divided by n − 1",
    deep: "When the data are a sample and you want to estimate the spread of a larger group, dividing by n − 1 is the usual correction, and it is the one applied in the reference text for this page. If the data are all that exists, for example the grades of every student in one class, the correct figure is the population one, which divides by N. The difference between the two is small with many values and large with few.",
    exampleTitle: "Worked example",
    example: "Data: 2, 4, 4, 4, 5, 5, 7, 9. There are n = 8 values and their mean is 5. The sum of the squared differences from the mean is 32. As a population, the variance is 32 / 8 = 4 and the standard deviation is 2. As a sample, the variance is 32 / 7 ≈ 4.57 and the standard deviation ≈ 2.14.",
    sourceTitle: "Source of the formulas",
    sourceText: "OpenStax, Introduction to Statistics, section 2.7 «Measures of the Spread of the Data». It is an open textbook, not an official publication.",
    faqTitle: "Frequently asked questions",
    q1: "What is the difference between standard deviation and variance?",
    a1: "The variance is the average of the squared differences from the mean. The standard deviation is its square root. The variance is expressed in squared units, for example squared euros if the data are in euros, while the standard deviation is in the same units as the data. That is why the standard deviation is the measure usually reported. Both measure the same thing, the spread, and the standard deviation expresses it in a form that is easier to interpret.",
    q2: "When should I use sample and when population?",
    a2: "Use population when you have all the data you care about, for example the grades of every student in a course or the complete sales of a month. Use sample when the data are part of a larger group you want to study, such as a survey of some people used to estimate the opinion of a whole country. In a sample the result is used as an estimate of the population, which is why it is divided by n − 1. If you are unsure, ask yourself whether you want to describe only those data (population) or extend the conclusion to the group they came from (sample).",
    q3: "What does a large or small standard deviation mean?",
    a3: "It only makes sense compared with the mean and the units of the data. A standard deviation of 2 is very large if the measurements are around 3 and very small if they are around 300. A small deviation means most values sit close to the mean, and a large one means they are spread over a wide range. To compare the spread of two sets with very different means, use a relative measure such as the coefficient of variation.",
    q4: "Can I use negative numbers or decimals?",
    a4: "Yes. The standard deviation is calculated with any real number, positive, negative or decimal. The variance is never negative because it is a sum of squares, so the standard deviation is not either. Also, if you add the same amount to every value, the mean changes but the standard deviation does not, because the differences from the mean stay the same. Write decimals with a point (2.5), because the comma separates the values.",
    q5: "Are the data I enter saved?",
    a5: "No. The calculation runs in your own browser, with code that has already loaded on the page. The data are not sent to any server and are not stored on the website. Closing the tab removes the result with it.",
  },
};

export default function DesviacionTipica() {
  const locale = useLocale();
  const t = T[locale];
  const nf = new Intl.NumberFormat(locale === "en" ? "en-GB" : "es-ES", {
    maximumFractionDigits: 4,
  });

  const [text, setText] = useState("");
  const [sample, setSample] = useState(true);

  const values = text.trim() === "" ? null : parseValues(text);
  const result = values ? computeDispersion(values, sample) : null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Sigma className="h-6 w-6 text-primary" />
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
          <div>
            <Label htmlFor="data">{t.dataLabel}</Label>
            <Textarea
              id="data"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-1 font-mono"
              rows={4}
              placeholder="2, 4, 4, 4, 5, 5, 7, 9"
            />
          </div>
          <div>
            <Label>{t.typeLabel}</Label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="kind" checked={sample} onChange={() => setSample(true)} />
                {t.sampleOption}
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="kind" checked={!sample} onChange={() => setSample(false)} />
                {t.populationOption}
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {text.trim() !== "" && (
        <Card className="border-primary/30 bg-primary/5 mb-8">
          <CardContent className="pt-6">
            {result ? (
              <dl className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
                <div>
                  <dt className="text-sm text-muted-foreground">{t.nLabel}</dt>
                  <dd className="text-2xl font-semibold">{result.n}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">{t.meanLabel}</dt>
                  <dd className="text-2xl font-semibold">{nf.format(result.mean)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">{t.varianceLabel}</dt>
                  <dd className="text-2xl font-semibold">{nf.format(result.variance)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">{t.sdLabel}</dt>
                  <dd className="text-2xl font-bold text-primary">{nf.format(result.sd)}</dd>
                </div>
              </dl>
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

      <section className="mt-10 prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t.deepTitle}</h2>
        <p>{t.deep}</p>
        <h3 className="text-base font-semibold mt-6 mb-2 text-gray-900 dark:text-white">{t.exampleTitle}</h3>
        <p>{t.example}</p>
      </section>

      <AdUnit slot={AD_SLOTS.midContent} className="my-10" />

      <section className="mt-10 text-sm text-muted-foreground">
        <h2 className="text-base font-semibold mb-2 text-gray-900 dark:text-white">{t.sourceTitle}</h2>
        <p>
          {t.sourceText}{" "}
          <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer" className="underline">
            openstax.org
          </a>
        </p>
      </section>

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
        </Accordion>
      </section>

      <AdUnit slot={AD_SLOTS.belowFaq} className="mt-8" />
    </div>
  );
}

registerFaq("educacion/desviacion-tipica", T);
