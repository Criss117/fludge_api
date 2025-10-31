import { allPermission, Permission } from '@/shared/entities/permissions';
import { IsArray, IsEnum, IsNotEmpty } from 'class-validator';

export class EnsurePermissionsDto {
  @IsArray({ message: 'Los permisos deben ser un arreglo' })
  @IsEnum(allPermission, {
    each: true,
    message: 'Cada permiso debe ser un valor válido',
  })
  @IsNotEmpty({ message: 'Los permisos son obligatorios' })
  permissions: Permission[];
}
