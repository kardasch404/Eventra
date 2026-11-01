# GraphQL Queries Examples

## Authentication Mutations

### Register

```graphql
mutation Register {
  register(input: {
    email: "john.doe@example.com"
    password: "securepass123"
    firstName: "John"
    lastName: "Doe"
  }) {
    accessToken
    refreshToken
    user {
      id
      email
      firstName
      lastName
      isEmailVerified
    }
  }
}
```

### Login

```graphql
mutation Login {
  login(input: {
    email: "john.doe@example.com"
    password: "securepass123"
  }) {
    accessToken
    refreshToken
    user {
      id
      email
      firstName
      lastName
    }
  }
}
```

### Refresh Token

```graphql
mutation RefreshToken {
  refreshToken(input: {
    refreshToken: "your-refresh-token-here"
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

## Protected Queries

### Get Current User

**Requires:** Authorization header with Bearer token

```graphql
query Me {
  me {
    id
    email
    firstName
    lastName
    avatar
    isEmailVerified
    createdAt
    updatedAt
  }
}
```

**HTTP Headers:**
```json
{
  "Authorization": "Bearer your-access-token-here"
}
```

## Testing in GraphQL Playground

### 1. Start the server

```bash
cd backend
npm run start:dev
```

### 2. Open Playground

Navigate to: `http://localhost:4000/graphql`

### 3. Register a new user

```graphql
mutation {
  register(input: {
    email: "test@example.com"
    password: "password123"
    firstName: "Test"
    lastName: "User"
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

### 4. Copy the accessToken from response

### 5. Set HTTP Headers

Click "HTTP HEADERS" at the bottom of the playground and add:

```json
{
  "Authorization": "Bearer YOUR_ACCESS_TOKEN_HERE"
}
```

### 6. Query protected resource

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

## Error Handling Examples

### Invalid Email Format

```graphql
mutation {
  register(input: {
    email: "invalid-email"
    password: "password123"
    firstName: "John"
    lastName: "Doe"
  }) {
    accessToken
  }
}
```

**Response:**
```json
{
  "errors": [
    {
      "message": "Invalid email format",
      "extensions": {
        "code": "BAD_USER_INPUT"
      }
    }
  ]
}
```

### Password Too Short

```graphql
mutation {
  register(input: {
    email: "test@example.com"
    password: "short"
    firstName: "John"
    lastName: "Doe"
  }) {
    accessToken
  }
}
```

**Response:**
```json
{
  "errors": [
    {
      "message": "Password must be at least 8 characters",
      "extensions": {
        "code": "BAD_USER_INPUT"
      }
    }
  }
}
```

### Email Already Exists

```graphql
mutation {
  register(input: {
    email: "existing@example.com"
    password: "password123"
    firstName: "John"
    lastName: "Doe"
  }) {
    accessToken
  }
}
```

**Response:**
```json
{
  "errors": [
    {
      "message": "Email already exists",
      "extensions": {
        "code": "CONFLICT"
      }
    }
  ]
}
```

### Invalid Credentials

```graphql
mutation {
  login(input: {
    email: "test@example.com"
    password: "wrongpassword"
  }) {
    accessToken
  }
}
```

**Response:**
```json
{
  "errors": [
    {
      "message": "Invalid credentials",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ]
}
```

### Unauthorized Access

```graphql
query {
  me {
    id
  }
}
```

**Without Authorization header:**
```json
{
  "errors": [
    {
      "message": "Unauthorized",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ]
}
```

## Complete Authentication Flow Example

```graphql
# Step 1: Register
mutation Register {
  register(input: {
    email: "alice@example.com"
    password: "alicepass123"
    firstName: "Alice"
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

# Step 2: Use accessToken in headers for protected queries
# Headers: { "Authorization": "Bearer <accessToken>" }

query GetProfile {
  me {
    id
    email
    firstName
    lastName
    isEmailVerified
  }
}

# Step 3: When accessToken expires, use refreshToken
mutation Refresh {
  refreshToken(input: {
    refreshToken: "<refreshToken>"
  }) {
    accessToken
    refreshToken
    user {
      id
    }
  }
}

# Step 4: Login again if needed
mutation Login {
  login(input: {
    email: "alice@example.com"
    password: "alicepass123"
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

## Tips

1. **Save tokens securely** - Store accessToken and refreshToken in secure storage
2. **Refresh before expiry** - Refresh accessToken before it expires (15 minutes)
3. **Handle errors gracefully** - Check for errors in response
4. **Use variables** - Parameterize queries for reusability
5. **Test edge cases** - Try invalid inputs to understand error responses
