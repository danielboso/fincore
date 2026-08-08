# Stage 1: Build stage
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm (pinned to v9 for compatibility with package.json settings)
RUN npm install -g pnpm@9

# Copy package configuration and lockfile
COPY package.json pnpm-lock.yaml ./

# Install dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm build

# Prune dev dependencies to leave only production dependencies
RUN pnpm prune --prod

# Stage 2: Production runner stage
FROM node:22-alpine AS runner

WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Copy the built output from builder
COPY --from=builder /app/.output ./.output

# Copy node_modules (which contains only production dependencies after pnpm prune --prod)
COPY --from=builder /app/node_modules ./node_modules

# Copy drizzle migration SQL files
COPY --from=builder /app/drizzle ./drizzle

# Copy package.json to preserve metadata and package type (type: module)
COPY --from=builder /app/package.json ./package.json

# Copy migrations runner script
COPY docker/migrate.js ./migrate.js

# Copy and set up the entrypoint script
COPY docker/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Expose port
EXPOSE 3000

# Start the application via the entrypoint script
ENTRYPOINT ["./entrypoint.sh"]
