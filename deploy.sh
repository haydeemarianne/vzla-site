#!/bin/bash
set -e

cd /home/vzla.site/public_html

echo "==> Pull..."
git reset --hard HEAD
git pull origin main

echo "==> Composer..."
composer install --no-dev --optimize-autoloader --no-interaction

echo "==> Migrations..."
php artisan migrate --force

echo "==> Caches..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "==> Storage link..."
php artisan storage:link 2>/dev/null || true

echo "==> Permisos..."
chown -R nobody:nobody storage bootstrap/cache 2>/dev/null || chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true
chmod -R 775 storage bootstrap/cache

echo "==> Deploy completado OK"
