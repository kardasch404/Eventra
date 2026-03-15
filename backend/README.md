# Eventra Backend

Backend API for the Eventra event management platform built with NestJS, GraphQL, MongoDB, and Redis.

## Getting Started

```bash
docker-compose up -d
npm install
npm run seed
npm run start:dev
```

The server runs on **http://localhost:4000** with GraphQL Playground at **http://localhost:4000/graphql**.

## Scripts

- `npm run start:dev` - Start in development mode
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run seed` - Seed the database

## Documentation

- [Auth Flow](docs/AUTH_FLOW.md)
- [GraphQL Schema](docs/GRAPHQL_SCHEMA.md)
- [GraphQL Queries](docs/GRAPHQL_QUERIES.md)
- [Event GraphQL](docs/EVENT_GRAPHQL.md)
- [Reservation Logic](docs/RESERVATION_LOGIC.md)
- [Redis Usage](docs/REDIS_USAGE.md)