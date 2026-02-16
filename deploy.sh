#!/bin/bash
# Deploy Script - Lendarios V2
# Execute: bash deploy.sh

set -e

APP_PATH="/var/www/lendarios-app"
BRANCH="main"

echo "🚀 Iniciando deploy..."

cd $APP_PATH

# Pull latest changes
echo "📥 Baixando atualizações..."
git pull origin $BRANCH

# Install/Update dependencies
echo "📦 Atualizando dependências..."
composer install --no-interaction --prefer-dist --optimize-autoloader
npm install

# Clear cache
echo "🧹 Limpando cache..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Run migrations and seeders
echo "🗄️ Executando migrations..."
php artisan migrate --force

echo "🌱 Executando seeders..."
php artisan db:seed --force

# Build assets
echo "🔨 Compilando assets..."
npm run build

# Optimize
echo "⚡ Otimizando..."
php artisan optimize

# Set permissions
echo "🔐 Ajustando permissões..."
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Reload PHP-FPM
echo "🔄 Recarregando PHP-FPM..."
systemctl reload php8.3-fpm

echo "✅ Deploy concluído com sucesso!"
echo "🌐 Acesse: http://147.93.138.28"
