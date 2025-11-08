import { IsDate, IsUUID } from 'class-validator';

export class ProductCursorDto {
  @IsDate({
    message: 'La fecha del cursor no es válida',
  })
  lastCreatedAt: Date;

  @IsUUID(7, {
    message: 'El id del cursor no es válido',
  })
  lastProductId: string;
}
