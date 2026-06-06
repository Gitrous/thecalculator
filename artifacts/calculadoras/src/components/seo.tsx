import { useEffect } from "react";

const SITE = "https://thecalculator.tech";
const SUFFIX = "Simuladores y Calculadoras Online";

interface SeoProps {
  title: string;
  description: string;
  /** Path beginning with "/", e.g. "/calculadoras/finanzas/hipoteca". */
  path: string;
  /** Optional JSON-LD structured data object. */
  jsonLd?: Record<string, unknown>;
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

/**
 * Lightweight client-side head manager. Sets the document title, meta
 * description, canonical URL and the Open Graph / Twitter equivalents for the
 * current page. Restores nothing on unmount — every page that needs custom SEO
 * renders its own <Seo/>, overwriting the previous values.
 */
export function Seo({ title, description, path, jsonLd }: SeoProps) {
  useEffect(() => {
    const fullTitle = `${title} | ${SUFFIX}`;
    const url = `${SITE}${path}`;

    document.title = fullTitle;
    setMeta('meta[name="description"]', "name", "description", description);
    setCanonical(url);

    setMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:url"]', "property", "og:url", url);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);

    const scriptId = "json-ld-schema";
    let script = document.head.querySelector<HTMLScriptElement>(`#${scriptId}`);
    if (jsonLd) {
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }
  }, [title, description, path, jsonLd]);

  return null;
}
