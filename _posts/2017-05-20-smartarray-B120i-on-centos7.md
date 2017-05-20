---
title: Настройка RAID-контроллера SmartArray B120i в CentOS 7
updated: 2017-01-28
---

Небольшая инструкция об установке CentOS 7 на HPE ProLiant Microserver Gen8 с
поддержкой аппаратного RAID-контроллера SmartArray B120i:

Загрузите образ дискеты для RAID-контроллера HP Dynamic Smart Array B120i
с [официального сайта Hewlett Packard](http://h20564.www2.hpe.com/hpsc/swd/public/detail?swItemId=MTX_7db7797756df4cd9825a5567e8).

Запишите образ на USB-диск с помощью утилиты `dd`. Не забудьте заменить путь до
блочного устройства `/dev/sdd` и отмонтировать устройство перед запуском:

```
gunzip < hpvsa-1.2.10-120.rhel7u0.x86_64.dd.gz | pv | sudo dd of=/dev/sdd
```

Запустите установку CentOS 7, на экране приглашения нажмите `TAB`, укажите опцию `dd` и отключите поддержку AHCI для использования драйвера от HP:

```
linux dd blacklist=ahci
```

Готово. Во время загрузки ядра будет предложено выбрать источник для драйвера.
Выберите USB-диск и продолжите на логический диск.
