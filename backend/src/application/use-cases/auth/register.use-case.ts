import { Injectable, ConflictException, Inject } from '@nestjs/common';
import { IUserRepository } from '@core/interfaces/user.repository.interface';
import { User } from '@core/entities/user.entity';
import { Email } from '@core/value-objects/email.vo';
import { Password } from '@core/value-objects/password.vo';
import { UuidService } from '@infrastructure/services/uuid.service';
import { JwtService } from '@infrastructure/services/jwt.service';
import { RegisterDto, AuthResponse } from '@application/dto/auth/auth.dto';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly uuidService: UuidService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: RegisterDto): Promise<AuthResponse> {
    const email = new Email(dto.email);
    const existingUser = await this.userRepository.findByEmail(email.getValue());
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const password = await Password.fromPlainText(dto.password);
    const userId = this.uuidService.generate();

    const user = new User({
      id: userId,
      email: email.getValue(),
      password: password.getValue(),
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
        roles,
      },
    };
  }
}
