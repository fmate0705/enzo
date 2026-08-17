# Enzo di Napoli

Website for **Enzo di Napoli**, a Neapolitan pizzeria at Kossuth tér 16., 3000
Hatvan, Hungary. Built with the Claude Enterprise Framework (CEF) on Next.js 15
(App Router), TypeScript and Tailwind.

Hungarian language, single dark theme, fully prerendered.

---

## Running it

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

```bash
pnpm build          # production build
pnpm start          # serve the build
pnpm verify         # typecheck → lint → format:check → test
pnpm check:pending  # list data still owed by the client
```

> **Windows note.** Two environment quirks, both documented in `docs/DECISIONS.md`:
> the build uses Turbopack because the parent path contains `!`, which webpack
> reserves for loader syntax; and `NEXT_STANDALONE=0 pnpm build` skips the
> standalone symlink step, which needs Developer Mode. Neither affects the Docker
> build.

---

## What the site is

Five content pages, plus a page per dish, plus legal.

| Route                                                                                          | Purpose                                                                                         |
| ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `/`                                                                                            | Cinematic oven hero, differentiators, signature pizzas, the oven, awards, location, closing CTA |
| `/etlap`                                                                                       | The full menu — 29 items, 5 categories, sticky category rail, scroll-spy                        |
| `/etlap/[slug]`                                                                                | One page per dish, statically generated                                                         |
| `/tortenet`                                                                                    | The restaurant, the dough, the room, the recognition                                            |
| `/galeria`                                                                                     | Filterable masonry gallery with an accessible lightbox                                          |
| `/megkozelites`                                                                                | Address, hours, phone, consent-gated map, directions                                            |
| `/impresszum`, `/adatkezelesi-tajekoztato`, `/cookie-tajekoztato`, `/felhasznalasi-feltetelek` | Legal                                                                                           |

**The site never takes an order.** Every ordering path links out to foodora.
Tables are taken by phone.

---

## Where the content lives

All restaurant data is in two files. No component hard-codes a fact.

- **`content/restaurant.ts`** — name, address, coordinates, phone, opening
  hours, services, awards, ratings, external links. Change the address here and
  it changes on every page, in the footer, in the metadata, in the JSON-LD and
  in the map links.
- **`content/menu.ts`** — the seed menu; live values come from the store. Every dish: name, category, description, price,
  image, popular and signature flags. The menu page, the dish pages, the home
  page selection, the sitemap and the `Menu` structured data all derive from it.
- **`content/gallery.ts`** — gallery images with intrinsic dimensions.
- **`content/navigation.ts`** — the four nav destinations and the legal shelf.

**Read `docs/CONTENT-INVENTORY.md` before changing any fact.** It records the
source and verification status of every claim the site makes — including the
address conflict between the restaurant's own channels and two directories, and
how it was resolved.

To update the menu, see the last section of that document.

---

## Design system

CEF's token architecture, with brand values overridden in `styles/brand.css`
(imported after the generated `app/globals.css`, so `cef design tokens` can be
re-run without losing them).

- Ground `#1B191A`, accent `#CCBE86`. One scheme; the brand is dark.
- Display: **Bodoni Moda**. Text and UI: **Archivo**. Both self-hosted by
  `next/font`.
- Measured contrast: foreground 14.9:1, accent 9.4:1, muted 6.4:1.
- Motion is CSS only — no animation library. Reveals use `IntersectionObserver`;
  the hero drives everything from one custom property updated in a single
  `requestAnimationFrame` loop. `prefers-reduced-motion` is honoured throughout,
  and below `md` the hero renders composed rather than sequenced.

---

## Consent

`lib/consent.ts` holds the state; `components/site/cookie-consent.tsx` asks.

One non-essential category, because there is exactly one non-essential thing on
the site: the Google Maps embed. Before consent, no request reaches Google at
all — the map's place is taken by a designed panel carrying the address, the
coordinates and a working directions link. Withdrawing consent from the footer
unmounts the iframe immediately.

Accept and decline carry equal visual weight.

---

## Testing

```bash
pnpm test
```

