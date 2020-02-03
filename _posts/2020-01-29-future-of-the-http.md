---
title: Как изменится HTTP в 2020 году 
description: Прогноз развития протокола в 2020 году 
updated: 2020-01-29
---

В январе выступил в [ФанБоксе](https://funbox.ru) с докладом о трендах развития HTTP.

{% include common/video.html name="20200129.mp4" poster="20200129.jpg" %}

Готовясь к выступлению, прочёл 53 документа, обсуждаемые в
[IETF HTTPWG](https://datatracker.ietf.org/wg/httpbis/documents/) и отобрал 4
самых интересных.

Сразу оговорюсь, предложенные темы для обсуждения и выводы об их
трендовости — это не глубокая аналитика, а простые наблюдения со стороны.
Прогнозы могут сбыться, а могут и нет: время расставит на свои места.

Намеренно обойду стороной причины появления этих документов. Считаю, что
«если звёзды зажигают, значит это кому-нибудь нужно», но почему
нужно — оставлю это тем, кто эти стандарты продвигает и разрабатывает.

## Запустят больше сайтов на HTTP/3

Самое ожидаемое событие года — переход на HTTP/3. Напомню, что в прошлом
году IETF опубликовали RFC для прикладного протокола HTTP/3, ставший логическим
продолжением развития HTTP. Как и HTTP/2, Google QUIC, SPDY — протокол призван
сделать передачу данных в мобильных сетях (с большими задержками) эффективнее,
а потому и сделать Интернет быстрее.

IETF также анонсировал QUIC — протокол, соединяющий в себе
функции транспортного (UDP) и сеансового (TLS) уровней. Считается, что QUIC
станет универсальным протоколом транспортного уровня: шифрованный, с гарантией
доставки, но поверх UDP.

Так вот, переход на HTTP/3 не за горами. За последний год Google, Facebook,
CloudFlare уже запустили HTTP/3 в боевую эксплуатацию. В конце 2018 года разработчики
обсуждали первую экспериментальную реализацию HTTP/3 в libcurl. В третьем квартале
она уже не экспериментальная, а [вполне готовая к использованию](https://daniel.haxx.se/blog/2019/08/05/first-http-3-with-curl/).

Если вам кажется, что до HTTP/3 далеко (ведь мы сами ещё HTTP/2 не прошли), то
спешу огорчить. HTTP/2 [распространён в Интернете на 42%](https://w3techs.com/technologies/history_overview/site_element/all/y), а HTTP/3 — уже на 2.4%.
Если рост HTTP/3 будет таким же, как у предшественника, то к концу 2020-го года
на HTTP/3 будет каждый шестой сайт, а через 4 года — каждый второй.

Самым ожидаемым событием, в этом смысле, кажется Nginx с поддержкой HTTP/3.
Ждём выпуск к [третьему кварталу 2020 года](https://www.nginx.com/nginxconf/2019/session/http3/). CloudFlare, например, ещё в сентябре
2019 года [предложила свой патч для поддержки HTTP/3 к Nginx](https://blog.cloudflare.com/experiment-with-http-3-using-nginx-and-quiche/).
Так что HTTP/3 — это не далёкое будущее, а вполне себе уже почти настоящее.

## Объявят User-Agent устаревшим

Второй тренд — отказ от User-Agent в пользу Client Hints. Mozilla, Google и
Chrome объявили, что [намерены прекратить развитие заголовка User-Agent](https://groups.google.com/a/chromium.org/forum/m/#!msg/blink-dev/-2JIRNMWJ7s/yHe4tQNLCgAJ),
а к сентябрю 2020 года полностью отказаться от User-Agent в пользу [HTTP Client Hints](https://tools.ietf.org/html/draft-west-ua-client-hints).
И не просто отказаться, а сделать устаревшим userAgent в Navigator API в Javascript.

Введение нового заголовка вендоры браузеров объясняют желанием структурировать заголовки
и навести порядок. В частности, уже полгода IETF обсуждает типизацию заголовков для
упрощения реализации ПО — черновик стандарта [HTTP Structured Headers](https://datatracker.ietf.org/doc/draft-ietf-httpbis-header-structure/).

Если коротко, то браузер по умолчанию станет отправлять только заголовок Sec-CH-UA,
сообщая веб-серверу только название браузера и его версию через пробел.
Веб-сервер может запросить дополнительную информацию от клиента в следующем запросе,
перечислив в заголовке необходимые параметры.

В зависимости от настроек приватности на стороне клиента, пользователь может
поделиться или не поделиться этими сведениями с сервером.

Помимо Sec-CH-UA, есть и другие стандартные заголовки:

- Sec-CH-Platform — ОС пользователя
- Sec-CH-Model — модель устройства
- Sec-CH-Arch — архитектура.
- Sec-CH-Mobile — признак, является ли устройство мобильным.

К серверу при этом предъявляется требование отправлять заголовок Content-DPR — соотношение
физических пикселей экрана к CSS-пикселям для рендера изображений на устройстве. То есть
этот заголовок не изменяет сами метаданные картинки, но дополняет их.

В сухом остатке, Client Hints сделают идентификацию легче, а жизнь фронтенд-разработчиков
на момент перехода — больнее. Вините Google — автор стандартизирующего документа работает там.

## Зашифруют TLS SNI

Третьим трендом развития HTTP становится сокрытие или шифрование SNI TLS. Как вы
наверняка знаете, данные, передаваемые по TLS шифрованные и без знания приватного
(в случае Perfect Forward Secrecy ещё и сессионного) ключа узнать содержимое человеку
посередине невозможно.

Однако кое-что всё-таки известно: то, куда пользователь подключается и какой сайт
запрашивает — HTTP-клиент в первом сообщении TLS ClientHello отправляет специальный
заголовок в расширении Server Name Indication (SNI), включая имя виртуального хоста.

Это позволяет веб-серверам ещё на этапе первого сообщения TLS понимать, какую цепочку
сертификатов следует вернуть клиенту в ходе согласования.

Так вот, SNI передаётся в открытом виде. Этим пользуются разработчики DPI при блокировке
веб-сайтов. Чтобы исправить эту проблему, [IETF приняли RFC Encrypted SNI](https://datatracker.ietf.org/doc/draft-ietf-tls-esni/),
регламентирующего процесс валидации шифрованного SNI.

Суть в том, что клиент перед подготовкой TLS ClientHello выполняет DNS-запрос для
TXT-записи, содержащей публичный ключ (и другие криптографические параметры) для шифрования
текста.

```
$ dig @1.1.1.1 _esni.rutracker.nl. +short
"/wErh[...]AAA="
```

Приватный ключ при этом знает принимающая сторона и дешифрует SNI. Если это сделать не удалось,
то сервер разрывает соединение. Публичный ключ при этом можно достаточно часто ротировать,
чтобы не попадать под блокировку уже шифрованного SNI.

Однако кажется странной идея выполнять проверку в DNS, ведь этот протокол не шифруется.
Если злоумышленник контролирует DNS, то ему достаточно подделать ответы от DNS, направив вас на
подконтрольный узел.

В этом отношении уже есть три конкурирующие технологии, позволяющие шифровать или проверять
целостность DNS-трафика.

- [DNSSec](https://tools.ietf.org/html/rfc4033)
- [DNS over TLS (DoT)](https://tools.ietf.org/html/rfc7858)
- [DNS over HTTPS (DoH)](https://tools.ietf.org/html/rfc8484)

На мой взгляд, самый перспективный вариант — это DNS over HTTPS. Учитывая, что HTTP/3 станет
поверх UDP, это вполне вероятный сценарий. Ещё обсуждают вариант с [DNS over QUIC](https://tools.ietf.org/html/draft-huitema-quic-dnsoquic),
но пока не очень интенсивно.

## Научат HTTP подписывать сообщения

Четвёртая инициатива касается [подписи всего HTTP сообщения](https://tools.ietf.org/html/draft-cavage-http-signatures). Когда вы шифруете данные
end-to-end с помощью TLS и мешаете человеку посередине прочитать содержимое. Но что,
если по пути следования HTTP-сообщения есть цепочка реверс-прокси или других
посредников, способных уже после дешифрования изменить сообщение.

Для борьбы с этим IETF обсуждает изменения, предусматривающие цифровую подпись
каждого HTTP-сообщения. Эту цифровую подпись сообщения и мета-данных предлагает
заголовок `Signature`.

```
Signature:
  keyId="test-key-b",
  algorithm="rsa-sha256",
  created=1402170695,
  expires=1402170995,
  headers="(request-target) (created) host x-custom-header",
  signature="T1l3[...]Ag=="
```

Например, однажды вы уже выработали пару закрытого и открытого ключей, обменялись
ими, то теперь вы можете включить цифровую подпись вашего сообщения.

Вы и сервер знаете идентификатор ключа. Клиент сообщает его в параметре `keyId` серверу.
Выбираете нужный алгоритм из списка поддерживаемых клиентом и сервером (пока без согласования).
А также время создания сообщения и время его устаревания, чтобы усложнить посредникам
задачу по дешифрованию ключа.

В параметре `headers` вы перечисляете через пробел те данные (сообщение, время его создания)
и мета-данные, которые вы хотите защитить от подделки. При этом, что важно, цифровая
подпись учитывает их порядок.

В параметре `signature` вы сообщаете base64 кодированную строку цифровой подписи,
вычисленной с помощью вашего публичного ключа. Обладатель приватного ключа проверит
цифровую подпись на предмет целостности сообщения.

Результирующую схема совместима с реверс-прокси. Если вы планируете по пути
изменять заголовок `host` или менять URI, то не включайте его в цифровую подпись.
Новые кастомные заголовки потребуется также добавлять в конец, чтобы не путать
порядок и не нарушать подпись.

## Итоги

Подводя итог, нельзя не отметить, что будет на самом деле — никто не знает.
Возможно, все эти идеи так и не найдут поддержки у компаний и комитета, так не
оставшись реализованными. А может, мы очень скоро увидим все или их часть в новых
выпусках веб-серверов, браузеров и клиентских библиотек.
