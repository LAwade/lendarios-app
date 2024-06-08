FROM alpine

LABEL maintainer 'Lucas Awade'

RUN apk update && apk upgrade

## INSTALL UTILS ##
RUN apk add curl vim libpq-dev \
    php php-cli php-common php-opcache php-mcrypt \ 
    php-cli php-gd php-curl php-pgsql php-fpm \ 
    php-json php-mbstring php-phar php-openssl \
    php-tokenizer php-xml php-session php-dom \
    php-xmlwriter php-fileinfo php-pdo php-iconv \
    postgresql-dev php-pdo_pgsql

RUN docker-php-ext-install pdo pdo_pgsql

## INSTALL COMPOSER ##
WORKDIR /var/
RUN curl -s https://getcomposer.org/installer | php
RUN mv composer.phar /usr/local/bin/composer
RUN alias composer='/usr/local/bin/composer'

## MAKE A PROJECT
RUN composer create-project --prefer-dist laravel/laravel lendarios
WORKDIR /var/lendarios
RUN php artisan key:generate

EXPOSE 8080

ENTRYPOINT [ "php" ]

CMD [ "php", 'artisan', 'serve', '--host=0.0.0.0', '--port=8080' ]