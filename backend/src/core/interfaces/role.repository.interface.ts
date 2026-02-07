import { Role } from '@core/entities/role.entity';

export interface IRoleRepository {
  create(role: Role): Promise<Role>;
  findById(id: string): Promise<Role | null>;
  findBySlug(slug: string): Promise<Role | null>;
  findAll(): Promise<Role[]>;
  update(id: string, data: Partial<Role>): Promise<Role | null>;
  delete(id: string): Promise<boolean>;
  addPermissions(roleId: string, permissionIds: string[]): Promise<void>;
  removePermissions(roleId: string, permissionIds: string[]): Promise<void>;
}
