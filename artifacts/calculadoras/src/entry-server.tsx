import { renderToString } from "react-dom/server";
import App from "./App";
import { getServerHead, resetServerHead, type HeadData } from "./components/seo";
import { preloadBlogRoutes } from "./pages/blog-routes";

export { getAllRoutes } from "./lib/routes";

export interface RenderResult {
  html: string;
  head: HeadData | null;
}

/** Resolve every on-demand chunk before prerendering. renderToString is
 * synchronous, so anything still suspended would render as its fallback. */
export async function preloadRoutes(): Promise<void> {
  await preloadBlogRoutes();
}

/** Render a single route to its body HTML and resolved head metadata. Used by
 * the build-time prerenderer (see vite-plugin-ssg.ts). Call preloadRoutes()
 * once before the first render. */
export function render(url: string): RenderResult {
  resetServerHead();
  const html = renderToString(<App ssrPath={url} />);
  return { html, head: getServerHead() };
}
