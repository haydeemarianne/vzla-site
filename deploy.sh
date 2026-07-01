#!/bin/bash
set -e

cd /home/vzla.site/public_html

# ── 1. Limpiar cachés ANTES de tocar el código ────────────────────────────────
# Así ninguna petición entrante usa cachés viejos con hashes obsoletos
echo "==> Limpiando cachés previas..."
php artisan config:clear 2>/dev/null || true
php artisan route:clear  2>/dev/null || true
php artisan view:clear   2>/dev/null || true

# ── 2. Sincronizar código con GitHub ──────────────────────────────────────────
# fetch + reset --hard es más fiable que git pull:
# garantiza que TODOS los archivos tracked (incluyendo public/build/) queden
# exactamente como en origin/main, sin importar el estado local.
echo "==> Sincronizando con origin/main..."
git fetch origin main
git reset --hard origin/main

# ── 3. Dependencias PHP ───────────────────────────────────────────────────────
echo "==> Composer..."
composer install --no-dev --optimize-autoloader --no-interaction

# ── 4. Migraciones ────────────────────────────────────────────────────────────
echo "==> Migrations..."
php artisan migrate --force

# ── 5. Cachés de producción (solo config + routes, NO views) ─────────────────
# view:cache congela las rutas de assets de Vite — omitirla evita el 404 post-deploy.
# Las vistas se compilan al vuelo desde el manifest.json actualizado.
echo "==> Cachés..."
php artisan config:cache
php artisan route:cache

# ── 6. Storage ────────────────────────────────────────────────────────────────
echo "==> Storage link..."
php artisan storage:link 2>/dev/null || true

# ── 7. Permisos ───────────────────────────────────────────────────────────────
echo "==> Permisos..."
chown -R nobody:nobody storage bootstrap/cache 2>/dev/null || \
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true
chmod -R 775 storage bootstrap/cache

echo "==> Deploy completado OK"
