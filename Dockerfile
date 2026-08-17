# syntax=docker/dockerfile:1
# Multi-stage build for a Next.js (standalone) app.
#
# The runtime listens on 3000, NOT 80. Port 80 needs a privileged bind, which a
# non-root process can only do if it is handed NET_BIND_SERVICE — and the
# hosting platform validates docker-compose.yml against an allowlist that
# refuses cap_add. An unprivileged port removes the need for the capability
# instead of arguing with the validator. Traefik does not care which port it
# routes to, as long as the panel's container port agrees with this one.

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Runs as an unprivileged user. The node images ship a `node` account (uid 1000)
# for exactly this; nothing here needs root at runtime, and a container running
# as root is the single most common finding in a host security scan.
#
# Two directories must be writable by that user, and both are created HERE, in
# the image, rather than left to be created at runtime as root:
#
#   /data              the content store — every menu, contact and legal edit the
#                      admin makes. A named volume mounted on an empty directory
#                      inherits that directory's ownership, which is what lets an
#                      unprivileged process write to the volume at all.
#   /app/.next/cache   next/image writes optimised AVIF and WebP here on first
#                      request. Without it the pizza photographs — 1024px PNGs —
#                      are re-encoded on every single request.
RUN mkdir -p /data /app/.next/cache

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

RUN chown -R node:node /app /data

USER node

EXPOSE 3000
CMD ["node", "server.js"]
