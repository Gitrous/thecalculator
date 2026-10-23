import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useLocale } from "@/lib/locale";
import { CONSENT_KEY as STORAGE_KEY, removePushWorker } from "@/lib/ads";

/**
 * Cookie banner. Monetag ads load by default; rejecting stores "denied" in
 * localStorage, which stops both the site-wide tag (index.html) and the
 * in-page banners (AdUnit), and unregisters the push service worker (/sw.js)
 * so notifications stop. The page reloads on reject so scripts Monetag
 * already injected are gone too. The choice is re-applied on the next visit.
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
    // Let the "Cookie settings" footer link reopen the banner so the user can
    // change (or withdraw) a previously stored choice at any time.
    const reopen = () => setVisible(true);
    window.addEventListener("cookie-consent:open", reopen);
    return () => window.removeEventListener("cookie-consent:open", reopen);
  }, []);

  async function decide(granted: boolean) {
    const value = granted ? "granted" : "denied";
    let previous: string | null = null;
    try {
      previous = localStorage.getItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore storage errors (private mode, etc.) */
    }
    setVisible(false);
    // Ads were running (no choice yet, or accepted before): reload so they go.
    // Going from rejected to accepted also reloads, so ads start straight away.
    if (value === "denied") await removePushWorker();
    if (previous !== value && (value === "denied" || previous === "denied")) {
      window.location.reload();
    }
  }

  if (!visible) return null;

  const policyHref = isEn ? "/en/cookies" : "/cookies";

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] no-print flex justify-center p-2 sm:p-6">
      <div className="w-full max-w-xl rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl p-3 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <p className="flex-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            {isEn ? (
              <>
                We use cookies, including third-party advertising cookies (Monetag), to keep
                this site free. You can accept or reject non-essential cookies. Read more in our{" "}
                <Link href={policyHref} className="text-primary underline">
                  Cookie Policy
                </Link>
                .
              </>
            ) : (
              <>
                Usamos cookies, incluidas las publicitarias de terceros (Monetag), para
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
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            >
              {isEn ? "Reject" : "Rechazar"}
            </button>
            <button
              type="button"
              onClick={() => decide(true)}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold bg-primary text-white hover:opacity-90 transition-opacity"
            >
              {isEn ? "Accept" : "Aceptar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
