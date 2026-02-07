import { Inject, Injectable } from '@nestjs/common';
import { IRoleRepository } from '@core/interfaces/role.repository.interface';
import { IPermissionRepository } from '@core/interfaces/permission.repository.interface';

@Injectable()
export class AssignPermissionsUseCase {
  constructor(
    @Inject('IRoleRepository')
    private readonly roleRepository: IRoleRepository,
    @Inject('IPermissionRepository')
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(roleId: string, permissionIds: string[]): Promise<void> {
    const role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    const permissions = await this.permissionRepository.findByIds(permissionIds);
    if (permissions.length !== permissionIds.length) {
      throw new Error('Some permissions not found');
    }

    await this.roleRepository.addPermissions(roleId, permissionIds);
  }
}
