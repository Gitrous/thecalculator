import path from "path";
import { promises as fs } from "fs";
import { pathToFileURL } from "url";
import { build, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import type { HeadData } from "./src/components/seo";

const ROOT = import.meta.dirname;
const SRC = path.resolve(ROOT, "src");
const CLIENT_OUT = path.resolve(ROOT, "dist/public");
const SERVER_OUT = path.resolve(ROOT, "dist/server");

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Replace the content="" of a meta tag, or insert it before </head> if absent. */
function setMetaTag(html: string, attr: "name" | "property", key: string, content: string): string {
  const value = escapeAttr(content);
  const re = new RegExp(`(<meta\\s+${attr}="${key}"[^>]*content=")[^"]*(")`, "i");
  if (re.test(html)) {
    return html.replace(re, `$1${value}$2`);
  }
  return html.replace("</head>", `    <meta ${attr}="${key}" content="${value}" />\n  </head>`);
}

/** Build the per-route head HTML and inject it into the client index.html template. */
function applyHead(template: string, head: HeadData): string {
  let html = template;

  // <html lang>: the template ships with the Spanish default, so English routes
  // must be rewritten or every /en/ page claims to be Spanish.
  html = html.replace(/(<html[^>]*\slang=")[^"]*(")/i, `$1${escapeAttr(head.lang)}$2`);

  // <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttr(head.fullTitle)}</title>`);

  // Standard + social meta
  html = setMetaTag(html, "name", "description", head.description);
  html = setMetaTag(html, "name", "author", head.siteName);
  html = setMetaTag(html, "property", "og:locale", head.ogLocale);
  html = setMetaTag(html, "property", "og:site_name", head.siteName);
  html = setMetaTag(html, "property", "og:title", head.fullTitle);
  html = setMetaTag(html, "property", "og:description", head.description);
  html = setMetaTag(html, "property", "og:url", head.url);
  html = setMetaTag(html, "name", "twitter:title", head.fullTitle);
  html = setMetaTag(html, "name", "twitter:description", head.description);

  // Canonical: replace the template's default ("/") rather than duplicate it.
  const canonicalTag = `<link rel="canonical" href="${escapeAttr(head.url)}" />`;
  if (/<link\s+rel="canonical"[^>]*>/i.test(html)) {
    html = html.replace(/<link\s+rel="canonical"[^>]*>/i, canonicalTag);
  } else {
    html = html.replace("</head>", `    ${canonicalTag}\n  </head>`);
  }

  // The template ships site-level WebSite/Organization JSON-LD written in
  // Spanish. On English routes those blocks must be localized too, otherwise
  // every /en/ page advertises a Spanish site name and inLanguage.
  if (head.lang !== "es") {
    html = html
      .replace(/"name": "Simuladores y Calculadoras Online"/g, `"name": "${escapeAttr(head.siteName)}"`)
      .replace(/"inLanguage": "es"/g, `"inLanguage": "${escapeAttr(head.lang)}"`)
      .replace(
        /"description": "Herramientas gratuitas de cálculo[^"]*"/g,
        '"description": "Free calculation and simulation tools for finance, home, work, education and productivity."',
      );
  }

  // hreflang + page JSON-LD, inserted before </head>.
  const extra: string[] = [];
  for (const alt of head.alternates) {
    extra.push(`<link rel="alternate" hreflang="${alt.hreflang}" href="${escapeAttr(alt.href)}" />`);
  }
  if (head.jsonLd) {
    const json = JSON.stringify(head.jsonLd).replace(/</g, "\\u003c");
    extra.push(`<script type="application/ld+json" id="json-ld-schema">${json}</script>`);
  }
  if (extra.length > 0) {
    html = html.replace("</head>", `    ${extra.join("\n    ")}\n  </head>`);
  }

  return html;
}

/** Map a route to the static file path it should be written to. */
function outFileForRoute(route: string): string {
  if (route === "/") return path.join(CLIENT_OUT, "index.html");
  const clean = route.replace(/^\/+|\/+$/g, "");
  return path.join(CLIENT_OUT, clean, "index.html");
}

/**
 * Static-site-generation plugin. After the client bundle is written, it builds
 * a server bundle, renders every route to static HTML and writes one index.html
 * per route (with the correct <head>). The client still uses createRoot (no
 * hydration), so the prerendered markup is for crawlers/first paint and React
 * re-renders on load.
 */
export function ssgPlugin(): Plugin {
  return {
    name: "ssg-prerender",
    apply: "build",
    async closeBundle() {
      // Skip when this is the nested SSR build we trigger below.
      if (process.env.SSG_SSR_BUILD) return;
      process.env.SSG_SSR_BUILD = "1";

      try {
        // 1. Build the server entry (no config file → this plugin isn't reused).
        await build({
          configFile: false,
          root: ROOT,
          logLevel: "warn",
          resolve: {
            alias: {
              "@": SRC,
              "@assets": path.resolve(ROOT, "..", "..", "attached_assets"),
            },
            dedupe: ["react", "react-dom"],
          },
          plugins: [react()],
          build: {
            ssr: path.resolve(SRC, "entry-server.tsx"),
            outDir: SERVER_OUT,
            emptyOutDir: true,
            rollupOptions: { output: { format: "es", entryFileNames: "entry-server.js" } },
          },
          ssr: { noExternal: true },
        });

        // 2. Load the server render() and the route list from the bundle.
        const serverEntry = pathToFileURL(path.join(SERVER_OUT, "entry-server.js")).href;
        const { render, getAllRoutes } = (await import(serverEntry)) as {
          render: (url: string) => { html: string; head: HeadData | null };
          getAllRoutes: () => string[];
        };

        const template = await fs.readFile(path.join(CLIENT_OUT, "index.html"), "utf8");
        const routes = getAllRoutes();

        let ok = 0;
        let failed = 0;
        for (const route of routes) {
          try {
            const { html, head } = render(route);
            let page = template;
            if (head) page = applyHead(page, head);
            page = page.replace('<div id="root"></div>', `<div id="root">${html}</div>`);

            const outFile = outFileForRoute(route);
            await fs.mkdir(path.dirname(outFile), { recursive: true });
            await fs.writeFile(outFile, page, "utf8");
            ok++;
          } catch (err) {
            failed++;
            this.warn(`SSG: failed to prerender ${route}: ${(err as Error).message}`);
          }
        }

        // 3. Clean up the server bundle (not part of the published output).
        await fs.rm(SERVER_OUT, { recursive: true, force: true });

        console.log(`\n[ssg] prerendered ${ok} routes${failed ? `, ${failed} failed (SPA fallback)` : ""}.`);
      } finally {
        delete process.env.SSG_SSR_BUILD;
      }
    },
  };
}
