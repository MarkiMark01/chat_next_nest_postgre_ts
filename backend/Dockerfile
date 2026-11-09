FROM node:20-bookworm-slim AS base
WORKDIR /app
RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

FROM base AS deps
COPY package*.json ./
RUN npm install

FROM deps AS dev
COPY . .
EXPOSE 3001
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npm run start:dev"]