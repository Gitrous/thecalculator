import { LegalPage } from "@/components/legal-page";
import { useLocale } from "@/lib/locale";
import { CONTACT_EMAIL, SITE_NAME_ES, SITE_NAME_EN, SITE_DOMAIN } from "@/lib/site";

export default function Privacidad() {
  const isEn = useLocale() === "en";

  if (isEn) {
    return (
      <LegalPage
        title="Privacy Policy"
        description="How Online Calculators (thecalculator.tech) handles data, cookies and third-party advertising (Google AdSense)."
        path="/en/privacy"
        alternatePath="/privacidad"
        updated="Last updated: June 16, 2026"
      >
        <p>
          This Privacy Policy explains how <strong>{SITE_NAME_EN}</strong> ({SITE_DOMAIN}) handles
          information when you use our website. We are committed to protecting your privacy and only
          process data to the extent strictly necessary to operate the site.
        </p>

        <h2>1. Data controller</h2>
        <p>
          Site: <strong>{SITE_NAME_EN}</strong> ({SITE_DOMAIN}). Contact:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <h2>2. What data we process</h2>
        <p>
          Our calculators run entirely in your browser. We do not require registration and we do not
          collect or store personal data such as your name, email or the values you enter into the
          calculators — those calculations happen locally on your device and are not sent to our
          servers.
        </p>
        <p>
          We may store a small preference (such as your light/dark theme choice) in your browser's
          local storage. This never leaves your device and contains no personal information.
        </p>

        <h2>3. Third-party services</h2>
        <p>We rely on the following third parties, each with its own privacy policy:</p>
        <ul>
          <li>
            <strong>Google AdSense</strong> — serves the advertising shown on this site. Google and
            its partners may use cookies and similar technologies to show ads based on your prior
            visits to this and other websites. See{" "}
            <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
              How Google uses information from sites that use its services
            </a>
            .
          </li>
          <li>
            <strong>Cloudflare Web Analytics</strong> — provides privacy-friendly, aggregated traffic
            statistics. It does not use cookies and does not fingerprint or track individual users.
          </li>
        </ul>

        <h2>4. Advertising cookies and personalization</h2>
        <p>
          Third-party vendors, including Google, use cookies to serve ads based on your previous
          visits. Google's use of advertising cookies enables it and its partners to serve ads based
          on your visit to this site and/or other sites on the Internet. You can opt out of
          personalized advertising by visiting{" "}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
            Google Ads Settings
          </a>{" "}
          or{" "}
          <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
            www.aboutads.info
          </a>
          .
        </p>

        <h2>5. Your rights</h2>
        <p>
          Under the GDPR and applicable data protection law, you may have the right to access,
          rectify, erase, restrict or object to the processing of your personal data, and to data
          portability. To exercise these rights, contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <h2>6. Changes to this policy</h2>
        <p>
          We may update this Privacy Policy from time to time. The "last updated" date at the top
          reflects the latest revision.
        </p>
      </LegalPage>
    );
  }

  return (
    <LegalPage
      title="Política de Privacidad"
      description="Cómo Simuladores y Calculadoras Online (thecalculator.tech) trata los datos, las cookies y la publicidad de terceros (Google AdSense)."
      path="/privacidad"
      alternatePath="/en/privacy"
      updated="Última actualización: 16 de junio de 2026"
    >
      <p>
        Esta Política de Privacidad explica cómo <strong>{SITE_NAME_ES}</strong> ({SITE_DOMAIN})
        trata la información cuando utilizas nuestro sitio web. Nos comprometemos a proteger tu
        privacidad y solo procesamos datos en la medida estrictamente necesaria para el
        funcionamiento del sitio.
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <p>
        Sitio: <strong>{SITE_NAME_ES}</strong> ({SITE_DOMAIN}). Contacto:{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>2. Qué datos tratamos</h2>
      <p>
        Nuestras calculadoras funcionan íntegramente en tu navegador. No requerimos registro y no
        recopilamos ni almacenamos datos personales como tu nombre, correo electrónico o los valores
        que introduces en las calculadoras: esos cálculos se realizan localmente en tu dispositivo y
        no se envían a nuestros servidores.
      </p>
      <p>
        Podemos guardar una pequeña preferencia (como tu elección de tema claro/oscuro) en el
        almacenamiento local de tu navegador. Esa información nunca sale de tu dispositivo y no
        contiene datos personales.
      </p>

      <h2>3. Servicios de terceros</h2>
      <p>Utilizamos los siguientes servicios de terceros, cada uno con su propia política de privacidad:</p>
      <ul>
        <li>
          <strong>Google AdSense</strong> — gestiona la publicidad mostrada en este sitio. Google y
          sus colaboradores pueden usar cookies y tecnologías similares para mostrar anuncios basados
          en tus visitas anteriores a este y otros sitios web. Consulta{" "}
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
            cómo usa Google la información de los sitios que utilizan sus servicios
          </a>
          .
        </li>
        <li>
          <strong>Cloudflare Web Analytics</strong> — proporciona estadísticas de tráfico agregadas y
          respetuosas con la privacidad. No utiliza cookies ni rastrea ni identifica a usuarios
          individuales.
        </li>
      </ul>

      <h2>4. Cookies publicitarias y personalización</h2>
      <p>
        Proveedores externos, incluido Google, utilizan cookies para mostrar anuncios basados en tus
        visitas anteriores. El uso de cookies publicitarias permite a Google y a sus colaboradores
        mostrar anuncios en función de tu visita a este sitio y/o a otros sitios de Internet. Puedes
        inhabilitar la publicidad personalizada en{" "}
        <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
          la Configuración de anuncios de Google
        </a>{" "}
        o en{" "}
        <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
          www.aboutads.info
        </a>
        .
      </p>

      <h2>5. Tus derechos</h2>
      <p>
        Conforme al RGPD y a la normativa de protección de datos aplicable, puedes ejercer tus
        derechos de acceso, rectificación, supresión, limitación, oposición y portabilidad de tus
        datos personales. Para ejercerlos, escríbenos a{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>6. Cambios en esta política</h2>
      <p>
        Podemos actualizar esta Política de Privacidad ocasionalmente. La fecha de «última
        actualización» que figura arriba refleja la última revisión.
      </p>
    </LegalPage>
  );
}
