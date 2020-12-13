########################################################################################

DESTDIR = _site
ENV = production
TRANSPORT = ssh
.PHONY = all prep build check pack publish test release clean start stop

########################################################################################

all: prep build check pack publish test release clean

prep:
	true

build:
	docker-compose run --rm -u $(shell id -u):$(shell id -g) app hugo

check:
	true

pack:
	true

publish:
	true

test:
	true

release:
	ansible-playbook deploy.yml -i environments/$(ENV) \
		--extra-vars="env=$(ENV)" \
		-c $(TRANSPORT) 

clean:
	rm -rf _site/ deploy.retry

########################################################################################

start: stop
	docker-compose up -d

stop:
	docker-compose stop
	docker-compose rm -f
