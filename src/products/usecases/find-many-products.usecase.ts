import { Injectable } from '@nestjs/common';
import { ProductsQueriesRepository } from '../repositories/products-queries.repository';
import type { ProductCursor } from '@/shared/entities/cursor.entity';

type Filters = {
  name?: string;
  barcode?: string;
  productId?: string;
  categoryId?: string;
  slug?: string;
};

type Options = {
  filters?: Filters;
  cursor: ProductCursor | null;
  limit: number;
};

@Injectable()
export class FindManyProductsUsecase {
  constructor(
    private readonly productsQueriesRepository: ProductsQueriesRepository,
  ) {}

  public async execute(businessId: string, options: Options) {
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
      { limit: options.limit + 1, cursor: cursor ?? null, ensureActive: true },
    );

    const nextCursor: ProductCursor | null =
      products.length > options.limit
        ? {
            lastCreatedAt: products[products.length - 1].createdAt,
            lastProductId: products[products.length - 1].id,
          }
        : null;

    return {
      items: products.slice(0, options.limit),
      nextCursor,
    };
  }
}
