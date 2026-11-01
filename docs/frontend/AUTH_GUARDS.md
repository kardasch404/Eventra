# Protected Routes & Auth Guards

## Overview
This implementation provides route protection and role-based access control for the Eventra frontend.

## Components

### 1. Middleware (`middleware.ts`)
- Server-side route protection
- Redirects unauthenticated users to login
- Prevents authenticated users from accessing auth pages
- Preserves redirect URL for post-login navigation

### 2. ProtectedRoute Component
Client-side route guard that wraps protected pages.

**Usage:**
```tsx
import { ProtectedRoute } from '@/presentation/components/guards';

export default function MyProtectedPage() {
  return (
    <ProtectedRoute>
      <div>Protected content</div>
    </ProtectedRoute>
  );
}
```

### 3. RoleGuard Component
Conditionally renders content based on permissions.

**Usage:**
```tsx
import { RoleGuard } from '@/presentation/components/guards';

<RoleGuard requiredPermission="reservation:cancel" fallback={<p>No access</p>}>
  <button>Cancel Reservation</button>
</RoleGuard>
```

### 4. useAuth Hook
Enhanced to return user state and authentication status.

**Usage:**
```tsx
const { user, isAuthenticated, login, logout } = useAuth();
```

### 5. usePermission Hook
Check if user has specific permission.

**Usage:**
```tsx
const canCancel = usePermission('reservation:cancel');

if (canCancel) {
  // Show cancel button
}
```

## Route Configuration

### Public Routes
- `/` - Home
- `/login` - Login page
- `/register` - Register page
- `/events` - Events listing
- `/events/[slug]` - Event details

### Protected Routes
All other routes require authentication.

## Permissions

Current base permissions:
- `event:view` - View events
- `reservation:create` - Create reservations
- `reservation:cancel` - Cancel reservations (future)
- `event:create` - Create events (future)

## Future Enhancements
- Backend role/permission system
- Admin routes
- Organizer-specific permissions
