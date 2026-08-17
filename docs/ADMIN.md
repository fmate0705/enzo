# The admin panel

`/admin` — an authenticated editor for the menu, the contact details, the
company data and the legal texts.

---

## First-time setup

```bash
pnpm run admin:credentials "a long passphrase you will remember"
```

Paste the three lines it prints into `.env` (local) or the hosting panel's
Environment section (production), then restart. Nothing is written to disk by
the script and the plaintext password is never stored anywhere.

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=scrypt:65536:8:1:…
AUTH_SECRET=…
```

Rotating `AUTH_SECRET` signs every open session out immediately — that is the
way to revoke access.

> The hash uses `:` as its separator, not `$`. Next expands `$…` in `.env`, so a
> `$` in the value silently corrupts the hash and the correct password is then
> rejected with no error. Do not change it back.

---

## What can be edited

| Page              | What it changes                                                                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Étlap**         | Every dish: name, category, description, price, "-tól" flag, photo, URL slug, popular and home-page-featured flags. Add and delete items. |
| **Elérhetőség**   | Address, coordinates, phone, opening hours, delivery note, services, and the Foodora / Facebook / Instagram / Turul links.                |
| **Céges adatok**  | The eleven company identity fields the legal pages need.                                                                                  |
| **Jogi szövegek** | Title, lede, date, full body and draft flag for all four legal documents.                                                                 |

Saving rebuilds every affected public page immediately — the menu, the dish
pages, the home page, the sitemap and the structured data.

### Photos

The admin picks from photographs already in the project; there is no upload.
That removes an entire class of risk (file-type spoofing, size exhaustion, path
traversal, a writable image directory) in exchange for a developer adding new
photos to `public/images/etelek/`. For a menu that changes a few times a year,
that is the right trade. A dish with no photo renders as a typographic card
rather than a broken image.

### Legal text

The body is Markdown, in a deliberately small subset:

```
## Heading            ### Sub-heading
- bullet              1. numbered
**bold**              `code`
[label](/path)        [label](https://example.com)
{{company.taxNumber}}
```

**HTML is not supported and never will be.** This text renders on public pages,
so it is treated as untrusted: anything that is not one of the constructs above
becomes literal text. Pasting a `<script>` tag puts the characters on the page
and nothing else.

`{{token}}` references pull from the Céges adatok and Elérhetőség pages, so the
tax number is entered once and appears in every document that cites it. A token
whose field is still empty renders as a visible yellow "missing" marker — never
as a blank, and never as an invented value.

Available tokens:

```
{{restaurant.name}}   {{contact.address}}   {{contact.phone}}
{{company.legalName}} {{company.seat}}      {{company.registrationNumber}}
{{company.taxNumber}} {{company.registeringCourt}} {{company.representative}}
{{company.email}}     {{company.hostingProvider}}  {{company.hostingLogRetention}}
{{company.conciliationBoard}}
```

The **draft** switch only controls the warning banner on the page. It is not
legal approval — leave it on until a qualified Hungarian legal professional has
reviewed the text.

---

## Where the data lives

One JSON file, `content.json`, in the directory named by `CONTENT_DATA_DIR`
(`/data` in Docker, `./data` locally).

**In production this must be a mounted volume.** `docker-compose.yml` mounts
`enzo_content:/data` for exactly this reason — without it, every edit is lost
when the container is replaced and the site silently reverts to the values baked
into the build. See `deploy/DEPLOY.md` for the backup command.

Writes are atomic: the file is written to a temporary name and renamed into
place, so a crash mid-save cannot destroy the previous version.

If the file is missing or unreadable, the site falls back to the reviewed
defaults in `content/*.ts` and logs the problem. It never renders blank.

---

## Security summary

- Password hashed with scrypt (N=2^16), verified in constant time.
- Session is a short-lived JWT in an httpOnly, SameSite=Strict, Secure cookie —
  unreadable to scripts, not sent cross-site.
- Every mutation re-checks the session server-side. Middleware only guards
  navigation.
- Login is rate limited and gives the same message for a wrong username as for a
  wrong password, so the account name cannot be probed.
- `/admin` runs under a nonce-based CSP, `no-store`, and `noindex`.
- Everything written is re-validated before it is stored and again before it is
  rendered: prices are clamped, image paths must be inside the project's own
  image directories, links must be http(s), and the `tel:` href is derived from
  the phone number rather than accepted from input.

If you lose the password, generate new credentials and restart — there is no
recovery flow and no password reset by design, because there is no mail sender
and no second factor to protect one.
