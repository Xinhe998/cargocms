FROM mhart/alpine-node:5.12.0

RUN apk add --update git
RUN apk add --update build-base libffi-dev ruby ruby-dev \
    && gem install sass compass --no-ri --no-rdoc \
    && apk del build-base libffi-dev ruby-dev \
    && rm -rf /var/cache/apk/*

RUN apk add --no-cache make gcc g++ python && rm -rf /var/cache/apk/*