42 tests. They guard facts and boundaries rather than markup: that the address is the resolved
one and the rejected one appears nowhere, that slugs and prices are sound, that
every referenced image file exists on disk, that structured data does not claim
third-party ratings as its own, that the awards match the source, that the store repairs hostile input rather
than publishing it (path traversal, script schemes, control characters, clashing
slugs), that the password hash cannot contain a `# Enzo di Napoli

Website for **Enzo di Napoli**, a Neapolitan pizzeria at Kossuth tér 16., 3000
Hatvan, Hungary. Built with the Claude Enterprise Framework (CEF) on Next.js 15
(App Router), TypeScript and Tailwind.

Hungarian language, single dark theme, fully prerendered.

---

## Running it

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

```bash
pnpm build          # production build
pnpm start          # serve the build
pnpm verify         # typecheck → lint → format:check → test
pnpm check:pending  # list data still owed by the client
```

> **Windows note.** Two environment quirks, both documented in `docs/DECISIONS.md`:
> the build uses Turbopack because the parent path contains `!`, which webpack
> reserves for loader syntax; and `NEXT_STANDALONE=0 pnpm build` skips the
> standalone symlink step, which needs Developer Mode. Neither affects the Docker
> build.

---

## What the site is

Five content pages, plus a page per dish, plus legal.

| Route                                                                                          | Purpose                                                                                         |
| ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `/`                                                                                            | Cinematic oven hero, differentiators, signature pizzas, the oven, awards, location, closing CTA |
| `/etlap`                                                                                       | The full menu — 29 items, 5 categories, sticky category rail, scroll-spy                        |
| `/etlap/[slug]`                                                                                | One page per dish, statically generated                                                         |
| `/tortenet`                                                                                    | The restaurant, the dough, the room, the recognition                                            |
| `/galeria`                                                                                     | Filterable masonry gallery with an accessible lightbox                                          |
| `/megkozelites`                                                                                | Address, hours, phone, consent-gated map, directions                                            |
| `/impresszum`, `/adatkezelesi-tajekoztato`, `/cookie-tajekoztato`, `/felhasznalasi-feltetelek` | Legal                                                                                           |

**The site never takes an order.** Every ordering path links out to foodora.
Tables are taken by phone.

---

## Where the content lives

All restaurant data is in two files. No component hard-codes a fact.

- **`content/restaurant.ts`** — name, address, coordinates, phone, opening
  hours, services, awards, ratings, external links. Change the address here and
  it changes on every page, in the footer, in the metadata, in the JSON-LD and
  in the map links.
- **`content/menu.ts`** — the seed menu; live values come from the store. Every dish: name, category, description, price,
  image, popular and signature flags. The menu page, the dish pages, the home
  page selection, the sitemap and the `Menu` structured data all derive from it.
- **`content/gallery.ts`** — gallery images with intrinsic dimensions.
- **`content/navigation.ts`** — the four nav destinations and the legal shelf.

**Read `docs/CONTENT-INVENTORY.md` before changing any fact.** It records the
source and verification status of every claim the site makes — including the
address conflict between the restaurant's own channels and two directories, and
how it was resolved.

To update the menu, see the last section of that document.

---

## Design system

CEF's token architecture, with brand values overridden in `styles/brand.css`
(imported after the generated `app/globals.css`, so `cef design tokens` can be
re-run without losing them).

- Ground `#1B191A`, accent `#CCBE86`. One scheme; the brand is dark.
- Display: **Bodoni Moda**. Text and UI: **Archivo**. Both self-hosted by
  `next/font`.
- Measured contrast: foreground 14.9:1, accent 9.4:1, muted 6.4:1.
- Motion is CSS only — no animation library. Reveals use `IntersectionObserver`;
  the hero drives everything from one custom property updated in a single
  `requestAnimationFrame` loop. `prefers-reduced-motion` is honoured throughout,
  and below `md` the hero renders composed rather than sequenced.

---

## Consent

`lib/consent.ts` holds the state; `components/site/cookie-consent.tsx` asks.

One non-essential category, because there is exactly one non-essential thing on
the site: the Google Maps embed. Before consent, no request reaches Google at
all — the map's place is taken by a designed panel carrying the address, the
coordinates and a working directions link. Withdrawing consent from the footer
unmounts the iframe immediately.

Accept and decline carry equal visual weight.

---

## Testing

```bash
pnpm test
```

42 tests. They guard facts and boundaries rather than markup: that the address is the resolved
one and the rejected one appears nowhere, that slugs and prices are sound, that
every referenced image file exists on disk, that structured data does not claim
third-party ratings as its own, that dotenv would eat, and
that the admin CSP still allows the one inline script it needs.

---

## The admin panel

`/admin` — an authenticated editor for the menu, the contact details, the
company data and the four legal documents. Saving rebuilds the affected public
pages immediately.

```bash
pnpm run admin:credentials "a long passphrase"   # then paste into .env
```

Full guide, including the Markdown subset and the token system: `docs/ADMIN.md`.

**In production the content volume is mandatory** — `docker-compose.yml` mounts
`enzo_content:/data`. Without it every edit is lost on redeploy.

---

## Before launch

1. `pnpm check:pending` — company data and legal approvals still outstanding.
   Fill them in at **Admin → Céges adatok** and **Admin → Jogi szövegek**.
2. Have a qualified Hungarian legal professional review the four legal
   documents, then clear their "draft" switch.
3. Confirm the closing time — sources disagree between 21:00 and 22:00. See
   `docs/CONTENT-INVENTORY.md` §2.
4. Confirm rights to use the food photography outside foodora
   (`docs/CONTENT-INVENTORY.md` §5).
5. Set `NEXT_PUBLIC_SITE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`,
   `AUTH_SECRET` and `CONTENT_DATA_DIR` in the hosting panel.
6. Verify the `enzo_content` volume is mounted and backed up.
7. Ask Turul Gasztronómia and Cylex to correct the address on their listings.

## Documentation

- `docs/CONTENT-INVENTORY.md` — every fact, its source, its status
- `docs/ADMIN.md` — the admin panel: setup, editing, security
- `docs/DECISIONS.md` — deviations from CEF defaults, with reasoning
- `deploy/DEPLOY.md` — the Docker deployment runbook
- `.cef/reports/` — the twelve quality gates and the readiness score
