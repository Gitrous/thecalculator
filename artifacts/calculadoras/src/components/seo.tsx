import { useEffect } from "react";
import { SITE_NAME_ES, SITE_NAME_EN } from "@/lib/site";

const SITE = "https://thecalculator.tech";

/** True for the English side of the site ("/en" and everything under it). */
function isEnPath(path: string): boolean {
  return path === "/en" || path.startsWith("/en/");
}

interface SeoProps {
  title: string;
  description: string;
  /** Path beginning with "/", e.g. "/calculadoras/finanzas/hipoteca". */
  path: string;
  /** Optional JSON-LD structured data object. */
  jsonLd?: Record<string, unknown>;
  /** Alternate path for the other language (hreflang). */
  alternatePath?: string;
}

/** Resolved head data for a page, shared by the client DOM updater and the
 * build-time prerenderer. */
export interface HeadData {
  fullTitle: string;
  description: string;
  url: string;
  alternates: { hreflang: string; href: string }[];
  jsonLd?: Record<string, unknown>;
  /** Value for <html lang>, e.g. "es" or "en". */
  lang: string;
  /** Value for og:locale, e.g. "es_ES" or "en_US". */
  ogLocale: string;
  /** Site name in the page's own language, used for og:site_name and author. */
  siteName: string;
}

/** Pure: turn page props into the concrete head values. No DOM access, so it
 * runs identically on the server (SSG) and the client. */
export function computeHead({ title, description, path, jsonLd, alternatePath }: SeoProps): HeadData {
  const isEn = isEnPath(path);
  const siteName = isEn ? SITE_NAME_EN : SITE_NAME_ES;
  const fullTitle = `${title} | ${siteName}`;
  const lang = isEn ? "en" : "es";
  const ogLocale = isEn ? "en_US" : "es_ES";
  const url = `${SITE}${path}`;

  const alternates: { hreflang: string; href: string }[] = [];
  if (alternatePath) {
    if (isEn) {
      alternates.push({ hreflang: "en", href: url });
      alternates.push({ hreflang: "es", href: `${SITE}${alternatePath}` });
    } else {
      alternates.push({ hreflang: "es", href: url });
      alternates.push({ hreflang: "en", href: `${SITE}${alternatePath}` });
    }
    alternates.push({
      hreflang: "x-default",
      href: `${SITE}${alternatePath.startsWith("/en") ? alternatePath : path}`,
    });
  }

  return { fullTitle, description, url, alternates, jsonLd, lang, ogLocale, siteName };
}

// During a server-side render (build-time prerender) the last <Seo/> rendered
// stores its resolved head here so the prerenderer can read it. Unused on the
// client.
let serverHead: HeadData | null = null;
export function resetServerHead() {
  serverHead = null;
}
export function getServerHead(): HeadData | null {
  return serverHead;
}

function setMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setHreflang(hreflang: string, href: string) {
  const selector = `link[rel="alternate"][hreflang="${hreflang}"]`;
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "alternate");
    el.setAttribute("hreflang", hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function removeHreflangLinks() {
  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
}

function applyToDom(head: HeadData) {
  document.title = head.fullTitle;
  document.documentElement.lang = head.lang;
  setMeta('meta[name="description"]', "name", "description", head.description);
  setMeta('meta[name="author"]', "name", "author", head.siteName);
  setMeta('meta[property="og:locale"]', "property", "og:locale", head.ogLocale);
  setMeta('meta[property="og:site_name"]', "property", "og:site_name", head.siteName);
  setCanonical(head.url);

  setMeta('meta[property="og:title"]', "property", "og:title", head.fullTitle);
  setMeta('meta[property="og:description"]', "property", "og:description", head.description);
  setMeta('meta[property="og:url"]', "property", "og:url", head.url);
  setMeta('meta[name="twitter:title"]', "name", "twitter:title", head.fullTitle);
  setMeta('meta[name="twitter:description"]', "name", "twitter:description", head.description);

  removeHreflangLinks();
  for (const alt of head.alternates) {
    setHreflang(alt.hreflang, alt.href);
  }

  const scriptId = "json-ld-schema";
  let script = document.head.querySelector<HTMLScriptElement>(`#${scriptId}`);
  if (head.jsonLd) {
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(head.jsonLd);
  } else if (script) {
    script.remove();
  }
}

/**
 * Head manager. On the client it updates the document head in an effect; during
 * the build-time prerender (import.meta.env.SSR) it records the resolved head so
 * the static HTML for each route gets the right title, meta, canonical,
 * hreflang and JSON-LD. Every page renders its own <Seo/>.
 */
export function Seo(props: SeoProps) {
  useEffect(() => {
    if (import.meta.env.SSR) return;
    applyToDom(computeHead(props));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.title, props.description, props.path, props.jsonLd, props.alternatePath]);

  if (import.meta.env.SSR) {
    serverHead = computeHead(props);
  }

  return null;
}
