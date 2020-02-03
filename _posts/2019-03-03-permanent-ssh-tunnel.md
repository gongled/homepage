---
title: Как настроить постоянно работающий SSH-туннель
description: Как настроить постоянно работающий SSH-туннель с systemd.
updated: 2019-03-03
---

Иногда в работе над проектами приходится прибегать к уловкам
для организации сетевых доступов. В тех случаях, когда согласован SSH с
поддержкой перенаправления портов, альтернативным способом организации
доступа становится SSH-туннель.

Рассмотрим пример создания такого туннеля с поддержанием работы с помощью systemd.
Представим, что есть два сервера: сервер A (`alice.example.com`) с IP-адресом 10.0.0.1
и B (`bob.example.com`) с IP-адресом 10.0.0.2. Задача: пробросить порт 3128/tcp с
сервера B на сервер A для доступа к HTTP-прокси.

### Настройка

Перед началом убедитесь, что Port Forwarding разрешён на сервере: включите
опцию `AllowTcpForwarding`. Подробнее об использовании перенаправлении
TCP-портов в справке `sshd_config(5)`.

Далее заводим непривилегированного пользователя `autossh` на обоих серверах.
Этот пользователь будет подключаться к серверу B, а там, в свою очередь,
аутентифицироваться и перенаправлять порт.

```
sudo useradd -m -d /home/autossh/ -s /bin/bash autossh
```

Генерируем пару закрытого и открытого ключей (RSA 4096 бит) на сервере A. В 2019 году 4096 бит достаточно для обеспечения должного уровня безопасности, не опасаясь подбора ключа. Вероятно, если вы читаете эту заметку в будущем, увеличьте размер ключа до 8192 бит или выше. Парольную фразу указывать не нужно.

```
su - autossh
mkdir -p /home/autossh/.ssh/ident
ssh-keygen -t rsa -b 4096 -f /home/autossh/.ssh/ident/ident@bob.example.com
```

Копируем текст публичного ключа в файл `/home/autossh/.ssh/authorized_keys` вручную или с помощью `ssh-copy-id(1)` на сервер B. Это позволит пользователю `autossh` аутентифицироваться по нему при подключении.

```
# Using ssh-copy-id
ssh-copy-id -i /home/autossh/.ssh/ident/ident@bob.example.com.pub autossh@bob.example.com

# Manually
cat ~/.ssh/ident/ident@bob.example.com.pub | ssh autossh@bob.example.com 'cat >> ~/.ssh/authorized_keys'
```

Проверяем подключение к серверу B. Продолжаем, если всё в порядке.

```
ssh -i /home/autossh/.ssh/ident/ident@bob.example.com autossh@bob.example.com
```

Конфигурируем SSH-клиент на сервере A.

```
# vim /home/autossh/.ssh/config
Host bob-example-com-proxy
    HostName            bob.example.com
    User                autossh
    Port                22
    IdentityFile        ~/.ssh/ident/ident@bob.example.com
    RemoteForward       10.0.0.1:3128 10.0.0.2:3128
    ServerAliveInterval 30
    ServerAliveCountMax 3
```

Создаём systemd-юнит. Обратите внимание на символ `@` в названии: после него 
может быть указан параметр для юнита. Конфигурация шаблонизируется спецификаторами, 
описанными в документации к [systemd.unit](https://www.freedesktop.org/software/systemd/man/systemd.unit.html).

```
# sudo vim /usr/lib/systemd/system/autossh@.service
[Unit]
Description=Persistent SSH tunnel (%i)
After=network.target

[Service]
User=autossh
ExecStart=/usr/bin/ssh -NT -o ExitOnForwardFailure=yes %i
RestartSec=5
Restart=always

[Install]
WantedBy=multi-user.target
```

Применяем изменения.

```
sudo systemctl daemon-reload
```

Запускаем юнит и добавляем в автозапуск. Имя параметра соответствует названию 
профиля SSH-клиента в `$HOME/.ssh/config`.

```
sudo systemctl start autossh@b-example-com-proxy.service
sudo systemctl enable autossh@b-example-com-proxy.service
```

Готово. Проверяем перенаправление портов на сервере A.

```
cat < /dev/null > /dev/tcp/10.0.0.1/3128 && echo OK || echo NOK
```

Отладить подключение можно либо из-под пользователя `autossh`, либо добавив 
`-vvv` в systemd-юнит. Приведённое выше работает и для `LocalForward` для 
перенаправления порта с удалённого сервера на локальный. 
Легко комбинировать с {{ProxyJump}} и другими возможностями SSH, когда в 
цепочке несколько узлов.

