# enzo-di-napoli

Project instructions for Claude Code. This is a **marketing** built with
**nextjs** (typescript), scaffolded by the Claude Enterprise Framework (CEF).

## What this project is

Enzo di Napoli autentikus napolyi pizzeria es olasz etterem Hatvanban. AVPN minositesu MP Forni kemenceben sult napolyi pizza, friss olasz alapanyagok, hagyomanyos receptek, salatak es desszertek. Etlap, galeria, tortenet, megkozelites es Foodora hazhozszallitas.

## How this project is organized

- `.cef/` — CEF configuration and memory. Start here.
  - `manifest.yaml` — enabled engines, skills, MCP servers, and project metadata.
  - `memory.md` — persistent project memory. **Read it before making decisions; update it after significant work.**
  - `project.json` / `runtime.json` — machine-readable project and runtime configuration.
- `app/` — routes and pages. `components/` — reusable UI. `features/` — feature modules.
- `lib/` — utilities and clients. `hooks/` — React hooks. `types/` — shared types.
- `content/` — content and copy (including legal pages under `content/legal/`). `docs/` — documentation.
- `tests/` — tests. `docker/` — container support. `public/` — static assets.

## Stack

- Framework: **nextjs** · Language: **typescript** · Package manager: **pnpm**
- Styling: **tailwind** · UI: **shadcn** · Animation: **framer-motion**
- Data: **none** · Auth: **none** · CMS: **none**
- Deployment: **vercel** · Docker: enabled (port 3000)

## Enabled CEF engines

- accessibility
- ai-seo
- architecture
- components
- core
- deployment
- design
- docker
- experience
- legal
- motion
- performance
- platform
- security
- seo
- validation

## Conventions

- Follow the enabled engines' standards. Accessibility (WCAG 2.2 AA), security, performance,
  and legal are **floors** — never trade them away.
- Prefer server-first rendering; keep client JavaScript minimal and justified.
- Every page ships its empty, loading, and error states. No placeholder content.
- Legal documents in this project are **drafts** and must be reviewed by a qualified legal
  professional before publication.

## Getting started

```bash
pnpm install
pnpm run dev
```

## Quality gate

`pnpm run verify` runs every automated gate — types, lint, formatting, and
tests — in the order CEF reviews them. Run it before reporting work complete; a failing gate
means the work is not done.
