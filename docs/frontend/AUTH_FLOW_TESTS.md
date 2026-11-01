# Authentication Flow Tests

## Manual Testing Guide

### 1. Register Flow
**URL**: `/register`

**Test Steps**:
1. Navigate to `/register`
2. Fill in form: firstName, lastName, email, password
3. Click "Sign Up"
4. Verify redirect to `/events`
5. Check cookies for tokens

**Expected**: Form validation, redirect, tokens in cookies, user in Redux

### 2. Login Flow
**URL**: `/login`

**Test Steps**:
1. Navigate to `/login`
2. Fill in email and password
3. Click "Login"
4. Verify redirect and tokens

**Expected**: Validation, redirect, tokens (15min access, 7d refresh), user in Redux

### 3. Form Validation
- Empty fields → Required errors
- Invalid email → "Invalid email address"
- Short password (< 6) → "Password must be at least 6 characters"
- Short names (< 2) → "Must be at least 2 characters"

### 4. Error Handling
- Wrong credentials → "Login failed"
- Duplicate email → Error message
- Network error → Error message

## Cookie Configuration
- **accessToken**: 15 minutes
- **refreshToken**: 7 days
- Secure in production
