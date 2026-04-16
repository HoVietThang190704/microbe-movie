FROM oven/bun:1.2.22 AS builder
WORKDIR /app

# Copy root package files
COPY package.json ./
COPY bun.lock ./
COPY tsconfig.json ./

# Copy ALL workspace package.json files
COPY libs/package.json ./libs/
COPY apps/api-gateway/package.json ./apps/api-gateway/
COPY apps/auth-service/package.json ./apps/auth-service/
COPY apps/user-service/package.json ./apps/user-service/
COPY apps/videos-service/package.json ./apps/videos-service/

# Copy tsconfig files for each workspace
COPY libs/tsconfig.lib.json ./libs/
COPY apps/api-gateway/tsconfig.json ./apps/api-gateway/
COPY apps/auth-service/tsconfig.json ./apps/auth-service/
COPY apps/user-service/tsconfig.json ./apps/user-service/
COPY apps/videos-service/tsconfig.json ./apps/videos-service/

# Install dependencies with verbose output
RUN bun install --verbose

# Copy source code
COPY libs/src ./libs/src
COPY apps/user-service/src ./apps/user-service/src

# Build libs
RUN bun run build:libs

# Build user-service
RUN bun run --filter user-service build

# Runtime stage
FROM oven/bun:1.2.22
WORKDIR /app

# Copy root package files
COPY package.json ./
COPY bun.lock ./
COPY tsconfig.json ./

# Copy ALL workspace package.json files (needed for bun workspace recognition)
COPY libs/package.json ./libs/
COPY apps/api-gateway/package.json ./apps/api-gateway/
COPY apps/auth-service/package.json ./apps/auth-service/
COPY apps/user-service/package.json ./apps/user-service/
COPY apps/videos-service/package.json ./apps/videos-service/

# Install production dependencies only
RUN bun install --production

# Copy built code from builder
COPY --from=builder /app/libs/dist ./libs/dist
COPY --from=builder /app/apps/user-service/dist ./apps/user-service/dist

ENV NODE_ENV=production

CMD ["bun", "run", "apps/user-service/dist/main.js"]
