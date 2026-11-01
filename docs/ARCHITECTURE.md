# Eventra - Event Management Platform

## Architecture Overview

This project follows **Clean Architecture** principles with clear separation of concerns across layers.

### Backend Architecture

#### Layers

1. **Core Layer** (`src/core/`)
   - Domain entities (business objects)
   - Repository interfaces (contracts)
   - Value objects (immutable domain concepts)
   - Pure business logic, framework-agnostic

2. **Application Layer** (`src/application/`)
   - Use cases (business operations)
   - DTOs (data transfer objects)
   - Application-specific business rules
   - Orchestrates domain objects

3. **Infrastructure Layer** (`src/infrastructure/`)
   - Database schemas and repositories
   - External services (JWT, Redis, PDF)
   - Configuration files
   - Framework-specific implementations

4. **Presentation Layer** (`src/presentation/`)
   - GraphQL resolvers
   - Guards and decorators
   - Request/response handling
   - API layer

5. **Shared Layer** (`src/shared/`)
   - Constants and enums
   - Exceptions and filters
   - Utility functions
   - Cross-cutting concerns

### Technology Stack

**Backend:**
- NestJS (TypeScript)
- MongoDB + Mongoose
- Redis
- GraphQL (Apollo Server)
- JWT Authentication
- UUID v7

**Frontend:**
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Redux Toolkit
- Apollo Client

### Path Aliases

- `@core/*` → `src/core/*`
- `@application/*` → `src/application/*`
- `@infrastructure/*` → `src/infrastructure/*`
- `@presentation/*` → `src/presentation/*`
- `@shared/*` → `src/shared/*`

### Development Workflow

1. Create feature branch: `feature/TASK-ID-description`
2. Make changes following Clean Architecture
3. Lint and format code (automatic via Husky)
4. Write tests
5. Commit with conventional commits
6. Push and create PR

### Code Quality

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks
- **TypeScript Strict Mode**: Type safety
- **Jest**: Unit and E2E testing
