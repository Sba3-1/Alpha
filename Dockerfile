# Use Node.js 22 as the base image
FROM node:22-slim AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application
RUN pnpm run build

# Production image
FROM node:22-slim AS runner

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy built assets and necessary files from builder
COPY --from=base /app/dist ./dist
COPY --from=base /app/package.json ./
COPY --from=base /app/pnpm-lock.yaml ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/server ./server
COPY --from=base /app/shared ./shared
COPY --from=base /app/drizzle ./drizzle
COPY --from=base /app/drizzle.config.ts ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the application
CMD ["pnpm", "run", "start"]
