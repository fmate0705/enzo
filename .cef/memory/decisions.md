# Decisions

> **`cef sync` regenerates this file from the manifest.** The authoritative
> record of why this project is built the way it is lives in
> **`docs/DECISIONS.md`** — read that first. The summary below is a pointer, and
> may be overwritten by the next sync.

## Stack (scaffold)

- **Framework: nextjs** — server-first rendering is the default.
- **Language: typescript** — strict mode on.
- **Package manager: pnpm** — reproducible installs from a committed lockfile.
- **Deployment: Docker** — `output: 'standalone'`; bundle in `deploy/`.
- **Persistence: a JSON content store on a mounted volume** — no database.

## The things a future session must not re-derive

1. **The address is Kossuth tér 16., 3000 Hatvan.** Resolved from the
   restaurant's own Facebook page and Foodora listing against two directories
   that say Horváth Mihály út 7. A test asserts the rejected address appears
   nowhere. Sources: `docs/CONTENT-INVENTORY.md` §1.

2. **`ADMIN_PASSWORD_HASH` uses `:` separators, not `$`.** Next runs
   dotenv-expand over `.env`; a `$` silently eats `$1`/`$8` out of the value and
   the correct password is then rejected with no error anywhere.

3. **The `.cef/reports/` SEO and Content scores are unreliable here.** CEF maps
   routes from directory paths and does not understand the `(site)` route group,
   so it reports missing pages and missing canonicals for pages that have both.
   Verified against served HTML. See `docs/DECISIONS.md`.

4. **The legal page bodies are admin-editable Markdown in the store**, rendered
   through a subset parser that never emits HTML. Do not swap in a rich-text
   editor or a general Markdown library without re-solving stored XSS.

5. **The content volume is mandatory in production.** Without
   `enzo_content:/data`, every admin edit is lost on redeploy.

## Outstanding before launch

Run `pnpm run check:pending`. At time of writing: 10 company fields empty, 4
legal documents still flagged draft, closing time unconfirmed (21:00 vs 22:00),
food photography rights outside Foodora unconfirmed.
