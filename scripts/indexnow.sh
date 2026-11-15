#!/usr/bin/env bash
# Envía a IndexNow (Bing, Yandex, Naver, Seznam) las URLs del sitemap.
# Uso: scripts/indexnow.sh [URL ...]   (sin argumentos: todas las del sitemap)
# Requiere el fichero de clave publicado en https://thecalculator.tech/<KEY>.txt
# (artifacts/calculadoras/public/<KEY>.txt). Google NO usa IndexNow.
set -euo pipefail

HOST="thecalculator.tech"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PUBLIC="$ROOT/artifacts/calculadoras/public"
KEY=""
for f in "$PUBLIC"/*.txt; do
  if [[ "$(basename "$f" .txt)" =~ ^[a-f0-9]{32}$ ]]; then KEY="$(cat "$f")"; break; fi
done
[ -n "$KEY" ] || { echo "No hay fichero de clave en $PUBLIC" >&2; exit 1; }

if [ "$#" -gt 0 ]; then
  URLS=("$@")
else
  mapfile -t URLS < <(grep -o '<loc>[^<]*</loc>' "$PUBLIC/sitemap.xml" | sed -e 's#</\?loc>##g')
fi

BODY=$(printf '%s\n' "${URLS[@]}" | python3 -c '
import json,sys
urls=[l.strip() for l in sys.stdin if l.strip()]
print(json.dumps({"host":"'"$HOST"'","key":"'"$KEY"'","keyLocation":"https://'"$HOST"'/'"$KEY"'.txt","urlList":urls}))')

CODE=$(curl -s -o /dev/null -w '%{http_code}' -X POST https://api.indexnow.org/indexnow \
  -H 'Content-Type: application/json; charset=utf-8' --data "$BODY")
echo "IndexNow: ${#URLS[@]} URLs -> HTTP $CODE (200/202 = aceptado)"
