// Monetag. Every value comes from the Monetag dashboard (Sites → Ad zones).
// An empty string disables that zone: nothing is loaded and no space is kept.

/**
 * Banner zones shown inside the pages. Each value is the script URL from the
 * zone's tag in Monetag (the `src` of its <script>, e.g.
 * "https://<domain>/<path>/<zoneId>"). The script is inserted inside the slot,
 * so the banner renders in place.
 */
export const AD_SLOTS = {
  /** Main unit shown after the calculator result on every page. */
  afterResult: "",
  /** Secondary unit shown before the FAQs on long calculators (IRPF, hipoteca…). */
  midContent: "",
  /** Third unit shown after the FAQ accordion. */
  belowFaq: "",
};

export const CONSENT_KEY = "cookie-consent";

/**
 * Ads load by default and stop only when the visitor rejects cookies in the
 * banner. The site-wide Monetag tag in index.html applies the same rule.
 */
export function adsAllowed(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) !== "denied";
  } catch {
    return true;
  }
}

/**
 * Unregisters Monetag's push service worker (/sw.js). Unregistering also
 * cancels its push subscription, so notifications stop. Used when the visitor
 * rejects cookies; index.html runs the same check on every load.
 */
export async function removePushWorker(): Promise<void> {
  try {
    if (!("serviceWorker" in navigator)) return;
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      regs
        .filter((r) => (r.active ?? r.installing ?? r.waiting)?.scriptURL.endsWith("/sw.js"))
        .map((r) => r.unregister()),
    );
  } catch {
    /* ignore: unsupported or blocked */
  }
}
