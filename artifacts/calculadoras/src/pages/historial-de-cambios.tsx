import { LegalPage } from "@/components/legal-page";
import { useLocale } from "@/lib/locale";

interface Entry {
  date: string;
  es: string[];
  en: string[];
}

/** Public revision log. Every entry corresponds to a change actually released
 * to the site — do not add entries for work that has not shipped. */
const ENTRIES: Entry[] = [
  {
    date: "2026-09-05",
    es: [
      "TAE: la calculadora deja claro que convierte TIN en tasa efectiva por capitalización y que no calcula la TAE contractual de un préstamo con comisiones. Se corrigió la explicación de la categoría Finanzas, que atribuía a la TAE costes que legalmente quedan fuera (seguros vinculados, notaría y registro).",
      "Préstamo personal: la explicación de la TAE se armonizó con la de la calculadora específica.",
      "Paro: se unificó el criterio de cuantía en el 70 % de la base reguladora los primeros 180 días y el 60 % desde el día 181, conforme al Real Decreto-ley 2/2024. La herramienta pasó a plantearse sobre la base reguladora y los días cotizados en lugar del salario.",
      "Finiquito: el resultado separa visualmente el finiquito (vacaciones y pagas extra, siempre exigible) de la indemnización, que solo corresponde según la causa de extinción.",
      "Autónomos: se añadió la fuente oficial junto a las cifras y el aviso de que la cuota final depende de la regularización posterior. La tarifa plana dejó de presentarse como una cifra única, ya que el MEI se aplica sobre la base de cotización.",
      "Se verificaron contra fuentes oficiales los parámetros de 2026 usados por las calculadoras: IPREM, salario mínimo, pensión máxima y mínima, tramos y bases de cotización de autónomos, escala de IRPF, tipos de IVA y cotización del trabajador.",
      "Se añadió fecha de revisión y enlace a la fuente en doce calculadoras de finanzas, trabajo y salud.",
      "Salud: se revisó el lenguaje del IMC, la hidratación y la frecuencia cardíaca para que describa indicadores en lugar de emitir juicios sobre la persona, y se citaron las fuentes de cada metodología (OMS, EFSA, Mifflin-St Jeor y Tanaka et al.).",
      "Gasto de coche: se retiró el umbral de 0,35 €/km como referencia de coste alto, por ser una regla arbitraria que depende del vehículo, la financiación y los kilómetros recorridos.",
      "Pensión: se advierte de que la metodología de cálculo varía según el año de jubilación y la normativa aplicable.",
      "Reforma del hogar: se detalló el ámbito, el periodo y la procedencia de los precios de referencia.",
      "SEO: se corrigió el hreflang x-default, que apuntaba a la versión inglesa en todas las páginas, y se añadió esa etiqueta al sitemap. Las calculadoras cuyos datos dependen de la normativa española se identifican como tales en la versión inglesa.",
      "Rendimiento: los textos del blog se separaron del paquete principal, de modo que abrir una calculadora descarga menos código.",
    ],
    en: [
      "APR: the calculator now makes clear that it converts a nominal rate into an effective rate through compounding and does not compute a loan's contractual APR with fees. The Finance category explanation, which credited the APR with costs that legally fall outside it (linked insurance, notary and registry), was corrected.",
      "Personal loan: its APR explanation was brought into line with the dedicated calculator.",
      "Unemployment benefit: the amount was unified at 70% of the regulatory base for the first 180 days and 60% from day 181, under Royal Decree-Law 2/2024. The tool is now framed around the regulatory base and days contributed rather than salary.",
      "Final settlement: the result now separates the settlement itself (holidays and pro-rata bonuses, always owed) from the dismissal indemnity, which applies only depending on the reason for termination.",
      "Self-employed: the official source was placed next to the figures, along with a note that the final contribution depends on the later reconciliation. The flat rate is no longer given as a single figure, since the MEI applies to the contribution base.",
      "The 2026 parameters used by the calculators were checked against official sources: IPREM, minimum wage, maximum and minimum pensions, self-employed contribution brackets and bases, income tax scale, VAT rates and employee contributions.",
      "A review date and a source link were added to twelve finance, work and health calculators.",
      "Health: the wording in BMI, hydration and heart rate was revised to describe indicators rather than judge the person, and the source of each methodology was cited (WHO, EFSA, Mifflin-St Jeor and Tanaka et al.).",
      "Car costs: the €0.35/km threshold was removed as a marker of high cost, being an arbitrary rule that depends on the vehicle, its financing and the distance driven.",
      "Pension: the page now warns that the calculation methodology varies with the retirement year and the applicable rules.",
      "Home renovation: the scope, period and provenance of the reference prices were spelled out.",
      "SEO: the x-default hreflang, which pointed at the English version on every page, was corrected, and that tag was added to the sitemap. Calculators whose data depend on Spanish regulation are identified as such in the English version.",
      "Performance: the blog prose was split out of the main bundle, so opening a calculator downloads less code.",
    ],
  },
  {
    date: "2026-09-04",
    es: [
      "Se reescribieron los artículos del blog sobre finanzas y salud para precisar afirmaciones y añadir los matices que faltaban.",
      "Se añadieron fuentes a las calculadoras de salud y datos estructurados de preguntas frecuentes.",
      "Se publicaron las páginas Sobre nosotros y Metodología, y se separó la metodología en una página propia.",
      "Se precisaron avisos, fuentes y afirmaciones en las calculadoras de finanzas, hogar, trabajo y educación.",
    ],
    en: [
      "The finance and health blog articles were rewritten to tighten claims and add missing nuance.",
      "Sources were added to the health calculators, along with FAQ structured data.",
      "The About and Methodology pages were published, with methodology split into a page of its own.",
      "Notices, sources and claims were tightened across the finance, home, work and education calculators.",
    ],
  },
  {
    date: "2026-07-24",
    es: [
      "Se alinearon la etiqueta canonical, el hreflang y el sitemap con la URL realmente servida, que lleva barra final.",
      "El sitio pasó a denominarse thecalculator.tech.",
    ],
    en: [
      "The canonical tag, hreflang and sitemap were aligned with the URL actually served, which carries a trailing slash.",
      "The site was renamed to thecalculator.tech.",
    ],
  },
  {
    date: "2026-07-22",
    es: [
      "Se corrigió el prerenderizado del blog: sesenta URLs del sitemap no llegaban a generarse.",
      "Las preguntas frecuentes pasaron a ser visibles para los rastreadores y se amplió el contenido de las páginas de categoría.",
      "Se amplió el contenido editorial de las calculadoras que aún eran demasiado breves.",
    ],
    en: [
      "Blog prerendering was fixed: sixty sitemap URLs were not being generated.",
      "The FAQs were made visible to crawlers and the category pages were expanded.",
      "The editorial content of the calculators that were still too brief was expanded.",
    ],
  },
];

