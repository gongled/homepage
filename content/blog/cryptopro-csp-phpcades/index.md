# Добавляем поддержку КриптоПро CSP в PHP

Несколько недель назад помогал одной команде интегрировать приложение на PHP с [ГИБДД ЕАИСТО](https://eaisto.gibdd.ru). Основная задача: подписывать сертификатом в формате ГОСТ Р 34.10-2012 и отправлять документы с помощью криптографического провайдера КриптоПро CSP. Использовать окружение на базе 64-битной версии Linux CentOS 7.x.

В PHP поддержка стандарта CAdES в СКЗИ КриптоПРО реализована через загрузку разделяемой библиотеки [phpcades](http://cpdn.cryptopro.ru/default.asp?url=content/cades/phpcades.html), что не входит в список стандартных и поддерживаемых мейнтейнерами дистрибутивов, а потому её нужно собирать самостоятельно.

Несмотря на распространённость задачи, в русскоязычном сегменте нет той инструкции, что не содержала бы неточности или ошибки при эксплуатации. Эта статья призвана обобщить опыт вендоров и сообщества, исправив ошибки и собрав полезные практики воедино.

## Подготовка

Прежде чем начать, зарегистрируйтесь на сайте [КриптоПРО CSP](https://www.cryptopro.ru/). Установочные пакеты и зависимости по прямым ссылкам доступны только авторизованным пользователям.

Создайте рабочую директорию и загрузите в неё:

- [КриптоПро CSP 5.0 для Linux (x86_64)](https://www.cryptopro.ru/sites/default/files/private/csp/50/11455/linux-amd64.tgz).
- [КриптоПро CSP 5.0 ЭЦП](https://cpdn.cryptopro.ru/default.asp?url=/content/cades/plugin-installation-unix.html).
- [Заголовочные файлы КриптоПРО CSP 5.0](https://www.cryptopro.ru/sites/default/files/public/faq/csp/csp5devel.tgz).
- [Патч для поддержки PHP 7 и выше](https://www.cryptopro.ru/sites/default/files/products/cades/php7_support.patch.zip).

## Сборка расширения

Установите зависимости для сборки расширения PHP.

```bash
yum install boost-devel php-devel lsb gcc-c++
```

Установите КриптоПРО CSP.

```bash
cd ~
tar zxf linux-amd64.tgz
cd linux-amd64
./install.sh
```

Убедитесь, что в ОС установлены необходимые пакеты.

```text
cprocsp-curl-64
cprocsp-pki-cades-64
cprocsp-pki-phpcades-64
lsb-cprocsp-base
lsb-cprocsp-ca-certs
lsb-cprocsp-capilite-64
lsb-cprocsp-devel
lsb-cprocsp-kc1-64
lsb-cprocsp-rdr-64
```

Установите КриптоПРО ЭЦП CSP.

```bash
cd ~
tar xzf cades_linux_amd64.tar.gz
cd cades_linux_amd64

yum -y install  cprocsp-pki-2.0.0-amd64-cades.rpm \
                cprocsp-pki-2.0.0-amd64-phpcades.rpm \
                lsb-cprocsp-devel-5.0.11455-5.noarch.rpm
```

Установите заголовочные файлы для КриптоПРО.

```bash
cd ~
tar xzf csp5devel.tgz
cd csp5devel

yum -y install lsb-cprocsp-devel-5.0.11863-5.noarch.rpm
```

Подключите репозиторий REMI и установите нужную версию PHP.

```bash
yum -y install https://rpms.remirepo.net/enterprise/remi-release-7.rpm
yum-config-manager --enable remi-php72
yum -y install php
```

Загрузите исходные коды PHP для действующей версии.

```bash
cd ~
export PHP_VERSION=$(php -r "echo phpversion();")
wget https://www.php.net/distributions/php-${PHP_VERSION}.tar.gz -O php.tar.gz
tar xzf php.tar.gz
mv php-${PHP_VERSION} php
```

Сконфигурируйте окружение для сборки расширения.

```bash
cd php
./configure
```

Укажите путь до исходных файлов PHP в манифесте сборки.

```bash
vi /opt/cprocsp/src/phpcades/Makefile.unix
# * PHPDIR=/root/php
```

Примените патч к PHP Cades для поддержки PHP 7.

```bash
cp ~/php7_support.patch /opt/cprocsp/src/phpcades/
cd /opt/cprocsp/src/phpcades/
patch -p0 < ./php7_support.patch
```

Соберите расширение.

```bash
cd /opt/cprocsp/src/phpcades
eval `/opt/cprocsp/src/doxygen/CSP/../setenv.sh --64`
make -f Makefile.unix
```

Скопируйте разделяемую библиотеку в директорию с расширениями и добавьте его в список загрузки.

```
# php -i | grep extension_dir
cp /opt/cprocsp/src/phpcades/libphpcades.so /usr/lib64/php/modules/phpcades.so

#   + extension=phpcades.so
vi /etc/php.ini
```

Готово. Проверьте, что расширение загружено.

```bash
php --re php_CPCSP
```

Используйте исходный код для проверки.

```php
<?php
if (extension_loaded('php_CPCSP')) {
    echo "php_CPCSP is loaded";
} else {
    echo "php_CPCSP is unavailable";
}
?>
```

# Установка сертификата в криптоконтейнер

Подключите профиль для расширения `PATH` (`/etc/profile.d/cryptopro.sh`).

```bash
#!/usr/bin/env bash

export PATH=$PATH:/opt/cprocsp/bin/amd64/:/opt/cprocsp/sbin/amd64/
```

```bash
vi /etc/profile.d/cryptopro.sh
chmod +x /etc/profile.d/cryptopro.sh
```

Инициализируйте `PATH`.

```bash
source /etc/profile.d/cryptopro.sh
```

Определите имя криптоконтейнера (например, `c0197fed.000`) и установите его в рабочую директорию под именем пользователя веб-сервера (`nobody`).

```bash
sudo chown -R nobody:nobody /var/opt/cprocsp/key/nobody/c0197fed.000
sudo chmod 700 /var/opt/cprocsp/key/john/c0197fed.000
sudo chmod -R 600 /var/opt/cprocsp/key/john/c0197fed.000/*.key
```

Проверьте видимость контейнера.
```bash
sudo -E -u nobody csptest -keyset -enum_cont -verifycontext -fqcn
```

Установите сертификат в криптоконтейнер.
```bash
sudo -E -u nobody certmgr -inst -store uMy -file /home/nobody/certificate.cer -cont '\\.\HDIMAGE\c0197fed.000'
```

Проверьте, что сертификат позволяет подписывать документы.
```bash
sudo -E -u nobody certmgr --list
Certmgr 1.1 (c) "Crypto-Pro",  2007-2019.
program for managing certificates, CRLs and stores

=============================================================================
1-------
[...]
Signature Algorithm : ГОСТ Р 34.11-2012/34.10-2012 256 бит
PublicKey Algorithm : ГОСТ Р 34.10-2012 (512 bits)
[...]
PrivateKey Link     : Yes
Container           : HDIMAGE\\c0197fed.000\3D0E
[...]
Extended Key Usage  : 1.2.643.2.2.34.25
                      1.2.643.2.2.34.26
                      1.2.643.2.2.34.6
                      1.3.6.1.5.5.7.3.2
                      1.3.6.1.5.5.7.3.4
=============================================================================

[ErrorCode: 0x00000000]

```

Готово. Для проверки подписи используйте команду.

```bash
sudo -u nobody cryptcp -signf -dn E=signer@example.tld document.pdf
cat document.pdf.sgn
```