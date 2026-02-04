### QuickChat - Fullstack Real-Time Messaging App

A modern messaging application built with **Next.js 15**, **NestJS 10**, and **PostgreSQL**. Features real-time communication via Socket.io, Google OAuth integration, and AI-powered chat capabilities.

---

### 🐳 Quick Start with Docker (Recommended)

The easiest way to get the backend and database running is using Docker Compose. This setup handles the PostgreSQL database, Prisma migrations, and the NestJS server automatically.

### 1. Backend & Database Setup
Navigate to the backend directory:
```bash
cd backend
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` root:
```bash
DATABASE_URL="postgresql://postgres:postgres@db:5432/chat_db"
JWT_SECRET="your_jwt_secret"
GOOGLE_CLIENT_ID="your_google_client_id"
GROQ_API_KEY="your_groq_api_key"
```

### 3. Launch with Docker
Run the following command to build and start the infrastructure:
```bash
docker-compose up --build
```
*The API will be available at: http://localhost:3001*

---

### 💻 Frontend Setup

The frontend runs locally to allow for fast development and hot-reloading.

### 1. Install Dependencies
Navigate to the frontend directory and install packages:
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `frontend/` root:
```bash
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_jwt_secret"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

### 3. Run Development Server
```bash
npm run dev
```
*The App will be available at: http://localhost:3000*

---

### 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS v4
- **Auth**: NextAuth.js
- **Real-time**: Socket.io-client
- **Notifications**: React Hot Toast

### Backend
- **Framework**: NestJS 10
- **ORM**: Prisma
- **Database**: PostgreSQL (via Docker)
- **Security**: Passport.js, JWT, BcryptJS
- **AI Integration**: OpenAI SDK (via Groq Cloud)
- **WebSockets**: Socket.io

---

### ✨ Key Features

- **Real-time Messaging**: Instant message delivery and typing indicators.
- **Dockerized Infrastructure**: One-command setup for API and Database.
- **Secure Auth**: Credentials-based login and Google OAuth integration.
- **Protected Routes**: Middleware and Backend Guards for session validation.
- **AI Assistance**: Integrated Groq AI for smart responses.
- **Modern UI**: Fully responsive design with Dark Mode support.

---

### 📜 Useful Scripts

### Backend (via Docker)
```bash
docker-compose stop
docker-compose down -v
```

### Frontend
```bash
npm run build 
npm run lint 
```