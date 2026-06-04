# CLAUDE.md

Guía para Claude Code en este repositorio.

## Flujo de trabajo (IMPORTANTE)

- **Después de CADA cambio, súbelo a GitHub.** En cuanto un cambio esté hecho y
  verificado (typecheck/build OK), haz `git add` de lo modificado, `git commit`
  con un mensaje descriptivo y `git push origin main`. No esperes a que el
  usuario lo pida cada vez: el push forma parte de completar el cambio.
- Mensajes de commit en imperativo y descriptivos; terminar con la línea
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

## Estructura

- App principal (web de calculadoras): `artifacts/calculadoras/` — Vite + React
  + wouter (SPA), Tailwind. Páginas en `src/pages/`, datos en `src/lib/`.
- También hay `artifacts/api-server/` y `artifacts/mockup-sandbox/`.

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
