# GraphQL Schema Documentation

## Overview

The GraphQL API provides a type-safe interface for interacting with the Eventra platform.

## Configuration

- **Driver:** Apollo Server
- **Schema Generation:** Code-first approach with decorators
- **Playground:** Enabled in development (controlled by `GRAPHQL_PLAYGROUND` env variable)
- **Introspection:** Enabled for schema exploration

## Endpoint

```
POST /graphql
```

## Authentication

Protected queries and mutations require a valid JWT access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Types

### User
Represents a registered user in the system.

**Fields:**
- `id`: Unique identifier (UUID v7)
- `email`: User's email address
- `firstName`: User's first name
- `lastName`: User's last name
- `avatar`: Profile picture URL (optional)
- `isEmailVerified`: Email verification status
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

### Event
Represents an event that can be booked.

**Fields:**
- `id`: Unique identifier (UUID v7)
- `slug`: URL-friendly identifier
- `title`: Event title
- `summary`: Brief description
- `description`: Detailed description (array of paragraphs)
- `category`: Event category
- `type`: ONLINE or IN_PERSON
- `status`: DRAFT, PUBLISHED, or CANCELED
- `hero`: Hero image object
- `dateTime`: Event date and time information
- `location`: Event location details
- `capacity`: Maximum attendees
- `bookedCount`: Current bookings
- `organizerId`: Event organizer's user ID
- `highlights`: Key features (array)
- `availableSeats`: Computed field (capacity - bookedCount)

### Reservation
Represents a booking for an event.

**Fields:**
- `id`: Unique identifier (UUID v7)
- `eventId`: Associated event ID
- `userId`: User who made the reservation
- `quantity`: Number of seats reserved
- `status`: PENDING, CONFIRMED, REFUSED, or CANCELED
- `ticketCode`: Unique ticket code for PDF generation
- `confirmedAt`: Confirmation timestamp (optional)
- `canceledAt`: Cancellation timestamp (optional)

## Queries

### me
Returns the authenticated user's profile.

```graphql
query {
  me {
    id
    email
    firstName
    lastName
  }
}
```

**Authentication:** Required

### events
Returns a list of all published events.

```graphql
query {
  events {
    id
    slug
    title
    summary
    availableSeats
  }
}
```

**Authentication:** Optional

### event
Returns a single event by slug.

```graphql
query {
  event(slug: "tech-conference-2024") {
    id
    title
    description
    dateTime {
      start
      end
    }
  }
}
```

**Authentication:** Optional

### myReservations
Returns all reservations for the authenticated user.

```graphql
query {
  myReservations {
    id
    eventId
    quantity
    status
    ticketCode
  }
}
```

**Authentication:** Required

## Mutations

### register
Creates a new user account.

```graphql
mutation {
  register(input: {
    email: "user@example.com"
    password: "password123"
    firstName: "John"
    lastName: "Doe"
  }) {
    accessToken
    refreshToken
    user {
      id
      email
    }
  }
}
```

**Validation:**
- Email must be valid format
- Password minimum 8 characters

### login
Authenticates a user and returns tokens.

```graphql
mutation {
  login(input: {
    email: "user@example.com"
    password: "password123"
  }) {
    accessToken
    refreshToken
    user {
      id
      email
    }
  }
}
```

### refreshToken
Generates new access and refresh tokens.

```graphql
mutation {
  refreshToken(input: {
    refreshToken: "your-refresh-token"
  }) {
    accessToken
    refreshToken
    user {
      id
      email
    }
  }
}
```

## Error Handling

GraphQL errors follow this structure:

```json
{
  "errors": [
    {
      "message": "Error description",
      "extensions": {
        "code": "ERROR_CODE",
        "statusCode": 400
      }
    }
  ]
}
```

**Common Error Codes:**
- `UNAUTHENTICATED`: Missing or invalid authentication
- `FORBIDDEN`: Insufficient permissions
- `BAD_USER_INPUT`: Invalid input data
- `INTERNAL_SERVER_ERROR`: Server error

## Development

### Playground

Access the GraphQL Playground at:
```
http://localhost:4000/graphql
```

Set `GRAPHQL_PLAYGROUND=true` in your `.env` file to enable.

### Schema Generation

The schema is automatically generated from TypeScript decorators and saved to:
```
src/presentation/graphql/schema.gql
```

## Best Practices

1. **Use Fragments:** Reuse common field selections
2. **Request Only Needed Fields:** Avoid over-fetching
3. **Batch Queries:** Combine multiple queries in one request
4. **Handle Errors:** Always check for errors in responses
5. **Use Variables:** Parameterize queries for reusability

## Example: Complete Authentication Flow

```graphql
# 1. Register
mutation Register {
  register(input: {
    email: "user@example.com"
    password: "securepass123"
    firstName: "Jane"
    lastName: "Smith"
  }) {
    accessToken
    refreshToken
    user {
      id
      email
      firstName
    }
  }
}

# 2. Query Protected Resource
query Me {
  me {
    id
    email
    isEmailVerified
  }
}

# 3. Refresh Token
mutation Refresh {
  refreshToken(input: {
    refreshToken: "your-refresh-token"
  }) {
    accessToken
    refreshToken
  }
}
```
