---
description: Deploy UHTFC to Cloudflare (runs remote D1 migrations, builds the worker, deploys to production)
---

This runs `pnpm deploy`, which in order: validates required env vars (`validate-env.js`), runs
Payload migrations **against the remote production D1 database**, then builds and deploys the
OpenNext worker to Cloudflare. This is a production-affecting, hard-to-reverse action.

Before running anything:

1. Run `git status` and `git log --oneline -5`. Confirm the working tree is clean and you're on the
   branch/commit the user actually intends to ship — if not, stop and ask.
2. Check whether `$CLOUDFLARE_ENV` is set (both `deploy:database` and `deploy:app` depend on it via
   `--env=$CLOUDFLARE_ENV`). If it's unset, ask the user which environment they mean before doing
   anything else — don't guess production vs. staging.
3. Summarize to the user exactly what's about to happen (remote D1 migration + production worker
   deploy) and get explicit confirmation before proceeding. Do not treat a general "yes, deploy" from
   earlier in the conversation as covering this specific run — confirm now.

Only after confirmation, run:

```bash
pnpm deploy
```

If it fails partway (e.g. migration succeeds but worker build/deploy fails), report exactly which
step failed and the error — don't retry blindly, since `deploy:database` having already run against
remote D1 changes the state for any retry.

After a successful deploy, report the outcome back to the user (don't just say "done" — mention
whether migrations ran, and the deploy target).
