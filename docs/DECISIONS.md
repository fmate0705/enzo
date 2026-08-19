# Decisions

Deviations from CEF defaults and non-obvious choices, with the reasoning that
justifies them. Recorded per Article V.6 and Article VIII of the CEF
Constitution.

---

### 2026-08-15 — Industry classified as Hospitality, not Creative Agency

**Context.** `cef analyze` classified the project as _Creative Agency_ and
planned agency pages (services, work, blog). The classifier scores the project
description plus the project _type_, and the type `marketing` is itself a keyword
in the agency profile, which tied with hospitality; ties break alphabetically and
`agency` sorts first.

**Decision.** Rewrote `metadata.description` in `.cef/manifest.yaml` in English
with explicit hospitality vocabulary (restaurant, pizzeria, cafe, venue). The
classification moved to Hospitality with a score of 10, whose `typicalPages` are
exactly home / about / menu / gallery / contact.

**Alternative rejected.** Overriding the generated page map by hand. The
description is CEF's documented highest-leverage input; fixing the input keeps
`cef blueprint` reproducible instead of making the plan a manual artefact.

---

### 2026-08-15 — Pruned reservations, login and signup from the page plan

**Context.** The hospitality profile's business models include `reservation-based`
and `membership`, so the planner added a reservations page and an authentication
pair, and the feature planner added `authentication` and `ai-features`.

**Decision.** Removed those routes. The site has exactly the five content pages
the brief specifies, plus dynamic dish pages and legal pages.

**Rationale.** The manifest declares `authentication: none`; the restaurant takes
tables by phone and orders through Foodora. A login page for a site with no
accounts is placeholder architecture, which Article IV prohibits. Explicit user
instruction is the highest authority in the precedence order.

---

### 2026-08-15 — Replaced the `luxury` preset's type scale

**Context.** The preset resolves its type scale on the golden ratio. In practice
that produced `--cef-text-xs: 0.382rem` (≈6px) and `--cef-text-7xl: 46.971rem`
(≈751px).

**Decision.** Replaced the scale in `styles/brand.css` with a fluid modular scale
using `clamp()`. The token _names_ and the architecture are untouched, so
Tailwind and every component still consume the design system exactly as before.

**Rationale.** 6px body text fails WCAG 2.2 readability and a 751px heading is
unusable at any viewport. Article II ranks accessibility above visual effect, and
the non-negotiables cannot be waived by a preset.

**Lower bounds were then measured, not guessed.** At a 3rem minimum the hero
headline wrapped to five lines inside a 272px column at 320px; the minimums are
set so each headline holds its intended line count on the narrowest supported
viewport.

---

### 2026-08-15 — Brand tokens override the theme, in a separate file

**Decision.** Brand colour and type tokens live in `styles/brand.css`, imported
after `app/globals.css`, rather than being edited into the generated file.

**Rationale.** `globals.css` is generated and carries a "do not edit by hand"
banner; re-running `cef design tokens` would silently discard brand decisions.
Overriding downstream keeps regeneration safe.

---

### 2026-08-15 — Single colour scheme, no theme script

**Decision.** `data-theme="dark"` is fixed on `<html>`. Deleted
`components/site/theme-script.tsx`.

**Rationale.** The brand has one scheme — a warm near-black ground with brass. A
toggle would offer a light theme that does not exist as a design. Removing the
pre-hydration script removes a render-blocking inline script and a class of
flash-of-wrong-theme bugs. The light-scheme tokens are still redefined to the
dark values so a visitor whose OS asks for light gets the designed surface rather
than unstyled defaults.

---

### 2026-08-15 — No animation library

**Decision.** Motion is CSS transitions and keyframes, driven by
`IntersectionObserver` and by one `requestAnimationFrame` loop for the hero.
`framer-motion` is listed in the manifest but was not installed.

**Rationale.** Principle 18 (minimal dependencies) and Principle 13 (performance
as a budget). The motion this site needs — reveal on enter, a scroll-linked
gradient, a hover mask — is a few lines of CSS. A ~40 kB runtime for that is not
earned, and the brief explicitly rejects "generic Framer Motion demos".

---

### 2026-08-15 — Deleted `app/loading.tsx`

**Context.** Found during browser validation: `<main>` contained only the loading
skeleton and the real page sat inside React's `<div hidden id="S:0">` streaming
buffer, waiting for `requestAnimationFrame` to swap it in.

**Decision.** Deleted the file.

**Rationale.** Every route is fully static — there is nothing to wait for. A
`loading.tsx` wraps a static route in a Suspense boundary that gains nothing and
costs the no-JavaScript rendering: without JS the visitor gets a pulsing skeleton
and the content stays in a `hidden` div. After removal the prerendered HTML
contains the page directly.

---

### 2026-08-15 — Consent has one non-essential category

