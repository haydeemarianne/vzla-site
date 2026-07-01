#!/bin/bash
set -e

cd /home/vzla.site/public_html

# ── 1. Limpiar cachés ANTES de tocar el código ────────────────────────────────
echo "==> Limpiando cachés previas..."
php artisan config:clear 2>/dev/null || true
php artisan route:clear  2>/dev/null || true
php artisan view:clear   2>/dev/null || true

# ── 2. Sincronizar con GitHub ─────────────────────────────────────────────────
# Secuencia correcta para hosting compartido:
# (a) fetch trae el estado de origin sin tocar nada
# (b) clean -fd elimina archivos untracked que podrían bloquear el reset
#     (ej: build assets que antes estaban en .gitignore)
# (c) reset --hard origin/main fuerza el árbol local a ser idéntico a origin
echo "==> Sincronizando con origin/main..."
git fetch origin main
git clean -fd
git reset --hard origin/main

# ── 3. Dependencias PHP ───────────────────────────────────────────────────────
echo "==> Composer..."
composer install --no-dev --optimize-autoloader --no-interaction

# ── 4. Migraciones ────────────────────────────────────────────────────────────
echo "==> Migrations..."
php artisan migrate --force

# ── 5. Cachés (config + routes — SIN view:cache) ──────────────────────────────
# view:cache guarda las rutas de assets con el hash anterior y causa 404.
# Con Vite+Inertia las vistas se compilan al vuelo y leen el manifest actualizado.
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
