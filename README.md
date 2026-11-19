# QuickChat - Fullstack Real-Time Messaging App

A modern messaging application built with **Next.js 15**, **NestJS 9** and **PostgreSQL**. Features real-time communication via Socket.io, Google OAuth integration and AI-powered chat (Groq).

---

## 🐳 Quick Start with Docker (Recommended)

Docker Compose runs the PostgreSQL database and the NestJS server. Prisma migrations are applied automatically on every start.

**Requirements:** Docker, Node.js 20+ (for the frontend).

### 1. Backend & Database

```bash
cd backend
```

Create a `.env` file in the `backend/` root:

```bash
JWT_SECRET="your_long_random_secret"
GOOGLE_CLIENT_ID="your_google_client_id"
GROQ_API_KEY="your_groq_api_key"
# optional, default is openai/gpt-oss-120b
# GROQ_MODEL="openai/gpt-oss-120b"
```

> `DATABASE_URL` is set in `docker-compose.yml`, so it is not needed in `.env`.
> Generate a secret with: `openssl rand -base64 32`

Start everything:

```bash
docker-compose up --build
```

*The API will be available at: http://localhost:3001*

### 2. Frontend

The frontend runs locally for fast development and hot-reloading.

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` root:

```bash
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="another_random_secret"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

> `NEXTAUTH_SECRET` (frontend) and `JWT_SECRET` (backend) are independent. Use different values.

Run the dev server:

```bash
npm run dev
```

*The app will be available at: http://localhost:3000*

---

## 🔐 How Authentication Works

1. The user logs in on the frontend (email/password or Google).
2. NextAuth sends the credentials to the backend (`/auth/login` or `/auth/google-login`).
3. The backend checks them and returns `{ user, accessToken }`. The `accessToken` is a JWT valid for **1 day**.
4. NextAuth stores the token in the session. The frontend sends it as `Authorization: Bearer <token>` with every request and as `auth.token` when connecting to Socket.io.
5. The backend guard checks the token and takes the user id from it, so users can only access their own chats.

When the token expires, the backend returns `401` and the app signs the user out.

---

## 📡 API

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | public | Create an account |
| POST | `/auth/login` | public | Login, returns `{ user, accessToken }` |
| POST | `/auth/google-login` | public | Login with Google ID token |
| GET | `/chats` | 🔒 | Your chats with messages |
| POST | `/chats` | 🔒 | Create a chat |
| POST | `/chats/:id/messages` | 🔒 | Send a message (AI answers in the background) |
| PATCH | `/chats/:id` | 🔒 | Rename a chat |
| DELETE | `/chats/:id` | 🔒 | Delete a chat |

**Socket.io events (server → client):** `receiveMessage`, `typingStatus`, `aiError`.
Each user is connected to a private room, so events are delivered only to the chat owner.

---

## 📁 Project Structure

```
backend/
├── prisma/schema.prisma
├── scripts/                 # one-off maintenance scripts
├── docker-compose.yml
├── Dockerfile
└── src/
    ├── main.ts              # ValidationPipe, CORS
    ├── cors.ts              # allowed frontend origins
    ├── app.module.ts
    ├── prisma.service.ts
    ├── auth/                # register, login, Google login, JWT guard
    ├── users/               # database access for users
    └── chat/                # REST controller, AI service, Socket.io gateway

frontend/
└── src/
    ├── app/
    │   ├── page.tsx                      # login / register
    │   ├── home/page.tsx                 # chat page
    │   ├── profile/page.tsx
    │   └── api/auth/[...nextauth]/route.ts
    ├── components/           # auth, chat, modal
    └── types/
```

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS v4
- **Auth**: NextAuth.js
- **Real-time**: Socket.io-client
- **Notifications**: React Hot Toast

### Backend
- **Framework**: NestJS 9
- **ORM**: Prisma 4
- **Database**: PostgreSQL 16 (via Docker)
- **Auth**: JWT (`@nestjs/jwt`), BcryptJS, Google OAuth (`google-auth-library`)
- **Validation**: class-validator
- **AI Integration**: OpenAI SDK (via Groq Cloud)
- **WebSockets**: Socket.io

---

## ✨ Key Features

- **Real-time Messaging**: instant message delivery and typing indicators.
- **Dockerized Infrastructure**: one-command setup for API and database.
- **Secure Auth**: hashed passwords, JWT, Google OAuth.
- **Protected Data**: backend guard + per-user ownership checks; sockets are authenticated with the same token.
- **AI Assistance**: Groq-powered responses with the last 12 messages as context.
- **Modern UI**: fully responsive design with Dark Mode support.

---

## 📜 Useful Commands

### Backend (via Docker)

```bash
docker-compose up --build        # start (rebuild after installing packages)
docker-compose logs -f backend   # backend logs
docker-compose stop              # stop containers
docker-compose down -v           # stop AND delete the database data
```

### Frontend

```bash
npm run dev
npm run build
npm run lint
```

---

## ⚠️ Notes

- **CORS:** the frontend must run on an origin listed in `backend/src/cors.ts` (by default `localhost:3000` and `localhost:3002`). Add yours there if you use another port.
- **Changed `JWT_SECRET`?** Old tokens become invalid, so sign out and sign in again.
- **Upgrading an old database:** earlier versions created Google accounts with the password `GOOGLE_AUTH`. Run this once to replace it with a random one:
  ```bash
  docker-compose exec backend npx ts-node scripts/fix-google-users.ts
  ```