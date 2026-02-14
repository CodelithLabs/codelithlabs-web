# ═══════════════════════════════════════════════════════════════════════════════
# CodelithLabs Tools Platform - Multi-Stage Dockerfile
# Optimized for: Low memory usage, fast builds, small image size
# ═══════════════════════════════════════════════════════════════════════════════

# ═══════════════════════════════════════════════════════════════════════════════
# STAGE 1: Dependencies
# ═══════════════════════════════════════════════════════════════════════════════
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with clean cache
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# ═══════════════════════════════════════════════════════════════════════════════
# STAGE 2: Builder
# ═══════════════════════════════════════════════════════════════════════════════
FROM node:20-alpine AS builder
WORKDIR /app

# Copy deps from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set build-time env vars
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# Limit memory during build (important for 8GB server)
ENV NODE_OPTIONS="--max-old-space-size=1024"

# Build the application
RUN npm run build

# ═══════════════════════════════════════════════════════════════════════════════
# STAGE 3: Runner (Production)
# ═══════════════════════════════════════════════════════════════════════════════
FROM node:20-alpine AS runner
WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Security: Run as non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Runtime memory limit (512MB for 8GB server)
ENV NODE_OPTIONS="--max-old-space-size=512"
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy only necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set correct permissions
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

EXPOSE 3000

# Start the server
CMD ["node", "server.js"]