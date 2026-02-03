/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@infrastructure/services/jwt.service';

describe('JwtService', () => {
  let service: JwtService;
  let nestJwtService: NestJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: NestJwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
            decode: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue?: string) => {
              const config: Record<string, string> = {
                JWT_ACCESS_SECRET: 'test-access-secret',
                JWT_REFRESH_SECRET: 'test-refresh-secret',
                JWT_ACCESS_EXPIRATION: '15m',
                JWT_REFRESH_EXPIRATION: '7d',
              };
              return config[key] || defaultValue;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<JwtService>(JwtService);
    nestJwtService = module.get<NestJwtService>(NestJwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateAccessToken', () => {
    it('should generate access token with userId and roles', () => {
      const userId = 'user-123';
      const roles = ['admin', 'user'];
      const mockToken = 'mock-access-token';

      jest.spyOn(nestJwtService, 'sign' as never).mockReturnValue(mockToken as never);

      const token = service.generateAccessToken(userId, roles);

      expect(token).toBe(mockToken);
      expect(nestJwtService.sign).toHaveBeenCalledWith(
        { sub: userId, roles },
        { secret: 'test-access-secret', expiresIn: '15m' },
      );
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate refresh token with userId', () => {
      const userId = 'user-123';
      const mockToken = 'mock-refresh-token';

      jest.spyOn(nestJwtService, 'sign' as never).mockReturnValue(mockToken as never);

      const token = service.generateRefreshToken(userId);

      expect(token).toBe(mockToken);
      expect(nestJwtService.sign).toHaveBeenCalledWith(
        { sub: userId, type: 'refresh' },
        { secret: 'test-refresh-secret', expiresIn: '7d' },
      );
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify and return access token payload', () => {
      const token = 'valid-access-token';
      const mockPayload = { sub: 'user-123', roles: ['user'] };

      jest.spyOn(nestJwtService, 'verify' as never).mockReturnValue(mockPayload as never);

      const payload = service.verifyAccessToken(token);

      expect(payload).toEqual(mockPayload);
      expect(nestJwtService.verify).toHaveBeenCalledWith(token, {
        secret: 'test-access-secret',
      });
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify and return refresh token payload', () => {
      const token = 'valid-refresh-token';
      const mockPayload = { sub: 'user-123', type: 'refresh' };

      jest.spyOn(nestJwtService, 'verify' as never).mockReturnValue(mockPayload as never);

      const payload = service.verifyRefreshToken(token);

      expect(payload).toEqual(mockPayload);
      expect(nestJwtService.verify).toHaveBeenCalledWith(token, {
        secret: 'test-refresh-secret',
      });
    });
  });

  describe('decodeToken', () => {
    it('should decode token without verification', () => {
      const token = 'some-token';
      const mockPayload = { sub: 'user-123', roles: ['user'] };

      jest.spyOn(nestJwtService, 'decode' as never).mockReturnValue(mockPayload as never);

      const payload = service.decodeToken(token);

      expect(payload).toEqual(mockPayload);
      expect(nestJwtService.decode).toHaveBeenCalledWith(token);
    });

    it('should return null for invalid token', () => {
      const token = 'invalid-token';

      jest.spyOn(nestJwtService, 'decode' as never).mockReturnValue(null as never);

      const payload = service.decodeToken(token);

      expect(payload).toBeNull();
    });
  });
});
