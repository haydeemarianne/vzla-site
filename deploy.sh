#!/bin/bash
set -e

cd /home/venezuela.site/public_html

echo "==> Pull..."
git pull origin main

echo "==> Composer..."
composer install --no-dev --optimize-autoloader --no-interaction

echo "==> Migrations..."
php artisan migrate --force

echo "==> Build assets..."
npm ci
npm run build

echo "==> Caches..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "==> Storage link..."
php artisan storage:link

echo "==> Permisos..."
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

echo "==> Deploy completado OK"
