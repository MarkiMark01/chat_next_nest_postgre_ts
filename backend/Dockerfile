
FROM node:20-bullseye-slim AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm install

FROM deps AS dev
WORKDIR /app

EXPOSE 3001

CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npm run start:dev"]




