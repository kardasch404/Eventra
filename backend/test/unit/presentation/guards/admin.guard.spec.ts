import { AdminGuard } from '@presentation/guards/admin.guard';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

describe('AdminGuard', () => {
  let guard: AdminGuard;

  beforeEach(() => {
    guard = new AdminGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access when user is authenticated', () => {
    const mockContext = {
      getType: jest.fn().mockReturnValue('graphql'),
      switchToHttp: jest.fn(),
    } as unknown as ExecutionContext;

    const mockGqlContext = {
      getContext: jest.fn().mockReturnValue({
        req: {
          user: { userId: 'user-1' },
        },
      }),
    };

    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(mockGqlContext as any);

    const result = guard.canActivate(mockContext);

    expect(result).toBe(true);
  });

  it('should throw ForbiddenException when user is not authenticated', () => {
    const mockContext = {
      getType: jest.fn().mockReturnValue('graphql'),
      switchToHttp: jest.fn(),
    } as unknown as ExecutionContext;

    const mockGqlContext = {
      getContext: jest.fn().mockReturnValue({
        req: {},
      }),
    };

    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(mockGqlContext as any);

    expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
    expect(() => guard.canActivate(mockContext)).toThrow('User not authenticated');
  });

  it('should allow access for admin users', () => {
    const mockContext = {
      getType: jest.fn().mockReturnValue('graphql'),
      switchToHttp: jest.fn(),
    } as unknown as ExecutionContext;

    const mockGqlContext = {
      getContext: jest.fn().mockReturnValue({
        req: {
          user: { userId: 'admin-1', roles: ['admin'] },
        },
      }),
    };

    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(mockGqlContext as any);

    const result = guard.canActivate(mockContext);

    expect(result).toBe(true);
  });
});
