import { Body, Controller, Post } from '@nestjs/common';
import { CreateCategoryUsecase } from '../usecases/create-category.usecase';
import { Permissions } from '@/auth/decorators/permissions.decorator';
import { GetBusiness } from '@/auth/decorators/get-business.decorator';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { safeAction } from '@/shared/http/safe-action';
import { HTTPResponse } from '@/shared/http/common.response';

@Controller('businesses/:businessSlug/categories')
export class CategoriesController {
  constructor(private readonly createCategoryUsecase: CreateCategoryUsecase) {}

  @Post()
  @Permissions('categories:create')
  public async createCategories(
    @GetBusiness('id') businessId: string,
    @Body() values: CreateCategoryDto,
  ) {
    await safeAction(
      () => this.createCategoryUsecase.execute(businessId, values),
      'No se pudieron crear las categorías',
    );

    return HTTPResponse.created(
      'Las categorías se han creado correctamente',
      null,
    );
  }
}
