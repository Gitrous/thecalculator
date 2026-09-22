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
- **Después de cada cambio, antes de preguntar `s`/`g`, pregúntate: ¿qué me ha
  costado más de esto?** Si la respuesta le ahorraría trabajo a una sesión
  futura que no tenga este contexto, apúntala en la sección que corresponda de
  este fichero, o crea una nueva. Lo que costó una vez vuelve a costar.

  Merece apuntarse:
  - Una trampa que **no da error**: el build pasa, el navegador se ve bien, y
    aun así algo está roto (ver la sección de prerenderizado y la de analítica).
  - Una **comprobación** que hay que hacer sí o sí, con el comando concreto.
  - Una **decisión** que un futuro yo revertiría por desconocer el motivo.
  - Dónde vive algo que costó encontrar.

  No apuntar: lo que ya cuentan el código, `git log` o
  `/historial-de-cambios/`; listas de cambios; ni consejos genéricos del tipo
  «verifica antes de concluir», que no cambian el comportamiento de nadie. Si
  no hay nada que aporte, no fuerces una entrada: este fichero se lee entero en
  cada sesión y el ruido le resta valor.

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

## Prerenderizado y carga diferida (trampa conocida)

El build prerenderiza cada ruta con `renderToString`, que es **síncrono**. Por
eso un `React.lazy` envuelto en `Suspense` sin más **vacía el HTML publicado**:
el prerender emite el fallback en lugar del contenido, y la página se queda sin
texto para los rastreadores. No se nota en el navegador, solo en el HTML.

Si añades carga diferida (p. ej. al partir las calculadoras en chunks):

1. Expón un `preload…()` en el módulo de la ruta que resuelva el `import()`.
2. Llámalo desde `preloadRoutes()` en `src/entry-server.tsx`.
3. `vite-plugin-ssg.ts` lo espera antes del primer render, así que el servidor
   renderiza el componente ya resuelto y el HTML sale completo.

Ver `src/pages/blog-routes.tsx`, que es el patrón ya implementado para el blog.

**Verificación obligatoria** tras tocar esto: comprobar que el HTML generado
sigue conteniendo el texto real, no solo que el build no falle. Por ejemplo:

```bash
grep -c "Adolphe Quetelet" dist/public/blog/que-es-el-imc/index.html   # debe ser 1
```

## Enlazado interno blog ↔ calculadoras (trampa conocida)

Los enlaces entre artículos y calculadoras salen de `relatedCalcCategory` +
`relatedCalcSlug` en `src/lib/articles.ts` (en ambos sentidos: CTA del artículo
y bloque «Guía relacionada» de la calculadora). La categoría debe ser la de la
**calculadora** en `calculators.ts`, no la del artículo. Si no coincide, el
enlace **desaparece sin error** (le pasó a letra-dni: artículo en `educacion`,
calculadora en `trabajo`). Los cruces entre categorías de «Calculadoras
relacionadas» están en `RELATED` de `calculators.ts`.

Tras tocar artículos o calculadoras, comprobar tras el build (desde
`dist/public`):

```bash
for f in blog/*/index.html; do grep -q 'Abrir calculadora' $f || echo "SIN CTA $f"; done
for f in calculadoras/*/*/index.html; do grep -q 'Guía' $f || echo "SIN GUÍA $f"; done  # solo reforma-hogar
```

## URLs en inglés (`enSlug`)

Las calculadoras tienen **dos slugs**: `slug` (español, p. ej. `salario-neto`) y
`enSlug` (inglés, `net-salary`), ambos en `src/lib/calculators.ts`. La URL
inglesa usa `enSlug`, pero **todo el código sigue indexado por el slug
español**: `REGISTRY` y el JSON-LD de FAQ en `calculator-page.tsx`, `RELATED`
en `calculators.ts`, `relatedCalcSlug` en `articles.ts` y la clave de
`localStorage`. Por eso en `/en/` la calculadora se resuelve con
`getCalculatorByEnSlug()` y a partir de ahí se usa `calc.slug`, nunca el
`slug` de la URL. Si en el futuro se usa el de la URL, la página inglesa da 404
o pierde la FAQ sin error visible.

Al añadir una calculadora: `enSlug` en `calculators.ts`, entrada en
`public/sitemap.xml` y, si se renombra un `enSlug`, un `301` en
`public/_redirects` **antes** del fallback SPA (`/*  /index.html  200`), que al
ser comodín captura todo lo que vaya después.

**Las reglas de `_redirects` no cubren las dos formas de la URL**: una regla
escrita sin barra final no captura la URL con barra, que cae en el fallback SPA
y devuelve **200 con el esqueleto de la app** (un soft 404, sin error visible).
Y la forma con barra es justo la que Google indexa, porque es la que usan la
canonical y el sitemap. Escribe siempre las dos líneas, cada una apuntando a su
destino con la misma forma:

```
/en/calculators/finance/salario-neto    /en/calculators/finance/net-salary    301
/en/calculators/finance/salario-neto/   /en/calculators/finance/net-salary/   301
```

Comprobar tras desplegar (`%{http_code}` debe ser 301 en ambas):

```bash
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" https://thecalculator.tech/en/calculators/work/paro/
```

## Analítica (Cloudflare Web Analytics)

La medición la **inyecta Cloudflare en el borde** (RUM en modo `Enable` en el
panel). **No añadas un `<script>` del beacon a `index.html`**: si Cloudflare
detecta uno, deja de inyectar el suyo para no duplicar, y la analítica se queda
en cero **en silencio**, sin ningún error visible. Costó una sesión entera
localizarlo.

Cómo verificar que funciona:

- **No sirve `curl`**: la inyección solo se aplica a peticiones de navegador
  real. Con `curl` el HTML sale sin beacon aunque todo esté bien.
- En un navegador, busca una petición a
  `static.cloudflareinsights.com/beacon.min.js/v<hash>`. **El sufijo de versión
  es la señal** de que la inyección automática está activa; sin él, el beacon es
  manual.
- Un **503** en ese host no implica que el sitio esté mal: los bloqueadores de
  anuncios lo devuelven de forma sintética. Comprueba siempre desde un navegador
  sin extensiones antes de concluir nada.

## Despliegue

- `thecalculator.tech` se sirve por Cloudflare Pages, conectado a este repo
  (rama `main`). Cada push a `main` dispara un build automático.
- Build output directory en Cloudflare: `artifacts/calculadoras/dist/public`.
