# Content inventory

Every factual claim the site makes, with its source and its status.

Three statuses are used:

| Status                        | Meaning                                                                                                     |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **VERIFIED**                  | Confirmed from a source the business controls, or from two independent sources that agree. Safe to publish. |
| **SUPPLIED**                  | Provided with the project brief or the project assets. Believed correct, but not independently confirmed.   |
| **NEEDS CLIENT CONFIRMATION** | Cannot be resolved from public sources, or sources disagree. Must be signed off before the site goes live.  |

All of it lives in `content/restaurant.ts` and `content/menu.ts`. No component
hard-codes any of it, so correcting a value here corrects it everywhere —
pages, metadata, JSON-LD, footer and map links.

---

## 1. The address — a resolved conflict

The brief flagged this, and the conflict is real. It is resolved in favour of
**Kossuth tér 16., 3000 Hatvan**.

| Source                               | Address             | Controlled by                          |
| ------------------------------------ | ------------------- | -------------------------------------- |
| Facebook page ("📍Kossuth tér 16")   | Kossuth tér 16      | **the restaurant**                     |
| Foodora listing JSON-LD              | Kossuth tér 16      | **the restaurant** (vendor-maintained) |
| Foodora map pin `47.66689, 19.68236` | Kossuth tér         | **the restaurant**                     |
| Turul Gasztronómia profile           | Horváth Mihály út 7 | third-party directory                  |
| nyitva.hu / Cylex                    | Horváth Mihály út 7 | third-party directory                  |

**Why Kossuth tér 16 wins.** Both sources the business itself maintains agree,
and the coordinates the restaurant publishes for its own delivery pickup fall on
Kossuth tér. Horváth Mihály út 7 geocodes to longitude 19.6892 — about 700 m
east of that pin. The two directories are also internally inconsistent with each
other elsewhere: the same Cylex dataset lists a _different_ pizzeria at Kossuth
tér 16, which is what a stale listing of a previous tenant looks like.

Status: **VERIFIED**, with one caveat — a directory correction request should be
sent to Turul and Cylex, since a wrong address on high-ranking directories will
cost walk-in traffic regardless of what this site says.

`tests/content.test.ts` asserts that "Horváth Mihály" appears nowhere in the data
layer, so the losing address cannot creep back in.

---

## 2. Facts published on the site

| Fact               | Value                                                    | Source                                                  | Status            |
| ------------------ | -------------------------------------------------------- | ------------------------------------------------------- | ----------------- |
| Name               | Enzo di Napoli                                           | signage, all sources                                    | VERIFIED          |
| Descriptor         | Pizza Tradizionale                                       | signage / logo                                          | VERIFIED          |
| Address            | Kossuth tér 16., 3000 Hatvan                             | see above                                               | VERIFIED          |
| Coordinates        | 47.6667312, 19.6824158                                   | OpenStreetMap node for Kossuth tér 16                   | VERIFIED          |
| Phone              | +36 20 932 3270                                          | Facebook, Foodora, nyitva.hu, Cylex — all agree         | VERIFIED          |
| Oven               | MP Forni                                                 | legible on the oven in the restaurant's own photographs | VERIFIED          |
| AVPN certification | "Nápolyi pizza eredeti AVPN minősítésű Forni kemencéből" | the restaurant's own Facebook page, verbatim            | VERIFIED          |
| Opened             | 2024-10-22                                               | the restaurant's own Facebook announcement              | VERIFIED          |
| Services           | dine-in, takeaway, outdoor seating, delivery             | Facebook service tags                                   | VERIFIED          |
| Instagram handle   | `enzo_di_napoli_hatvan`                                  | published on the Facebook page                          | VERIFIED          |
| Awards             | Turul 2025 + 2026, arany fokozat and Projekt díjazottja  | Turul profile                                           | VERIFIED          |
| Turul score        | 9,7 / 10 from 413 ratings                                | Turul profile                                           | VERIFIED          |
| Foodora score      | 4,9 / 5 from 335 ratings                                 | Foodora listing JSON-LD                                 | VERIFIED          |
| Facebook score     | 100% recommend, 54 recommendations                       | Facebook page                                           | VERIFIED          |
| Full menu          | 29 items, 5 categories, with prices                      | live Foodora listing                                    | VERIFIED          |
| Food photography   | 28 photographs                                           | the restaurant's own, from its Foodora listing          | VERIFIED — see §5 |

### Opening hours — NEEDS CLIENT CONFIRMATION

