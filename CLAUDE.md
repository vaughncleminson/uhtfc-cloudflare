# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Payload CMS 3.0 site for the Underberg-Himeville Trout Fishing Club, deployed to Cloudflare Workers
via OpenNext, with D1 (SQLite) as the database and R2 for media storage. Next.js 16 app router.

See `AGENTS.md` at the repo root for detailed Payload CMS patterns (access control, hooks,
components, queries, etc.) — read it before making non-trivial Payload changes. Deeper topic
references live in `.cursor/rules/` (security-critical, collections, fields, access-control,
hooks, queries, endpoints, adapters, components, plugin-development, field-type-guards).

## Commands

- `pnpm dev` — run locally (wrangler auto-binds D1/R2 for local dev)
- `pnpm devsafe` — same, but wipes `.next` and `.open-next` first (use after cache weirdness)
- `pnpm build` — Next.js build only (no worker bundling)
- `pnpm build:worker` — full OpenNext Cloudflare worker build
- `pnpm preview` — build the worker and preview it via `opennextjs-cloudflare preview`
- `pnpm lint` — Next.js/ESLint
- `pnpm exec tsc --noEmit` — typecheck (do this after any schema/type change)
- `pnpm test` — runs both integration and e2e suites
- `pnpm test:int` — Vitest integration tests (`tests/int/**/*.int.spec.ts`)
- `pnpm test:int -- tests/int/api.int.spec.ts` — run a single integration test file
- `pnpm test:e2e` — Playwright e2e tests (`tests/e2e/**`); the Playwright config auto-starts
  `pnpm dev` against `http://localhost:3000` if it isn't already running
- `pnpm payload <subcommand>` — Payload CLI wrapper (e.g. `pnpm payload migrate:create`)

### Schema / type changes

After changing any collection, global, or field config:

```bash
pnpm run schema:update
```

This runs, in order: `generate:types` (Cloudflare env types + Payload types), `generate:importmap`,
`payload migrate:create`, `payload migrate`, then `tsc --noEmit`. Don't skip steps individually —
migrations must be created against the updated types, and the import map must be regenerated
whenever admin component paths change.

### Local D1 data

`pnpm run db:restore:prod-to-local` (wraps `scripts/restore-prod-to-local-d1.sh`) exports the
remote prod D1 database and reimports it into the local Wrangler/Miniflare SQLite state. Destructive
to local DB state — confirm with the user before running.

### Deployment — **not** `pnpm deploy`

`pnpm deploy` / `pnpm run deploy:app` exist in `package.json` (leftover from the Cloudflare template)
but this team does **not** deploy from a developer workstation — both are blocked in
`.claude/settings.json`. The actual release process is git-driven, with Cloudflare building
server-side and a human promoting the build in the dashboard:

1. `pnpm run build` locally to confirm a clean build.
2. Commit, then `git push` the branch — this triggers a Cloudflare server-side build of that branch.
3. Once the branch build is green on Cloudflare (checked in the dashboard, not locally), open a PR
   to `main`.
4. Merge the PR — this triggers a Cloudflare build of `main`.
5. Once the `main` build is green, a human marks it **"Promote"** in the Cloudflare dashboard — this
   is what actually ships it to production.
6. Only then, back on `main` locally (`git pull`), run the production migration:
   `pnpm run deploy:database` (`NODE_ENV=production PAYLOAD_SECRET=ignore pnpm payload migrate`
   followed by `wrangler d1 execute D1 --command "PRAGMA optimize" --remote` — see `VC Notes.txt`).

Use `/deploy` (in `.claude/commands/`) to walk through this — it has the checkpoints that need human
confirmation (dashboard build status, the promote step) built in.

## Architecture

### Two separate auth collections

- **`Admins`** (`src/admin/collections/Admins.ts`) — the Payload *admin panel* users
  (`admin.user: Admins.slug` in `payload.config.ts`). Role field: `admin` / `editor` / `viewer`.
  Supports MFA (`mfa.mfaSettings` group, custom field component).
- **`Users`** (`src/admin/collections/Users.ts`) — club members / frontend-facing accounts, a
  *separate* auth collection. Role field (`src/admin/fields/UserRole.ts`): `non-member` / `member`
  / `member-guest` / `admin`, plus a `committeeMember` boolean. These are logged-in frontend users
  (bookings, catch returns, dashboard), not CMS editors — don't conflate the two role systems when
  writing access control.
- Jobs/cron endpoints check `req.user.collection !== 'admins'` to gate admin-only actions — always
  check `.collection`, not just presence of `role`, since both collections can have a `role` field.

### Collections (all in `src/admin/collections/`)

Core domain collections: `Bookings` / `BookingHistory`, `CatchReturns`, `Festivals` /
`FestivalEntries`, `NewMemberships`, `Orders`, `Payments`, `Locations`, `Pages`, `Media`,
`EmailAuditLogs`, `EmailSubscribers`, `PreviousUsers`. Globals: `Settings`, `Navigation`.
`Sections` exists in the collections folder but is **not** registered in `payload.config.ts`
collections array (appears unused/WIP — confirm before building on it).

`Bookings` and `CatchReturns` lock certain fields with `access: { update: () => false }` plus a
`beforeValidate` hook — treat that pattern (immutable-after-create fields) as intentional, not a bug.

### Jobs / scheduled tasks

