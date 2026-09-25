# --- STAGE 1: Build environment ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests
COPY package.json package-lock.json ./

# Install dependencies (including devDependencies for build)
RUN npm ci

# Copy source codebase
COPY . .

# Compile Vite frontend assets and bundle Express backend to dist/server.cjs
RUN npm run build

# --- STAGE 2: Production runtime ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built distribution artifacts & static assets from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Expose service port 3000
EXPOSE 3000

# Health check instruction
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start bundled Node server
CMD ["node", "dist/server.cjs"]
