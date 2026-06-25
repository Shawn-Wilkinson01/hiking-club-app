# The Hiking Club

A community web application for outdoor enthusiasts — tracking trails, planning group hikes, and celebrating shared adventures.

## Tech stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, TanStack Query, wouter
- **Backend**: Node.js, Express 5, pino logger
- **Database**: PostgreSQL via Drizzle ORM
- **Auth**: JWT (jsonwebtoken) + bcryptjs
- **Language**: TypeScript throughout

## Requirements

- Node.js 20+
- Docker (for PostgreSQL)

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/Shawn-Wilkinson01/hiking-club-app.git
cd hiking-club-app
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

### 3. Start PostgreSQL with Docker

```bash
docker run -d --name hiking-pg \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=hiking_club \
  postgres:15-alpine
```

### 4. Set up the database

```bash
npm run db:push
npm run db:seed
```

### 5. Run the app

```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

Login with: `admin` / `admin123`

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start both servers in development mode |
| `npm run build` | Build client + server for production |
| `npm start` | Run the production build |
| `npm run db:push` | Push schema changes to the database |
| `npm run db:seed` | Seed the database with sample data |
| `npm run typecheck` | Type-check server and client |

## Ports

| Service | Port |
|---|---|
| Frontend (Vite) | 5173 |
| API Server (Express) | 3001 |
| PostgreSQL | 5432 |

## Project structure

```
├── server/             Express API server
│   ├── index.ts        Entry point
│   ├── app.ts          Express app setup
│   ├── db/             Drizzle ORM + schema
│   ├── lib/            Auth, logger, validation
│   └── routes/         API route handlers
├── client/             React frontend
│   ├── index.html      Vite entry
│   └── src/
│       ├── api/        API client (hooks + fetch)
│       ├── components/ UI components (shadcn/ui)
│       ├── context/    Auth context (JWT)
│       ├── pages/      Page components
│       └── hooks/      Custom hooks
├── scripts/            Utility scripts
│   └── seed.ts         Database seeder
├── vite.config.ts      Vite config (proxies /api to :3001)
├── drizzle.config.ts   Drizzle Kit config
└── esbuild.server.mjs  Server bundler
```

## API endpoints

| Method | Path | Description |
|---|---|---|
| POST | /api/auth/login | Login (returns JWT) |
| GET | /api/auth/me | Current user (requires auth) |
| GET | /api/healthz | Health check |
| GET | /api/dashboard/summary | Dashboard stats |
| GET/POST | /api/trails | List / create trails |
| GET/PATCH/DELETE | /api/trails/:id | Trail operations |
| GET/POST | /api/events | List / create events |
| GET/PATCH/DELETE | /api/events/:id | Event operations |
| GET/POST | /api/members | List / create members |
| GET | /api/members/:id | Get member |
| GET/POST | /api/announcements | List / create announcements |
| DELETE | /api/announcements/:id | Delete announcement |
