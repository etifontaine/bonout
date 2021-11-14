FROM node:16-alpine AS dependencies

ENV NODE_ENV production
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:16-alpine AS builder

ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

COPY . .
COPY --from=dependencies /app/node_modules ./node_modules

RUN npm install -g pnpm
RUN pnpm run build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "start"]
