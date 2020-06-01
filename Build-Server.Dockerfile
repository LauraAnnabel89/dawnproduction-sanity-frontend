FROM node:8.15.0

COPY ./ /app

EXPOSE 80

WORKDIR /app

ENV NODE_ENV production

CMD [ "node", "server.js" ]
