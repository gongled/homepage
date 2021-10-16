########################################################################################

ENV = production
TRANSPORT = ssh
.PHONY = all deps build play check pack test release clean start stop

########################################################################################

all: deps build check pack test release clean

deps:
	npm audit fix
	npm ci

build:
	hugo --gc --minify --cleanDestinationDir

play:
	hugo server --bind="0.0.0.0"

check:
	true

pack:
	true

test:
	true

release:
	ansible-playbook deploy.yml -i environments/$(ENV) \
		--extra-vars="env=$(ENV)" \
		-c $(TRANSPORT) 

clean:
	rm -rf public/

########################################################################################

start: stop
	docker-compose up -d

stop:
	docker-compose stop
	docker-compose rm -f
