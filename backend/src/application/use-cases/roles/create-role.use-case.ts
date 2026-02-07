import { Inject, Injectable } from '@nestjs/common';
import { IRoleRepository } from '@core/interfaces/role.repository.interface';
import { Role } from '@core/entities/role.entity';
import { CreateRoleDto } from '@application/dto/roles/create-role.dto';
import { UuidService } from '@infrastructure/services/uuid.service';

@Injectable()
export class CreateRoleUseCase {
  constructor(
    @Inject('IRoleRepository')
    private readonly roleRepository: IRoleRepository,
    private readonly uuidService: UuidService,
  ) {}

  async execute(dto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.roleRepository.findBySlug(dto.slug);
    if (existingRole) {
      throw new Error('Role with this slug already exists');
    }

    const role = new Role({
      id: this.uuidService.generate(),
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      isSystem: dto.isSystem || false,
    });

    return this.roleRepository.create(role);
  }
}