export default function HistorialDeCambios() {
  const isEn = useLocale() === "en";

  const intro = isEn ? (
    <>
      <p>
        This page records the changes we make to the calculators and to the published content: what
        was changed, on which page and on what date. We keep it because a calculator that depends on
        legislation is only as good as its last review, and because a review date is worth little if
        you cannot see what it covered.
      </p>
      <p>
        Parameters that depend on regulation are reviewed once a year, when the figures for the new
        tax and contribution period are published, and additionally whenever a rule changes in the
        meantime. Each calculator shows its own review date and its sources. Our working method is
        described in our <a href="/en/methodology">methodology</a>, and if you spot an error you can
        report it through the <a href="/en/contact">contact page</a>: we correct it and log it here.
      </p>
      <p>
        Only released changes are listed. Purely cosmetic or internal work is left out.
      </p>
    </>
  ) : (
    <>
      <p>
        Esta página recoge los cambios que hacemos en las calculadoras y en el contenido publicado:
        qué se ha cambiado, en qué página y en qué fecha. La mantenemos porque una calculadora que
        depende de la normativa vale lo que valga su última revisión, y porque una fecha de revisión
        sirve de poco si no puedes ver qué abarcó.
      </p>
      <p>
        Los parámetros que dependen de la normativa se revisan una vez al año, cuando se publican las
        cifras del nuevo ejercicio fiscal y de cotización, y además cada vez que cambia una norma
        entre medias. Cada calculadora muestra su propia fecha de revisión y sus fuentes. Cómo
        trabajamos está descrito en nuestra <a href="/metodologia">metodología</a>, y si detectas un
        error puedes comunicárnoslo desde la <a href="/contacto">página de contacto</a>: lo
        corregimos y lo registramos aquí.
      </p>
      <p>
        Solo se listan los cambios publicados. El trabajo puramente estético o interno queda fuera.
      </p>
    </>
  );

  return (
    <LegalPage
      title={isEn ? "Change history" : "Historial de cambios"}
      description={
        isEn
          ? "A dated record of the changes made to the calculators and published content on thecalculator.tech."
          : "Registro fechado de los cambios realizados en las calculadoras y el contenido publicado de thecalculator.tech."
      }
      path={isEn ? "/en/changelog" : "/historial-de-cambios"}
      alternatePath={isEn ? "/historial-de-cambios" : "/en/changelog"}
      updated={isEn ? "Last updated: September 6, 2026" : "Última actualización: 6 de septiembre de 2026"}
    >
      {intro}

      {ENTRIES.map((entry) => {
        const items = isEn ? entry.en : entry.es;
        const label = new Date(`${entry.date}T00:00:00`).toLocaleDateString(isEn ? "en-GB" : "es-ES", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        return (
          <section key={entry.date}>
            <h2>{label}</h2>
            <ul>
              {items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>
        );
      })}
    </LegalPage>
  );
}
