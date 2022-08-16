FROM node:14-alpine
WORKDIR /manager-web
COPY /package.json /manager-web/
RUN npm i pnpm -g && pnpm i
COPY / /manager-web
RUN pnpm run build

FROM nginx:alpine
RUN mkdir /manager-web
COPY --from=0 /manager-web/dist /manager-web
COPY /ci/conf/nginx.conf /etc/nginx/nginx.conf