import { Injectable } from '@nestjs/common';
import { ProductsQueriesRepository } from '../repositories/products-queries.repository';
import { FindOneProductDto } from '../repositories/dtos/find-one-product.dto';
import { ProductNotFoundException } from '../exceptions/product-not-found.exception';

@Injectable()
export class FindOneProductUsecase {
  constructor(
    private readonly productsQueriesRepository: ProductsQueriesRepository,
  ) {}

  public async execute(meta: FindOneProductDto) {
    const product = await this.productsQueriesRepository.findOne(meta, {
      ensureActive: true,
    });

    if (!product) throw new ProductNotFoundException();

    return product;
  }
}