Payload Jobs are defined in `src/admin/jobs/index.ts` (queue config, custom admin UI for the jobs
collection) and `src/admin/tasks/` (individual `TaskConfig`s, e.g. `emailCatchReturnLinks`).

On Cloudflare, Payload's in-process `autoRun` cron does **not** drive scheduled execution reliably —
`worker.ts` wires the Workers Cron Trigger (`scheduled()` handler, configured in `wrangler.jsonc`
under `triggers.crons`) to POST an internal `/api/internal/run-scheduled-jobs` route, guarded by
`x-cron-secret` and a single-entry `jobsRunning` flag to avoid overlapping invocations hammering D1.
If you change job scheduling, update the cron trigger in `wrangler.jsonc` *and* keep the task's own
expectations in sync — the comment there explains a past incident (1-minute cron caused 1440 D1
write cycles/day and SQLite busy/locked errors).

### Cloudflare bindings & config

- `payload.config.ts` resolves the Cloudflare context (`D1`, `R2`) differently for prod vs.
  dev/CLI (`getCloudflareContextSafe`): prod uses `getCloudflareContext`, dev falls back to
  Wrangler's `getPlatformProxy`.
- `serverURL` is intentionally left unset in development so admin server actions use the incoming
  request's origin (preserves auth cookies for calls like `/api/payload-preferences`) — don't force
  a hardcoded serverURL in dev.
- CORS/CSRF allowed origins are `https://uhtfc.org.za` / `https://www.uhtfc.org.za` in prod, plus
  `localhost:3000` / `127.0.0.1:3000` in dev.
- `wrangler.jsonc` config is authoritative for bindings (`D1`, `R2`), env vars, and the cron
  trigger — `cloudflare-env.d.ts` (generated, do not hand-edit) mirrors it for TypeScript.
- Email is sent via a custom MailerSend adapter (`src/admin/utils/mailerSendAdapter`).
- Import/export of data uses `@payloadcms/plugin-import-export`, currently scoped to the
  `previousUsers` collection.

### Frontend structure

- `src/app/(frontend)/` — public/member-facing Next.js routes (home, `our-water`, dashboard,
  forgot-password, and frontend-facing API routes like `register`, `current-user`, `update-user`,
  `logout`, `festival-entries`).
- `src/app/(payload)/` — Payload admin panel routes plus most authenticated API routes (bookings,
  payments, catch-return, checkout/Yoco payment integration, bulk mail, MFA, GraphQL).
- `src/frontend/` — shared frontend building blocks: `components/` (blocks, dashboard, forms,
  layout, ui), `atoms/` (Jotai state), `schemas/` (zod), `constants/`, `types/`.
- `src/admin/` — everything Payload-config-side: `collections/`, `components/` (custom admin UI,
  e.g. `Dashboard`, `MFA`, `Jobs`, `Map`, `ImportExport`, `BuildInfo`), `fields/`, `blocks/`,
  `jobs/`, `tasks/`, `utils/`, `types/`.
- Payment processing integrates with Yoco (`api/yoco-payment`, `api/checkout`, `api/payment-success`,
  `api/cancel-order`).

### Build env quirks

- `scripts/set-build-env.mjs` writes `.env.build` with the current git branch/SHA (for
  `NEXT_PUBLIC_GIT_BRANCH`/`NEXT_PUBLIC_GIT_SHA`, surfaced via `AdminBuildInfo`); it can't export
  into the parent shell so it writes a file that `next.config.ts` loads instead.
- `scripts/patch-opennext-env-shim.mjs` patches `@opennextjs/cloudflare`'s `env.js` shim in
  `node_modules` to add a default export, needed before `build:worker` runs — don't remove this
  from the `build:worker` script.
- `validate-env.js` is a pre-deploy gate checking required env vars are present; it's invoked by the
  (unused-by-this-team) `pnpm deploy` script — Cloudflare's own server-side build is what actually
  gates the real deploys.

## Testing

- Integration tests (Vitest, jsdom environment) live in `tests/int/*.int.spec.ts`.
- E2E tests (Playwright, Chromium only) live in `tests/e2e/*.e2e.spec.ts` and run against a
  locally-started `pnpm dev` server.

## Claude Code setup

- `.claude/settings.json` allowlists safe, read-only/local commands (lint, typecheck, test, build,
  read-only git, type/importmap generation); gates `db:restore:prod-to-local`, the production
  migration step (`deploy:database`), `wrangler d1 execute ... --remote`, and force-push/reset/clean
  behind confirmation; and outright blocks `pnpm deploy` / `pnpm run deploy:app` since this team
  never deploys from a workstation (see "Deployment" above).
- A `PreToolUse` hook blocks direct Edit/Write to generated files (`src/payload-types.ts`,
  `cloudflare-env.d.ts`, `tsconfig.tsbuildinfo`, `migrations/*.json`) — run `pnpm run schema:update`
  instead.
- Use `/deploy`, `/schema-update`, and `/db-restore-prod-to-local` (in `.claude/commands/`) for those
  respective workflows — they wrap the right confirmation steps.

## Agent skills

### Issue tracker

Issues live in this repo's GitHub Issues (`vaughncleminson/uhtfc-cloudflare`), via the `gh` CLI. See
`docs/agents/issue-tracker.md`.

### Triage labels

Default five canonical roles (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`,
`wontfix`) used as-is. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
