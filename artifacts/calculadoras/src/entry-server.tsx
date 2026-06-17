import { renderToString } from "react-dom/server";
import App from "./App";
import { getServerHead, resetServerHead, type HeadData } from "./components/seo";

export { getAllRoutes } from "./lib/routes";

export interface RenderResult {
  html: string;
  head: HeadData | null;
}

/** Render a single route to its body HTML and resolved head metadata. Used by
 * the build-time prerenderer (see vite-plugin-ssg.ts). */
export function render(url: string): RenderResult {
  resetServerHead();
  const html = renderToString(<App ssrPath={url} />);
  return { html, head: getServerHead() };
}
