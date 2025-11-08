import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ProductCursor } from '@/shared/entities/cursor.entity';
import { ProductCursorDto } from './product-cursor.dto';
import { validateSync } from 'class-validator';

@Injectable()
export class ProductsCursorPipe
  implements PipeTransform<string, ProductCursor | undefined>
{
  transform(value?: string) {
    if (!value) return;

    const plainCursor = Buffer.from(value, 'base64').toString('utf-8');
    const obj = JSON.parse(plainCursor);

    const cursor = new ProductCursorDto();

    cursor.lastCreatedAt = new Date(obj.lastCreatedAt);
    cursor.lastProductId = obj.lastProductId;

    const res = validateSync(cursor);

    if (res.length > 0) {
      throw new BadRequestException('El cursor no es válido');
    }

    return cursor;
  }
}
