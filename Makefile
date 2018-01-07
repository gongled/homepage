########################################################################################

DESTDIR = _site
ENV = production
TRANSPORT = ssh
.PHONY = all clean build check install

########################################################################################

all: clean build

build: clean
	bundle exec jekyll build

check:
	bundle exec htmlproofer --disable-external _site/

play:
	bundle exec jekyll serve --drafts --watch

deploy: build check
	ansible-playbook deploy.yml -i environments/$(ENV) --extra-vars="env=$(ENV)" -c $(TRANSPORT) 

deps:
	gem install bundler
	bundle install

clean:
	rm -rf _site/
