# Wolfville Student Rentals

A rental and roommate-matching site for students at Acadia University in Wolfville,
Nova Scotia. Students (and local landlords) can sign up, browse rental listings,
post their own listings, and connect on a roommate/sublet board.

Not affiliated with or endorsed by Acadia University.

## Features

- **Rental listings** — post, browse, search, and filter rentals by price, bedrooms,
  property type, neighborhood, and lease length (school year, summer sublet,
  12-month, month-to-month).
- **Roommate & sublet board** — post that you have a room to offer or that you're
  looking for one.
- **Accounts** — email/password sign up and login, with sessions stored in a signed,
  HTTP-only cookie.
- **Dashboard** — manage your own listings and roommate posts, and see the listings
  you've saved.
- **Favorites** — save listings you're interested in.
- **Contact by email** — logged-in users can email a poster directly; contact info
  is hidden from logged-out visitors and from the listing itself.
- **Ratings & public profiles** — after dealing with someone, rate them 1-5 stars
  with an optional comment. Average ratings show on listings, roommate posts, and
  each user's public profile page.

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router, TypeScript, Turbopack)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Prisma ORM 7](https://www.prisma.io/) with SQLite (file-based, zero external
  services required for local dev)
- [jose](https://github.com/panva/jose) for signed session cookies, `bcryptjs` for
  password hashing
- [Zod](https://zod.dev/) for form validation

## Getting started

### 1. Install dependencies

```bash
npm install
```

This also runs `prisma generate` automatically (via `postinstall`).

### 2. Configure environment variables

```bash
cp .env.example .env
```

Then replace `SESSION_SECRET` with your own random value:

```bash
openssl rand -base64 32
```

### 3. Set up the database

```bash
npm run db:migrate
```

This creates a local SQLite database at `./dev.db` and applies the schema.

### 4. (Optional) Seed demo data

```bash
npm run db:seed
```

Adds a few sample listings and roommate posts, plus three demo accounts
(`maya@example.com`, `jordan@example.com`, `priya@example.com`, password
`password123`).

### 5. Run the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Useful scripts

| Command              | Description                                  |
| --------------------- | --------------------------------------------- |
| `npm run dev`          | Start the dev server                          |
| `npm run build`        | Production build (also type-checks)           |
| `npm run start`        | Run the production build                      |
| `npm run lint`         | Lint the codebase                             |
| `npm run db:migrate`   | Create/apply a Prisma migration               |
| `npm run db:seed`      | Seed demo data                                |
| `npm run db:studio`    | Open Prisma Studio (visual database browser)  |
| `npm run db:reset`     | Reset the database (drops all data)           |

## Project structure

```
src/
  app/            Routes (App Router): home, listings, roommates, dashboard, auth
  components/     Shared UI components (forms, cards, nav)
  lib/
    actions/      Server Actions (create/update/delete for listings & roommate posts, auth)
    db.ts         Prisma Client singleton
    session.ts    Signed session cookie helpers (jose)
    dal.ts        Data access layer / auth checks (verifySession, getCurrentUser)
    validation.ts Zod schemas + shared option lists
  proxy.ts        Optimistic auth redirects for protected/auth-only routes
prisma/
  schema.prisma   Data model
  seed.ts         Demo data
```

## Notes on the current data model

- Listings and roommate posts are simple, single-table models (SQLite has no
  native enum/array support, so option fields are validated strings via Zod).
- Listing photos are added as pasted image URLs rather than file uploads, to
  avoid needing an object-storage service for a first version.
- The database is SQLite for zero-setup local development. Swapping to Postgres
  later mainly means changing the Prisma datasource provider, connection string,
  and driver adapter.
