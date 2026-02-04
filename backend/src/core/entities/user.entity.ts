export class User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
    this.isEmailVerified = data.isEmailVerified ?? false;
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  verifyEmail(): void {
    this.isEmailVerified = true;
    this.updatedAt = new Date();
  }
}
