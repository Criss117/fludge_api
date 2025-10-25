import { UnauthorizedException } from '@nestjs/common';

export class NoSessionException extends UnauthorizedException {
  constructor(message?: string) {
    super(message || 'No se ha iniciado una sesión');
  }
}
