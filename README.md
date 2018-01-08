<p align="center"><a href="#requirements">Requirements</a> • <a href="#quick-start">Quick start</a> • <a href="#playground">Playground</a> • <a href="#deployment">Deployment</a> • <a href="#travis-ci-status">Travis CI status</a> • <a href="#license">License</a></p>

# About

Homepage with pretty minimal design which based on [Jekyll](http://jekyllrb.com).

## Requirements

- Ansible
- Docker
- Docker Compose

## Quick start

If you're new to Jekyll, please read the [documentation](http://jekyllrb.com).

```
$ git clone https://github.com/gongled/homepage.git
$ cd homepage/
$ make release
```

## Playground

Start the Jekyll Server to run the website.

```
$ docker-compose up
```

You can navigate to `0.0.0.0:4000` in your browser to see the site.

## Deployment

Run this command to deploy website on your VPS:

```
make ENV=production deploy
```

## Travis CI status

| Branch | Status |
|------------|--------|
| `master` | [![Build Status](https://travis-ci.org/gongled/homepage.svg?branch=master)](https://travis-ci.org/gongled/homepage) |
| `develop` | [![Build Status](https://travis-ci.org/gongled/homepage.svg?branch=develop)](https://travis-ci.org/gongled/homepage) |

## License

MIT
