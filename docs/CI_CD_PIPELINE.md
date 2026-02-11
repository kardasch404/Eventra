# CI/CD Pipeline Documentation

## Overview

This document describes the Continuous Integration and Continuous Deployment (CI/CD) pipeline for the Eventra project using GitHub Actions.

## Pipeline Architecture

### Workflow Trigger

The pipeline is triggered on:
- Push to `main` or `develop` branches
- Pull requests targeting `main` or `develop` branches

### Jobs Structure

The pipeline consists of 6 parallel job groups:

#### Backend Pipeline
1. **backend-lint**: ESLint code quality checks
2. **backend-test**: Unit and integration tests with coverage
3. **backend-build**: TypeScript compilation and build artifacts

#### Frontend Pipeline
1. **frontend-lint**: ESLint code quality checks
2. **frontend-test**: Jest tests with coverage
3. **frontend-build**: Next.js production build

### Job Dependencies

```
backend-lint ─→ backend-test ─→ backend-build
frontend-lint ─→ frontend-test ─→ frontend-build
```

Each job must pass before the next one starts.

## Environment Variables

- `NODE_VERSION`: Node.js version (20)
- npm cache is automatically managed per workspace

## Artifacts

### Backend Build Artifacts
- **Path**: `backend/dist`
- **Name**: `backend-dist`
- **Contents**: Compiled TypeScript output

### Frontend Build Artifacts
- **Path**: `frontend/.next`
- **Name**: `frontend-build`
- **Contents**: Next.js optimized production build

## Coverage Reports

Test coverage is automatically uploaded to Codecov:
- Backend coverage: `backend/coverage/lcov.info`
- Frontend coverage: `frontend/coverage/lcov.info`

## Docker Support

### Frontend Dockerfile

Multi-stage build for optimized production images:
- **Builder stage**: Dependencies + build
- **Production stage**: Production deps + built artifacts

### Docker Compose

Full stack orchestration:
- MongoDB (port 27018)
- Redis (port 6380)
- Backend API (port 4000)
- Frontend (port 3000)
- Mongo Express (port 8081)

### Running with Docker

```bash
# Build and start all services
cd backend/docker
docker-compose up --build

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Clean up volumes
docker-compose down -v
```

## Local Development

### Backend

```bash
cd backend
npm install
npm run lint
npm run test
npm run build
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run lint
npm run test
npm run build
npm run dev
```

## Troubleshooting

### Pipeline Failures

1. **Lint Failures**: Run `npm run lint` locally to see errors
2. **Test Failures**: Run `npm run test` locally with detailed output
3. **Build Failures**: Check TypeScript/Next.js errors locally

### Docker Issues

1. **Port Conflicts**: Ensure ports 3000, 4000, 6380, 8081, 27018 are free
2. **Permission Issues**: Run `docker-compose` with appropriate permissions
3. **Network Issues**: Check `eventra-network` bridge configuration

## Best Practices

1. Always run linting before committing
2. Ensure all tests pass locally
3. Test Docker builds before pushing
4. Keep dependencies updated
5. Monitor pipeline execution times

## Future Enhancements

- [ ] Add E2E testing with Playwright/Cypress
- [ ] Implement deployment to staging/production
- [ ] Add security scanning (Snyk, Dependabot)
- [ ] Implement Docker image versioning
- [ ] Add performance testing
- [ ] Implement automatic rollback
