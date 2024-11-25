FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN corepack enable
RUN corepack prepare yarn@4.5.2 --activate

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]
