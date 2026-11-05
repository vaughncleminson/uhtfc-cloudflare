---
description: Overwrite local D1 state with a fresh export of the remote production database
argument-hint: [--db <name>] [--out-dir <dir>]
---

This runs `scripts/restore-prod-to-local-d1.sh` (via `pnpm run db:restore:prod-to-local`), which:

1. Exports the remote prod D1 database (`d1-uhtfc-cloudflare` by default) to a timestamped SQL file
   under `database-exports/`.
2. **Deletes the local Wrangler/Miniflare D1 sqlite files** (`.wrangler/state/v3/d1/...`).
3. Runs `git clean -fd src/migrations/` to wipe untracked local migration files.
4. Recreates the local D1 sqlite file and imports the prod dump into it.
5. Runs verification queries (row count on `admins`, lists migration tables).

It does **not** touch the remote/production database — it only reads from it. But it is destructive
to local state: any local-only D1 data or untracked migration files under `src/migrations/` will be
lost.

Before running:

1. Run `git status` — if there's anything under `src/migrations/` or local DB state that looks like
   uncommitted work the user cares about, point it out and confirm they still want to proceed.
2. Confirm with the user that they intend to overwrite local D1 state (the script itself also prompts
   interactively unless `--yes` is passed — don't pass `--yes` on their behalf unless they've already
   explicitly said to skip the prompt).

Then run:

```bash
pnpm run db:restore:prod-to-local $ARGUMENTS
```

Report the export file path it printed and the verification query results (admin row count, migration
tables found) so the user can confirm the restore looks sane.
