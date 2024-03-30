FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json gsap-bonus.tgz ./
RUN npm ci
COPY . .
RUN npm run build

RUN npm prune --production

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package*.json gsap-bonus.tgz ./
COPY static/stylesheets build/client/stylesheets

EXPOSE 3000

ENV NODE_ENV=production

CMD [ "node", "build" ]
