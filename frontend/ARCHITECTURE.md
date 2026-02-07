# Frontend Architecture

## Clean Architecture Structure

```
frontend/
├── app/                           # Next.js App Router
│   ├── (public)/                  # Public routes (SSR)
│   │   ├── page.tsx               # Home page
│   │   ├── events/
│   │   │   ├── page.tsx           # Events list (SSR)
│   │   │   └── [slug]/
│   │   │       └── page.tsx       # Event detail (SSR)
│   │   └── auth/
│   │       ├── login/
│   │       └── register/
│   ├── (protected)/               # Protected routes (CSR)
│   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx       # Admin dashboard
│   │   │   │   ├── events/
│   │   │   │   ├── reservations/
│   │   │   │   └── roles/
│   │   │   └── participant/
│   │   │       ├── page.tsx       # Participant dashboard
│   │   │       └── reservations/
│   │   └── layout.tsx             # Protected layout
│   └── api/                       # API routes (if needed)
│
├── core/                          # Domain Layer
│   ├── entities/
│   │   ├── User.ts
│   │   ├── Event.ts
│   │   ├── Reservation.ts
│   │   └── Role.ts
│   └── interfaces/
│       ├── IEventRepository.ts
│       └── IReservationRepository.ts
│
├── application/                   # Application Layer
│   ├── use-cases/
│   │   ├── auth/
│   │   ├── events/
│   │   └── reservations/
│   └── dto/
│
├── infrastructure/                # Infrastructure Layer
│   ├── graphql/
│   │   ├── client.ts              # Apollo Client setup
│   │   ├── queries/
│   │   │   ├── events.queries.ts
│   │   │   └── reservations.queries.ts
│   │   └── mutations/
│   │       ├── auth.mutations.ts
│   │       ├── events.mutations.ts
│   │       └── reservations.mutations.ts
│   ├── repositories/
│   │   ├── EventRepository.ts
│   │   └── ReservationRepository.ts
│   └── services/
│       ├── auth.service.ts
│       └── storage.service.ts     # localStorage/sessionStorage
│
├── presentation/                  # Presentation Layer
│   ├── components/
│   │   ├── ui/                    # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Input.tsx
│   │   ├── features/
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventFilters.tsx
│   │   │   ├── ReservationForm.tsx
│   │   │   └── RolePermissionMatrix.tsx
│   │   └── layouts/
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── Sidebar.tsx
│   └── hooks/
│       ├── useAuth.ts
│       ├── useEvents.ts
│       └── useReservations.ts
│
└── shared/                        # Shared Layer
    ├── store/                     # Redux store
    │   ├── store.ts
    │   ├── slices/
    │   │   ├── authSlice.ts
    │   │   ├── eventsSlice.ts
    │   │   └── reservationsSlice.ts
    │   └── middleware/
    ├── constants/
    ├── types/
    └── utils/
        ├── formatters.ts
        └── validators.ts
```

## Layer Responsibilities

### Core Layer (Domain)
- Pure business logic
- Domain entities
- Repository interfaces
- No external dependencies

### Application Layer
- Use cases (business workflows)
- DTOs for data transfer
- Orchestrates domain logic

### Infrastructure Layer
- GraphQL client configuration
- API queries and mutations
- Repository implementations
- External service integrations

### Presentation Layer
- React components
- Custom hooks
- UI logic
- No business logic

### Shared Layer
- Redux store
- Constants and types
- Utility functions
- Cross-cutting concerns

## TypeScript Path Aliases

```json
{
  "@/app/*": ["./app/*"],
  "@/core/*": ["./core/*"],
  "@/application/*": ["./application/*"],
  "@/infrastructure/*": ["./infrastructure/*"],
  "@/presentation/*": ["./presentation/*"],
  "@/shared/*": ["./shared/*"]
}
```

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **API Client**: Apollo Client (GraphQL)
- **Forms**: React Hook Form + Zod
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier
- **Git Hooks**: Husky + lint-staged

## Development Workflow

1. **Feature Development**: Create feature branch
2. **Clean Architecture**: Follow layer separation
3. **Type Safety**: Use TypeScript strict mode
4. **Code Quality**: ESLint + Prettier on commit
5. **Testing**: Unit tests for business logic
6. **Review**: Pull request with tests

## Routing Strategy

- **Public Routes**: SSR for SEO (events list, event details)
- **Protected Routes**: CSR for dynamic content (dashboards)
- **API Routes**: Minimal usage, prefer GraphQL

## State Management

- **Server State**: Apollo Client cache
- **Client State**: Redux Toolkit
- **Form State**: React Hook Form
- **URL State**: Next.js router

## Component Guidelines

- **UI Components**: Reusable, no business logic
- **Feature Components**: Specific functionality
- **Layout Components**: Page structure
- **Smart Components**: Connect to state
- **Dumb Components**: Pure presentation
