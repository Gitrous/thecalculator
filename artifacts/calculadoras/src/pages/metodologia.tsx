import { LegalPage } from "@/components/legal-page";
import { useLocale } from "@/lib/locale";

export default function Metodologia() {
  const isEn = useLocale() === "en";

  if (isEn) {
    return (
      <LegalPage
        title="Methodology"
        description="How we build and keep our calculators up to date, and which sources we rely on by area."
        path="/en/methodology"
        alternatePath="/metodologia"
        updated="Last updated: September 5, 2026"
      >
        <h2>How we build our calculators</h2>
        <p>
          Every calculator is built from an identifiable basis: a mathematical formula, a piece of
          regulation or a recognised technical reference. Before publishing a tool we test it against
          known cases and worked examples to check that the results match, and we review periodically
          those whose parameters can change over time (tax brackets, contribution rates, legal
          limits). Each page explains how the result is obtained so you can understand the number,
          not just read it.
        </p>

        <h2>Reference sources by area</h2>
        <p>Depending on the calculator, we work from sources such as:</p>
        <ul>
          <li>
            <strong>Finance</strong> — standard financial formulas plus, where a calculation depends
            on Spanish regulation, parameters from the Spanish Tax Agency (AEAT), the Bank of Spain,
            Social Security and the Official State Gazette (BOE).
          </li>
          <li>
            <strong>Work</strong> — Social Security, the State Employment Service (SEPE), the Ministry
            of Labour and the BOE for unemployment benefit, severance, self-employed contributions
            and working-time rules.
          </li>
          <li>
            <strong>Health</strong> — the World Health Organisation's BMI classification, the
            Mifflin-St Jeor equation (1990) for energy expenditure and the Tanaka formula for maximum
            heart rate, among other peer-reviewed references. Health results are estimates and never
            replace medical advice.
          </li>
          <li>
            <strong>Education &amp; physics</strong> — the International System of Units (SI/BIPM) and
            standard academic references.
          </li>
        </ul>

        <h2>How we choose a source</h2>
        <p>
          When a result depends on regulation, we take the figure from the body that sets it, not
          from a secondary summary: the BOE for the wording of a rule, the Tax Agency for income tax
          and VAT, Social Security for contribution bases and pensions, the SEPE for unemployment
          benefit, and bodies such as the WHO or EFSA for health references. Where a page relies on
          a published formula rather than a rule — Mifflin-St Jeor for basal metabolism, Tanaka for
          maximum heart rate — we cite the original paper, so you can check what the formula was
          derived from and on which population.
        </p>
        <p>
          We avoid press articles and blog posts as primary sources. They are useful for spotting
          that something has changed, but not for stating what it changed to. When an official
          source is ambiguous or a rule is being phased in, we say so on the page rather than
          picking the reading that gives the tidier number.
        </p>

        <h2>How we verify a figure before publishing it</h2>
        <p>
          Every parameter that comes from regulation is checked against its official source before
          it goes live, and the check is recorded as a review date next to the figure. We also run
          the calculator against worked examples whose result is known, so that a wrong constant
          shows up as a wrong total. When a figure cannot be verified, we do not publish a review
          date for it: an unverified date is worse than none, because it claims a check that never
          happened.
        </p>
        <p>
          A single figure is rarely enough on its own. A contribution base means little without the
          rate applied to it, and a percentage means little without the cap that limits it, so we
          check the whole chain that produces the number rather than the headline value alone.
        </p>

        <h2>Keeping data up to date</h2>
        <p>
          Calculators whose parameters depend on regulation are reviewed <strong>once a year</strong>,
          when the figures for the new tax and contribution period are published, and additionally{" "}
          <strong>whenever a rule changes in the meantime</strong>. That is the cadence we commit to,
          and we prefer to state a modest one we keep rather than an ambitious one we do not: review
          dates are visible on each page, so a missed cadence would be visible too.
        </p>
        <p>
          Even so, results remain indicative and some parameters may depend on your collective
          agreement, contract or personal situation.
        </p>

        <h2>What happens when the rules change</h2>
        <p>
          When a reform alters a parameter, we update the calculation and the text that explains it
          in the same pass, because a correct number under an outdated explanation is still
          misleading. If the change applies from a given date or is being phased in gradually, the
          page says so instead of presenting the new figure as if it had always applied. The
          Spanish and English versions are updated together, so the two never disagree.
        </p>

        <h2>How we correct an error</h2>
        <p>
          If we get something wrong, we fix it and we record it. Corrections are not made silently:
          the change is logged with its date in the change history, and if it affected a result
          rather than the wording, we say so plainly. We would rather show that a figure was wrong
          for a while than quietly overwrite it.
        </p>

        <p>
          If you spot a figure that looks wrong or a formula that seems out of date, check our{" "}
          <a href="/en/about">corrections policy</a> and let us know through the{" "}
          <a href="/en/contact">contact page</a>. Every revision we release is logged, with its
          date and what it covered, in the <a href="/en/changelog">change history</a>.
        </p>
      </LegalPage>
    );
  }

  return (
    <LegalPage
      title="Metodología"
      description="Cómo elaboramos y mantenemos actualizadas nuestras calculadoras, y qué fuentes de referencia utilizamos por área."
      path="/metodologia"
      alternatePath="/en/methodology"
      updated="Última actualización: 5 de septiembre de 2026"
    >
      <h2>Cómo elaboramos las calculadoras</h2>
      <p>
        Cada calculadora se construye a partir de una base identificable: una fórmula matemática, una
        norma o una referencia técnica reconocida. Antes de publicar una herramienta la comprobamos
        con casos conocidos y ejemplos resueltos para verificar que los resultados coinciden, y
        revisamos periódicamente aquellas cuyos parámetros pueden cambiar con el tiempo (tramos
        fiscales, tipos de cotización, límites legales). Cada página explica cómo se obtiene el
        resultado para que entiendas el número, no solo lo leas.
      </p>

      <h2>Fuentes de referencia por área</h2>
      <p>Según la calculadora, trabajamos con fuentes como:</p>
      <ul>
        <li>
          <strong>Finanzas</strong> — fórmulas financieras estándar y, cuando el cálculo depende de
          normativa española, parámetros de la Agencia Tributaria (AEAT), el Banco de España, la
          Seguridad Social y el Boletín Oficial del Estado (BOE).
        </li>
        <li>
          <strong>Trabajo</strong> — Seguridad Social, Servicio Público de Empleo Estatal (SEPE),
          Ministerio de Trabajo y BOE para el paro, el finiquito, la cuota de autónomos y las reglas
          de jornada.
        </li>
        <li>
          <strong>Salud</strong> — la clasificación del IMC de la Organización Mundial de la Salud, la
          ecuación de Mifflin-St Jeor (1990) para el gasto energético y la fórmula de Tanaka para la
          frecuencia cardíaca máxima, entre otras referencias científicas revisadas por pares. Los
          resultados de salud son estimaciones y nunca sustituyen el consejo médico.
        </li>
        <li>
          <strong>Educación y física</strong> — el Sistema Internacional de Unidades (SI/BIPM) y
          bibliografía académica de referencia.
        </li>
      </ul>

      <h2>Cómo elegimos una fuente</h2>
      <p>
        Cuando un resultado depende de la normativa, tomamos la cifra del organismo que la fija, no
        de un resumen de segunda mano: el BOE para el texto de una norma, la Agencia Tributaria para
        el IRPF y el IVA, la Seguridad Social para bases de cotización y pensiones, el SEPE para la
        prestación por desempleo, y organismos como la OMS o la EFSA para las referencias de salud.
        Cuando una página se apoya en una fórmula publicada en lugar de en una norma —Mifflin-St
        Jeor para el metabolismo basal, Tanaka para la frecuencia cardíaca máxima—, citamos el
        trabajo original, para que puedas comprobar de qué se derivó la fórmula y sobre qué
        población.
      </p>
      <p>
        Evitamos usar noticias de prensa y artículos de blog como fuente primaria. Sirven para
        detectar que algo ha cambiado, pero no para afirmar en qué ha cambiado. Cuando una fuente
        oficial es ambigua o una norma está en despliegue progresivo, lo decimos en la página en
        lugar de escoger la lectura que da el número más redondo.
      </p>

      <h2>Cómo verificamos una cifra antes de publicarla</h2>
      <p>
        Todo parámetro que proviene de la normativa se contrasta con su fuente oficial antes de
        publicarse, y esa comprobación queda registrada como fecha de revisión junto a la cifra.
        Además ejecutamos la calculadora contra ejemplos resueltos de resultado conocido, de modo
        que una constante equivocada se manifieste como un total equivocado. Cuando una cifra no se
        puede verificar, no le ponemos fecha de revisión: una fecha sin verificar es peor que no
        ponerla, porque afirma una comprobación que no ha ocurrido.
      </p>
      <p>
        Una cifra aislada rara vez basta. Una base de cotización dice poco sin el tipo que se le
        aplica, y un porcentaje dice poco sin el tope que lo limita, así que comprobamos toda la
        cadena que produce el número y no solo el valor destacado.
      </p>

      <h2>Actualización de los datos</h2>
      <p>
        Las calculadoras cuyos parámetros dependen de la normativa se revisan{" "}
        <strong>una vez al año</strong>, cuando se publican las cifras del nuevo ejercicio fiscal y
        de cotización, y además <strong>cada vez que cambia una norma entre medias</strong>. Esa es
        la cadencia a la que nos comprometemos, y preferimos declarar una modesta que cumplimos
        antes que una ambiciosa que no: las fechas de revisión están visibles en cada página, así
        que un incumplimiento también lo estaría.
      </p>
      <p>
        Aun así, los resultados siguen siendo orientativos y algunos parámetros pueden depender de
        tu convenio colectivo, de tu contrato o de tu situación personal.
      </p>

      <h2>Qué pasa cuando cambia la normativa</h2>
      <p>
        Cuando una reforma altera un parámetro, actualizamos el cálculo y el texto que lo explica en
        la misma pasada, porque un número correcto bajo una explicación desfasada sigue induciendo a
        error. Si el cambio se aplica desde una fecha determinada o entra en vigor de forma
        progresiva, la página lo indica en lugar de presentar la cifra nueva como si siempre hubiera
        regido. Las versiones española e inglesa se actualizan a la vez, de modo que nunca se
        contradigan entre sí.
      </p>

      <h2>Cómo corregimos un error</h2>
      <p>
        Si nos equivocamos, lo corregimos y lo dejamos registrado. Las correcciones no se hacen en
        silencio: el cambio queda anotado con su fecha en el historial de cambios y, si afectó a un
        resultado y no solo a la redacción, lo decimos con claridad. Preferimos mostrar que una
        cifra estuvo mal durante un tiempo antes que sobrescribirla sin más.
      </p>

      <p>
        Si detectas una cifra que parece incorrecta o una fórmula que crees desactualizada, consulta
        nuestra <a href="/sobre-nosotros">política de correcciones</a> y cuéntanoslo a través de la{" "}
        <a href="/contacto">página de contacto</a>. Cada revisión que publicamos queda registrada,
        con su fecha y su alcance, en el <a href="/historial-de-cambios">historial de cambios</a>.
      </p>
    </LegalPage>
  );
}
