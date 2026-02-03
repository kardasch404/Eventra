# Authentication Flow Documentation

## Overview

The authentication system uses JWT tokens with access and refresh token pattern for secure user authentication.

## Value Objects

### Email
- Validates email format
- Normalizes to lowercase
- Immutable value object

### Password
- Minimum 8 characters required
- Hashed using bcrypt with 12 salt rounds
- Provides secure comparison method
- Never stores plain text passwords

## Use Cases

### 1. Register (RegisterUseCase)

**Flow:**
1. Validate email format (Email value object)
2. Check if email already exists
3. Validate password requirements (Password value object)
4. Hash password with bcrypt (12 rounds)
5. Generate UUID v7 for user ID
6. Create user with "participant" role
7. Save user to database
8. Generate access token (15min expiration)
9. Generate refresh token (7d expiration)
10. Return tokens and user data

**Input:**
```typescript
{
  email: string,
  password: string,
  firstName: string,
  lastName: string
}
```

**Output:**
```typescript
{
  accessToken: string,
  refreshToken: string,
  user: {
    id: string,
    email: string,
    firstName: string,
    lastName: string
  }
}
```

### 2. Login (LoginUseCase)

**Flow:**
1. Validate email format
2. Find user by email
3. Verify password using bcrypt compare
4. Generate new access token
5. Generate new refresh token
6. Return tokens and user data

**Security:**
- Returns generic "Invalid credentials" for both email not found and wrong password
- Prevents user enumeration attacks

### 3. Refresh Token (RefreshTokenUseCase)

**Flow:**
1. Verify refresh token signature and expiration
2. Extract user ID from token payload
3. Find user by ID
4. Generate new access token
5. Generate new refresh token
6. Return new tokens and user data

**Token Rotation:**
- Each refresh generates both new access and refresh tokens
- Old refresh token becomes invalid after use

## Token Structure

### Access Token
- **Expiration:** 15 minutes
- **Payload:**
  ```typescript
  {
    sub: userId,
    roles: ['participant'],
    iat: timestamp,
    exp: timestamp
  }
  ```

### Refresh Token
- **Expiration:** 7 days
- **Payload:**
  ```typescript
  {
    sub: userId,
    type: 'refresh',
    iat: timestamp,
    exp: timestamp
  }
  ```

## Security Best Practices

1. **Password Hashing:** bcrypt with 12 salt rounds
2. **Token Secrets:** Separate secrets for access and refresh tokens
3. **Short-lived Access Tokens:** 15 minutes to minimize exposure
4. **Token Rotation:** New tokens on each refresh
5. **Email Validation:** Format validation via value object
6. **Password Requirements:** Minimum 8 characters
7. **Error Messages:** Generic messages to prevent enumeration

## Error Handling

- `ConflictException`: Email already exists (409)
- `UnauthorizedException`: Invalid credentials (401)
- `BadRequestException`: Invalid email/password format (400)

## Future Enhancements

- Email verification flow
- Password reset flow
- Logout with token blacklisting
- Multi-factor authentication
- Session management
- Rate limiting for login attempts
