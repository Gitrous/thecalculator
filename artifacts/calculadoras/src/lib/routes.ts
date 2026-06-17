import { CATEGORIES, CALCULATORS, calcPath, enCalcPath, EN_CATEGORY_SLUGS } from "./calculators";

/** Static legal pages (both locales) that get prerendered. */
const LEGAL_ROUTES = [
  "/privacidad",
  "/en/privacy",
  "/cookies",
  "/en/cookies",
  "/aviso-legal",
  "/en/legal-notice",
  "/contacto",
  "/en/contact",
];

/**
 * Every route the build-time prerenderer turns into a static HTML file.
 * Derived from the calculator/category data so new calculators are picked up
 * automatically.
 */
export function getAllRoutes(): string[] {
  const routes = new Set<string>();

  // Home (ES / EN)
  routes.add("/");
  routes.add("/en");

  // Category landing pages (ES / EN)
  for (const cat of CATEGORIES) {
    routes.add(`/calculadoras/${cat.id}`);
    routes.add(`/en/calculators/${EN_CATEGORY_SLUGS[cat.id]}`);
  }

  // Individual calculators (ES / EN)
  for (const calc of CALCULATORS) {
    routes.add(calcPath(calc));
    routes.add(enCalcPath(calc));
  }

  // Legal pages
  for (const r of LEGAL_ROUTES) routes.add(r);

  return [...routes];
}
