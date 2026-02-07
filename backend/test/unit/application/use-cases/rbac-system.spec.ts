import { CreateRoleUseCase } from '@application/use-cases/roles/create-role.use-case';
import { AssignPermissionsUseCase } from '@application/use-cases/roles/assign-permissions.use-case';
import { AssignRoleToUserUseCase } from '@application/use-cases/roles/assign-role-to-user.use-case';
import { PermissionService } from '@infrastructure/services/permission.service';
import { IRoleRepository } from '@core/interfaces/role.repository.interface';
import { IPermissionRepository } from '@core/interfaces/permission.repository.interface';
import { IUserRepository } from '@core/interfaces/user.repository.interface';
import { Role } from '@core/entities/role.entity';
import { Permission } from '@core/entities/permission.entity';
import { User } from '@core/entities/user.entity';
import { UuidService } from '@infrastructure/services/uuid.service';

describe('RBAC System', () => {
  let mockRoleRepository: jest.Mocked<IRoleRepository>;
  let mockPermissionRepository: jest.Mocked<IPermissionRepository>;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockUuidService: jest.Mocked<UuidService>;

  beforeEach(() => {
    mockRoleRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addPermissions: jest.fn(),
      removePermissions: jest.fn(),
    };

    mockPermissionRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn(),
      findAll: jest.fn(),
      findByIds: jest.fn(),
      delete: jest.fn(),
    };

    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockUuidService = {
      generate: jest.fn(),
    } as unknown as jest.Mocked<UuidService>;
  });

  describe('CreateRoleUseCase', () => {
    let useCase: CreateRoleUseCase;

    beforeEach(() => {
      useCase = new CreateRoleUseCase(mockRoleRepository, mockUuidService);
    });

    it('should create role successfully', async () => {
      const dto = {
        name: 'Admin',
        slug: 'admin',
        description: 'Administrator role',
        isSystem: true,
      };

      mockRoleRepository.findBySlug.mockResolvedValue(null);
      mockUuidService.generate.mockReturnValue('role-123');
      mockRoleRepository.create.mockResolvedValue(new Role({ id: 'role-123', ...dto }));

      const result = await useCase.execute(dto);

      expect(result.slug).toBe('admin');
      expect(mockRoleRepository.create).toHaveBeenCalled();
    });

    it('should throw error if role slug already exists', async () => {
      const dto = {
        name: 'Admin',
        slug: 'admin',
        description: 'Administrator role',
      };

      mockRoleRepository.findBySlug.mockResolvedValue(new Role({ id: 'role-123', ...dto }));

      await expect(useCase.execute(dto)).rejects.toThrow('Role with this slug already exists');
    });
  });

  describe('AssignPermissionsUseCase', () => {
    let useCase: AssignPermissionsUseCase;

    beforeEach(() => {
      useCase = new AssignPermissionsUseCase(mockRoleRepository, mockPermissionRepository);
    });

    it('should assign permissions to role', async () => {
      const roleId = 'role-123';
      const permissionIds = ['perm-1', 'perm-2'];

      mockRoleRepository.findById.mockResolvedValue(
        new Role({ id: roleId, name: 'Admin', slug: 'admin', description: 'Admin role' }),
      );
      mockPermissionRepository.findByIds.mockResolvedValue([
        new Permission({ id: 'perm-1', resource: 'event', action: 'create' }),
        new Permission({ id: 'perm-2', resource: 'event', action: 'update' }),
      ]);

      await useCase.execute(roleId, permissionIds);

      expect(mockRoleRepository.addPermissions).toHaveBeenCalledWith(roleId, permissionIds);
    });

    it('should throw error if role not found', async () => {
      mockRoleRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('role-123', ['perm-1'])).rejects.toThrow('Role not found');
    });

    it('should throw error if some permissions not found', async () => {
      mockRoleRepository.findById.mockResolvedValue(
        new Role({ id: 'role-123', name: 'Admin', slug: 'admin', description: 'Admin role' }),
      );
      mockPermissionRepository.findByIds.mockResolvedValue([
        new Permission({ id: 'perm-1', resource: 'event', action: 'create' }),
      ]);

      await expect(useCase.execute('role-123', ['perm-1', 'perm-2'])).rejects.toThrow(
        'Some permissions not found',
      );
    });
  });

  describe('AssignRoleToUserUseCase', () => {
    let useCase: AssignRoleToUserUseCase;

    beforeEach(() => {
      useCase = new AssignRoleToUserUseCase(mockUserRepository, mockRoleRepository);
    });

    it('should assign role to user', async () => {
      const userId = 'user-123';
      const roleId = 'role-123';

      mockUserRepository.findById.mockResolvedValue(
        new User({ id: userId, email: 'test@example.com', firstName: 'Test', lastName: 'User' }),
      );
      mockRoleRepository.findById.mockResolvedValue(
        new Role({ id: roleId, name: 'Admin', slug: 'admin', description: 'Admin role' }),
      );

      await useCase.execute(userId, roleId);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockRoleRepository.findById).toHaveBeenCalledWith(roleId);
    });

    it('should throw error if user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('user-123', 'role-123')).rejects.toThrow('User not found');
    });

    it('should throw error if role not found', async () => {
      mockUserRepository.findById.mockResolvedValue(
        new User({
          id: 'user-123',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
        }),
      );
      mockRoleRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('user-123', 'role-123')).rejects.toThrow('Role not found');
    });
  });

  describe('PermissionService', () => {
    let service: PermissionService;

    beforeEach(() => {
      service = new PermissionService();
    });

    it('should check if user has permission', () => {
      const userPermissions = ['event:create', 'event:update'];

      expect(service.hasPermission(userPermissions, 'event:create')).toBe(true);
      expect(service.hasPermission(userPermissions, 'event:delete')).toBe(false);
    });

    it('should check if user has any permission', () => {
      const userPermissions = ['event:create', 'event:update'];

      expect(service.hasAnyPermission(userPermissions, ['event:create', 'event:delete'])).toBe(
        true,
      );
      expect(service.hasAnyPermission(userPermissions, ['event:delete', 'event:cancel'])).toBe(
        false,
      );
    });

    it('should check if user has all permissions', () => {
      const userPermissions = ['event:create', 'event:update', 'event:delete'];

      expect(service.hasAllPermissions(userPermissions, ['event:create', 'event:update'])).toBe(
        true,
      );
      expect(service.hasAllPermissions(userPermissions, ['event:create', 'event:cancel'])).toBe(
        false,
      );
    });
  });
});
