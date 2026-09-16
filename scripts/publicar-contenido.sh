#!/usr/bin/env bash
#
# Sincroniza el contenido de las hojas y NO se da por satisfecho hasta comprobar
# que ribie.org está sirviendo lo nuevo.
#
# Existe por lo que pasó entre el 16 de agosto y el 6 de septiembre de 2026: el
# workflow reportaba éxito, commiteaba, y el sitio seguía sirviendo el build del
# día 16 (D59). Un ✓ verde dice que un proceso terminó, no qué hay publicado.
# Por eso el paso final no mira Actions: mira el sitio.
#
# Uso:  pnpm publicar     ·     bash scripts/publicar-contenido.sh
#
# Salidas: 0 = publicado y verificado, o no había nada que publicar
#          1 = algo se rompió (el mensaje dice qué)

set -uo pipefail

REPO="ribieorg/web-ribie"
SITIO="https://ribie.org"
RAMA="main"
ESPERA_CACHE=90          # segundos antes del único reintento
RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ -t 1 ]; then
  N=$'\033[0m'; B=$'\033[1m'; VERDE=$'\033[32m'; ROJO=$'\033[31m'
  AMBAR=$'\033[33m'; GRIS=$'\033[90m'
else
  N=''; B=''; VERDE=''; ROJO=''; AMBAR=''; GRIS=''
fi

paso()  { printf '%s→%s %s\n' "$B" "$N" "$1"; }
ok()    { printf '%s✓%s %s\n' "$VERDE" "$N" "$1"; }
mal()   { printf '%s✗%s %s\n' "$ROJO" "$N" "$1" >&2; }
aviso() { printf '%s!%s %s\n' "$AMBAR" "$N" "$1"; }
tenue() { printf '%s  %s%s\n' "$GRIS" "$1" "$N"; }

# ── Preflight ───────────────────────────────────────────────────────────────
command -v gh >/dev/null || { mal "No está instalado 'gh'.  sudo apt install gh"; exit 1; }
if ! gh auth status >/dev/null 2>&1; then
  mal "gh no tiene sesión iniciada.  Corre:  gh auth login"; exit 1
fi
if ! gh repo view "$REPO" >/dev/null 2>&1; then
  mal "Tu cuenta de gh no alcanza $REPO. Revisa con:  gh auth status"; exit 1
fi

# ── Lanzar el workflow y quedarse con SU run ────────────────────────────────
# `gh workflow run` no devuelve el id, así que se anota cuál era el último run
# antes de disparar y se espera a que aparezca uno distinto.
lanzar_sync() {
  local previo id intentos
  previo=$(gh run list --repo "$REPO" --workflow=contenido.yml --limit 1 \
             --json databaseId -q '.[0].databaseId' 2>/dev/null || echo "")

  gh workflow run contenido.yml --repo "$REPO" --ref "$RAMA" >/dev/null 2>&1 || {
    mal "No se pudo disparar el workflow."; return 1; }

  for intentos in $(seq 1 15); do
    sleep 2
    id=$(gh run list --repo "$REPO" --workflow=contenido.yml --limit 1 \
           --json databaseId -q '.[0].databaseId' 2>/dev/null || echo "")
    if [ -n "$id" ] && [ "$id" != "$previo" ]; then echo "$id"; return 0; fi
  done
  mal "El workflow se lanzó pero no apareció el run. Míralo en:"
  mal "  https://github.com/$REPO/actions"
  return 1
}

# ── Una corrida completa del sync ───────────────────────────────────────────
# Devuelve: 0 = hubo cambios (imprime el SHA), 2 = sin cambios, 1 = falló
correr_sync() {
  local id log sha filas rotos
  id=$(lanzar_sync) || return 1
  tenue "run $id · https://github.com/$REPO/actions/runs/$id" >&2

  if ! gh run watch "$id" --repo "$REPO" --exit-status --interval 10 >/dev/null 2>&1; then
    mal "El sync falló. El log completo:"
    mal "  gh run view $id --repo $REPO --log-failed"
    return 1
  fi

  log=$(gh run view "$id" --repo "$REPO" --log 2>/dev/null \
        | sed $'s/\x1b\\[[0-9;]*m//g' \
        | sed 's/^[^\t]*\t[^\t]*\t//' \
        | sed 's/^[0-9TZ:.+-]*Z //')

  filas=$(printf '%s\n' "$log" | grep -cE '^✓ [a-z_]+: [0-9]+ fila' || true)
  filas=${filas:-0}
  [ "$filas" -gt 0 ] && tenue "$filas hojas leídas" >&2

  # Enlaces: el sync los comprueba en cada corrida desde D61.
  rotos=$(printf '%s\n' "$log" | grep -oE '::warning title=Enlaces rotos[^:]*::[^\n]*' | head -1 || true)
  if [ -n "$rotos" ]; then
    aviso "Hay enlaces rotos en las hojas:" >&2
    printf '%s\n' "${rotos#*::}" | sed 's/^/    /' >&2
  fi

  sha=$(printf '%s\n' "$log" | grep -oE '^\[main [0-9a-f]{7,40}\]' | head -1 \
        | tr -d '[]' | awk '{print $2}')
  if [ -z "$sha" ]; then return 2; fi
  echo "$sha"
  return 0
}

