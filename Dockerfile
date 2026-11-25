# syntax=docker/dockerfile:1
# Base image shared across build stages to prevent duplicate registry lookups
FROM node:22-slim AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.27.0 --activate
RUN pnpm config set store-dir /pnpm/store

# Stage 1: Full dependencies & source code
FROM base AS source
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prefer-offline
COPY . .

# Stage 2 (Quality Gate): Test runner targeted by Jenkins
FROM source AS tester
RUN --mount=type=cache,target=/app/node_modules/.vite \
    pnpm test

# Stage 3: Application & standalone migration builder
FROM source AS builder
ENV NODE_ENV=production
RUN --mount=type=cache,target=/app/node_modules/.vite \
    pnpm build && node docker/bundle-migrate.js

# Stage 4: Production runner (zero node_modules copy, ultra-fast layer export)
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ARG PORT=3000
ENV PORT=${PORT}

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/dist/migrate.mjs ./migrate.mjs
COPY --from=builder /app/drizzle ./drizzle
COPY docker/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE ${PORT}
ENTRYPOINT ["./entrypoint.sh"]
