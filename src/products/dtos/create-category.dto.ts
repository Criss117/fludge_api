import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsArray,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCategoryBase {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
  name: string;

  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsOptional()
  @MaxLength(225, {
    message: 'La descripción no puede exceder los 255 caracteres',
  })
  description?: string | null | undefined;
}

export class CreateCategoryDto extends CreateCategoryBase {
  @IsUUID('4', { message: 'El ID del padre debe ser un UUID válido' })
  @IsOptional()
  parentId?: string | null | undefined;

  @IsArray({ message: 'Los hijos deben ser un arreglo' })
  @IsOptional()
  @ValidateNested({
    each: true,
    message: 'Cada hijo debe ser una categoría válida',
  })
  @Type(() => CreateCategoryBase)
  childrens?: CreateCategoryBase[];
}
