FROM node:14-alpine
COPY ../ /manager-web
WORKDIR /manager-web
RUN yarn install && yarn build

FROM nginx:alpine
RUN mkdir /manager-web
COPY --from=0 /manager-web/dist /manager-web
COPY nginx.conf /etc/nginx/nginx.conf