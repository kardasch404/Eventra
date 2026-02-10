import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { IUserRepository } from '@core/interfaces/user.repository.interface';
import { Email } from '@core/value-objects/email.vo';
import { Password } from '@core/value-objects/password.vo';
import { JwtService } from '@infrastructure/services/jwt.service';
import { LoginDto, AuthResponse } from '@application/dto/auth/auth.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginDto): Promise<AuthResponse> {
    const email = new Email(dto.email);
    const user = await this.userRepository.findByEmail(email.getValue());
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const password = Password.fromHash(user.password);
    const isPasswordValid = await password.compare(dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Use user's actual roles from the database
    const roles = user.roles || ['participant'];
    const accessToken = this.jwtService.generateAccessToken(user.id, roles);
    const refreshToken = this.jwtService.generateRefreshToken(user.id);

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
