import { BadRequestException } from '@nestjs/common';

export class CanNotCreateCategoriesException extends BadRequestException {
  constructor(message?: string) {
    super(message || 'No se pudieron crear las categorías');
  }
}
