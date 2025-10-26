import { allPermission, Permission } from '@/shared/entities/permissions';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateGroupDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  description?: string | null;

  @IsOptional()
  @IsBoolean({ message: 'El valor por defecto debe ser verdadero o falso' })
  isDefault?: boolean;

  @IsArray({ message: 'Los permisos deben ser un arreglo' })
  @IsEnum(allPermission, {
    each: true,
    message: 'Cada permiso debe ser un valor válido',
  })
  @IsNotEmpty({ message: 'Los permisos son obligatorios' })
  permissions: Permission[];
}
