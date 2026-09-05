import { LegalPage } from "@/components/legal-page";
import { useLocale } from "@/lib/locale";
import { SITE_NAME_ES, SITE_NAME_EN, SITE_DOMAIN } from "@/lib/site";

export default function SobreNosotros() {
  const isEn = useLocale() === "en";

  if (isEn) {
    return (
      <LegalPage
        title="About us"
        description="Who is behind Online Calculators (thecalculator.tech) and how to reach Transparent Calculators (CT), the editorial signature of the site."
        path="/en/about"
        alternatePath="/sobre-nosotros"
        updated="Last updated: September 5, 2026"
      >
        <h2>What thecalculator.tech is</h2>
        <p>
          <strong>{SITE_NAME_EN}</strong> ({SITE_DOMAIN}) is an independent project that offers free
          online calculators and simulators for finance, work, home, education and health. It is not
          owned by any bank, insurer, public body or brand. The plan is to fund the project through
          advertising so the tools stay free, and advertising is kept separate from the editorial
          content and from how each calculator is designed: ad slots never determine which
          calculators we build, what a result says or which option a page recommends.
        </p>

        <h2>Who is behind the site</h2>
        <p>
          The site is maintained by an independent editorial team, and every article and calculator
          is signed under the editorial pseudonym <strong>Transparent Calculators (CT)</strong> — the
          initials you see next to each article. It is a fixed, transparent pseudonym rather than the
          name of a single individual, and we are open about that: we do not present ourselves as
          licensed financial advisers, tax specialists or doctors, and we do not claim credentials we
          do not have. The calculators are informational tools built on public formulas and official
          data, not personalised professional advice. If you want to reach the person responsible for
          the content, you can always write to us through our{" "}
          <a href="/en/contact">contact page</a>.
        </p>

        <h2>Methodology and sources</h2>
        <p>
          Every calculator is built on an identifiable basis — a mathematical formula, a piece of
          regulation or a recognised technical reference — and we review periodically the ones whose
          parameters change over time. You can read the full detail — how we build our calculators
          and which sources we use by area — on our <a href="/en/methodology">methodology page</a>.
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
      title="Sobre nosotros"
      description="Quién está detrás de thecalculator.tech y qué significa la firma Calculadoras Transparentes (CT)."
      path="/sobre-nosotros"
      alternatePath="/en/about"
      updated="Última actualización: 5 de septiembre de 2026"
    >
      <h2>Qué es thecalculator.tech</h2>
      <p>
        <strong>{SITE_NAME_ES}</strong> es un proyecto independiente que ofrece calculadoras y
        simuladores online gratuitos de finanzas, trabajo, hogar, educación y salud. No pertenece a
        ninguna entidad financiera, aseguradora, organismo público ni marca. Nuestro objetivo es
        financiar el proyecto mediante publicidad para que las herramientas sigan siendo gratuitas,
        y la publicidad se mantiene separada del contenido editorial y del diseño de cada
        calculadora: los espacios publicitarios no determinan qué calculadoras hacemos, qué dice un
        resultado ni qué opción recomienda una página.
      </p>

      <h2>Quién está detrás del sitio</h2>
      <p>
        El sitio lo mantiene un equipo editorial independiente, y cada artículo y calculadora se firma
        bajo el seudónimo editorial <strong>Calculadoras Transparentes (CT)</strong> —las iniciales
        que ves junto a cada artículo—. Es un seudónimo fijo y transparente, no el nombre de una
        persona concreta, y lo decimos abiertamente: no nos presentamos como asesores financieros
        colegiados, especialistas fiscales ni médicos, y no atribuimos titulaciones que no tenemos.
        Las calculadoras son herramientas informativas construidas sobre fórmulas públicas y datos
        oficiales, no asesoramiento profesional personalizado. Si quieres dirigirte a la persona
        responsable del contenido, puedes escribirnos siempre a través de nuestra{" "}
        <a href="/contacto">página de contacto</a>.
      </p>

      <h2>Metodología y fuentes</h2>
      <p>
        Cada calculadora se construye sobre una base identificable —una fórmula matemática, una norma
        o una referencia técnica reconocida— y revisamos periódicamente aquellas cuyos parámetros
        cambian con el tiempo. Puedes consultar el detalle completo —cómo elaboramos las calculadoras
        y qué fuentes usamos por área— en nuestra <a href="/metodologia">página de metodología</a>.
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
