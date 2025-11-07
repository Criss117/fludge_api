import { Injectable } from '@nestjs/common';
import { ProductsQueriesRepository } from '../repositories/products-queries.repository';

type Filters = {
  name?: string;
  barcode?: string;
  productId?: string;
  categoryId?: string;
  slug?: string;
};

type Cursor = {
  lastCreatedAt: Date;
  lastProductId: string;
};

type Options = {
  filters?: Filters;
  cursor: Cursor | null;
};

@Injectable()
export class FindManyProductsUsecase {
  constructor(
    private readonly productsQueriesRepository: ProductsQueriesRepository,
  ) {}

  public async execute(businessId: string, limit = 50, options: Options) {
    const { cursor, filters } = options;

    const products = await this.productsQueriesRepository.findManyBy(
      {
        businessId,
        barcode: filters?.barcode,
        productId: filters?.productId,
        categoryId: filters?.categoryId,
        slug: filters?.slug,
        name: filters?.name
          ? {
              operator: 'like',
              value: filters?.name,
            }
          : undefined,
      },
      { limit: limit + 1 },
      {
        cursor: cursor ?? null,
        ensureActive: true,
      },
    );

    const nextCursor: Cursor | null =
      products.length > limit
        ? {
            lastCreatedAt: products[products.length - 1].createdAt,
            lastProductId: products[products.length - 1].id,
          }
        : null;

    return {
      items: products.slice(0, limit),
      nextCursor,
    };
  }
}
