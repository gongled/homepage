---
title: Трассировка запросов в NGINX
updated: 2017-01-05
---

Начиная с NGINX 1.11.0 в конфигурации доступна переменная `$request_id` — случайным образом сгенерированная 32-символьная HEX-строка, автоматически назначаемая каждому HTTP-запросу (например, `622f438a1f1b8020f092135383c77a69`).

Нововведение помогает трассировать и отлаживать веб-приложения, помогая извлекать конкретный запрос от балансировщика до сервера приложения. Это также упрощает поиск в системе централизованного сбора и визуализации логов — такой как ELK.

До того, как появилась встроенная переменная, в ранних версиях NGINX такой идентификатор получали иначе.

Например, вызовом кода на Perl. Модуль `ngx_http_perl_module` экспериментальный, а потому [используйте в продакшене аккуратно](http://nginx.org/ru/docs/http/ngx_http_perl_module.html) и помните, блокирующие операции ставят на паузу процессы, обслуживающие запросы.

```
perl_set $request_id 'sub {
  return join "", map{(a..e,0..9)[rand 16]} 0..31;
}';
```

Ещё одна идея — объявить переменную, составленную из других переменных. В `$request_id` окажется строка вида `30791-1483643084.713-127.0.0.1-86-9563`. К сожалению, переменную придётся указывать в каждом виртуальном хосте.

```
set $request_id "$pid-$msec-$remote_addr-$request_length-$connection";
```

#### Как это использовать?

Расширьте действующий или добавьте новый формат лога. Журналирование идентификатора выручает, когда нужно найти ошибку, появившуюся какое-то время назад.

```
log_format extended '[$request_id] $remote_addr - $remote_user [$time_local] '
                    '$host $server_addr $request $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent" '
                    '"$http_x_forwarded_for" $request_time '
                    '$upstream_response_time';

access_log /var/log/nginx/access.log extended;
```

Используйте HTTP-заголовок или FastCGI/uWSGI параметр для передачи значения приложению или веб-серверу. Обратите внимание, что для стоящего в цепочке проксирования NGINX, переменная будет называться `$http_request_id`.

```
proxy_set_header Request-ID $request_id;

# fastcgi_param Request-ID $request_id;
# uwsgi_param Request-ID $request_id;
```

Отдать идентификатор клиентскому приложению можно с HTTP-заголовком `Request-ID`. Имя подойдёт любое, но лучше без [устаревшего префикса X-](https://tools.ietf.org/html/rfc6648).

```
add_header Request-ID $request_id;
```

Так запрос к моему сайту:
```
$ curl -I https://gongled.ru/
HTTP/1.1 200 OK
Server: nginx
Content-Type: text/html; charset=UTF-8
Request-ID: f5ae2621ffff2e7d5000bb8f04ef278a
```

Создаст запись в логе NGINX:
```
[f5ae2621ffff2e7d5000bb8f04ef278a] 89.250.169.207 - - [05/Jan/2017:21:12:16 +0300] gongled.ru 178.63.55.9 HEAD / HTTP/1.1 200 7695 "-" "curl/7.51.0" "-" 0.016 -
```

Попробуйте в своём проекте — это удобно.
