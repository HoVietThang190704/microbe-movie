FROM oven/bun:latest
WORKDIR /app

# Copy root package files
COPY package.json bun.lock tsconfig.json ./

# Copy ALL workspace package.json files so bun recognizes the workspace
COPY libs/package.json ./libs/
COPY apps/api-gateway/package.json ./apps/api-gateway/
COPY apps/auth-service/package.json ./apps/auth-service/
COPY apps/user-service/package.json ./apps/user-service/
COPY apps/videos-service/package.json ./apps/videos-service/

# Install dependencies
RUN bun install

# Copy service .env file
COPY apps/auth-service/.env ./apps/auth-service/.env

# Copy pre-built libs
COPY libs/dist ./libs/dist

# Copy pre-built service
COPY apps/auth-service/dist ./apps/auth-service/dist

ENV NODE_ENV=production

CMD ["bun", "run", "apps/auth-service/dist/main.js"]
