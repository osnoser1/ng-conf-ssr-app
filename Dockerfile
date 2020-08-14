FROM node:12.18.3-alpine3.12

WORKDIR /app

COPY . ./

EXPOSE 4000

CMD node dist/ng-conf-ssr-app/server
