import { Permission } from '@/shared/entities/permissions';
import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { PermissionsGuard } from '../guards/permissions.guard';

export const META_PERMISSIONS = Symbol('permissioss');

export function Permissions(...args: Permission[]) {
  return applyDecorators(
    SetMetadata(META_PERMISSIONS, args),
    UseGuards(PermissionsGuard),
  );
}
