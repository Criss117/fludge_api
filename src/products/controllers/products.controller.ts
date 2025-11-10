import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateProductUsecase } from '../usecases/create-product.usecase';
import { Permissions } from '@/auth/decorators/permissions.decorator';
import { GetBusiness } from '@/auth/decorators/get-business.decorator';
import { CreateProductDto } from '../dtos/create-product.dto';
import { safeAction } from '@/shared/http/safe-action';
import { HTTPResponse } from '@/shared/http/common.response';
import { FindOneProductUsecase } from '../usecases/find-one-product.usecase';
import { FindManyProductsUsecase } from '../usecases/find-many-products.usecase';
import type { ProductCursor } from '@/shared/entities/cursor.entity';
import { ProductsCursorPipe } from '../dtos/products-cursor.pipe';

@Controller('businesses/:businessSlug/products')
export class ProductsController {
  constructor(
    private readonly createProductUsecase: CreateProductUsecase,
    private readonly findOneProductUsecase: FindOneProductUsecase,
    private readonly findManyProductsUsecase: FindManyProductsUsecase,
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

  @Get()
  @Permissions('products:read')
  public async findMany(
    @GetBusiness('id') businessId: string,
    @Query('nextCursor', ProductsCursorPipe) cursor?: ProductCursor,
    @Query('name') name?: string,
    @Query('barcode') barcode?: string,
    @Query('slug') slug?: string,
    @Query(
      'limit',
      new ParseIntPipe({
        optional: true,
      }),
    )
    limit = 50,
    @Query(
      'categoryId',
      new ParseUUIDPipe({
        version: '7',
        optional: true,
      }),
    )
    categoryId?: string,
  ) {
    const response = await safeAction(
      () =>
        this.findManyProductsUsecase.execute(businessId, {
          limit,
          cursor: cursor ?? null,
          filters: {
            name,
            barcode,
            slug,
            categoryId,
          },
        }),
      'No se pudieron obtener los productos',
    );

    const base64Cursor = response.nextCursor
      ? Buffer.from(JSON.stringify(response.nextCursor)).toString('base64')
      : null;

    return HTTPResponse.ok('Los productos se han obtenido correctamente', {
      items: response.items,
      nextCursor: base64Cursor,
    });
  }
}
