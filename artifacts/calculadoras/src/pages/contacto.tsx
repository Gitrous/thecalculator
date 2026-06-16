import { LegalPage } from "@/components/legal-page";
import { useLocale } from "@/lib/locale";
import { CONTACT_EMAIL, SITE_NAME_ES, SITE_NAME_EN } from "@/lib/site";

export default function Contacto() {
  const isEn = useLocale() === "en";

  if (isEn) {
    return (
      <LegalPage
        title="Contact"
        description="Get in touch with Online Calculators (thecalculator.tech)."
        path="/en/contact"
        alternatePath="/contacto"
        updated="Last updated: June 16, 2026"
      >
        <p>
          Do you have a question, a suggestion or have you spotted an error in one of our calculators?
          We'd love to hear from you.
        </p>
        <p>
          You can reach <strong>{SITE_NAME_EN}</strong> by email at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We read every message and try to
          reply as soon as possible.
        </p>
        <p>Please use this address for:</p>
        <ul>
          <li>Suggestions for new calculators or improvements.</li>
          <li>Reporting an error or an out-of-date figure.</li>
          <li>Privacy or data-protection enquiries.</li>
          <li>Advertising or general questions.</li>
        </ul>
      </LegalPage>
    );
  }

  return (
    <LegalPage
      title="Contacto"
      description="Ponte en contacto con Simuladores y Calculadoras Online (thecalculator.tech)."
      path="/contacto"
      alternatePath="/en/contact"
      updated="Última actualización: 16 de junio de 2026"
    >
      <p>
        ¿Tienes una duda, una sugerencia o has detectado un error en alguna de nuestras calculadoras?
        Nos encantará escucharte.
      </p>
      <p>
        Puedes contactar con <strong>{SITE_NAME_ES}</strong> por correo electrónico en{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Leemos todos los mensajes e
        intentamos responder lo antes posible.
      </p>
      <p>Utiliza esta dirección para:</p>
      <ul>
        <li>Sugerencias de nuevas calculadoras o mejoras.</li>
        <li>Informar de un error o de una cifra desactualizada.</li>
        <li>Consultas sobre privacidad o protección de datos.</li>
        <li>Publicidad o cuestiones generales.</li>
      </ul>
    </LegalPage>
  );
}
