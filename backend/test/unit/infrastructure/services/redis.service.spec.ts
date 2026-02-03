import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@infrastructure/services/redis.service';

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
    exists: jest.fn(),
    quit: jest.fn(),
  }));
});

describe('RedisService', () => {
  let service: RedisService;
  let mockRedisClient: {
    get: jest.Mock;
    set: jest.Mock;
    setex: jest.Mock;
    del: jest.Mock;
    exists: jest.Mock;
    quit: jest.Mock;
  };

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: string | number) => {
      const config: Record<string, string | number> = {
        REDIS_HOST: 'localhost',
        REDIS_PORT: 6379,
        REDIS_PASSWORD: 'test-password',
      };
      return config[key] || defaultValue;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisService, { provide: ConfigService, useValue: mockConfigService }],
    }).compile();

    service = module.get<RedisService>(RedisService);
    mockRedisClient = (service as unknown as { client: typeof mockRedisClient }).client;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should get a value', async () => {
      const key = 'test-key';
      const value = 'test-value';
      mockRedisClient.get.mockResolvedValue(value);

      const result = await service.get(key);

      expect(result).toBe(value);
      expect(mockRedisClient.get).toHaveBeenCalledWith(key);
    });

    it('should return null for non-existent key', async () => {
      mockRedisClient.get.mockResolvedValue(null);

      const result = await service.get('non-existent-key');

      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should set a value without TTL', async () => {
      const key = 'test-key';
      const value = 'test-value';
      mockRedisClient.set.mockResolvedValue('OK');

      await service.set(key, value);

      expect(mockRedisClient.set).toHaveBeenCalledWith(key, value);
    });

    it('should set a value with TTL', async () => {
      const key = 'test-key-ttl';
      const value = 'test-value-ttl';
      const ttl = 10;
      mockRedisClient.setex.mockResolvedValue('OK');

      await service.set(key, value, ttl);

      expect(mockRedisClient.setex).toHaveBeenCalledWith(key, ttl, value);
    });
  });

  describe('del', () => {
    it('should delete a key', async () => {
      const key = 'test-key-delete';
      mockRedisClient.del.mockResolvedValue(1);

      await service.del(key);

      expect(mockRedisClient.del).toHaveBeenCalledWith(key);
    });
  });

  describe('exists', () => {
    it('should return true if key exists', async () => {
      const key = 'test-key-exists';
      mockRedisClient.exists.mockResolvedValue(1);

      const exists = await service.exists(key);

      expect(exists).toBe(true);
      expect(mockRedisClient.exists).toHaveBeenCalledWith(key);
    });

    it('should return false if key does not exist', async () => {
      mockRedisClient.exists.mockResolvedValue(0);

      const exists = await service.exists('non-existent-key');

      expect(exists).toBe(false);
    });
  });

  describe('onModuleDestroy', () => {
    it('should quit the Redis client', async () => {
      mockRedisClient.quit.mockResolvedValue('OK');

      await service.onModuleDestroy();

      expect(mockRedisClient.quit).toHaveBeenCalled();
    });
  });
});
