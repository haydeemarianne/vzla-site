#!/bin/bash
set -e

cd /home/vzla.site/public_html

echo "==> Limpiando cachés previas..."
php artisan config:clear 2>/dev/null || true
php artisan route:clear  2>/dev/null || true
php artisan view:clear   2>/dev/null || true

echo "==> Sincronizando con origin/main..."
git fetch origin main
git reset --hard origin/main

echo "==> Composer..."
composer install --no-dev --optimize-autoloader --no-interaction

echo "==> Migrations..."
php artisan migrate --force

echo "==> Cachés..."
php artisan config:cache
php artisan route:cache

echo "==> Storage link..."
php artisan storage:link 2>/dev/null || true

echo "==> Permisos..."
chown -R nobody:nobody storage bootstrap/cache 2>/dev/null || \
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true
chmod -R 775 storage bootstrap/cache

echo "==> Deploy completado OK"
