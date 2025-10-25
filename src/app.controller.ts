import { Controller, Get } from '@nestjs/common';
import { HTTPResponse } from './shared/http/common.response';

@Controller()
export class AppController {
  constructor() {}

  @Get('health')
  getHealth() {
    return HTTPResponse.ok<null>('OK');
  }
}
