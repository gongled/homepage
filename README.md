<p align="center"><a href="#requirements">Requirements</a> • <a href="#quick-start">Quick start</a> • <a href="#playground">Playground</a> • <a href="#deployment">Deployment</a> • <a href="#license">License</a></p>

# About

Homepage with pretty minimal design which based on [Hugo](https://gohugo.io).

## Requirements

- [Ansible](https://ansible.com)
- [Docker](https://docker.com)
- [Docker Compose](https://docs.docker.com/compose/)

## Quick start

If you're new to Hugo, please read the [documentation](https://gohugo.io).

```
$ git clone https://github.com/gongled/homepage.git
$ cd homepage/
$ make release
```

## Playground

Start the Hugo Server to run the website.

```
$ make start
```

You can navigate to `0.0.0.0:1313` in your browser to see the site.

## Build

Use `build` target to build static assets.

```
$ make build
```

## Deployment

Run this command to deploy website on your VPS:

```
make ENV=production release
```

## License

MIT
