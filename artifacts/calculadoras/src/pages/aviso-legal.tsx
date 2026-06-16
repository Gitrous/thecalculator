import { LegalPage } from "@/components/legal-page";
import { useLocale } from "@/lib/locale";
import { CONTACT_EMAIL, SITE_NAME_ES, SITE_NAME_EN, SITE_DOMAIN, SITE_URL } from "@/lib/site";

export default function AvisoLegal() {
  const isEn = useLocale() === "en";

  if (isEn) {
    return (
      <LegalPage
        title="Legal Notice"
        description="Legal notice and terms of use for Online Calculators (thecalculator.tech)."
        path="/en/legal-notice"
        alternatePath="/aviso-legal"
        updated="Last updated: June 16, 2026"
      >
        <h2>1. Site information</h2>
        <p>
          This website, <strong>{SITE_NAME_EN}</strong>, is available at{" "}
          <a href={SITE_URL}>{SITE_DOMAIN}</a>. For any enquiry you can contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <h2>2. Purpose</h2>
        <p>
          The site offers free online calculators and simulators for finance, home, work, education
          and health. They are provided as informational tools for general use.
        </p>

        <h2>3. Disclaimer</h2>
        <p>
          The results provided by the calculators are estimates for guidance only and may not reflect
          your particular situation. They do not constitute financial, tax, legal or medical advice.
          You should verify any important figure with a qualified professional or the relevant
          official source before making decisions. We accept no liability for decisions taken based
          on the results obtained on this site.
        </p>

        <h2>4. Intellectual property</h2>
        <p>
          The content, design and source code of this site are protected by intellectual property
          law. Reproduction or distribution without authorization is not permitted, except as allowed
          by applicable law.
        </p>

        <h2>5. External links and advertising</h2>
        <p>
          The site displays advertising through Google AdSense and may contain links to third-party
          websites. We are not responsible for the content or policies of those external sites.
        </p>

        <h2>6. Governing law</h2>
        <p>
          This legal notice is governed by Spanish law. Any dispute arising from the use of the site
          shall be subject to the competent courts in accordance with applicable law.
        </p>
      </LegalPage>
    );
  }

  return (
    <LegalPage
      title="Aviso Legal"
      description="Aviso legal y condiciones de uso de Simuladores y Calculadoras Online (thecalculator.tech)."
      path="/aviso-legal"
      alternatePath="/en/legal-notice"
      updated="Última actualización: 16 de junio de 2026"
    >
      <h2>1. Información del sitio</h2>
      <p>
        Este sitio web, <strong>{SITE_NAME_ES}</strong>, está disponible en{" "}
        <a href={SITE_URL}>{SITE_DOMAIN}</a>. Para cualquier consulta puedes contactar con nosotros en{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>2. Objeto</h2>
      <p>
        El sitio ofrece calculadoras y simuladores online gratuitos de finanzas, hogar, trabajo,
        educación y salud. Se proporcionan como herramientas informativas de uso general.
      </p>

      <h2>3. Exención de responsabilidad</h2>
      <p>
        Los resultados que ofrecen las calculadoras son estimaciones con carácter meramente
        orientativo y pueden no reflejar tu situación particular. No constituyen asesoramiento
        financiero, fiscal, legal ni médico. Antes de tomar decisiones, debes verificar cualquier
        cifra importante con un profesional cualificado o con la fuente oficial correspondiente. No
        asumimos ninguna responsabilidad por las decisiones tomadas en base a los resultados
        obtenidos en este sitio.
      </p>

      <h2>4. Propiedad intelectual</h2>
      <p>
        Los contenidos, el diseño y el código fuente de este sitio están protegidos por la normativa
        de propiedad intelectual. No se permite su reproducción o distribución sin autorización,
        salvo en los supuestos permitidos por la ley aplicable.
      </p>

      <h2>5. Enlaces externos y publicidad</h2>
      <p>
        El sitio muestra publicidad a través de Google AdSense y puede contener enlaces a sitios web
        de terceros. No nos hacemos responsables del contenido ni de las políticas de dichos sitios
        externos.
      </p>

      <h2>6. Legislación aplicable</h2>
      <p>
        El presente aviso legal se rige por la legislación española. Cualquier controversia derivada
        del uso del sitio se someterá a los juzgados y tribunales competentes conforme a la normativa
        aplicable.
      </p>
    </LegalPage>
  );
}
