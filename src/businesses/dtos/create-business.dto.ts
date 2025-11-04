import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBusinessDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsString({ message: 'El NIT debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El NIT es obligatorio' })
  @Transform(({ value }) => value?.trim())
  nit: string;

  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido' })
  @Transform(({ value }) => value?.trim())
  email: string;

  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @Transform(({ value }) => value?.trim())
  phone: string;

  @IsString({ message: 'La razón social debe ser una cadena de texto' })
  @Transform(({ value }) => value?.trim())
  legalName: string;

  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @Transform(({ value }) => value?.trim())
  address?: string | null;
}
