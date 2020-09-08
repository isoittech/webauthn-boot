FROM alpine:3.12.0

RUN apk update \
    && apk --no-cache add openjdk11-jre-headless \
    && apk --no-cache add vim \
    && apk --no-cache add less \
    && apk --no-cache add curl \
    && rm -rf /var/cache/apk/*

