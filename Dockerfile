FROM node:20-bullseye as base

RUN mkdir /app
WORKDIR /app

COPY package.json package.json
RUN npm install

FROM base as builder
WORKDIR /app
COPY . .
COPY --from=base /app/node_modules ./app/node_modules
RUN npx prisma generate

FROM builder as runner
WORKDIR /app
COPY . .
COPY --from=builder /app/node_modules ./app/node_modules

EXPOSE 4000
CMD [ "npm", "run", "start" ]
