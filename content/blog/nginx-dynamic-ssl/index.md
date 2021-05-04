---
title: Научить Nginx динамическому SSL
description: Как передавать заголовки с точкой в Nginx
date: 2021-05-04
---

Вместе с [Ильёй Бирманом](https://ilyabirman.ru) мы делаем SaaS-версию Эгеи для тех, у кого нет сервера или кто не хотят устанавливать или обновлять движок самостоятельно. Чтобы создать блог для пользователя, мы запускаем специальный сценарий командной строки: по шаблону генерируем виртуальный хост, выписываем бесплатный сертификат Let's Encrypt для домена, а в конце применяем изменения.

На днях мы решили упростить процесс: перестать создавать новые конфигурации и сделать SSL/TLS динамическим, чтобы вся логика оставалась в одном файле, а не в нескольких. Я думал, что без программирования на Lua или Njs задачу не обойтись, но, к счастью, в [комментариях к посту](https://ilyabirman.ru/meanwhile/all/nginx-multiuser-ssl/) [Константин Барышников](https://github.com/kbaryshnikov) подсказал, что начиная с Nginx 1.15.9 и OpenSSL 1.0.2 директивы `ssl_certificate` и `ssl_certificate_key` [поддерживают переменные](https://nginx.org/ru/docs/http/ngx_http_ssl_module.html#ssl_certificate). Добавлю от себя и расскажу о том, как мы решили эту задачу.

Добавьте `map` для `$ssl_server_name`, чтобы на основе TLS SNI определять имя для сертификата. 

Важно, чтобы при создании сертификата основным доменом выступал именно он, а алиасами были поддомены. Например, если вы выписываете сертификат с помощью [ACME-клиента `certbot`](https://certbot.eff.org), то первым аргументом `-d` указывайте именно основной домен, а не один из его субдоменов.

```
certbot certonly -d example.tld -d www.example.com --webroot -w /usr/share/nginx/html
```

Также обратите внимание на регулярное выражение: используйте подстановку вместо позиционных аргументов (`$fqdn` вместо `$1`), чтобы избежать перезаписи при обработке в директивах `rewrite` или regexp-локейшенах.

```
map $ssl_server_name $ssl_certificate_filename {
    ~^www\.(?<fqdn>.*)$ $fqdn;
    default             $ssl_server_name;
}
```

Далее опишите два блока `server`: для HTTP и HTTPS-трафика соответственно. В моём примере веб-сервер сделает перенаправление с HTTP на HTTPS с кодом 301. В директивах `ssl_certificate` и `ssl_certificate_key` используйте переменную `$ssl_certificate_filename`, полученную в `map`. При необходимости, ограничьте область действия конфигурации, объявив директиву `server_name` как регулярное выражение.

```
server {
    listen 80 default_server;

    # Enable ACME PKI provisioning
    include xtra/acme.conf;

    # Use permanent redirect from HTTP to HTTPS schema
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 http2 ssl default_server;

    # SSL/TLS certificate and private key definition
    #
    # Uses dynamic variable $ssl_certificate_filename, which 
    # provides mechanism defining virtual host configuration only once.
    #
    ssl_certificate             /etc/letsencrypt/live/$ssl_certificate_filename/fullchain.pem;
    ssl_certificate_key         /etc/letsencrypt/live/$ssl_certificate_filename/privkey.pem;
    ssl_trusted_certificate     /etc/webkaos/ssl/letsencrypt-chain.pem;

    # Enable ACME PKI provisioning
    include xtra/acme.conf;

    # Main entrypoint
    location / {}
}
```

Теперь при запуске Nginx не проверяет сертификаты и ключи, а станет это делать при выполнении запроса. Если сертификат с приватным ключом не будут найдены или же в них есть ошибка, то клиент получит в ответ TCP RST.

У изменения есть обратная сторона: на каждый SSL/TLS handshake сервер делает по два дополнительных системных вызова на каждый файл к диску, что может быть неприемлемым в условиях высокой нагрузки.

Перечитывайте документацию даже к хорошо знакомым проектам!