import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

export class Password {
  private readonly hashedValue: string;
  private static readonly SALT_ROUNDS = 12;

  private constructor(hashedValue: string) {
    this.hashedValue = hashedValue;
  }

  static async fromPlainText(plainPassword: string): Promise<Password> {
    if (!plainPassword || plainPassword.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }
    const hashed = await bcrypt.hash(plainPassword, Password.SALT_ROUNDS);
    return new Password(hashed);
  }

  static fromHash(hashedValue: string): Password {
    return new Password(hashedValue);
  }

  async compare(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.hashedValue);
  }

  getValue(): string {
    return this.hashedValue;
  }
}
