---
title: Как передать тело запроса вместе с X-Accel-Redirect
updated: 2017-09-16
---

Ещё об одном нестандартном использовании NGINX. Рассмотрим гипотетический веб-проект для меломанов. Сайт доступен только для авторизованных пользователей: те слушают треки и оставляют комментарии под ними. Сам сервис не хранит ни музыку, ни сообщения — этим заведует контент-провайдер, трафик к которому проксируется по HTTP.

Чтобы запретить гостям слушать музыку без регистрации, запросы к трекам обрабатывает приложение, присылая в ответ [X-Accel-Redirect](https://www.nginx.com/resources/wiki/start/topics/examples/x-accel/) на internal локейшен до контент-провайдера. Веб-сервер получит заголовок, найдёт локейшен, выполнит HTTP-запрос и вернёт результат клиенту.

Особенность NGINX такова, что тот при работе с X-Accel-Redirect [выполнит GET-запрос](https://github.com/nginx/nginx/blob/80f2e8f656267251c7d053307b82a382f5bb7744/src/http/ngx_http_upstream.c#L2693) вне зависимости от метода начального запроса. Скажем, если отправить POST-запрос с новым комментарием, то <mark>сообщение будет отброшено, а до апстрима дойдут только заголовки</mark>.

Решить эту проблему можно несколькими способами. Например, передавать POST как GET, помещая тело запроса в кастомный заголовок `X-Accel-Post-Body`. Вот так:

```
server {
  listen 80;

  location / {
    proxy_pass http://app.example.tld;
  }

  location /content {
    rewrite_by_lua_block {
        if ngx.header["X-Accel-Post-Body"] ~= nil then
          ngx.req.set_method(ngx.HTTP_POST)
          ngx.req.set_body_data(ngx.header["X-Accel-Post-Body"])
        end
    }

    internal;
    proxy_pass http://provider.example.tld/content/;
  }
}
```

Или форсировать метод POST с помощью директивы [`proxy_method`](https://nginx.ru/en/docs/http/ngx_http_proxy_module.html#proxy_method). В этом случае придётся описать два локейшена, чтобы не передавать через POST запросы для GET.

```
server {
  listen 80;

  location / {
    proxy_pass http://app.example.tld;
  }

  location /content_get/ {
    internal;
    proxy_pass http://provider.example.tld/content/;    
  }

  location /content_post/ {
    internal;
    proxy_method POST;
    proxy_pass http://provider.example.tld/content/;
  }
}
```

На практике удобнее `proxy_method`. В первом случае, чтобы передать большое тело запроса в заголовке, потребуется увеличить [`large_client_header_buffers`](https://nginx.org/en/docs/http/ngx_http_core_module.html#large_client_header_buffers) и изменить приложение, научив работать с кастомным заголовком. Также NGINX должен поддерживать Lua или Perl — стандартными средствами описать такое поведение не получится.
