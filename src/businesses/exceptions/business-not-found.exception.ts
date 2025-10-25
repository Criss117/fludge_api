import { NotFoundException } from '@nestjs/common';

export class BusinessNotFoundException extends NotFoundException {
  constructor(message?: string) {
    super(message || 'No se ha encontrado el negocio');
  }
}
