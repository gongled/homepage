---
title: Миграция базы данных OpenLDAP
updated: 2017-12-13
---

На прошлой неделе готовил серверы для запуска проекта Икс в коммерческую эксплуатацию. Кластер под приложение работает в изолированной сети, а потому каждый инфраструктурный сервис устанавливаем строго внутри периметра. Подошла очередь настройки OpenLDAP для управления правами доступа пользователей.

Штука в том, что вспоминая как работать с LDAP, каждый раз полчаса-час ищу названия команд и опций в Интернете. Чтобы в следующий раз не тратить время, расскажу как перенести LDAP с одного сервера на другой на примере OpenLDAP и инсталляции ОС CentOS и RHEL.

### На старом сервере

Остановите сервис.

```
$ sudo systemctl stop slapd
```

Сделайте резервную копию базы данных LDAP.

```
$ sudo slapcat -b "dc=example,dc=tld" -f /etc/openldap/slapd.conf -l /var/tmp/backup.ldif
```

Запустите сервис.

```
$ sudo systemctl start slapd
```

### На новом сервере

Установите OpenLDAP.

```
$ sudo yum -y install openldap openldap-servers openldap-clients
```

Добавьте в автозапуск.

```
$ sudo systemctl enable slapd
```

Остановите сервис.

```
$ sudo systemctl stop slapd
```

Затем скопируйте конфигурации, сертификаты и приватные ключи со старого сервера.

Импортируйте базу данных.

```
$ sudo slapadd -b "dc=example,dc=tld" -f /etc/openldap/slapd.conf -l /var/tmp/backup.ldif
```

Укажите путь до конфигурационного файла в опции `SLAPD_OPTIONS`.

```
$ sudo vim /etc/sysconfig/slapd

SLAPD_OPTIONS="-f /etc/openldap/slapd.conf"
[...]
```

Запустите сервис.

```
$ sudo systemctl start slapd
```

Готово. 
