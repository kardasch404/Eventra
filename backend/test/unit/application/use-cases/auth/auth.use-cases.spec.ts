import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterUseCase } from '@application/use-cases/auth/register.use-case';
import { LoginUseCase } from '@application/use-cases/auth/login.use-case';
import { RefreshTokenUseCase } from '@application/use-cases/auth/refresh-token.use-case';
import { UuidService } from '@infrastructure/services/uuid.service';
import { JwtService } from '@infrastructure/services/jwt.service';
import { User } from '@core/entities/user.entity';

describe('Auth Use Cases', () => {
  let registerUseCase: RegisterUseCase;
  let loginUseCase: LoginUseCase;
  let refreshTokenUseCase: RefreshTokenUseCase;

  const mockUserRepository = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  };

  const mockUuidService = {
    generate: jest.fn(),
  };

  const mockJwtService = {
    generateAccessToken: jest.fn(),
    generateRefreshToken: jest.fn(),
    verifyRefreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterUseCase,
        LoginUseCase,
        RefreshTokenUseCase,
        { provide: 'IUserRepository', useValue: mockUserRepository },
        { provide: UuidService, useValue: mockUuidService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    registerUseCase = module.get<RegisterUseCase>(RegisterUseCase);
    loginUseCase = module.get<LoginUseCase>(LoginUseCase);
    refreshTokenUseCase = module.get<RefreshTokenUseCase>(RefreshTokenUseCase);

    jest.clearAllMocks();
  });

  describe('RegisterUseCase', () => {
    it('should register a new user successfully', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUuidService.generate.mockReturnValue('user-uuid');
      mockJwtService.generateAccessToken.mockReturnValue('access-token');
      mockJwtService.generateRefreshToken.mockReturnValue('refresh-token');
      mockUserRepository.create.mockResolvedValue(undefined);

      const result = await registerUseCase.execute(dto);

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: 'user-uuid',
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(mockUserRepository.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      const dto = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockUserRepository.findByEmail.mockResolvedValue(new User({ id: '1', email: dto.email }));

      await expect(registerUseCase.execute(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('LoginUseCase', () => {
    it('should login user successfully', async () => {
      const dto = { email: 'test@example.com', password: 'password123' };
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const user = new User({
        id: 'user-uuid',
        email: dto.email,
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
      });

      mockUserRepository.findByEmail.mockResolvedValue(user);
      mockJwtService.generateAccessToken.mockReturnValue('access-token');
      mockJwtService.generateRefreshToken.mockReturnValue('refresh-token');

      const result = await loginUseCase.execute(dto);

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const dto = { email: 'notfound@example.com', password: 'password123' };

      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(loginUseCase.execute(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const dto = { email: 'test@example.com', password: 'wrongpassword' };
      const user = new User({
        id: 'user-uuid',
        email: dto.email,
        password: await bcrypt.hash('correctpassword', 10),
        firstName: 'John',
        lastName: 'Doe',
      });

      mockUserRepository.findByEmail.mockResolvedValue(user);

      await expect(loginUseCase.execute(dto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('RefreshTokenUseCase', () => {
    it('should refresh tokens successfully', async () => {
      const dto = { refreshToken: 'valid-refresh-token' };
      const user = new User({
        id: 'user-uuid',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      });

      mockJwtService.verifyRefreshToken.mockReturnValue({ sub: 'user-uuid' });
      mockUserRepository.findById.mockResolvedValue(user);
      mockJwtService.generateAccessToken.mockReturnValue('new-access-token');
      mockJwtService.generateRefreshToken.mockReturnValue('new-refresh-token');

      const result = await refreshTokenUseCase.execute(dto);

      expect(result).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      const dto = { refreshToken: 'invalid-token' };

      mockJwtService.verifyRefreshToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(refreshTokenUseCase.execute(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const dto = { refreshToken: 'valid-refresh-token' };

      mockJwtService.verifyRefreshToken.mockReturnValue({ sub: 'user-uuid' });
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(refreshTokenUseCase.execute(dto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
