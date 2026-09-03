# KLS Environmental

Service-management and compliance platform for KLS Environmental LLC: public website, customer portal, and internal admin.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- PostgreSQL + Prisma
- Auth.js (NextAuth v5) with credentials, structured for additional providers

## Local setup

1. Copy environment variables:

```bash
cp .env.example .env
```

2. Start Postgres (Docker or Homebrew):

```bash
docker compose up -d
```

If Docker is not installed, Homebrew Postgres 16 works with the same `.env`:

```bash
brew services start postgresql@16
# Create user/database once: kls / kls / database kls
```

3. Generate the client, run migrations, and seed:

```bash
npm run db:generate
npx prisma migrate dev --name init
npm run db:seed
```

4. Start the app:

```bash
npm run dev
```

## Seed logins

Password for all seed users: `Password123!`

| Role | Email |
| --- | --- |
| Super admin | `ivan.p@example.net` |
| Admin | `zoe.m@example.net` |
| Technician | `hannah.h@example.com` |
| Customer (Harbor & Oak) | `oscar.d@example.net` |

## Routes

- `/` public website
- `/login` `/register` customer auth
- `/onboarding` first-time customer setup
- `/portal/*` customer application
- `/admin/login` staff login
- `/admin/*` operations console

Update `src/config/site.ts` with the real phone, email, and service area before launch.
