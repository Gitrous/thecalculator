import { createRoot } from "react-dom/client";
import App from "./App";
import { preloadBlogRoutes } from "./pages/blog-routes";
import { preloadCalculatorForPath } from "./pages/calculator-registry";
import "./index.css";

/** The page arrives prerendered, and createRoot (there is no hydration) replaces
 * that HTML with the client render. If the landing route's chunk were still
 * loading at that moment, the content would vanish until it arrived. So the
 * chunk for the landing URL is resolved first, and only then is React mounted. */
async function start() {
  const path = window.location.pathname;
  try {
    if (/^\/(en\/)?blog(\/|$)/.test(path)) await preloadBlogRoutes();
    else await preloadCalculatorForPath(path);
  } catch {
    // A failed chunk must not leave the page without React; the route will
    // retry the import when it renders.
  }
  createRoot(document.getElementById("root")!).render(<App />);
}

start();
