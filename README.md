# Eventra

Eventra is a digital platform for event discovery and booking built with NestJS, Next.js, MongoDB, and GraphQL.

## Quick Start

See [SETUP.md](SETUP.md) for detailed setup instructions.

### Prerequisites
- Node.js v22+
- Docker & Docker Compose

### Backend
```bash
cd backend
docker-compose up -d
npm install
npm run seed
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Documentation

- [Architecture](ARCHITECTURE.md)
- [Setup Guide](SETUP.md)
- [CI/CD Pipeline](docs/CI_CD_PIPELINE.md)
