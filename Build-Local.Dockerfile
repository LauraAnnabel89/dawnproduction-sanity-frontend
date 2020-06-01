FROM node:8.15.0

COPY ./ /app

EXPOSE 3000

WORKDIR /app

RUN yarn install

RUN yarn build

ENV NODE_ENV development

CMD [ "yarn", "dev" ]
