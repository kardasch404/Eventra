import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export interface TokenPayload {
  sub: string;
  roles?: string[];
  type?: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(userId: string, roles: string[]): string {
    const payload: TokenPayload = {
      sub: userId,
      roles,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION', '15m'),
    });
  }

  generateRefreshToken(userId: string): string {
    const payload: TokenPayload = {
      sub: userId,
      type: 'refresh',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d'),
    });
  }

  verifyAccessToken(token: string): TokenPayload {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  verifyRefreshToken(token: string): TokenPayload {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }

  decodeToken(token: string): TokenPayload | null {
    return this.jwtService.decode(token);
  }
}
