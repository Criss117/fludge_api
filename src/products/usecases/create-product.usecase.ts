import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductsQueriesRepository } from '../repositories/products-queries.repository';
import { ProductsCommandsRepository } from '../repositories/products-commands.repository';
import { slugify } from '@/shared/utils/slugify';
import { ProductAlreadyExistsException } from '../exceptions/product-already-exists.exception';
import { CategoriesQueriesRepository } from '../repositories/categories-queries.repository';
import { CategoryNotFoundException } from '../exceptions/category-not-found.exception';

@Injectable()
export class CreateProductUsecase {
  constructor(
    private readonly productsCommandsRepository: ProductsCommandsRepository,
    private readonly productsQueriesRepository: ProductsQueriesRepository,
    private readonly categoriesQueriesRepository: CategoriesQueriesRepository,
  ) {}

  public async execute(businessId: string, values: CreateProductDto) {
    const productSlug = slugify(values.name);

    const exisitingProducts = await this.productsQueriesRepository.findManyBy(
      {
        businessId,
        name: {
          value: values.name,
          operator: 'eq',
        },
        barcode: values.barcode,
        slug: productSlug,
      },
      {
        ensureActive: true,
      },
    );

    if (exisitingProducts.length > 0) throw new ProductAlreadyExistsException();

    if (values.categoryId) {
      const category = await this.categoriesQueriesRepository.findOne({
        businessId,
        id: values.categoryId,
      });

      if (!category) throw new CategoryNotFoundException();
    }

    await this.productsCommandsRepository.save({
      ...values,
      slug: productSlug,
      businessId,
    });
  }
}
