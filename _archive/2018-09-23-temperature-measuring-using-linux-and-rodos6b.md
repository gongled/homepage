---
title: Измеряем температуру в офисной серверной 
updated: 2018-09-16
---

На днях установили USB-термометр [RODOS 6B](https://olimp-z.ru/rodos-6b) для контроля температуры в офисной 
серверной, чтобы знать о сбоях системы охлаждения. Мы остановились на модели с 
корпусом из ABS-пластика и выносным датчиком температуры длиной в один метр.

> Фотография RODOS 6B

### Инструкция

Коротко о том, как подключить термометр в CentOS 7.x для мониторинга температуры.

Установите зависимости для сборки.

```
[sudo] yum -y install gcc-c++ libusbx-devel 
```

Загрузите, скомпилируйте и установите C++ приложение. У разных модификаций 
устройств могут отличаться Product ID и Vendor ID. Используйте те, что в 
выводе команды `lsusb(8)`.

```
# Download tarball with source codes and unpack it
curl https://www.olimp-z.ru/products/RODOS-5/RODOS5_6.tar.gz | tar xfz

# Switch to the working directory
cd RODOS5_6/

# Compile program
make

# Install binary to /usr/local/bin
[sudo] mv RODOS5_6 /usr/local/bin/rodos6

# Set up execution bits
[sudo] chmod +x /usr/local/bin/rodos6
```

Сконфигурируйте `udev` для работы с термометром под непривилегированным пользователем.

```
[sudo] cat << EOF > /etc/udev/rules.d/40-rodos6.rules
# RODOS-6B
SUBSYSTEMS=="usb", ATTRS{idVendor}=="20a0", ATTRS{idProduct}=="4173", GROUP="users", MODE="0666"

EOF
```

Примените изменения.

```
[sudo] udevadm control --reload-rules
```

Остаётся добавить метрику в мониторинг. Пример для Zabbix:

```
UserParameter=rodos6[temperature],printf "%.2f\n" "$(/usr/local/bin/rodos6 --read --id $(/usr/local/bin/rodos6 info | grep -Eo 'ID: [0-9]{0,}' | awk '{print $2}') | grep -oP 'T=.+' | awk -F '=' '{print $2}')"
```

Готово. Комитет ASHRAE рекомендует сохранять температуру в серверных в 
диапазоне 20-25℃ при влажности до 60%. Старайтесь придерживаться 
безопасных значений ниже точки росы, избегая перегрева и конденсата.
