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
 * banner. In-content banners (AdUnit) check this before loading.
 */
export function adsAllowed(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) !== "denied";
  } catch {
    return true;
  }
}
