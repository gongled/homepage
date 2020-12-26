# О проекте

Личный сайт и блог на статическом генераторе [Hugo](https://gohugo.io).

## Требования

- [Ansible](https://ansible.com)
- [Docker](https://docker.com)
- [Docker Compose](https://docs.docker.com/compose/)

## Перед началом

```
git clone https://github.com/gongled/gon.gl.git
cd gon.gl/
make release
```

## Работа

Запустите hugo для работы над проектом.

```
make start
```

Откройте в вашем браузере URL (`http://0.0.0.0:1313`) для просмотра.

## Сборка

Используйте цель `build` для сборки статических файлов.

```
make build
```

## Публикация

Запустите команду ниже для доставки сайта на веб-сервер.

```
make ENV=production release
```

## Лицензия

MIT
