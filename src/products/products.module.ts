import { BusinessesModule } from '@/businesses/businesses.module';
import { DbModule } from '@/db/db.module';
import { Module } from '@nestjs/common';
import { CategoriesCommandsRepository } from './repositories/categories-commands.repository';
import { CategoriesQueriesRepository } from './repositories/categories-queries.repository';
import { CreateCategoryUsecase } from './usecases/create-category.usecase';
import { CategoriesController } from './controllers/categories.controller';
import { ProductsCommandsRepository } from './repositories/products-commands.repository';
import { ProductsQueriesRepository } from './repositories/products-queries.repository';
import { CreateProductUsecase } from './usecases/create-product.usecase';
import { ProductsController } from './controllers/products.controller';
import { FindOneProductUsecase } from './usecases/find-one-product.usecase';

@Module({
  imports: [DbModule, BusinessesModule],
  controllers: [CategoriesController, ProductsController],
  providers: [
    // - Products
    // Usecases
    CreateProductUsecase,
    FindOneProductUsecase,

    // Repositories
    ProductsCommandsRepository,
    ProductsQueriesRepository,

    // - Categories
    // Usecases
    CreateCategoryUsecase,

    // Repositories
    CategoriesCommandsRepository,
    CategoriesQueriesRepository,
  ],
})
export class ProductsModule {}
