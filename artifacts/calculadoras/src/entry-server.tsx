import { renderToString } from "react-dom/server";
import App from "./App";
import { getServerHead, resetServerHead, type HeadData } from "./components/seo";
import { preloadBlogRoutes } from "./pages/blog-routes";
import {
  calculatorKeyFromPath,
  calculatorSourceFile,
  preloadAllCalculators,
} from "./pages/calculator-registry";

export { getAllRoutes } from "./lib/routes";

export interface RenderResult {
  html: string;
  head: HeadData | null;
}

/** Resolve every on-demand chunk before prerendering. renderToString is
 * synchronous, so anything still suspended would render as its fallback. */
export async function preloadRoutes(): Promise<void> {
  await Promise.all([preloadBlogRoutes(), preloadAllCalculators()]);
}

/** Render a single route to its body HTML and resolved head metadata. Used by
 * the build-time prerenderer (see vite-plugin-ssg.ts). Call preloadRoutes()
 * once before the first render. */
export function render(url: string): RenderResult {
  resetServerHead();
  const html = renderToString(<App ssrPath={url} />);
  return { html, head: getServerHead() };
}

/** Source modules loaded on demand for a route, as Vite's manifest keys them.
 * The prerenderer turns them into <link rel="modulepreload"> so the browser
 * fetches the calculator's chunk alongside the main bundle instead of only
 * discovering it once the main bundle has run. */
export function routeModules(url: string): string[] {
  if (/^\/(en\/)?blog\/[^/]+/.test(url)) return ["src/pages/blog-article.tsx"];
  if (/^\/(en\/)?blog\/?$/.test(url)) return ["src/pages/blog.tsx"];
  const key = calculatorKeyFromPath(url);
  const file = key ? calculatorSourceFile(key) : undefined;
  return file ? [file] : [];
}
