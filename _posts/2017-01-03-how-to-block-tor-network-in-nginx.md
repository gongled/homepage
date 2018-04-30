---
title: Блокировка Tor в NGINX
updated: 2017-01-03
---

Защитная стратегия защиты от DDoS атаки из TOR на уровне веб-приложения — блокировка HTTP-запросов из луковых подсетей. Сделать это несложно: проект Tor Project регулярно обновляет [списки выходных узлов сети](https://check.torproject.org/exit-addresses).

```
[...]
ExitNode FF0D1841086637CA0920E21AFA4C6A43905EA2BD
Published 2017-01-02 11:00:24
LastStatus 2017-01-02 12:03:41
ExitAddress 45.76.159.203 2017-01-02 12:12:29
ExitNode FFB8575D7C8E40AC6E48C1B7AA32AC7701E04AB9
Published 2017-01-01 16:10:32
LastStatus 2017-01-01 20:03:40
ExitAddress 80.15.98.127 2017-01-01 18:10:35
ExitNode FFB94702D023B6F824D8B3BC68F33EA02AFA70D8
Published 2017-01-02 08:37:56
LastStatus 2017-01-02 09:02:40
ExitAddress 51.15.39.2 2017-01-02 09:07:51
```

Обрабатываем реестр в формате [TorDNSEL](https://www.torproject.org/projects/tordnsel.html.en) и сохраняем в файл список узлов:

```
curl -Ls https://check.torproject.org/exit-addresses | grep ExitAddress | awk '{print $2}' | sort | uniq
```

Результирующий и включаем опцией `include` в секции `geo` ([`ngx_http_geo_module`](http://nginx.org/ru/docs/http/ngx_http_geo_module.html)):

```
geo $is_tor {
  default 0;
  include /etc/nginx/conf.d/tor.list;
}
```

В секции `server` виртуального хоста указываем условие с кодом возрата:

> Переменную ещё можно залогировать. Такие журналы интересно потом читать или разбирать.
{:.aside-text-right}

```
if ($is_tor) {
  return 403;
}
```

Готово. Рекомендую также поэкспериментировать со ответами веб-сервера: иногда атакующий прекращает DDoS при получении статус-кодов 5XX. Как вариант, завершать запрос с [внутренним кодом 444](http://nginx.org/ru/docs/http/request_processing.html#how_to_prevent_undefined_server_names) для разрыва TCP-сессии.
