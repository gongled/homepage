---
title: Как создать базовый Docker образ
description: Создаём и поддерживаем образы Docker для полностью автономной инфраструктуры 
updated: 2019-03-24
---

В инфраструктуре ФБ мы собираем и поддерживаем автономный репозиторий образов Docker.

### Зачем это делать

Основные причины:

- Снизить риск недоступности внешних ресурсов.
- Контролировать поведение.
- Автономность и безопасность репозитория.
- Обеспечить повторяемость окружений.
- Минификация образа.

### Как собрать свой образ

Создаём директорию для файлов контейнера.

```
export centos_root="/mnt/rootfs"
mkdir -p "$centos_root"
```

Инициализируем новую базу данных RPM.

```
rpm --root "$centos_root" --initdb
```

Загружаем и устанавливаем пакет `centos-release`, содержащий конфигурации репозиториев. Импортируем
публичный GPG ключ для валидации цифровых подписей загружаемых пакетов.

```
yum reinstall --downloadonly --downloaddir /var/tmp/ centos-release
rpm --root "$centos_root" -ivh --nodeps /var/tmp/centos-release*.rpm
rpm --root "$centos_root" --import "$centos_root/etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7"
```

Устанавливаем пакетный менеджер и его зависимости без документации для экономии места.

```
yum -y --installroot="$centos_root" --setopt=tsflags="nodocs" --setopt=override_install_langs="en_US.utf8" install yum
```

Запрещаем `yum` устанавливать документацию и языковые пакеты.

```
sed -i "/distroverpkg=centos-release/a override_install_langs=en_US.utf8\ntsflags=nodocs" "$centos_root/etc/yum.conf"
```

Копируем `resolv.conf(5)` в новое окружение для работы DNS.

```
cp /etc/resolv.conf "$centos_root/etc/resolv.conf"
```

Связываем директорию `/dev` с устройствами внутри окружения. 

```
mount -o bind /dev "$centos_root/dev"
```

Установим `epel-release`, `iputils` и `procps-ng` внутри окружения. В конце очищаем кеш и метаданные, чтобы не включать
их в образ будущего контейнера.

```
$ chroot "$centos_root" /bin/bash <<EOF
yum install -y epel-release procps-ng iputils
yum clean all
EOF
```

Удаляем временный `resolv.conf(5)`.

```
rm -f "$centos_root/etc/resolv.conf"
```

Отвязываем директорию с устройствами из окружения.

```
umount "$centos_root/dev"
```

Создаём пустой `scratch` образ.

```
tar cv --files-from /dev/null | docker import - registry.example.tld/acme/scratch:latest
```

Создаём `tar.gz` архив.

```
tar cvfz centos-7-x86_64-docker.tar.gz -C "$centos_root/"
```

Описываем `Dockerfile` на базе образа `scratch` и архива окружения с CentOS 7 x86_64.

```
FROM registry.example.tld/acme/scratch
ADD centos-7-x86_64-docker.tar.gz /

LABEL org.label-schema.schema-version="1.0" \
    org.label-schema.name="CentOS Base Image" \
    org.label-schema.vendor="CentOS" \
    org.label-schema.license="GPLv2" \
    org.label-schema.build-date="20190324"

CMD ["/bin/bash"]
```

Собираем базовый образ.

```
docker build -t registry.example.tld/acme/centos:7 .
```

Готово. Проверяем.

```
docker run -it registry.example.tld/acme/centos:7 whoami
```
