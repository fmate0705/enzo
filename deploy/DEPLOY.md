# Deploying enzo-di-napoli

This project is generated to deploy on the **Klivo Docker hosting platform**
(Traefik reverse proxy, one container per site). No CI is required — the platform
builds and runs the repository's `docker-compose.yml` on deploy.

## What CEF generated for deployment

| File                 | Purpose                                                                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Dockerfile`         | Multi-stage Next.js **standalone** build; listens on port 3000, runs as the unprivileged `node` user.                                                        |
| `docker-compose.yml` | The platform-contract compose: container `hosting_enzo-di-napoli_web`, network `client_enzo-di-napoli_net`, `env_file: .env`, capped logs, no Docker labels. |
| `compose.local.yml`  | **Local only, never deployed.** Publishes a host port so the site is reachable without Traefik. Opt-in via `-f`; see "Local check" below.                    |
| `.dockerignore`      | Keeps `.env`, `.git`, `node_modules`, and `.next` out of the build context.                                                                                  |

`next.config.mjs` sets `output: 'standalone'`, which the Dockerfile relies on.

## Security posture

The platform validates `docker-compose.yml` against an **allowlist** of compose
keys and rejects the whole deploy if it finds anything outside it. Confirmed by
rejection, it refuses:

- `security_opt` — including `no-new-privileges:true`
- `cap_add` — including a single capability

It does **not** object to `cap_drop`. It reports every violation it finds in one
pass, and `cap_drop: ALL` was present in a rejected file without being listed.

So the hardening lives in the image rather than the compose file:

- **Not root.** The image drops to the `node` account (uid 1000). `/data` and
  `/app/.next/cache` are created in the image owned by that user — that is what
  lets an unprivileged process write to the mounted volume, and lets next/image
  cache its optimised output instead of re-encoding on every request.
- **Port 3000, not 80.** This is a consequence of the two rules above, not a
  preference. Binding below 1024 is privileged, so a non-root process on port 80
  needs `NET_BIND_SERVICE` handed back — which the validator forbids. An
  unprivileged port needs no capability at all, so `cap_drop: ALL` can stand on
  its own and the container still starts.
- **All capabilities dropped**, and none added back. Nothing in the runtime
  needs one.
- **No published ports, no Docker socket, no privileged mode.** Traefik reaches
  the container over `client_enzo-di-napoli_net`; nothing is bound on the host.

> If a future validator rejects `cap_drop` as well, delete those two lines. The
> container still runs unprivileged on an unprivileged port — nothing depends on
> them.

> **Never add a `docker-compose.override.yml`.** Compose merges that filename
> **automatically, with no flag**, so a file meant for a laptop takes effect on
> the server merely by being copied there — which is how a published host port
> ends up sitting on the public internet beside Traefik instead of behind it.
> A `.gitignore` entry does not protect against this: this project is not a git
> repository, and a file copy does not consult git in any case. The local
> overlay is deliberately named `compose.local.yml` so it does nothing unless
> passed with `-f`.

## Deploy steps

1. **Create the client/site in the panel** with the slug **`enzo-di-napoli`** (Clients →
   - New Client → set the domain; template _None_ for a repo deploy). The
     container name and network above must match this slug — regenerate with
     `cef generate --client-slug <your-slug>` if it differs.
2. **Container port** must be set to **3000**, matching the Dockerfile's
   `EXPOSE 3000`.

   > This is **not** the platform default of 80, and it has to be changed by
   > hand. See "Security posture" above for why the container cannot listen on 80. Traefik routes to whatever the panel tells it: leave this at 80 and the
   > compose will pass validation, the container will start healthily, and the
   > domain will answer **502** — because Traefik is talking to a port nothing
   > is listening on.

3. **Environment**: set runtime variables under **Sites → site → Environment**.
   The panel writes `.env`, which the compose loads via `env_file`. Secrets are
   never baked into the image. Required:

   | Variable               | Value                                                            |
   | ---------------------- | ---------------------------------------------------------------- |
   | `NEXT_PUBLIC_SITE_URL` | The site's public URL, e.g. `https://enzodinapoli.hu`            |
   | `CONTENT_DATA_DIR`     | Pinned to `/data` in `docker-compose.yml`; no panel entry needed |
   | `ADMIN_USERNAME`       | The admin login name                                             |
   | `ADMIN_PASSWORD_HASH`  | From `pnpm run admin:credentials "<passphrase>"`                 |
   | `AUTH_SECRET`          | From the same command                                            |

   Generate the last two locally and paste the output:

   ```bash
   pnpm run admin:credentials "a long passphrase"
   ```

   The plaintext password is never stored anywhere. Rotating `AUTH_SECRET`
   signs every open admin session out immediately.

   > The hash uses `:` as its separator, not the conventional `$`. Next runs
   > dotenv-expand over `.env`, and a `$` in the value is read as variable
   > interpolation — `$1` and `$8` would vanish and the correct password would
   > then be rejected with no error anywhere. Do not "tidy" the separator.

4. **The content volume is not optional.** `docker-compose.yml` mounts a named
   volume `enzo_content` at `/data`. Everything the admin edits — the menu, the
   contact details, the company data, the legal texts — is a single JSON file
   there. Without the volume, every edit is lost when the container is replaced
   and the site silently reverts to the values baked into the build.

   Check it after the first deploy:

   ```bash
   docker volume ls | grep enzo_content
   docker exec hosting_enzo-di-napoli_web ls -l /data
   ```

   Back it up like any other data:

   ```bash
   docker run --rm -v enzo_content:/data -v "$PWD:/backup" alpine \
     tar czf /backup/enzo-content-$(date +%F).tar.gz -C /data .
   ```

5. **Point the code at the platform**: set the client's GitHub repo + branch and
   **Deploy now**, or push to the configured branch to auto-deploy (webhook).
6. The platform validates the compose (rejecting privileged mode, the Docker
   socket, or foreign networks), builds the image, starts `hosting_enzo-di-napoli_web` on
   `client_enzo-di-napoli_net`, and Traefik routes the domain to it — issuing a Let's Encrypt
   certificate on first request in production.

## Local check (optional)

The compose file alone only `expose`s the container port, so on a laptop — where
there is no Traefik — nothing is reachable until a port is published.
`compose.local.yml` does that, and has to be named on the command line:

```bash
docker compose -f docker-compose.yml -f compose.local.yml up -d --build
```

Then open http://localhost:8080. The network is created by the platform, so on a
laptop it has to exist first:

```bash
docker network create client_enzo-di-napoli_net
```

To check the exact compose the server will act on — no local overlay, no
published ports — render it without the `-f` overlay:

```bash
docker compose -f docker-compose.yml config
```
