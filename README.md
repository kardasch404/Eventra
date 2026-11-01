# Eventra — Event Management Platform

A full-stack event management and ticketing platform built with **Clean Architecture**, **NestJS**, **Next.js**, **GraphQL**, **MongoDB**, and **Redis**.

## Quick Start

```bash
# 1. Start infrastructure (MongoDB + Redis)
cd infra/docker/eventra
docker-compose up -d

# 2. Backend
cd backend
npm install
npm run seed
npm run start:dev   # http://localhost:4000/graphql

# 3. Frontend
cd frontend
npm install
npm run dev         # http://localhost:3000
```

**Admin login:** `admin@eventra.co` / `eventra`

## Documentation

All docs live in [`/docs`](./docs/):

| Doc | Description |
|-----|-------------|
| [SETUP.md](./docs/SETUP.md) | Full local development setup |
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System architecture overview |
| [ADMIN_CREDENTIALS.md](./docs/ADMIN_CREDENTIALS.md) | Admin account details |
| [CI_CD_PIPELINE.md](./docs/CI_CD_PIPELINE.md) | GitHub Actions pipeline |
| **Backend** | |
| [AUTH_FLOW.md](./docs/backend/AUTH_FLOW.md) | JWT auth & token flow |
| [GRAPHQL_SCHEMA.md](./docs/backend/GRAPHQL_SCHEMA.md) | Full GraphQL schema |
| [GRAPHQL_QUERIES.md](./docs/backend/GRAPHQL_QUERIES.md) | Query & mutation examples |
| [REDIS_USAGE.md](./docs/backend/REDIS_USAGE.md) | Redis caching patterns |
| [RESERVATION_LOGIC.md](./docs/backend/RESERVATION_LOGIC.md) | Booking business rules |
| [SEEDING.md](./docs/backend/SEEDING.md) | Database seeding guide |
| **Frontend** | |
| [ARCHITECTURE.md](./docs/frontend/ARCHITECTURE.md) | Frontend Clean Architecture |
| [AUTH_GUARDS.md](./docs/frontend/AUTH_GUARDS.md) | Route protection & guards |
| [AUTH_FLOW_TESTS.md](./docs/frontend/AUTH_FLOW_TESTS.md) | Auth test coverage |
| **Infra** | |
| [DOCKER.md](./docs/infra/DOCKER.md) | Docker Compose setup |

## Stack

| Layer | Tech |
|-------|------|
| Backend | NestJS · TypeScript · GraphQL (Apollo) |
| Database | MongoDB 7 · Mongoose · Redis 7 |
| Frontend | Next.js 16 · React 19 · Tailwind CSS v4 |
| State | Redux Toolkit · Apollo Client |
| Auth | JWT (Access 15m + Refresh 7d) · bcrypt |
| DevOps | Docker Compose · GitHub Actions CI/CD |
