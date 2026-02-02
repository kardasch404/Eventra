export class RefreshToken {
  id: string; // UUID v7
  userId: string; // UUID v7
  token: string;
  expiresAt: Date;
  isRevoked: boolean;
  createdAt: Date;

  constructor(data: Partial<RefreshToken>) {
    Object.assign(this, data);
    this.isRevoked = data.isRevoked ?? false;
    this.createdAt = data.createdAt ?? new Date();
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isValid(): boolean {
    return !this.isRevoked && !this.isExpired();
  }

  revoke(): void {
    this.isRevoked = true;
  }
}
