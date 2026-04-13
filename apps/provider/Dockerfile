ARG NODE_VERSION=20-slim

# ─── base ─────────────────────────────────────────────────────────────────────
# Shared foundation for all stages.
# Centralises npm upgrade, apt dependencies, turbo install, and SSL config
# so they are never duplicated and stay in sync across stages.
FROM node:${NODE_VERSION} AS base

RUN npm install -g npm@11.12.1
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
RUN npm install -g turbo
# Required on Windows Docker Desktop — TLS inspection causes SSL alert 47.
# Scoped to build stages only; runner stage inherits nothing from here.
RUN npm config set strict-ssl false

# ─── pruner ───────────────────────────────────────────────────────────────────
# PRODUCTION ONLY.
# Uses turbo prune to generate a minimal subset of the monorepo containing
# only the files needed by the target portal. Keeps production images lean.
FROM base AS pruner

WORKDIR /app
COPY . .

ARG APP_NAME
RUN turbo prune @gradlly/${APP_NAME} --docker

# ─── deps ─────────────────────────────────────────────────────────────────────
# PRODUCTION ONLY.
# Installs dependencies from the pruned lockfile so production images
# contain only what the target portal needs — nothing more.
FROM base AS deps

WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json

RUN --mount=type=cache,target=/root/.npm \
    npm ci \
    --fetch-timeout=600000 \
    --fetch-retry-mintimeout=20000 \
    --fetch-retry-maxtimeout=120000 \
    --fetch-retries=10

# Force-install the glibc SWC binary for node:slim (Debian/glibc).
# The lockfile was generated on Windows so it contains the win32 binary.
# Without this explicit install Next.js cannot compile on Linux.
RUN --mount=type=cache,target=/root/.npm \
    npm install --no-save @next/swc-linux-x64-gnu

# ─── dev-deps ─────────────────────────────────────────────────────────────────
# DEVELOPMENT ONLY — targeted by docker-compose.dev.yml via `target: dev-deps`.
# Intentionally skips turbo prune and installs the FULL monorepo workspace.
# This ensures every @gradlly/* shared package (hooks, ui, utils, api, lib,
# types, features/auth) gets a correct node_modules symlink so cross-package
# imports resolve at runtime. turbo prune produces a portal-scoped subset
# which silently drops shared packages not in the direct dependency graph —
# the root cause of shared hooks not working in Docker.
# Source files are overwritten by the volume mount defined in compose;
# only node_modules is preserved via the anonymous volume.
FROM base AS dev-deps

WORKDIR /app
COPY . .

RUN --mount=type=cache,target=/root/.npm \
    npm ci \
    --fetch-timeout=600000 \
    --fetch-retry-mintimeout=20000 \
    --fetch-retry-maxtimeout=120000 \
    --fetch-retries=10

RUN --mount=type=cache,target=/root/.npm \
    npm install --no-save @next/swc-linux-x64-gnu

# ─── builder ──────────────────────────────────────────────────────────────────
# PRODUCTION ONLY.
# Runs next build against the pruned source using production dependencies.
FROM deps AS builder

WORKDIR /app

ARG APP_NAME
COPY --from=pruner /app/out/full/ .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build --workspace=apps/${APP_NAME}

# ─── runner ───────────────────────────────────────────────────────────────────
# PRODUCTION ONLY.
# Lean final image — no source, no build tools, no dev dependencies.
# Only the standalone Next.js server output is copied here.
FROM node:${NODE_VERSION} AS runner

WORKDIR /app

ARG APP_NAME
ARG PORT

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 --ingroup nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP_NAME}/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP_NAME}/.next/static     ./apps/${APP_NAME}/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP_NAME}/public           ./apps/${APP_NAME}/public

USER nextjs
EXPOSE ${PORT}
ENV PORT=${PORT}
ENV HOSTNAME="0.0.0.0"
CMD node apps/${APP_NAME}/.next/standalone/server.js