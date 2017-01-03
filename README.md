# About

Homepage with pretty minimal design which based on [Jekyll](http://jekyllrb.com).

## Quick start

If you're new to Jekyll, please read the [documentation](http://jekyllrb.com).

```
$ git clone https://github.com/gongled/homepage.git
$ cd homepage
$ [sudo] make deps
$ make
```

## Usage

Start the Jekyll Server to run the website.

```
$ make play
```

You can navigate to `localhost:4000` in your browser to see the site.

## Installation

Run this command to deploy website on your VPS:

```
make install DESTDIR=example.com:/var/www/html
```

## License

MIT
