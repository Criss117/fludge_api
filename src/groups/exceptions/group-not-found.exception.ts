import { NotFoundException } from '@nestjs/common';

export class GroupNotFoundException extends NotFoundException {
  constructor(message?: string) {
    super(message || 'El grupo no existe');
  }
}
