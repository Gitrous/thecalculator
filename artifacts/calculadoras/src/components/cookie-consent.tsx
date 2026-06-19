import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useLocale } from "@/lib/locale";

const STORAGE_KEY = "cookie-consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * GDPR / Google Consent Mode v2 banner. Consent defaults to "denied" in
 * index.html before AdSense loads; this banner lets the user grant or reject
 * it and pushes the corresponding `consent: update` to Google. The choice is
 * persisted in localStorage and re-applied on the next visit.
 */
export function CookieConsent() {
  const isEn = useLocale() === "en";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function decide(granted: boolean) {
    const value = granted ? "granted" : "denied";
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore storage errors (private mode, etc.) */
    }
    window.gtag?.("consent", "update", {
      ad_storage: value,
      ad_user_data: value,
      ad_personalization: value,
      analytics_storage: value,
    });
    setVisible(false);
  }

  if (!visible) return null;

  const policyHref = isEn ? "/en/cookies" : "/cookies";

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] no-print flex justify-center p-4 sm:p-6">
      <div className="w-full max-w-xl rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <p className="flex-1 text-sm text-gray-600 dark:text-gray-300">
            {isEn ? (
              <>
                We use cookies, including third-party advertising cookies (Google AdSense), to keep
                this site free. You can accept or reject non-essential cookies. Read more in our{" "}
                <Link href={policyHref} className="text-primary underline">
                  Cookie Policy
                </Link>
                .
              </>
            ) : (
              <>
                Usamos cookies, incluidas las publicitarias de terceros (Google AdSense), para
                mantener este sitio gratuito. Puedes aceptar o rechazar las cookies no esenciales. Más
                información en nuestra{" "}
                <Link href={policyHref} className="text-primary underline">
                  Política de Cookies
                </Link>
                .
              </>
            )}
          </p>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => decide(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            >
              {isEn ? "Reject" : "Rechazar"}
            </button>
            <button
              type="button"
              onClick={() => decide(true)}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-white hover:opacity-90 transition-opacity"
            >
              {isEn ? "Accept" : "Aceptar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
