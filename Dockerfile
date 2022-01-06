FROM node:14.18

WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get install build-essential librdkafka-dev -y