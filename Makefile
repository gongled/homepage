########################################################################################

DESTDIR = _site
ENV = production
TRANSPORT = ssh
.PHONY = all clean release test build check deploy deps

########################################################################################

all: release

run: stop
	docker-compose up -d --build

stop:
	docker-compose stop
	docker-compose rm -f

test:
	docker-compose run --rm -u $(shell id -u) --service-ports app make check

release:
	docker-compose run --rm -u $(shell id -u) --service-ports app make build

########################################################################################

deploy:
	ansible-playbook deploy.yml -i environments/$(ENV) --extra-vars="env=$(ENV)" -c $(TRANSPORT) 

########################################################################################

build: clean
	bundle exec jekyll build

check:
	true

play:
	bundle exec jekyll serve --drafts --watch --host=0.0.0.0

deps:
	gem install bundler
	bundle install

clean:
	rm -rf _site/ deploy.retry
