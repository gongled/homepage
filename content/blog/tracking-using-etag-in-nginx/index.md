---
title: Идентифицируем пользователя по E-Tag
date: 2017-01-28
---

Расскажу о старом и простом трюке по слежке за пользователями с помощью HTTP-заголовка
ETag. В отличие от Cookies, о нём редко вспоминают, когда пытаются стереть
следы присутствия.

### Принцип работы

Когда клиент загружает веб-страницу, веб-сервер может передать идентификатор
загружаемого ресурса в заголовке ETag:

```
HTTP/1.1 200 OK
Server: nginx
[...]
ETag: 5888f5e0-34d
```

Браузер сохранит ответ, а когда ресурс будет нужен снова, то в
следующий раз он добавит к запросу заголовок If-None-Match.

```
GET /style.css HTTP/1.1
If-None-Match: "5888f5e0-34d"
Host: gongled.me
```

Сервер сверит ETag и значение из If-None-Match: если они совпадают, то в
ответ придёт код 304 (Not Modified). Так браузер понимает, что ресурс не
изменился и загружать его повторно не нужно. Если идентификаторы разные —
браузер повторно загрузит ресурс ещё раз.

```
HTTP/1.1 304 Not Modified
Server: nginx
[...]
ETag: 5888f5e0-34d
```

### Способы применения

Веб-разработчики используют ETag как механизм кеширования без привязки ко времени.
Например, в NGINX для этого есть опция [etag](http://nginx.org/ru/docs/http/ngx_http_core_module.html#etag). NGINX склеит [время последнего изменения и размер файла](http://lxr.nginx.org/ident?_i=ngx_http_set_etag) в строку, преобразует каждую часть в шестнадцатеричное число, а затем запишет значение в заголовок.

```
$ printf "%x-%x\n" $(stat -c%Y style.css) $(stat --format="%s" style.css)
5888f5e0-34d
```

Проблема в том, что спецификация HTTP/1.1 не говорит как создавать ETag. На этом
принципе и основана идентификация пользователя: вместо идентификатора файла
можно отдавать любую строку. Например, переменную `$request_id` для [трассировки запросов в NGINX]({% post_url 2017-01-05-tracing-requests-in-nginx %}).

Пользователь откроет страничку со стилями в CSS-файле, отправит запрос ресурсу
и получит ответ с ETag и длительным временем кеширования. В следующий раз
браузер отправит идентификатор обратно веб-серверу.

Пример конфигурации NGINX:

```
log_format ident_format '[$request_id] [$http_if_none_match] $remote_addr - $remote_user [$time_local] '
                        '"$request" $status $body_bytes_sent '
                        '"$http_x_forwarded_for" "$http_referer" $host '
                        '"$http_referer" "$http_user_agent" '
                        '$request_time $upstream_response_time';

server {
  listen 80;

  server_name example.com;

  [...]

  location = /css/track.css {
    access_log /var/log/nginx/ident.log ident_format;

    if ($http_if_none_match) {
      return 304;
      break;
    }
    return 200;
    add_header ETag $request_id;
    default_type text/css;
    expires max;
  }
}
```

Переменную `$http_if_none_match` можно залогировать или передать в
приложение для обработки с помощью `proxy_set_header`, `fastcgi_param` или
`uwsgi_param`. Пока пользователь не сбросит кеш, за ним можно
следить. Например, узнать когда и с каких IP-адресов тот заходит на сайт:

```
$ cat /var/log/nginx/ident.log | grep c834687fa74d6b616cedad8ae407d5b5
[c834687fa74d6b616cedad8ae407d5b5] [-] 89.250.169.240 - - [28/Jan/2017:13:27:59 +0300] "GET /css/style.css HTTP/1.1" 304 0 "-" "-" example.com "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.2994.0 Safari/537.36" 0.000 -
[57594da59a7c817aca6b70910a67e331] [c834687fa74d6b616cedad8ae407d5b5] 89.250.169.240 - - [28/Jan/2017:13:28:09 +0300] "GET /css/style.css HTTP/1.1" 304 0 "-" "-" example.com "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.2994.0 Safari/537.36" 0.000 -
[9fbd5604134a4f1dd2fee25d3098314c] [c834687fa74d6b616cedad8ae407d5b5] 95.104.194.197 - - [28/Jan/2017:13:28:20 +0300] "GET /css/style.css HTTP/1.1" 304 0 "-" "-" example.com "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.2994.0 Safari/537.36" 0.000 -
```

### Σ

Если вы всерьёз озабочены своей приватностью, используйте режим «инкогнито» в
браузере или отключайте кеш. Ознакомьтесь с [продвинутыми методами идентификации пользователей в сети](https://amiunique.org/links).

Я же советую не забивать голову: ETag не связывает ваш IP-адрес с личностью и
ничем не грозит. Напротив, не нужно отключать кеширование и сводить на ноль
усилия веб-разработчиков по оптимизации проектов.
