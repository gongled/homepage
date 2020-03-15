FROM ruby:2.6.2
WORKDIR "/app"

COPY Gemfile Gemfile.lock Makefile /app/
RUN gem install bundler && \
    bundle install

EXPOSE 4000
