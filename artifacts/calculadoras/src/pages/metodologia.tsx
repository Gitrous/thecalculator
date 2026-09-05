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

        <h2>Keeping data up to date</h2>
        <p>
          Calculators that depend on figures which change over time are reviewed at the start of each
          fiscal year and whenever a relevant reform comes into force, as soon as the competent body
          publishes the official values. Even so, results remain indicative and some parameters may
          depend on your collective agreement, contract or personal situation.
        </p>

        <p>
          If you spot a figure that looks wrong or a formula that seems out of date, check our{" "}
          <a href="/en/about">corrections policy</a> and let us know through the{" "}
          <a href="/en/contact">contact page</a>.
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

      <h2>Actualización de los datos</h2>
      <p>
        Las calculadoras que dependen de cifras que cambian con el tiempo se revisan al inicio de cada
        ejercicio y cuando entra en vigor una reforma relevante, en cuanto el organismo competente
        publica los valores oficiales. Aun así, los resultados siguen siendo orientativos y algunos
        parámetros pueden depender de tu convenio, tu contrato o tu situación personal.
      </p>

      <p>
        Si detectas una cifra que parece incorrecta o una fórmula que crees desactualizada, consulta
        nuestra <a href="/sobre-nosotros">política de correcciones</a> y cuéntanoslo a través de la{" "}
        <a href="/contacto">página de contacto</a>.
      </p>
    </LegalPage>
  );
}
