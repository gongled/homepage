########################################################################################

DESTDIR = _site
ENV = production
TRANSPORT = ssh
.PHONY = all clean release update build check deploy deps

########################################################################################

all: build

build: clean
	bundle exec jekyll build

release:
	docker-compose run app

update:
	docker-compose build

check:
	bundle exec htmlproofer --disable-external _site/

play:
	bundle exec jekyll serve --drafts --watch

deploy:
	ansible-playbook deploy.yml -i environments/$(ENV) --extra-vars="env=$(ENV)" -c $(TRANSPORT) 

deps:
	gem install bundler
	bundle install

clean:
	rm -rf _site/ deploy.retry
