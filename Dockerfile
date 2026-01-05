# Base image with dependencies
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Install dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/admin/package.json ./apps/admin/package.json
COPY apps/customer/package.json ./apps/customer/package.json
COPY apps/driver/package.json ./apps/driver/package.json
COPY apps/restaurant/package.json ./apps/restaurant/package.json
COPY apps/super-admin/package.json ./apps/super-admin/package.json
COPY packages/api/package.json ./packages/api/package.json
COPY packages/config/package.json ./packages/config/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY packages/fonts/package.json ./packages/fonts/package.json
COPY packages/hooks/package.json ./packages/hooks/package.json
COPY packages/lib/package.json ./packages/lib/package.json
COPY packages/mappers/package.json ./packages/mappers/package.json
COPY packages/middleware/package.json ./packages/middleware/package.json
COPY packages/models/package.json ./packages/models/package.json
COPY packages/store/package.json ./packages/store/package.json
COPY packages/types/package.json ./packages/types/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json
COPY packages/ui/package.json ./packages/ui/package.json
COPY packages/utils/package.json ./packages/utils/package.json
COPY packages/validation/package.json ./packages/validation/package.json

RUN pnpm install --frozen-lockfile

# Build the app
FROM base AS builder
ARG APP_NAME
WORKDIR /app

# Copy all source files first
COPY . .

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy environment file if exists (with wildcard to avoid errors if not present)
RUN if [ -f .env ]; then cp .env .env.temp; fi

# Install dependencies again to ensure workspace links are correct
RUN pnpm install --frozen-lockfile

# Build the specific app
RUN SKIP_ENV_VALIDATION=1 pnpm turbo run build --filter=${APP_NAME}

# Production runner
FROM node:18-alpine AS runner
ARG APP_NAME
WORKDIR /app

ENV NODE_ENV=production
ENV APP_NAME=${APP_NAME}

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/apps/${APP_NAME}/next.config.mjs ./
COPY --from=builder /app/apps/${APP_NAME}/package.json ./

# Copy .next folder and dependencies
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP_NAME}/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP_NAME}/.next/static ./apps/${APP_NAME}/.next/static

# Copy public folder if exists (for PWA assets, manifest.json, service worker)
RUN --mount=type=bind,from=builder,source=/app/apps,target=/tmp/apps \
    if [ -d /tmp/apps/${APP_NAME}/public ]; then \
      mkdir -p ./apps/${APP_NAME}/public && \
      cp -r /tmp/apps/${APP_NAME}/public/* ./apps/${APP_NAME}/public/ && \
      chown -R nextjs:nodejs ./apps/${APP_NAME}/public; \
    fi

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD node apps/${APP_NAME}/server.js
