### QuickChat - Fullstack Real-Time Messaging App
A modern messaging application built with Next.js 16, NestJS 9, and PostgreSQL. Features real-time communication via Socket.io, Google OAuth integration, and AI-powered chat capabilities.

### Quick Start
1. Prerequisites
Node.js: v20 or higher

Package Manager: npm

Database: PostgreSQL instance

2. Backend Setup
Navigate to the backend directory: 

```bash 
cd backend npm install 
```

### Install dependencies: 

```bash 
npm install
```
Configure environment variables: Create a .env file in the backend root and fill in your credentials:

```bash 
DATABASE_URL="postgresql://user:password@db:5432/chat_db"
JWT_SECRET="your_jwt_secret"
GOOGLE_CLIENT_ID="your_google_client_id"
GROQ_API_KEY="your_groq_api_key"
```
Initialize database (Prisma): 
```bash 
npx prisma generate 

npx prisma db push
```
Run the server: npm run start:dev Server will be available at: http://localhost:3001

3. Frontend Setup
Navigate to the frontend directory: 
```bash 
cd frontend 
```

### Install dependencies: 

```bash 
npm install 
```

### Configure environment variables: Create a .env file in the frontend root:

```bash 
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="same_secret_as_backend"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```
Run the development server: npm run dev App will be available at: http://localhost:3000

### Tech Stack

### Frontend
- Framework: Next.js 16 (App Router)

- Library: React 19

- Styling: Tailwind CSS v4

- Auth: NextAuth.js

- Real-time: Socket.io-client

- Notifications: React Hot Toast

### Backend
- Framework: NestJS 9

- ORM: Prisma

- Database: PostgreSQL

- Security: Passport.js, JWT, BcryptJS

- AI Integration: OpenAI SDK (via Groq)

- WebSockets: Socket.io

### Key Features
- Real-time Messaging: Instant message delivery and typing indicators.

- Secure Auth: Credentials-based login and Google One Tap authentication.

- Protected Routes: Middleware and Backend Guards for session validation.

- AI Assistance: Integrated Groq AI for smart responses.

- Modern UI: Fully responsive design with Dark Mode support.

### Scripts

```bash
npm run dev / npm run start:dev - Start development environment.

npm run build - Build for production.

npm run lint - Run ESLint for code quality.
```
