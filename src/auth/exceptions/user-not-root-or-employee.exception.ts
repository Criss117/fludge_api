import { UnauthorizedException } from '@nestjs/common';

export class UserNotRootOrEmployeeException extends UnauthorizedException {
  constructor(message?: string) {
    super(message || 'El usuario no es root ni es empleado');
  }
}
