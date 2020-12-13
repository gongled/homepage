FROM debian:latest as builder

WORKDIR "/app"

RUN apt update && \
    apt install -y hugo

EXPOSE 1313
