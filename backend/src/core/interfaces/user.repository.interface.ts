import { User } from '@core/entities/user.entity';

export interface PaginatedUsersResult {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserFilters {
  search?: string;
  role?: string;
  isEmailVerified?: boolean;
}

export interface IUserRepository {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  findWithFilters(filters: UserFilters, pagination: { page: number; limit: number }): Promise<PaginatedUsersResult>;
  update(id: string, data: Partial<User>): Promise<User | null>;
  updateRoles(id: string, roles: string[]): Promise<User | null>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
}
