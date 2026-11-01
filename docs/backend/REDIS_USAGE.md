# Redis Usage Guide

## Overview

Redis is used for caching and session management in the Eventra platform.

## Configuration

### Environment Variables

Add to your `.env` file:

```env
REDIS_HOST=localhost
REDIS_PORT=6380
REDIS_PASSWORD=redis_pass
```

### Starting Redis

Using Docker Compose:

```bash
cd backend/docker
docker-compose up -d redis
```

## RedisService API

### Methods

#### get(key: string): Promise<string | null>

Retrieves a value from Redis.

```typescript
const value = await redisService.get('user:123');
```

#### set(key: string, value: string, ttl?: number): Promise<void>

Sets a value in Redis with optional TTL (time-to-live) in seconds.

```typescript
// Without TTL
await redisService.set('user:123', JSON.stringify(userData));

// With TTL (expires in 3600 seconds / 1 hour)
await redisService.set('session:abc', sessionData, 3600);
```

#### del(key: string): Promise<void>

Deletes a key from Redis.

```typescript
await redisService.del('user:123');
```

#### exists(key: string): Promise<boolean>

Checks if a key exists in Redis.

```typescript
const exists = await redisService.exists('user:123');
if (exists) {
  // Key exists
}
```

## Usage Examples

### Caching User Data

```typescript
import { Injectable } from '@nestjs/common';
import { RedisService } from '@infrastructure/services/redis.service';

@Injectable()
export class UserService {
  constructor(private readonly redisService: RedisService) {}

  async getUserById(id: string): Promise<User> {
    // Try to get from cache
    const cached = await this.redisService.get(`user:${id}`);
    if (cached) {
      return JSON.parse(cached);
    }

    // Fetch from database
    const user = await this.userRepository.findById(id);

    // Cache for 1 hour
    await this.redisService.set(
      `user:${id}`,
      JSON.stringify(user),
      3600
    );

    return user;
  }
}
```

### Storing Refresh Tokens

```typescript
import { Injectable } from '@nestjs/common';
import { RedisService } from '@infrastructure/services/redis.service';

@Injectable()
export class TokenService {
  constructor(private readonly redisService: RedisService) {}

  async storeRefreshToken(
    userId: string,
    token: string,
    expiresIn: number
  ): Promise<void> {
    const key = `refresh_token:${userId}:${token}`;
    await this.redisService.set(key, '1', expiresIn);
  }

  async isRefreshTokenValid(
    userId: string,
    token: string
  ): Promise<boolean> {
    const key = `refresh_token:${userId}:${token}`;
    return this.redisService.exists(key);
  }

  async revokeRefreshToken(
    userId: string,
    token: string
  ): Promise<void> {
    const key = `refresh_token:${userId}:${token}`;
    await this.redisService.del(key);
  }
}
```

### Rate Limiting

```typescript
import { Injectable } from '@nestjs/common';
import { RedisService } from '@infrastructure/services/redis.service';

@Injectable()
export class RateLimitService {
  constructor(private readonly redisService: RedisService) {}

  async checkRateLimit(
    identifier: string,
    limit: number,
    windowSeconds: number
  ): Promise<boolean> {
    const key = `rate_limit:${identifier}`;
    const current = await this.redisService.get(key);

    if (!current) {
      await this.redisService.set(key, '1', windowSeconds);
      return true;
    }

    const count = parseInt(current, 10);
    if (count >= limit) {
      return false;
    }

    await this.redisService.set(
      key,
      (count + 1).toString(),
      windowSeconds
    );
    return true;
  }
}
```

### Session Management

```typescript
import { Injectable } from '@nestjs/common';
import { RedisService } from '@infrastructure/services/redis.service';

@Injectable()
export class SessionService {
  constructor(private readonly redisService: RedisService) {}

  async createSession(
    sessionId: string,
    data: SessionData,
    ttl: number = 86400 // 24 hours
  ): Promise<void> {
    const key = `session:${sessionId}`;
    await this.redisService.set(
      key,
      JSON.stringify(data),
      ttl
    );
  }

  async getSession(sessionId: string): Promise<SessionData | null> {
    const key = `session:${sessionId}`;
    const data = await this.redisService.get(key);
    return data ? JSON.parse(data) : null;
  }

  async destroySession(sessionId: string): Promise<void> {
    const key = `session:${sessionId}`;
    await this.redisService.del(key);
  }
}
```

## Key Naming Conventions

Use descriptive, hierarchical key names:

```
user:{userId}
session:{sessionId}
refresh_token:{userId}:{token}
rate_limit:{identifier}
cache:events:{eventId}
cache:events:list:{page}
```

## Best Practices

1. **Use TTL for temporary data** - Always set expiration for cache and sessions
2. **Namespace your keys** - Use prefixes to organize keys (e.g., `user:`, `session:`)
3. **Serialize complex objects** - Use JSON.stringify/parse for objects
4. **Handle null values** - Always check if cached value exists
5. **Invalidate on updates** - Delete cache when data changes
6. **Monitor memory usage** - Redis stores data in memory
7. **Use appropriate TTL** - Balance between freshness and performance

## TTL Guidelines

- **User sessions**: 24 hours (86400 seconds)
- **Refresh tokens**: 7 days (604800 seconds)
- **User data cache**: 1 hour (3600 seconds)
- **Event list cache**: 5 minutes (300 seconds)
- **Rate limiting**: 1 minute to 1 hour depending on use case

## Testing

The RedisService is fully tested with mocked Redis client. See:
```
test/unit/infrastructure/services/redis.service.spec.ts
```

## Monitoring

Check Redis connection:

```bash
docker exec -it eventra-redis redis-cli -a redis_pass ping
```

View all keys:

```bash
docker exec -it eventra-redis redis-cli -a redis_pass KEYS '*'
```

Get key value:

```bash
docker exec -it eventra-redis redis-cli -a redis_pass GET "user:123"
```

Check key TTL:

```bash
docker exec -it eventra-redis redis-cli -a redis_pass TTL "session:abc"
```

## Troubleshooting

### Connection Issues

If you see connection errors:

1. Check Redis is running: `docker ps | grep redis`
2. Verify environment variables in `.env`
3. Check Redis logs: `docker logs eventra-redis`

### Memory Issues

If Redis runs out of memory:

1. Check memory usage: `docker exec -it eventra-redis redis-cli -a redis_pass INFO memory`
2. Clear all keys: `docker exec -it eventra-redis redis-cli -a redis_pass FLUSHALL`
3. Adjust TTL values to expire data sooner

### Performance

For better performance:

1. Use pipelining for multiple operations
2. Avoid storing large objects
3. Use appropriate data structures (strings, hashes, sets)
4. Monitor slow queries with SLOWLOG
