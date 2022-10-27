import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

// 待完善,现在有问题,不能先取到req.user
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles || !roles.length) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return matchRoles(user, roles);
  }
}

function matchRoles(user, roles) {
  return true;
}
