import { Inject, Injectable } from '@nestjs/common';
import {
  and,
  desc,
  eq,
  getTableColumns,
  like,
  lte,
  or,
  SQL,
} from 'drizzle-orm';
import { DBSERVICE, type LibSQLDatabase } from '@/db/db.module';
import { FindManyProductsByDto } from './dtos/find-many-products-by.dto';
import { products } from '@/shared/dbschemas/products.schema';
import {
  ProductDetail,
  ProductSummary,
} from '@/shared/entities/products.entity';
import { FindOneProductDto } from './dtos/find-one-product.dto';
import { businesses } from '@/shared/dbschemas/businesses.schema';
import { categories } from '@/shared/dbschemas/categories.schema';

type Cursor = {
  lastCreatedAt: Date;
  lastProductId: string;
};

type Options = {
  ensureActive?: boolean;
};

type ShortOptions = {
  limit: number;
};

@Injectable()
export class ProductsQueriesRepository {
  constructor(@Inject(DBSERVICE) private readonly db: LibSQLDatabase) {}

  public async findManyBy(
    meta: FindManyProductsByDto,
    shortOptions: ShortOptions,
    options?: Options & {
      cursor: Cursor | null;
    },
  ): Promise<ProductSummary[]> {
    const optionsFilters: SQL[] = [];
    const productsFilters: SQL[] = [];

    if (options?.ensureActive) {
      optionsFilters.push(eq(products.isActive, true));
    }

    if (meta.barcode) productsFilters.push(eq(products.barcode, meta.barcode));
    if (meta.slug) productsFilters.push(eq(products.slug, meta.slug));
    if (meta.productId) productsFilters.push(eq(products.id, meta.productId));
    if (meta.categoryId)
      productsFilters.push(eq(products.categoryId, meta.categoryId));

    if (meta.name) {
      if (meta.name.operator === 'eq')
        productsFilters.push(eq(products.name, meta.name.value));

      if (meta.name.operator === 'like')
        productsFilters.push(like(products.name, `%${meta.name.value}%`));
    }

    return this.db
      .select()
      .from(products)
      .where(
        and(
          eq(products.businessId, meta.businessId),
          options?.cursor
            ? or(
                lte(products.createdAt, options.cursor.lastCreatedAt),
                and(
                  eq(products.createdAt, options.cursor.lastCreatedAt),
                  lte(products.id, options.cursor.lastProductId),
                ),
              )
            : undefined,
          or(...productsFilters),
          ...optionsFilters,
        ),
      )
      .limit(shortOptions.limit)
      .orderBy(desc(products.createdAt));
  }

  public async findOneBy(
    meta: FindManyProductsByDto,
    options?: Options,
  ): Promise<ProductSummary | null> {
    const optionsFilters: SQL[] = [];
    const productsFilters: SQL[] = [];

    if (options?.ensureActive) {
      optionsFilters.push(eq(products.isActive, true));
    }

    if (meta.barcode) productsFilters.push(eq(products.barcode, meta.barcode));
    if (meta.slug) productsFilters.push(eq(products.slug, meta.slug));
    if (meta.productId) productsFilters.push(eq(products.id, meta.productId));
    if (meta.categoryId)
      productsFilters.push(eq(products.categoryId, meta.categoryId));

    if (meta.name) {
      if (meta.name.operator === 'eq')
        productsFilters.push(eq(products.name, meta.name.value));

      if (meta.name.operator === 'like')
        productsFilters.push(like(products.name, `%${meta.name.value}%`));
    }

    const [product] = await this.db
      .select()
      .from(products)
      .where(
        and(
          eq(products.businessId, meta.businessId),
          ...productsFilters,
          ...optionsFilters,
        ),
      );

    if (!product) return null;
    return product;
  }

  public async findOne(
    meta: FindOneProductDto,
    options?: Options,
  ): Promise<ProductDetail | null> {
    if (!meta.productId && !meta.slug) return null;

    const optionsFilters: SQL[] = [];
    const productsFilters: SQL[] = [];

    if (options?.ensureActive) {
      optionsFilters.push(eq(products.isActive, true));
    }

    if (meta.productId) productsFilters.push(eq(products.id, meta.productId));
    if (meta.slug) productsFilters.push(eq(products.slug, meta.slug));

    const [product] = await this.db
      .select({
        ...getTableColumns(products),
        business: getTableColumns(businesses),
        category: getTableColumns(categories),
      })
      .from(products)
      .innerJoin(businesses, eq(businesses.id, products.businessId))
      .leftJoin(categories, eq(categories.id, products.categoryId))
      .where(
        and(
          and(eq(products.businessId, meta.businessId), ...productsFilters),
          ...optionsFilters,
        ),
      );

    if (!product) return null;

    return product;
  }
}
