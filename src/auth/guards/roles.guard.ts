import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles } from '../constants/roles.enum';
import { User } from 'src/user/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRole = this.reflector.get<string>('role', context.getHandler());
        if (!requiredRole) {
            return true; // No specific role required, allow access
        }

        const request = context.switchToHttp().getRequest();
        const user: User = request.user; // Assuming user is set in the request by the AuthGuard

        if (user.role !== requiredRole) {
            throw new ForbiddenException('You do not have permission to perform this action.');
        }
        return true;
    }
}
