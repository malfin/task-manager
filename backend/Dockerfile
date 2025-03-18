# Используем PHP с Debian
FROM php:8.2-fpm
LABEL authors="aleksejpuhov"

# Устанавливаем необходимые пакеты для Laravel
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    zip \
    git \
    unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd pdo pdo_mysql zip

# Устанавливаем Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Устанавливаем рабочую директорию
WORKDIR /var/www

# Копируем файлы Laravel в контейнер
COPY backend/ /var/www

# Устанавливаем зависимости Laravel
RUN composer install --no-dev --optimize-autoloader

# Настроим разрешения
RUN chown -R www-data:www-data /var/www

# Запускаем php-fpm
CMD ["php-fpm"]
