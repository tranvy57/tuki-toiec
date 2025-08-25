import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permissions } from 'src/common/decorator/permission.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get(Roles, context.getHandler());
    const requiredPermissions = this.reflector.get(
      Permissions,
      context.getHandler(),
    );

    const { user } = context.switchToHttp().getRequest();

    // console.log('requiredRoles:', requiredRoles);
    // console.log('user.roles:', user.roles);

    if (!requiredRoles && !requiredPermissions) {
      return true;
    }

    if (user?.roles?.some((r) => r.name === 'admin')) {
      return true;
    }

    if (
      user?.roles?.some(
        (r: any) => (typeof r === 'string' ? r : r.name) === 'admin',
      )
    ) {
      return true;
    }

    if (requiredRoles) {
      const userRoleNames =
        user.roles?.map((r: any) => (typeof r === 'string' ? r : r.name)) ?? [];

      const hasRole = requiredRoles.some((role) =>
        userRoleNames.includes(role),
      );
      if (!hasRole) return false;
    }

    if (requiredPermissions) {
      const userPerms =
        user.roles?.flatMap((r: any) =>
          typeof r === 'string' ? [] : r.permissions?.map((p: any) => p.name),
        ) ?? [];

      const hasAllPerms = requiredPermissions.every((perm) =>
        userPerms.includes(perm),
      );
      if (!hasAllPerms) return false;
    }

    return true;
  }
}
