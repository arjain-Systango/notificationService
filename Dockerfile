FROM node:18.16.0-alpine AS base

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install && npm cache clean --force

RUN npm install pm2 -g

COPY . .

FROM base as production

WORKDIR /app

RUN npm run build

EXPOSE 4006