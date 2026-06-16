import { LegalPage } from "@/components/legal-page";
import { useLocale } from "@/lib/locale";
import { CONTACT_EMAIL, SITE_NAME_ES, SITE_NAME_EN, SITE_DOMAIN } from "@/lib/site";

export default function Cookies() {
  const isEn = useLocale() === "en";

  if (isEn) {
    return (
      <LegalPage
        title="Cookie Policy"
        description="Information about the cookies used on Online Calculators (thecalculator.tech), including Google AdSense advertising cookies."
        path="/en/cookies"
        alternatePath="/cookies"
        updated="Last updated: June 16, 2026"
      >
        <p>
          This Cookie Policy explains what cookies are and which ones are used on{" "}
          <strong>{SITE_NAME_EN}</strong> ({SITE_DOMAIN}).
        </p>

        <h2>1. What are cookies?</h2>
        <p>
          Cookies are small text files that a website stores on your device to remember information
          about your visit. Similar technologies, such as your browser's local storage, work in a
          comparable way.
        </p>

        <h2>2. Cookies we use</h2>
        <ul>
          <li>
            <strong>Strictly necessary / preferences</strong> — we store your theme choice
            (light/dark) in your browser's local storage. It is not a tracking cookie and never
            leaves your device.
          </li>
          <li>
            <strong>Advertising (third party)</strong> — <strong>Google AdSense</strong> and its
            partners may set cookies to show and measure ads, including personalized advertising
            based on your browsing. See{" "}
            <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
              Google's advertising technologies
            </a>
            .
          </li>
          <li>
            <strong>Analytics</strong> — <strong>Cloudflare Web Analytics</strong> is used to measure
            traffic in aggregate. It is cookieless and does not track individual users.
          </li>
        </ul>

        <h2>3. Managing cookies</h2>
        <p>
          You can accept, block or delete cookies through your browser settings. You can also opt out
          of personalized advertising at{" "}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
            Google Ads Settings
          </a>{" "}
          or{" "}
          <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
            www.aboutads.info
          </a>
          . Disabling some cookies may affect how ads are shown but will not prevent the calculators
          from working.
        </p>

        <h2>4. Contact</h2>
        <p>
          For any questions about this Cookie Policy, contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </LegalPage>
    );
  }

  return (
    <LegalPage
      title="Política de Cookies"
      description="Información sobre las cookies utilizadas en Simuladores y Calculadoras Online (thecalculator.tech), incluidas las cookies publicitarias de Google AdSense."
      path="/cookies"
      alternatePath="/en/cookies"
      updated="Última actualización: 16 de junio de 2026"
    >
      <p>
        Esta Política de Cookies explica qué son las cookies y cuáles se utilizan en{" "}
        <strong>{SITE_NAME_ES}</strong> ({SITE_DOMAIN}).
      </p>

      <h2>1. ¿Qué son las cookies?</h2>
      <p>
        Las cookies son pequeños archivos de texto que un sitio web almacena en tu dispositivo para
        recordar información sobre tu visita. Tecnologías similares, como el almacenamiento local del
        navegador, funcionan de forma comparable.
      </p>

      <h2>2. Cookies que utilizamos</h2>
      <ul>
        <li>
          <strong>Técnicas / de preferencias</strong> — guardamos tu elección de tema (claro/oscuro)
          en el almacenamiento local del navegador. No es una cookie de seguimiento y nunca sale de
          tu dispositivo.
        </li>
        <li>
          <strong>Publicitarias (de terceros)</strong> — <strong>Google AdSense</strong> y sus
          colaboradores pueden instalar cookies para mostrar y medir anuncios, incluida la publicidad
          personalizada según tu navegación. Consulta{" "}
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
            las tecnologías publicitarias de Google
          </a>
          .
        </li>
        <li>
          <strong>Analíticas</strong> — <strong>Cloudflare Web Analytics</strong> se utiliza para
          medir el tráfico de forma agregada. No usa cookies ni rastrea a usuarios individuales.
        </li>
      </ul>

      <h2>3. Gestión de cookies</h2>
      <p>
        Puedes aceptar, bloquear o eliminar las cookies desde la configuración de tu navegador.
        También puedes inhabilitar la publicidad personalizada en{" "}
        <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
          la Configuración de anuncios de Google
        </a>{" "}
        o en{" "}
        <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
          www.aboutads.info
        </a>
        . Desactivar algunas cookies puede afectar a cómo se muestran los anuncios, pero no impedirá
        que las calculadoras funcionen.
      </p>

      <h2>4. Contacto</h2>
      <p>
        Para cualquier duda sobre esta Política de Cookies, escríbenos a{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPage>
  );
}
