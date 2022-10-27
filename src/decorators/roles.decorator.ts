import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/modules/users/constant';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
