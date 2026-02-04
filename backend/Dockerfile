# ===============================
# Базовий образ Node.js з OpenSSL
# ===============================
FROM node:20-bullseye-slim AS base
WORKDIR /app

# ===============================
# Встановлюємо залежності
# ===============================
FROM base AS deps
COPY package*.json ./
RUN npm install

# ===============================
# Development: код доступний напряму через bind mount
# ===============================
FROM deps AS dev
WORKDIR /app

# Відкриваємо порт NestJS
EXPOSE 3001

# ===============================
# Запуск через NestJS hot reload з Prisma
# ===============================
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npm run start:dev"]




