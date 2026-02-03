import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUserRepository } from '@core/interfaces/user.repository.interface';
import { User } from '@core/entities/user.entity';
import { UuidService } from '@infrastructure/services/uuid.service';
import { JwtService } from '@infrastructure/services/jwt.service';
import { RegisterDto, AuthResponse } from '@application/dto/auth/auth.dto';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly uuidService: UuidService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const userId = this.uuidService.generate();

    const user = new User({
      id: userId,
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      isEmailVerified: false,
    });

    await this.userRepository.create(user);

    const roles = ['participant'];
    const accessToken = this.jwtService.generateAccessToken(userId, roles);
    const refreshToken = this.jwtService.generateRefreshToken(userId);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }
}
