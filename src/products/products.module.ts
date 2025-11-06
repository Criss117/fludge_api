import { BusinessesModule } from '@/businesses/businesses.module';
import { DbModule } from '@/db/db.module';
import { Module } from '@nestjs/common';
import { CategoriesCommandsRepository } from './repositories/categories-commands.repository';
import { CategoriesQueriesRepository } from './repositories/categories-queries.repository';
import { CreateCategoryUsecase } from './usecases/create-category.usecase';
import { CategoriesController } from './controllers/categories.controller';

@Module({
  imports: [DbModule, BusinessesModule],
  controllers: [CategoriesController],
  providers: [
    // Usecases
    // - Categories
    CreateCategoryUsecase,

    // Repositories
    CategoriesCommandsRepository,
    CategoriesQueriesRepository,
  ],
})
export class ProductsModule {}
