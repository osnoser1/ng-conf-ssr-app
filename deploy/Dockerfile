FROM nginx:1.17.10-alpine

COPY deploy/nginx/default.conf /etc/nginx/conf.d/default.conf
ADD dist/ng-conf-ssr-app /var/www/ng-conf-ssr-app

EXPOSE 5000
