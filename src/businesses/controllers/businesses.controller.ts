import { Body, Controller, ForbiddenException, Post } from '@nestjs/common';
import { CreateBusinessDto } from '../dtos/create-business.dto';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { HTTPResponse } from '@/shared/http/common.response';
import type { UserDetail } from '@/shared/entities/user.entity';
import { CreateBusinessUseCase } from '../usecases/create-business.usecase';
import { safeAction } from '@/shared/http/safe-action';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly createBusinessUseCase: CreateBusinessUseCase) {}

  @Post()
  public async createBusiness(
    @GetUser() user: UserDetail,
    @Body() values: CreateBusinessDto,
  ) {
    if (!user.isRoot) throw new ForbiddenException();
    const res = await safeAction(
      () => this.createBusinessUseCase.execute(user.id, values),
      'Error al crear el negocio',
    );

    return HTTPResponse.created('Business created correctly', res);
  }
}
