# Development Setup Guide

## Prerequisites
- Node.js v22+
- Docker & Docker Compose
- MongoDB (via Docker)
- Redis (via Docker)

## Backend Setup

### 1. Start Docker Services
```bash
cd backend
docker-compose up -d
```

This starts:
- MongoDB on port 27018
- Redis on port 6380
- Mongo Express on port 8081

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Configure Environment
Ensure `backend/.env` has:
```
PORT=4000
MONGODB_URI=mongodb://localhost:27018/eventra
REDIS_HOST=localhost
REDIS_PORT=6380
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
```

### 4. Run Database Seeds
```bash
cd backend
npm run seed
```

### 5. Start Backend Server
```bash
cd backend
npm run start:dev
```

Backend runs on: **http://localhost:4000**
GraphQL Playground: **http://localhost:4000/graphql**

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
Create `frontend/.env.local`:
```
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

### 3. Start Frontend Server
```bash
cd frontend
npm run dev
```

Frontend runs on: **http://localhost:3000**

## Verify Setup

### Backend Health Check
```bash
curl http://localhost:4000/graphql
```
Should return GraphQL playground HTML

### Frontend Health Check
Visit: http://localhost:3000

### Test GraphQL Connection
Visit: http://localhost:3000/test-connection

## Common Issues

### Backend won't start
- Check Docker services: `docker-compose ps`
- Check MongoDB: `docker logs eventra-mongodb`
- Check Redis: `docker logs eventra-redis`
- Verify ports 27018 and 6380 are not in use

### Frontend can't connect to backend
- Verify backend is running on port 4000
- Check `.env.local` has correct GraphQL URL
- Restart frontend dev server after env changes

### Database connection errors
- Ensure MongoDB container is running
- Check connection string in backend `.env`
- Try: `docker-compose restart mongodb`

## Development Workflow

### Terminal 1: Backend
```bash
cd backend
docker-compose up -d  # Start once
npm run start:dev     # Keep running
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev           # Keep running
```

### Terminal 3: Commands
```bash
# Run tests
cd backend && npm test
cd frontend && npm test

# Database operations
cd backend && npm run seed
```

## Ports Summary
- Frontend: 3000
- Backend: 4000
- MongoDB: 27018
- Redis: 6380
- Mongo Express: 8081
