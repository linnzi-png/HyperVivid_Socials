# HyperVivid Socials

Plan, create, schedule and publish social content for solo creators, on web and mobile.

## Layout

| Path | What it is |
| --- | --- |
| `apps/web` | Next.js 16 web app (App Router), deployed on Vercel |
| `apps/mobile` | Expo SDK 58 app for iOS and Android |
| `packages/core` | Shared types, validation and business rules (zod) |
| `packages/ui` | Shared design tokens |
| `packages/publishers` | One adapter per social network behind a shared interface |
| `supabase` | Database migrations, config and the RLS test suite |
| `docs` | Decisions and spikes |

## Getting started

Needs Node 22 and pnpm 10.

```sh
pnpm install
```

```sh
pnpm turbo run lint typecheck test build
```

Copy `.env.example` to `apps/web/.env.local` and `apps/mobile/.env` and fill in the Supabase URL and publishable key.

## Database

Migrations live in `supabase/migrations`. Every table has row-level security, and `supabase/tests/rls.test.ts` proves one creator can never read or change another's data.

With Docker and the Supabase CLI:

```sh
supabase db start
```

```sh
pnpm db:test
```

Without Docker, against an empty plain Postgres database (the tests apply a small stand-in for Supabase's auth schema first):

```sh
DB_TEST_BOOTSTRAP=1 DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/hv_test pnpm db:test
```

## Data model (foundation)

- `profiles`: one per user, created at sign-up.
- `workspaces`: every user gets a personal creator workspace at sign-up. A creator workspace has two seats: the owner and one editor.
- `workspace_members`: owner or editor. Invitations will be a server-side flow; clients can only read memberships, leave, or (as owner) remove an editor.
- `brands`: the brands or channels inside a workspace. Owners and editors create and edit them; only the owner deletes.

Deleting an account deletes the workspaces that account owns.
