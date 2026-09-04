import { LegalPage } from "@/components/legal-page";
import { useLocale } from "@/lib/locale";
import { SITE_NAME_ES, SITE_NAME_EN, SITE_DOMAIN } from "@/lib/site";

export default function SobreNosotros() {
  const isEn = useLocale() === "en";

  if (isEn) {
    return (
      <LegalPage
        title="About & Methodology"
        description="Who is behind Online Calculators (thecalculator.tech), how we build our calculators and which sources we rely on."
        path="/en/about"
        alternatePath="/sobre-nosotros"
        updated="Last updated: September 4, 2026"
      >
        <h2>What thecalculator.tech is</h2>
        <p>
          <strong>{SITE_NAME_EN}</strong> ({SITE_DOMAIN}) is an independent project that offers free
          online calculators and simulators for finance, work, home, education and health. It is not
          owned by any bank, insurer, public body or brand, and no advertiser influences the content
          of the tools: advertising (Google AdSense) is what keeps the site free, and it is kept
          separate from how each calculator is designed.
        </p>

        <h2>Who is behind the site</h2>
        <p>
          The site is maintained by an independent editorial team. We do not present ourselves as
          licensed financial advisers, tax specialists or doctors, and we do not claim credentials we
          do not have: the calculators are informational tools built on public formulas and official
          data, not personalised professional advice. If you want to reach the person responsible for
          the content, you can always write to us through our{" "}
          <a href="/en/contact">contact page</a>.
        </p>

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

        <h2>Corrections policy</h2>
        <p>
          If you spot a figure that looks wrong or a formula that seems out of date, please tell us
          through the <a href="/en/contact">contact page</a>. We review every report and correct
          confirmed errors as quickly as we can. Accuracy matters more to us than being right, so we
          genuinely welcome corrections.
        </p>

        <h2>Important notice</h2>
        <p>
          The results provided by our calculators are estimates for guidance only. They do not
          constitute financial, tax, legal or medical advice. For decisions with a significant
          impact, always check the figures with a qualified professional or the relevant official
          source.
        </p>
      </LegalPage>
    );
  }

  return (
    <LegalPage
      title="Sobre nosotros y metodología"
      description="Quién está detrás de thecalculator.tech, cómo elaboramos las calculadoras y qué fuentes utilizamos."
      path="/sobre-nosotros"
      alternatePath="/en/about"
      updated="Última actualización: 4 de septiembre de 2026"
    >
      <h2>Qué es thecalculator.tech</h2>
      <p>
        <strong>{SITE_NAME_ES}</strong> es un proyecto independiente que ofrece calculadoras y
        simuladores online gratuitos de finanzas, trabajo, hogar, educación y salud. No pertenece a
        ninguna entidad financiera, aseguradora, organismo público ni marca, y ningún anunciante
        influye en el contenido de las herramientas: la publicidad (Google AdSense) es lo que permite
        mantener el sitio gratuito y se mantiene separada del diseño de cada calculadora.
      </p>

      <h2>Quién está detrás del sitio</h2>
      <p>
        El sitio lo mantiene un equipo editorial independiente. No nos presentamos como asesores
        financieros colegiados, especialistas fiscales ni médicos, y no atribuimos titulaciones que
        no tenemos: las calculadoras son herramientas informativas construidas sobre fórmulas
        públicas y datos oficiales, no asesoramiento profesional personalizado. Si quieres dirigirte
        a la persona responsable del contenido, puedes escribirnos siempre a través de nuestra{" "}
        <a href="/contacto">página de contacto</a>.
      </p>

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

      <h2>Política de correcciones</h2>
      <p>
        Si detectas una cifra que parece incorrecta o una fórmula que crees desactualizada,
        cuéntanoslo a través de la <a href="/contacto">página de contacto</a>. Revisamos todos los
        avisos y corregimos los errores confirmados lo antes posible. Nos importa más la exactitud que
        tener razón, así que agradecemos de verdad las correcciones.
      </p>

      <h2>Aviso importante</h2>
      <p>
        Los resultados que ofrecen nuestras calculadoras son estimaciones con carácter meramente
        orientativo. No constituyen asesoramiento financiero, fiscal, legal ni médico. Para decisiones
        de gran impacto, contrasta siempre las cifras con un profesional cualificado o con la fuente
        oficial correspondiente.
      </p>
    </LegalPage>
  );
}
