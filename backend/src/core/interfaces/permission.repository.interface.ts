import { Permission } from '@core/entities/permission.entity';

export interface IPermissionRepository {
  create(permission: Permission): Promise<Permission>;
  findById(id: string): Promise<Permission | null>;
  findBySlug(slug: string): Promise<Permission | null>;
  findAll(): Promise<Permission[]>;
  findByIds(ids: string[]): Promise<Permission[]>;
  delete(id: string): Promise<boolean>;
}
