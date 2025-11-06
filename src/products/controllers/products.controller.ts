import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateProductUsecase } from '../usecases/create-product.usecase';
import { Permissions } from '@/auth/decorators/permissions.decorator';
import { GetBusiness } from '@/auth/decorators/get-business.decorator';
import { CreateProductDto } from '../dtos/create-product.dto';
import { safeAction } from '@/shared/http/safe-action';
import { HTTPResponse } from '@/shared/http/common.response';
import { FindOneProductUsecase } from '../usecases/find-one-product.usecase';

@Controller('businesses/:businessSlug/products')
export class ProductsController {
  constructor(
    private readonly createProductUsecase: CreateProductUsecase,
    private readonly findOneProductUsecase: FindOneProductUsecase,
  ) {}

  @Post()
  @Permissions('products:create')
  public async create(
    @GetBusiness('id') businessId: string,
    @Body() values: CreateProductDto,
  ) {
    await safeAction(
      () => this.createProductUsecase.execute(businessId, values),
      'No se pudo registrar el producto',
    );

    return HTTPResponse.created(
      'El producto se ha registrado correctamente',
      null,
    );
  }

  @Get(':productSlug')
  @Permissions('products:read')
  public async findOne(
    @GetBusiness('id') businessId: string,
    @Param('productSlug') productSlug: string,
  ) {
    const product = await safeAction(
      () =>
        this.findOneProductUsecase.execute({
          businessId,
          slug: productSlug,
        }),
      'No se pudo obtener el producto',
    );

    return HTTPResponse.ok('El producto se ha obtenido correctamente', product);
  }
}
