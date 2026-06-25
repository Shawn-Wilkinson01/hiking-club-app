# The Hiking Club

A community web application for outdoor enthusiasts — tracking trails, planning group hikes, and celebrating shared adventures.

## Tech stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, TanStack Query, wouter
- **Backend**: Node.js, Express 5, pino logger
- **Database**: PostgreSQL via Drizzle ORM
- **Language**: TypeScript throughout

## Requirements

- Node.js 20+
- npm 10+ (or pnpm / yarn)
- PostgreSQL 15+

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set `DATABASE_URL` to your PostgreSQL connection string.

### 3. Create the database

```bash
createdb hiking_club
```

### 4. Push the schema

```bash
npm run db:push
```

### 5. Seed sample data (optional)

```bash
npm run db:seed
```

## Running

### Development

Starts the Express API server on port 5000 and the Vite dev server on port 5173 with hot reload.

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Production build

```bash
npm run build
```

This builds the React app into `dist/public/` and bundles the server into `dist/index.mjs`.

### Production start

```bash
npm start
```

The server listens on `PORT` (default 5000) and serves the built client from `dist/public/`.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start both servers in development mode |
| `npm run build` | Build client + server for production |
| `npm start` | Run the production build |
| `npm run db:push` | Push schema changes to the database |
| `npm run db:seed` | Seed the database with sample data |
| `npm run typecheck` | Type-check server and client |

## Project structure

```
├── server/             Express API server
│   ├── index.ts        Entry point
│   ├── app.ts          Express app setup
│   ├── db/             Drizzle ORM + schema
│   ├── lib/            Logger, Zod validation schemas
│   └── routes/         API route handlers
├── client/             React frontend
│   ├── index.html      Vite entry
│   └── src/
│       ├── api/        API client (hooks + fetch)
│       ├── components/ UI components (shadcn/ui)
│       ├── pages/      Page components
│       └── hooks/      Custom hooks
├── scripts/            Utility scripts
│   └── seed.ts         Database seeder
├── vite.config.ts      Vite config (proxies /api to :5000)
├── drizzle.config.ts   Drizzle Kit config
└── esbuild.server.mjs  Server bundler
```

## API endpoints

| Method | Path | Description |
|---|---|---|
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
