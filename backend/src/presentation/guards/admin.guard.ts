import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

interface AuthenticatedUser {
  userId: string;
  email: string;
  roles?: string[];
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext<{ req: { user?: AuthenticatedUser } }>();
    const user = gqlContext.req.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const isAdmin = this.checkAdminPermission(user);
    if (!isAdmin) {
      throw new ForbiddenException('Admin permission required');
    }

    return true;
  }

  private checkAdminPermission(user: AuthenticatedUser): boolean {
    return user.roles?.includes('admin') ?? false;
  }
}
