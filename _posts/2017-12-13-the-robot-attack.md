---
title: Атака ROBOT на протокол TLS
updated: 2017-12-13
---

День назад стали известны детали нового метода атаки на криптографический
протокол TLS. Злоумышленник может расшифровать трафик без знания приватного
RSA-ключа уязвимого сервера. Основной причиной возникновения называют
неполную реализацию [мер защиты TLS](https://tools.ietf.org/html/rfc5246#section-7.4.7.1) в некоторых коммерческих и открытых продуктах.

[В списке уязвимых проектов](http://robotattack.org) нет открытых библиотек OpenSSL, LibreSSL, GnuTLS и BoringSSL. Однако нельзя гарантировать, что мейнтейнер пакета не наложит дополнительный патч и в вашей
системе не окажется уязвимое ПО. Или что вендор приложения не поставит уязвимую
версию криптографической библиотеки в составе своего ПО. Например, авторы
упоминают Facebook, где инженеры используют собственные патчи к OpenSSL.

Потому в любом случае важно убедиться, что с TLS в вашем приложении всё в порядке. Сделать это можно двумя способами: через веб-сервисы или же запустить проверочный сценарий. Например, проверка уже доступна в тестовой версии [SSLLabs Qualys](https://dev.ssllabs.com).
Для тестирования внутренней инфраструктуры практичнее использовать скрипт [robot-detect](https://github.com/robotattackorg/robot-detect).
В требованиях к работе авторы предлагают использовать версию Python не ниже
третьей.

Запустите Docker-контейнер с Python:

```
$ docker run -it python:3.6 bash
```

Проверьте версию интерпретатора:

```
$ python --version
Python 3.6.3
```

Установите библиотеки для установки и сборки зависимых модулей:

```
$ apt update
$ apt install -y libmpc-dev libmpfr-dev libgmp3-dev python-gmpy2
```

Установите зависимости для скрипта:

```
$ pip install cryptography gmpy2
```

Склонируйте репозиторий

```
$ git clone https://github.com/robotattackorg/robot-detect
```

Запустите сценарий:

```
$ cd robot-detect/
$ python robot-detect example.tld
```

Готово, теперь можно проанализировать результаты. На момент публикации балансировщики
сервиса Badoo были уязвимы к ROBOT:

```
$ python robot.py badoo.com
Scanning host badoo.com ip 31.222.68.33 port 443
RSA N: 0x936b74aa14d8b17e919f972a48d801c45cf9cc9b30d324d5d07141209f4b7628c21e2811327b8ee7d5774d03e557c4dde291ed1b07afab346760261b5183b9cfb0feba7767488f5860ee982d7372f53c1f14494ff5a3f457a272b3d9d6fc1c82bdb8734410c65d001e8801304d122a278c1d18ede98d961266b5de5d53a22bcb51968f94f4d0dd2677a221774f59ed43c786e6b3524684e1b4ba5b618eba2b685d2580909dba50a227da5ace8659b5b38a453910c86d1b3a4c527af22feaa50dfaa26879b22ed3bf5818e9cf15ee87f217bc98225c76a6bd1a3dc08f84ee2debb81ee4ba3fa822ec58bbead3a9205ba197d9cca542aa2e282793b5e9b38c314b
RSA e: 0x10001
Modulus size: 2048 bits, 256 bytes
The oracle is weak, the attack would take too long
VULNERABLE! Oracle (weak) found on badoo.com/31.222.68.33, TLSv1.2, standard message flow: TLS alert 40 of length 14/TLS alert 40 of length 7 (TLS alert 40 of length 7 / TLS alert 40 of length 7 / TLS alert 40 of length 7)
Result of good request:                        TLS alert 40 of length 14
Result of bad request 1 (wrong first bytes):   TLS alert 40 of length 7
Result of bad request 2 (wrong 0x00 position): TLS alert 40 of length 7
Result of bad request 3 (missing 0x00):        TLS alert 40 of length 7
Result of bad request 4 (bad TLS version):     TLS alert 40 of length 7
```

Тестировать можно не только веб-сервисы. Например, с SMTP-серверами Яндекса всё в хорошо:

```
$ python robot-detect smtp.yandex.ru -p 465
Scanning host smtp.yandex.ru ip 213.180.204.38 port 465
RSA N: 0x932395aca65c5083b8190c21269dbc472346b4fdc5edc74f99c33ed8f53485cb4348fd2cd80be6e0ba45afb27bee22178cdf22a927e7144acd86f8ade728e60334951ecf3ce28ab86edd4542fed64b0f7f68aca28601aeaa9b1e43bf667bff29e439f2998e65c1b7d1de9a8088b7233ad984c3f004109a43020782ae7be8f6c26f1f1f13ed80862e43312d0fdc4253dbc0363ea29a068c225accd1c7a092777ab16043474ef8a43b011148e0d86b0d4aa028da70f4b6f386085676aa420c2c88d982c0a6b5a8a79cced7b7e4c7c3c02932ef4156c813c973137d50b40b37c1d476c8775533a886c82e9ac1de22ebc421e7dcad45ebca2459f057043638829853
RSA e: 0x10001
Modulus size: 2048 bits, 256 bytes
Identical results (No data received from server), retrying with changed messageflow
Identical results (Timeout waiting for alert), no working oracle found
NOT VULNERABLE!
```

Подробнее об уязвимости и способах её эксплуатации можно прочесть в [отчёте исследователей Hanno Böck, Juraj Somorovsky и Craig Young](https://ia.cr/2017/1189). Помогите узнать о проблеме специалистам,
занятых разработкой и сопровождением веб-приложений.
