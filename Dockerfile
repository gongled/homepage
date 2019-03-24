FROM ruby:2.6.2

COPY Gemfile Gemfile.lock Makefile /app/

WORKDIR "/app"

RUN make deps

EXPOSE 4000

VOLUME ["/app"]
