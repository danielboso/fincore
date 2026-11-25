# syntax=docker/dockerfile:1
# Base image shared across stages to prevent duplicate registry metadata lookups and TLS timeouts
FROM node:22-slim AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.27.0 --activate
RUN pnpm config set store-dir /pnpm/store

# Stage 1: Production dependencies only (cached across code changes)
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --prod --frozen-lockfile --prefer-offline --ignore-scripts

# Stage 2: Full dependencies & source code
FROM base AS source
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prefer-offline
COPY . .

# Stage 3 (Quality Gate): Test runner targeted by Jenkins
FROM source AS tester
RUN --mount=type=cache,target=/app/node_modules/.vite \
    pnpm test

# Stage 4: Application builder with bundler cache mount
FROM source AS builder
ENV NODE_ENV=production
RUN --mount=type=cache,target=/app/node_modules/.vite \
    pnpm build

# Stage 5: Production runner (minimal footprint)
FROM base AS runner
ENV NODE_ENV=production
ARG PORT=3000
ENV PORT=${PORT}

COPY package.json ./package.json
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/drizzle ./drizzle

# Copy database migration runner & entrypoint
COPY docker/migrate.js ./migrate.js
COPY docker/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE ${PORT}
ENTRYPOINT ["./entrypoint.sh"]
