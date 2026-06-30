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
    vite.config.ts --port 5000`) si no hay ninguno en marcha. El servidor
    **siempre usa el puerto 5000** (`http://localhost:5000`).
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

## Cumplimiento de políticas de Google AdSense (IMPORTANTE)

**Después de CADA cambio** (nueva calculadora, página nueva, modificación de
contenido), revisar que se cumplen las políticas de AdSense. Si se detecta algún
incumplimiento, **NO corregirlo automáticamente**: informar al usuario de qué
política se incumple, qué se haría para corregirlo, y preguntar si quiere que
se haga.

Políticas clave a revisar en cada página/calculadora:

1. **Contenido mínimo y sustancial**: La página debe tener texto informativo
   suficiente más allá del propio widget. Mínimo orientativo: ≥ 300 palabras
   de contenido editorial visible o en acordeones (Google sí lee acordeones).
   Señales de alerta: subtítulo de 1 sola frase + herramienta + FAQ colapsada
   sin texto introductorio visible.

2. **Texto introductorio**: Antes de la calculadora o después del subtítulo
   debe haber al menos 1-2 párrafos explicando qué es el concepto, para qué
   sirve y cómo interpretar el resultado. Un subtítulo de una línea no es
   suficiente para páginas nuevas.

3. **FAQ completa**: Mínimo 3 preguntas con respuestas detalladas (≥ 80 palabras
   cada una). Preferible 5 preguntas para páginas de salud/finanzas.

4. **Proporción anuncios/contenido**: No más de 3 unidades de anuncio por página.
   Revisar que la suma de AdUnits en el componente de página + los que añade
   `calculator-page.tsx` no supere ese límite.

5. **Contenido original**: El texto no debe ser copiado literalmente de otras
   fuentes. Las FAQs deben aportar valor propio.

6. **Sin contenido engañoso ni afirmaciones médicas/financieras sin disclaimer**:
   En calculadoras de salud (IMC, calorías, agua, frecuencia cardíaca) incluir
   un aviso de que los resultados son orientativos y no sustituyen consejo médico.

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