# ── Esperar el deploy que disparó el sync ───────────────────────────────────
esperar_deploy() {
  local desde="$1" id intentos
  for intentos in $(seq 1 20); do
    id=$(gh run list --repo "$REPO" --workflow=deploy.yml --limit 5 \
           --json databaseId,createdAt \
           -q "[.[] | select(.createdAt > \"$desde\")] | .[0].databaseId" 2>/dev/null || echo "")
    [ -n "$id" ] && [ "$id" != "null" ] && break
    sleep 5
  done
  if [ -z "$id" ] || [ "$id" = "null" ]; then
    mal "El sync publicó, pero no arrancó ningún deploy — es exactamente la avería de D59."
    mal "  Dispáralo a mano:  gh workflow run deploy.yml --repo $REPO --ref $RAMA"
    return 1
  fi
  tenue "deploy $id"
  gh run watch "$id" --repo "$REPO" --exit-status --interval 10 >/dev/null 2>&1
}

# ── La comprobación que importa: ¿qué está sirviendo el sitio? ──────────────
verificar_en_vivo() {
  local sha="$1" completo publicado html faltan=0 valor
  completo=$(git -C "$RAIZ" rev-parse "$sha" 2>/dev/null || echo "$sha")

  # 1. ¿El commit desplegado en Pages es el del sync?
  publicado=$(gh api "repos/$REPO/deployments?environment=github-pages&per_page=1" \
                -q '.[0].sha' 2>/dev/null || echo "")
  if [ -n "$publicado" ] && [ "${publicado:0:7}" = "${completo:0:7}" ]; then
    ok "Pages desplegó el commit ${completo:0:7}"
  elif [ -n "$publicado" ]; then
    aviso "Pages sirve ${publicado:0:7} y el contenido nuevo es ${completo:0:7} — puede ir con retraso."
    faltan=1
  fi

  # 2. ¿Los valores nuevos se ven de verdad en la portada?
  #    Se le pega un parámetro para saltarse cualquier caché intermedia.
  html=$(curl -sS --max-time 20 -H 'Cache-Control: no-cache' "$SITIO/?v=$(date +%s)" 2>/dev/null || echo "")
  if [ -z "$html" ]; then
    aviso "No se pudo leer $SITIO para comprobarlo."
    return 1
  fi
  while IFS= read -r valor; do
    [ ${#valor} -lt 12 ] && continue
    if printf '%s' "$html" | grep -qF "$valor"; then
      ok "En vivo: «${valor:0:60}»"
    else
      aviso "No encontré «${valor:0:60}» en la portada (puede vivir en otra página)."
    fi
  done < <(git -C "$RAIZ" show "$sha" -- src/data/contenido.json 2>/dev/null \
           | grep -E '^\+' | grep -v '^+++' \
           | grep -oE '": *"[^"]{12,}"' | sed 's/^": *"//; s/"$//' | head -3)

  return $faltan
}

# Sourcear el guion carga sus funciones sin disparar nada: sirve para probarlas.
if [ "${BASH_SOURCE[0]}" != "$0" ]; then return 0 2>/dev/null || exit 0; fi

# ── Curso principal ─────────────────────────────────────────────────────────
printf '\n%sSincronizar el contenido de ribie.org%s\n\n' "$B" "$N"
git -C "$RAIZ" fetch -q origin "$RAMA" 2>/dev/null

MARCA=$(date -u +%Y-%m-%dT%H:%M:%SZ)
paso "Lanzando el sync…"
SHA=$(correr_sync); ESTADO=$?

if [ $ESTADO -eq 2 ]; then
  printf '\n'
  aviso "Las hojas dicen lo mismo que el repo."
  tenue "Google cachea el CSV publicado unos minutos —hasta cinco—, así que un"
  tenue "cambio recién guardado puede no verse todavía. Reintento en ${ESPERA_CACHE}s (1 de 1)…"
  sleep "$ESPERA_CACHE"
  printf '\n'
  MARCA=$(date -u +%Y-%m-%dT%H:%M:%SZ)
  paso "Lanzando el sync (reintento)…"
  SHA=$(correr_sync); ESTADO=$?
fi

case $ESTADO in
  1) exit 1 ;;
  2) printf '\n'; ok "Nada que publicar: el sitio ya está al día."
     tenue "Si editaste la hoja hace menos de un minuto, dale un momento y relánzalo."
     exit 0 ;;
esac

# Hubo cambios.
printf '\n'
git -C "$RAIZ" fetch -q origin "$RAMA" 2>/dev/null
paso "Cambió esto:"
git -C "$RAIZ" show "$SHA" --stat --format='' -- src/assets/remoto 2>/dev/null | sed 's/^/  /' | head -8
git -C "$RAIZ" show "$SHA" -- src/data/contenido.json 2>/dev/null \
  | grep -E '^[-+]' | grep -vE '^(\+\+\+|---)' | cut -c1-160 | sed 's/^/    /' | head -24
printf '\n'

paso "Desplegando…"
if ! esperar_deploy "$MARCA"; then exit 1; fi
printf '\n'

paso "Comprobando qué sirve el sitio…"
verificar_en_vivo "$SHA"
VERIF=$?
printf '\n'

if [ $VERIF -eq 0 ]; then
  ok "${B}Publicado y verificado en $SITIO${N}"
else
  aviso "Desplegado, pero no pude confirmarlo del todo. Ábrelo y míralo: $SITIO"
fi

# El commit lo hace el bot en remoto: el local se queda atrás sin avisar.
ATRAS=$(git -C "$RAIZ" rev-list --count HEAD.."origin/$RAMA" 2>/dev/null || echo 0)
if [ "$ATRAS" -gt 0 ]; then
  printf '\n'
  tenue "Tu copia local está $ATRAS commit(s) atrás.  git -C $RAIZ pull"
fi
exit 0
