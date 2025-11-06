import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { HTTPResponse } from '@/shared/http/common.response';
import { Public } from '@/auth/decorators/public-route.decorator';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @Public()
  public async seed() {
    const res = await this.seedService.seed();

    return HTTPResponse.ok('Se ha limpiado correctamente', res);
  }
}
