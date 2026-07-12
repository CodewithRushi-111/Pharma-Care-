# ==========================================
# Stage 1: Base & Dependencies
# ==========================================
FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl

FROM base AS dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# ==========================================
# Stage 2: Build Stage
# ==========================================
FROM base AS build
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build
RUN npm prune --production

# ==========================================
# Stage 3: Production Runner
# ==========================================
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=5000

# Create non-root user for enterprise security compliance
RUN addgroup --system --gid 1001 pharmacare && \
    adduser --system --uid 1001 --ingroup pharmacare pharmacare

# Copy production artifacts
COPY --from=build --chown=pharmacare:pharmacare /app/dist ./dist
COPY --from=build --chown=pharmacare:pharmacare /app/node_modules ./node_modules
COPY --from=build --chown=pharmacare:pharmacare /app/package.json ./package.json
COPY --from=build --chown=pharmacare:pharmacare /app/prisma ./prisma

USER pharmacare
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

CMD ["node", "dist/server.js"]
