import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '@core/interfaces/user.repository.interface';
import { IRoleRepository } from '@core/interfaces/role.repository.interface';

@Injectable()
export class AssignRoleToUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IRoleRepository')
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(userId: string, roleId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new Error('Role not found');
    }
  }
}
