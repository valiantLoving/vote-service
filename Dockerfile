FROM node:16

RUN mkdir -p /srv/app
WORKDIR /srv/app

COPY . /srv/app/
RUN npm config set registry=https://registry.npm.taobao.org
RUN npm install

ENV APP_DIR /srv/app
ENV TZ=Asia/Shanghai

RUN npm i -g @nestjs/cli

ENTRYPOINT [ "npm", "run", "start" ]