**Decision.** The consent notice offers _Szükséges_ and _Külső tartalom_ only. No
analytics category.

**Rationale.** Nothing on the site collects analytics today. A toggle that
controls nothing is the visual-only cookie banner the brief prohibits. The one
category is real: the Google Maps embed is not requested at all until it is
granted, and withdrawing consent unmounts the iframe immediately. Accept and
decline are given equal visual weight, since a prominent accept beside a muted
decline is not free consent under GDPR.

---

### 2026-08-15 — No `aggregateRating` structured data

**Decision.** The three real scores (Turul 9,7 · Foodora 4,9 · Facebook 100%) are
displayed and linked, but not emitted as `aggregateRating`.

**Rationale.** Google's structured data policy requires a marked-up rating to be
collected by the site itself. Marking up third-party scores as this site's own is
a manual-action risk for no gain. Asserted in `tests/content.test.ts`.

---

### 2026-08-15 — Build uses Turbopack

**Decision.** `next build --turbopack`.

**Rationale.** The project path contains `!` (`F:\Klivo\! PROJEKTEK\`), which
webpack rejects — `!` is reserved for its loader syntax — so the webpack builder
cannot run from this directory at all. Turbopack has no such restriction and is
the supported builder for Next 15. Renaming the parent directory would also fix
it and is worth doing independently.

---

### 2026-08-15 — `output: 'standalone'` is opt-out-able locally

**Decision.** `next.config.mjs` reads `NEXT_STANDALONE`; only `'0'` disables it.

**Rationale.** The Docker deploy bundle requires a standalone build, and the
Dockerfile never sets the variable, so the deployed image is always standalone.
The final trace step symlinks dependencies, which on Windows needs Developer Mode
or an elevated shell — a local verification build otherwise fails at the last
step with EPERM after every page has already compiled. The escape hatch is for
local builds only.

---

### 2026-08-17 — Images resolve by name, not by extension

**The failure.** Nineteen pizzas rendered nothing. The photographs had been
replaced with cut-out PNGs and the old `.jpg` files deleted; `content/menu.ts`
was updated to match, but `data/content.json` was not — and the store is what
renders. next/image answered 400 for every one of them ("isn't a valid image …
received null"), which shows up in the UI as an empty square and nowhere else.

`tests/assets.test.ts` did not catch it. It validated the seed, which was
correct, and never looked at the store.

**Three fixes, at three depths:**

1. `lib/images.ts` resolves a stored path by basename when the exact file is
   missing, so jpg → png → webp becomes a matter of dropping files in. It warns
   once per path, and returns null rather than a dead path so a genuinely
   missing photo falls back to the designed typographic card.
2. The 1024² source PNGs became WebP — identical alpha, 1.9 MB down to ~240 KB,
   and next/image optimises one in 0.11s instead of 2.5s. Nineteen of those at
   2.5s each was the other half of "sometimes the images do not load": the
   optimiser queue simply did not finish. The PNGs are kept in `assets-source/`,
   outside `public/`.
3. The asset test now checks the store as well as the seed, and the migration
   tests derive the extension instead of hard-coding it — the same brittleness
   that caused the bug had been written into its own test.

---

### 2026-08-16 — The admin panel, and what it changed

**Decision.** Added an authenticated admin at `/admin` that edits the menu, the
contact details and hours, the company identity fields, and the full body of all
four legal documents. Content moved from constants in `content/*.ts` to a JSON
store on a Docker volume; the constants remain as the reviewed seed and fallback.

**Storage: a JSON file, not a database.** One operator editing ~29 dishes and
four documents does not need a service to run, back up and upgrade. Writes are
atomic (temp file + rename), every read and write is re-validated by
`lib/store/validate.ts`, and a corrupt or missing file falls back to the seed
rather than breaking the site.

**Public pages stayed static.** Pages read the store at render and are rebuilt by
`revalidatePath` after a save, so an edit is live immediately without making 43
routes dynamic. Only `/admin` is server-rendered per request.

**Security decisions, in one place:**

- Password: scrypt from the Node standard library (N=2^16, r=8, p=1), so no
  native module in the image. Verified in constant time.
- Session: HS256 JWT via `jose` in an httpOnly, SameSite=Strict, Secure cookie,
  8-hour lifetime. `jose` rather than a hand-rolled HMAC because JWT verification
  is where algorithm-confusion bugs live.
- Every mutating Server Action calls `requireSession()` itself. Middleware
  guards navigation; it is not the boundary, because an action is reachable by
  POST regardless of the page the caller claims to be on.
- Login is rate limited (5 per 15 min per IP, in-process) and returns one
  message for both wrong-user and wrong-password, so the account name cannot be
  enumerated.
- Legal bodies are a constrained Markdown subset parsed to React elements. No
  raw HTML is parsed or emitted anywhere — pasted `<script>` renders as literal
  text. This is what makes it safe to let an editor write copy for public pages.
- `/admin` gets a nonce-based CSP from middleware, plus `no-store` and
  `noindex`. The public site keeps `'unsafe-inline'`; the reasoning in
  `next.config.mjs` was rewritten, since "no forms, no accounts" is no longer
  true of the whole site — but it is still true of every static page.

---

### 2026-08-16 — Password hash separator is `:`, not `$`

**Context.** The first implementation used the conventional PHC encoding
`scrypt$N$r$p$salt$hash`. Login then rejected the correct password with no error
in any log.

**Cause.** Next runs dotenv-expand over `.env`. A `$` in a value is variable
interpolation, so `$1` and `$8` expanded to nothing and the hash the process
received was not the hash that was written.

**Decision.** The separator is `:` — meaningless to dotenv and outside the
base64url alphabet, so still unambiguous. `verifyPassword` still accepts `$` for
any hash generated before the change. A test asserts the encoding contains no
`$`, because this failure is silent and costs an hour to find twice.

---

### 2026-08-16 — Route group `(site)`, and the CEF findings it causes

**Decision.** Public pages moved into `app/(site)/`, which owns the header,
footer and consent notice. `/admin` sits outside it.

**Rationale.** The admin was rendering inside the restaurant's navigation, with
the cookie consent panel in the lower-right corner — exactly where a form's Save
button goes.

**Consequence for `.cef/reports/`: SEO 30/100 and Content 29/100 are false.**
CEF derives routes from directory paths and does not know that a parenthesised
segment is omitted from the URL. It therefore reports "internal link /etlap has
no matching page" and "page declares no canonical URL" for pages that have both.

Verified against the served HTML — all ten public routes return a correct
canonical and meta description:

```
/                          canonical:…/                          desc:yes
/etlap                     canonical:…/etlap                     desc:yes
/etlap/margherita          canonical:…/etlap/margherita          desc:yes
/tortenet                  canonical:…/tortenet                  desc:yes
/galeria                   canonical:…/galeria                   desc:yes
/megkozelites              canonical:…/megkozelites              desc:yes
/impresszum                canonical:…/impresszum                desc:yes
/adatkezelesi-tajekoztato  canonical:…/adatkezelesi-tajekoztato  desc:yes
/cookie-tajekoztato        canonical:…/cookie-tajekoztato        desc:yes
/felhasznalasi-feltetelek  canonical:…/felhasznalasi-feltetelek  desc:yes
```

The "page has no metadata export" finding is the same blind spot: those pages
use `generateMetadata`, which the reviewer does not recognise.

Contorting the app to satisfy a route mapper would be the wrong trade. Read
those two gate scores as unreliable for this project.

---

### 2026-08-15 — Two CEF review findings accepted rather than fixed

Both are recorded waivers, not oversights. Neither is a blocker.

**1. Legal gate: "Required legal page Terms of Service is not present" (major).**

The page exists, at `/felhasznalasi-feltetelek`. CEF's legal reviewer matches
route names against an alias list — `['terms', 'aszf', 'altalanos-szerzodesi']` —
and the Hungarian phrase for terms _of use_ is not in it.

Renaming the route to `/aszf` would clear the gate and would be wrong. An ÁSZF
governs a contract concluded with the consumer; this site concludes none. It
takes no order, no booking and no payment, and every ordering path hands the
guest to foodora under foodora's terms. Publishing an "ÁSZF" would describe a
transaction the site does not perform.

The gate's _purpose_ — that a terms document exists and is linked — is met. The
route name stays honest. Note when reading `.cef/reports/`: Legal scores 70/100
for this reason, not because terms are missing.

**2. SEO gate: "Missing SEO artifact public/schema.json" (minor).**

Declined. `schema.json` is not a web standard and nothing consumes it. The
site's structured data is delivered the way search engines actually read it —
inline `application/ld+json` on every page, generated from `content/*` so it
cannot contradict the visible text. A second static copy would be a duplicate
with its own drift risk and no reader, which Principle 23 (no dead code) and
Article IV (nothing present without a reason) both argue against.

---

### 2026-08-15 — Typographic wordmark instead of the supplied logo bitmap

**Decision.** The header, footer and mobile panel set the wordmark in Bodoni. The
supplied `Enzo Logo.jpg` is kept for the icon and social-card use.

**Rationale.** The supplied logo is a 564px JPEG with its own near-black ground
baked in; over the page it would show a seam, and it softens at small sizes.
Type stays sharp at every size, costs no request, and matches the lettering on
the restaurant's actual signage.

**Sizes are explicit, not `em`-derived.** An em-scaled descriptor is how the
"Pizza Tradizionale" line ended up rendering at 6.5px during validation; the
descriptor now has a 10px floor at every size.
