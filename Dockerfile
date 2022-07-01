FROM node:16-alpine AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --frozen-lockfile


# Rebuild the source code only when needed
FROM node:16-alpine AS builder

ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

COPY . .
COPY --from=dependencies /app/node_modules ./node_modules

ENV DB_ENV=build

ENV NODE_ENV production
RUN npm run build
RUN rm -rf node_modules
RUN npm install --production --frozen-lockfile --ignore-scripts --prefer-offline

# Production image, copy all the files and run next
FROM node:16-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder --chown=nextjs:nodejs /app/package.json /app/package-lock.json ./
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/next-i18next.config.js ./

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "start"]
