import { ConflictException } from '@nestjs/common';

export class BusinessAlreadyExistsException extends ConflictException {
  constructor(message?: string) {
    super(message || 'El negocio ya existe');
  }
}
