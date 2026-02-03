import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { IUserRepository } from '@core/interfaces/user.repository.interface';
import { JwtService } from '@infrastructure/services/jwt.service';
import { RefreshTokenDto, AuthResponse } from '@application/dto/auth/auth.dto';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: RefreshTokenDto): Promise<AuthResponse> {
    let payload;
    try {
      payload = this.jwtService.verifyRefreshToken(dto.refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const roles = ['participant'];
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
      },
    };
  }
}
