---
description: Walk through UHTFC's actual release process (git/PR + Cloudflare build+promote, not a CLI deploy)
---

**This team does not deploy from a developer workstation with `pnpm deploy`.** That script (and
`pnpm run deploy:app`) builds and deploys the worker directly and is deliberately blocked in this
project's settings — do not run it, and do not suggest it as a shortcut. The real release flow is
git-driven, with Cloudflare building server-side and a human promoting the build:

1. **Local sanity build** — run `pnpm run build` to confirm the branch builds cleanly before
   pushing anything.
2. **Commit** — commit the changes with a proper message (ask the user for confirmation per normal
   git-safety rules; never skip this with `--no-verify`).
3. **Push the branch** — `git push`. This triggers a Cloudflare server-side build of the branch.
   This is a shared/visible action — confirm with the user before pushing.
4. **Wait for the branch build to pass on Cloudflare.** You cannot check Cloudflare build status
   yourself (no Cloudflare API access configured) — ask the user to confirm the branch build passed
   in the Cloudflare dashboard before continuing.
5. **Open a PR to `main`** (once the branch build is green) — use `gh pr create`.
6. **Merge the PR** once there are no conflicts and the user is ready (this triggers a Cloudflare
   build of `main`). Confirm with the user before merging — don't merge unprompted.
7. **Wait for the `main` build to pass, then the user promotes it** in the Cloudflare dashboard
   ("Promote" action). This is a manual portal step you cannot perform — ask the user to confirm
   the build passed and was promoted before moving on to migrations.
8. **Run any pending migration against production** — only after promotion is confirmed. On the
   local dev machine: `git checkout main && git pull`, then run the production migration step:

   ```bash
   pnpm run deploy:database
   ```

   (equivalent to `NODE_ENV=production PAYLOAD_SECRET=ignore pnpm payload migrate && wrangler d1
   execute D1 --command "PRAGMA optimize" --env=$CLOUDFLARE_ENV --remote` — see `VC Notes.txt`).
   This is gated to prompt for confirmation in settings; confirm with the user it's expected before
   running it, since it writes to production D1.

Do not skip steps or collapse this into a single command — each numbered step above has a human
checkpoint (dashboard build status, promote action, or an explicit go-ahead) that you cannot verify
or perform yourself except where noted.
