---
description: Regenerate types/importmap and create+run a local Payload migration after a schema change
---

This runs `pnpm run schema:update`, which chains: `generate:types` (Cloudflare env types + Payload
types), `generate:importmap`, `payload migrate:create`, `payload migrate` (against the **local** D1
via Wrangler/Miniflare), then `tsc --noEmit`. Use this after editing any collection, global, or
field config in `src/admin/collections/` or `src/admin/fields/`.

Steps:

1. Run `git status` first so you know what's already staged/modified — `migrate:create` will add a
   new migration file pair (`<timestamp>.ts` + `<timestamp>.json`) under `migrations/`, and you
   should be able to tell the new files from anything else in flight.
2. Run:

   ```bash
   pnpm run schema:update
   ```

3. If `tsc --noEmit` (the last step) fails, fix the type errors it surfaces — don't consider the
   schema change done until it passes clean.
4. Read the newly generated migration file(s) under `migrations/` and sanity-check them against the
   config change you made (e.g. confirm a column rename didn't get modeled as an unrelated
   add+drop). These files are auto-generated but are the source of truth for the DB diff — they get
   committed, so they're worth a quick read, not a blind pass-through.
5. Do **not** hand-edit `src/payload-types.ts`, `cloudflare-env.d.ts`, `tsconfig.tsbuildinfo`, or the
   `migrations/*.json` snapshot files directly — a project hook already blocks direct edits to these;
   re-run this command instead if something looks wrong.

Report what changed: which collections/fields prompted the update, and a summary of the generated
migration.
