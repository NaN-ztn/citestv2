FROM node:14-alpine
COPY / /manager-web
WORKDIR /manager-web
RUN npm i pnpm -g && pnpm i && pnpm run build

FROM nginx:alpine
RUN mkdir /manager-web
COPY --from=0 /manager-web/dist /manager-web
COPY /ci/conf/nginx.conf /etc/nginx/nginx.conf