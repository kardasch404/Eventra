FROM node:22-alpine AS builder

WORKDIR /app

COPY backend/package*.json ./backend/

WORKDIR /app/backend

RUN npm ci

COPY backend/ ./

RUN npm run build

FROM node:22-alpine

WORKDIR /app/backend

COPY --from=builder /app/backend/package*.json ./
COPY --from=builder /app/backend/tsconfig.json ./
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/dist ./dist

ENV NODE_ENV=production

EXPOSE 4000

CMD ["npm", "run", "start:prod"]
