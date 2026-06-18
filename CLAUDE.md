# CLAUDE.md

Guía para Claude Code en este repositorio.

## Flujo de trabajo (IMPORTANTE)

- **Después de CADA cambio, PREGUNTA al usuario si quiere verlo en el servidor o
  subirlo a GitHub.** En cuanto un cambio esté hecho y verificado (typecheck/build
  OK), pregunta exactamente esto: `¿Servidor (s) o GitHub (g)?`
- **El usuario responderá con una sola letra:**
  - **`s`** → haz el build y dale la URL del cambio. Si ya hay un servidor
    de previsualización corriendo, **no arranques uno nuevo**: el build
    actualiza `dist/public/` y el servidor existente ya sirve los nuevos
    ficheros. Solo arranca uno nuevo (`pnpm exec vite preview --config
    vite.config.ts`) si no hay ninguno en marcha.
  - **`g`** → haz `git add` + `git commit` + `git push origin main`. Después
    del push, **monitoriza el estado del despliegue en Cloudflare Pages** usando
    `gh run list --limit 1` o comprobando periódicamente con
    `curl -s -o /dev/null -w "%{http_code}" https://thecalculator.tech` hasta
    que el sitio responda con 200 y el contenido haya cambiado. Cuando el
    despliegue esté listo, **avisa al usuario** con un mensaje del tipo:
    `✅ Live en https://thecalculator.tech`. El build de Cloudflare tarda
    habitualmente entre 1 y 3 minutos.
- Mensajes de commit en imperativo y descriptivos; terminar con la línea
  `Co-Authored-By: Claude Sonnet 4.6 (1M context) <noreply@anthropic.com>`.

## Estructura

- App principal (web de calculadoras): `artifacts/calculadoras/` — Vite + React
  + wouter (SPA), Tailwind. Páginas en `src/pages/`, datos en `src/lib/`.
- También hay `artifacts/api-server/` y `artifacts/mockup-sandbox/`.
- El sitio tiene versión en español (por defecto, `/`) e inglés (`/en/...`).
  **Todo cambio en la versión española (nueva calculadora, copy, sección,
  funcionalidad, sitemap, JSON-LD...) debe replicarse también en la versión
  inglesa** para mantener la paridad entre ambos idiomas. Revisar al menos:
  - `src/lib/calculators.ts` — campos `en*` (enTitle, enShortLabel,
    enSeoTitle, enSeoDescription, etc.)
  - El texto/rama en inglés dentro del componente de página (la mayoría
    bifurca con `useLocale()` / `isEn`)
  - `public/sitemap.xml` — entradas ES y EN con `hreflang` cruzados

## Build / verificación

- Typecheck: `pnpm exec tsc -p tsconfig.json --noEmit` (dentro de la app).
- Build (no requiere variables de entorno): `pnpm exec vite build --config vite.config.ts`.
- Salida publicada: `artifacts/calculadoras/dist/public/` (incluye `_redirects`
  con el SPA fallback `/* /index.html 200`, imprescindible para que los deep
  links a calculadoras no den pantalla en blanco).

## Despliegue

- `thecalculator.tech` se sirve por Cloudflare Pages, conectado a este repo
  (rama `main`). Cada push a `main` dispara un build automático.
- Build output directory en Cloudflare: `artifacts/calculadoras/dist/public`.
