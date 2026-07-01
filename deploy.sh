#!/bin/bash
set -e

cd /home/vzla.site/public_html

# ── 1. Limpiar cachés ANTES de tocar el código ────────────────────────────────
echo "==> Limpiando cachés previas..."
php artisan config:clear 2>/dev/null || true
php artisan route:clear  2>/dev/null || true
php artisan view:clear   2>/dev/null || true

# ── 2. Fix de permisos de public/build ANTES del git reset ───────────────────
# El directorio puede quedar owned por root si se hizo algún git manual como root.
# git (corriendo como vzlas3094) no puede escribir en directorios de root.
echo "==> Permisos public/build..."
chown -R vzlas3094:vzlas3094 public/build/ 2>/dev/null || true
chmod -R 775 public/build/ 2>/dev/null || true

# ── 3. Sincronizar con GitHub (main) ──────────────────────────────────────────
echo "==> Sincronizando con origin/main..."
git fetch origin main
git reset --hard origin/main

# ── 4. Dependencias PHP ───────────────────────────────────────────────────────
echo "==> Composer..."
composer install --no-dev --optimize-autoloader --no-interaction

# ── 5. Migraciones ────────────────────────────────────────────────────────────
echo "==> Migrations..."
php artisan migrate --force

# ── 6. Cachés (config + routes — SIN view:cache) ──────────────────────────────
echo "==> Cachés..."
php artisan config:cache
php artisan route:cache

# ── 7. Storage ────────────────────────────────────────────────────────────────
echo "==> Storage link..."
php artisan storage:link 2>/dev/null || true

# ── 8. Permisos finales ───────────────────────────────────────────────────────
echo "==> Permisos finales..."
chown -R nobody:nobody storage bootstrap/cache 2>/dev/null || \
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true
chmod -R 775 storage bootstrap/cache
chmod -R 775 public/build/ 2>/dev/null || true

echo "==> Deploy completado OK"
