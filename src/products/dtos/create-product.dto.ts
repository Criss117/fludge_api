import {
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  Min,
  IsNotEmpty,
  MaxLength,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString({
    message: 'El nombre del producto no puede estar vacío',
  })
  @IsNotEmpty({
    message: 'El nombre del producto no puede estar vacío',
  })
  @MaxLength(100, {
    message: 'El nombre del producto no puede tener mas de 100 caracteres',
  })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsString({
    message: 'El código de barras del producto no puede estar vacío',
  })
  @IsNotEmpty({
    message: 'El código de barras del producto no puede estar vacío',
  })
  @MaxLength(225, {
    message:
      'El código de barras del producto no puede tener mas de 225 caracteres',
  })
  @Transform(({ value }) => value?.trim())
  barcode: string;

  @IsInt({
    message: 'El precio de compra debe ser un número entero',
  })
  @Min(1, { message: 'El precio de compra debe ser mayor a 0' })
  purchasePrice: number;

  @IsInt({
    message: 'El precio de venta debe ser un número entero',
  })
  @Min(1, { message: 'El precio de venta debe ser mayor a 0' })
  salePrice: number;

  @IsInt({
    message: 'El precio mayorista debe ser un número entero',
  })
  @Min(1, { message: 'El precio mayorista debe ser mayor a 0' })
  wholesalePrice: number;

  @IsInt({
    message: 'El stock debe ser un número entero',
  })
  @Min(1, { message: 'El stock debe ser mayor a 0' })
  stock: number;

  @IsInt({
    message: 'El stock mínimo debe ser un número entero',
  })
  @Min(1, { message: 'El stock mínimo debe ser mayor a 0' })
  minStock: number;

  @IsOptional()
  @IsString({
    message: 'La imagen del producto debe de ser una cadena de caracteres',
  })
  @MaxLength(225, {
    message: 'La imagen del producto no puede tener mas de 225 caracteres',
  })
  @Transform(({ value }) => value?.trim())
  description?: string | null;

  @IsOptional()
  @IsUUID('4', {
    message: 'La categoría del producto debe de ser un uuid válido',
  })
  @Transform(({ value }) => value?.trim())
  categoryId?: string | null;

  @IsOptional()
  @IsInt({
    message: 'El precio de oferta debe de ser un número entero',
  })
  @Min(1, { message: 'El precio de oferta debe ser mayor a 0' })
  offerPrice?: number | null;

  @IsOptional()
  @IsBoolean()
  allowNegativeStock?: boolean;
}
