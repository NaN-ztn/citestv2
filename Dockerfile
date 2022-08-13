FROM node:14-alpine
COPY ./ /app
WORKDIR /app
RUN yarn i && yarn build

FROM nginx:alpine
RUN mkdir /app
COPY --from=0 /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf