# Eventra Docker Infrastructure

## Quick Start

```bash
# From project root
cd infra/docker

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build
```

## Services

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000/graphql
- **MongoDB**: localhost:27018
- **Redis**: localhost:6379
- **Mongo Express**: http://localhost:8081

## Seed Database

```bash
docker cp seed-db.js eventra-backend:/app/seed-db.js
docker exec eventra-backend node seed-db.js
```

## Admin Credentials

- Email: admin@eventra.co
- Password: eventra