The site publishes **Tuesday–Sunday 11:00–22:00, Monday closed**, taken from the
restaurant's own Facebook page ("Nyitva: Kedd - Vasárnap, 11-22 h").

Sources disagree on the closing time:

| Source                          | Hours                   |
| ------------------------------- | ----------------------- |
| Facebook (the restaurant's own) | Tue–Sun 11:00–**22:00** |
| nyitva.hu (updated 2026-05-22)  | Tue–Sun 11:00–**21:00** |
| Foodora delivery window         | Tue–Sun 11:00–**20:30** |

Delivery closing before the dining room is normal and is shown separately on the
site. The 21:00 / 22:00 difference is not resolvable from public sources.

**Action:** confirm the real closing time and edit `restaurant.hours` in
`content/restaurant.ts`. The week table, the footer, the summary line and the
`openingHoursSpecification` structured data all read from that one array.

---

## 3. Legal data — NEEDS CLIENT CONFIRMATION

Company identity cannot be guessed. A plausible-looking registration number on a
published impresszum is a legal exposure, not a placeholder, so these are marked
visibly on the page instead.

Run `pnpm run check:pending` for the live list. At the time of writing, 15
values across three pages:

- Registered company name, seat, company registration number, tax number,
  registering court, authorised representative, official e-mail address
- Hosting provider name, seat, contact, and log retention period
- The territorially competent conciliation board (békéltető testület)

`pnpm run check:pending:ci` exits non-zero while any remain — wire it into the
release gate.

The legal texts themselves are **drafts** and are labelled as such on the page.
They must be reviewed by a qualified Hungarian legal professional before launch.

---

## 4. What is deliberately absent

**Guest review quotes.** The brief described Google reviews (friendly service,
dog-friendly, large portions, a reviewer with professional pizza experience
calling it genuinely Neapolitan). Those quotes were not in the supplied project
assets, and no verifiable, attributable review text could be obtained. Rather
than paraphrase remembered reviews into quotation marks — which produces a
fabricated testimonial — the social proof section carries the three real
aggregate scores instead, each attributed and linked to its platform.

**To add real quotes later:** capture the exact text, the reviewer's display
name and the platform, add a `reviews` array to `content/restaurant.ts`, and
render it in `components/home/recognition.tsx`. Quote verbatim, keep it short,
and attribute the platform.

**`aggregateRating` structured data.** The three scores are shown to visitors but
are _not_ marked up as this site's own rating. Google's structured data policy
requires that a marked-up rating be collected by the site itself; marking up
third-party scores invites a manual action. This is asserted in the tests.

**Allergen data.** Not published in any source. Allergen declaration is regulated
(EU 1169/2011) and inferring "contains gluten" from the word _tészta_ would be a
guess presented as a health statement. The menu shows a notice directing guests
to phone instead.

**Two downloaded photographs.** A pistachio dessert and a chocolate dessert were
present on the Foodora CDN but are not on the current menu. They were deleted
rather than given invented names.

**One supplied interior photograph.** `bent2.webp` is lit by a large green neon
sign that fights the palette. It remains in the source assets but is not used in
the curated gallery.

---

## 5. Image rights — NEEDS CLIENT CONFIRMATION

The 28 food photographs were downloaded from the restaurant's own Foodora
listing, as the brief directed, and are stored in `public/images/etelek/`. They
are the restaurant's product photography, served from Delivery Hero's CDN.

**Confirm before launch** that the restaurant owns or is licensed to use these
images outside the Foodora platform. If the photographer's licence is limited to
Foodora, either extend it or reshoot. This is a normal question and a cheap one
to ask; it is only expensive if nobody asks it.

The eight restaurant/oven photographs came with the project assets and are
assumed to be the client's own.

---

## 6. How to update the menu

1. Open the live listing: <https://www.foodora.hu/restaurant/tclu/enzo-di-napoli>
2. Edit `content/menu.ts` — names, descriptions and prices are transcribed
   verbatim; category order follows Foodora.
3. For a new dish, add the photograph to `public/images/etelek/<slug>.jpg`
   (1200px wide). If there is no photograph, set `image: null` — the card
   renders as a typographic tile rather than showing a stand-in.
4. Run `pnpm test`. The suite checks slug uniqueness, category coverage, price
   validity and that every referenced image file exists.

The menu page, the detail pages, the sitemap, the home page selection and the
`Menu` structured data all derive from that one file.
