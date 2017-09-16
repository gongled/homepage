---
title: О работе gzip_no_buffer в NGINX
updated: 2017-09-16
---

В сентябре вышел [пост SRE Dropbox об оптимизации веб-серверов](https://blogs.dropbox.com/tech/2017/09/optimizing-web-servers-for-high-throughput-and-low-latency/) в их [геораспределённой сети доставки контента](https://blogs.dropbox.com/tech/2017/06/evolution-of-dropboxs-edge-network/). Я заинтересовался опцией `gzip_no_buffer` в NGINX для сокращения времени получения первого байта TCP-пакета с сервера (TTFB).

Этой опции нет в официальной документации, а единственное упоминание в [книге NGINX HTTP Server Кле́мана Неде́льку](https://www.amazon.com/Nginx-HTTP-Server-Clement-Nedelcu/dp/1785280333) вторит ответу Игоря Сысоева в [почтовой рассылке 2006-го года](http://mailman.nginx.org/pipermail/nginx/2006-December/000415.html):

> By default Nginx waits until at least one buffer (defined by gzip_buffers) is filled with data before sending the response to the client. Enabling this directive disables buffering.

Из описания кажется, что опция отключает буферизацию, если ответ укладывается в один буфер, а если контент больше, то просто буферизирует вывод. Спешу огорчить: [это не так](http://hg.nginx.org/nginx/file/6b6e15bbda92/src/http/modules/ngx_http_gzip_filter_module.c#l889).

```c
if (conf->no_buffer && ctx->in == NULL) {

    cl = ngx_alloc_chain_link(r->pool);
    if (cl == NULL) {
        return NGX_ERROR;
    }

    cl->buf = ctx->out_buf;
    cl->next = NULL;
    *ctx->last_out = cl;
    ctx->last_out = &cl->next;

    return NGX_OK;
}
```

Если включен `gzip_no_buffer`, то заполняется один буфер, а затем возвращается клиенту без обработки следующей порции. В случае же превышения размера буфера, клиент получит ответ нулевой длины.

Иными словами, если размер буфера окажется недостаточным, веб-сервер не будет отдавать контент вовсе. Учитывайте эту особенность при конфигурировании NGINX. Выберите подходящее значение [`gzip_buffers`](https://nginx.ru/ru/docs/http/ngx_http_gzip_module.html#gzip_buffers) для вашего сервиса, если планируете использовать опцию в будущем.

Я рекомендую не отключать буферизацию. Возможно, эта оптимизация и играет роль на больших объёмах трафика, однако в небольших проектах влияние на производительность будет малозаметным.
