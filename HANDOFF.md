# Handoff

> Generado: 2026-10-23
> Proyecto: thecalculator.tech (app en `artifacts/calculadoras/`)
> Resumen de la sesión: se quitó Google AdSense, se integró Monetag (push + In-Page Push) y falta confirmar que los anuncios se sirven.

## Objetivo

Que thecalculator.tech muestre anuncios de **Monetag** en producción, sin rastro de AdSense. Regla de consentimiento elegida por el usuario: Monetag carga para todos **salvo** quien pulse «Rechazar» en el banner de cookies; al rechazar se quitan todos los anuncios, incluidas las push. Formatos elegidos por el usuario: **Push Notifications** e **In-Page Push**. Descartados a propósito: Multitag, Onclick/popunder y Vignette (son intrusivos y perjudican el SEO).

## Estado actual

**Funciona (desplegado en `main`, commits `a940d25` y `ebb70ba`, live en https://thecalculator.tech):**
- AdSense eliminado por completo: script, Consent Mode/gtag, `ads.txt` de Google y textos legales ES/EN. Comprobado con grep en `src`, `index.html`, `public` y `dist`.
- `index.html` carga dos etiquetas desde un `<script>` inline (`MONETAG_TAGS`):
  - Push, zona 12105547: `https://5gvci.com/act/files/tag.min.js?z=12105547`
  - In-Page Push, zona 12105559: `https://nap5k.com/tag.min.js` con `data-zone="12105559"`
- `https://thecalculator.tech/sw.js` se sirve con `zoneId: 12105547`.
- En el Chrome de la extensión, la página **sí** inyecta las dos etiquetas (`consent: "granted"`).
- Al rechazar: `cookie-consent.tsx` guarda `"denied"`, llama a `removePushWorker()` y recarga la página. Además, `index.html` da de baja cualquier service worker que termine en `/sw.js` en cada carga.
- En Monetag: el sitio 3545485 está «Verified» y tiene las dos zonas creadas.

**Sin confirmar o roto:**
- Ningún anuncio se ha visto todavía. En el Chrome de la extensión, todas estas peticiones devuelven **503** y `fetch` da `Failed to fetch`:
  - `5gvci.com/act/files/tag.min.js?z=12105547`
  - `nap5k.com/tag.min.js`
  - `static.cloudflareinsights.com/beacon.min.js/v…`
  - `ssp-notify.monetag.com/socket.io/...`

  En cambio, `example.com` carga bien.
- El «Installation check» de Monetag muestra **«Installation error»** en las dos zonas. No es concluyente: la propia comprobación usa `ssp-notify.monetag.com` (socket.io), y ese navegador la bloquea con 503.
- Desde el terminal, `curl` a los dominios de Monetag da `exit 7` (no conecta), probablemente por restricciones de red del sandbox. No sirve para comprobar nada.

## Archivos en juego

| Archivo | Por qué importa |
|------|---------------|
| `artifacts/calculadoras/index.html` | `<script>` inline con `MONETAG_TAGS`, la comprobación de rechazo y la baja de `/sw.js`. Comentario reservado para la `<meta>` de verificación. |
| `artifacts/calculadoras/public/sw.js` | Service worker push de Monetag (`zoneId` 12105547, dominio 5gvci.com). Debe servirse en la raíz. |
| `artifacts/calculadoras/src/lib/ads.ts` | `AD_SLOTS` (banners en página, **vacíos** a propósito), `CONSENT_KEY`, `adsAllowed()`, `removePushWorker()`. |
| `artifacts/calculadoras/src/components/ad-unit.tsx` | Inserta el script de banner dentro del hueco; si el slot está vacío, no renderiza nada. Lo usan unas 33 páginas. |
| `artifacts/calculadoras/src/components/cookie-consent.tsx` | Banner: `decide()` es async, quita el worker al rechazar y recarga si cambia la elección. |
| `artifacts/calculadoras/src/pages/{privacidad,cookies,aviso-legal}.tsx` | Textos legales ES/EN que ahora hablan de Monetag. |
| `artifacts/calculadoras/public/ads.txt` | Solo un comentario; las líneas de Monetag van aquí si las pide. |
| `CLAUDE.md` | Sección «Anuncios (Monetag)» con las reglas de arriba; la antigua sección de AdSense se llama ahora «Calidad del contenido». |

## Qué se ha probado (y por qué falló)

### Intento 1: copiar `sw.js` con `cp` desde Bash
- **Qué:** `cp "/home/guillem/Descargas/sw (1).js" public/sw.js`
- **Por qué falló:** el clasificador del modo auto lo denegó (es un service worker con `importScripts` remoto). Lo copió el usuario con `!`. No intentes rodear ese bloqueo.

### Intento 2: usar el `sw.js` descargado tal cual
- **Qué:** el fichero traía `zoneId: 12104831`.
- **Por qué falló:** esa zona no existe en la cuenta. Se cambió a 12105547 para que coincida con la zona push creada. No se volvió a descargar el `sw.js` desde la zona nueva, porque la descarga necesita permiso.

### Intento 3: verificar en el Chrome de la extensión
- **Qué:** cargar la web y leer las peticiones de red; ejecutar «Installation check» en Monetag.
- **Por qué falló:** ese navegador (o su red/DNS) bloquea los dominios de anuncios con 503 sintético, incluso `ssp-notify.monetag.com`. CLAUDE.md ya avisa de que un 503 en `cloudflareinsights` lo provoca un bloqueador.

### Intento 4: leer el código de la etiqueta en Monetag
- **Qué:** el código solo se obtiene con el botón de copiar.
- **Cómo se resolvió:** para la de push bastó con interceptar `navigator.clipboard.writeText`. La de In-Page Push usa `document.execCommand('copy')`: hay que interceptar `execCommand` y leer `getSelection()`.

## Teoría actual

Lo más probable es que el sitio esté bien y el fallo venga del bloqueador de ese Chrome. Si, con el bloqueador desactivado, Monetag sigue marcando «Installation error», la causa probable es que su comprobador busca el snippet **literal** en el HTML, y aquí se inserta de forma dinámica desde `MONETAG_TAGS`. En ese caso, pon los snippets exactos que da Monetag:
- Push: `<script src="https://5gvci.com/act/files/tag.min.js?z=12105547" data-cfasync="false" async></script>`
- In-Page Push: `<script>(function(s){s.dataset.zone='12105559',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))</script>`

Mantén el rechazo de cookies. Para el snippet inline: envuélvelo con la comprobación de `localStorage`. Para el `<script src>` estático no hay forma de saltarlo; una opción es insertarlo con `document.write` dentro del guard.

## Próximos pasos

1. Pide al usuario que desactive el bloqueador (uBlock, Brave Shields, Pi-hole/NextDNS…) para `thecalculator.tech` y `publishers.monetag.com`, o que pruebe desde el móvil con datos. Ese mensaje ya se le envió; espera su respuesta.
2. Con el bloqueador desactivado: abre https://thecalculator.tech/ con la extensión de Chrome y comprueba con `read_network_requests` que `5gvci`/`nap5k` den 200 y que aparezca el aviso de In-Page Push.
3. En Monetag, abre `https://publishers.monetag.com/site/3545485/zone/12105559` y `.../zone/12105547` y pulsa «Installation check».
4. Si sigue el error, aplica la teoría de arriba (snippets literales en `index.html`), haz el build y comprueba con `grep -c "tag.min.js?z=12105547" dist/public/index.html`.
5. Prueba el rechazo: en la web, «Configurar cookies» (pie de página) → «Rechazar». Debe recargar, no cargar `5gvci`/`nap5k`, y `navigator.serviceWorker.getRegistrations()` debe quedar sin `/sw.js`.
6. Después de cada cambio, pregunta «¿Servidor (s) o GitHub (g)?». Con `g`: commit + `git push origin main`, y vigila `curl https://thecalculator.tech/...` hasta que esté live.

## Restricciones clave

- No escribas contraseñas: el usuario inicia sesión en Monetag por su cuenta.
- La paridad ES/EN es obligatoria en cualquier texto.
- Cada cambio se cierra con «¿Servidor (s) o GitHub (g)?». El servidor local usa siempre el puerto 5000 y se reutiliza si ya existe uno.
- No añadas Multitag, popunder ni vignette sin preguntar.
- `AD_SLOTS` vacíos es intencionado: ningún formato elegido usa huecos.
- No metas el beacon de Cloudflare en `index.html` (ver CLAUDE.md).
- Commits en español, en imperativo, terminados en `Co-Authored-By: ...`.
- Ya se avisó al usuario de que cargar anuncios antes del consentimiento choca con el RGPD; lo eligió a sabiendas.

## Memory Pointers

- Observaciones: #1690 (etiqueta push extraída, zona 12105547), #1691 (zona In-Page 12105559 creada), #1644 (baja del service worker al rechazar), #1624 (banner de consentimiento con recarga)
- Búsquedas útiles: `search "Monetag zone installation check 503"`, `search "removePushWorker sw.js consent"`
