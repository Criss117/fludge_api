import { Inject, Injectable } from '@nestjs/common';
import { CategoriesQueriesRepository } from '../repositories/categories-queries.repository';
import { CategoriesCommandsRepository } from '../repositories/categories-commands.repository';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { CanNotCreateCategoriesException } from '../exceptions/can-not-create-categories.exception';
import { slugify } from '@/shared/utils/slugify';
import { CategoryAlreadyExistsException } from '../exceptions/category-already-exists.exception';
import { DBSERVICE, type LibSQLDatabase } from '@/db/db.module';
import type { CategorySummary } from '@/shared/entities/categories.entity';

@Injectable()
export class CreateCategoryUsecase {
  constructor(
    @Inject(DBSERVICE) private readonly db: LibSQLDatabase,
    private readonly categoriesCommandsRepository: CategoriesCommandsRepository,
    private readonly categoriesQueriesRepository: CategoriesQueriesRepository,
  ) {}

  public async execute(
    businessId: string,
    values: CreateCategoryDto,
  ): Promise<CategorySummary[]> {
    if (values.parentId && values.childrens)
      throw new CanNotCreateCategoriesException(
        'No se pueden crear categorías con un padre e hijos al mismo tiempo',
      );

    const allNames = [
      values.name,
      ...(values.childrens?.flatMap((child) => child.name) ?? []),
    ];

    const allSlugs = allNames.map((name) => slugify(name));

    const someNamesAreDuplicated = new Set(allNames).size !== allNames.length;
    const someSlugsAreDuplicated = new Set(allSlugs).size !== allSlugs.length;

    if (someNamesAreDuplicated || someSlugsAreDuplicated)
      throw new CanNotCreateCategoriesException(
        'No se pueden crear categorías duplicadas',
      );

    const existingCategories =
      await this.categoriesQueriesRepository.findManyBy({
        businessId,
        names: allNames,
        slugs: allSlugs,
      });

    if (existingCategories.length > 0)
      throw new CategoryAlreadyExistsException(
        'No se pueden crear categorías duplicadas',
      );

    const { childrens, ...parentCategory } = values;

    return this.db.transaction(async (tx) => {
      const parentCategoryCreated =
        await this.categoriesCommandsRepository.saveAndReturn(
          {
            name: parentCategory.name,
            slug: slugify(parentCategory.name),
            description: parentCategory.description,
            businessId,
            parentId: parentCategory.parentId,
          },
          {
            tx,
          },
        );

      if (!childrens) return [parentCategoryCreated];

      const savedChildrens = await this.categoriesCommandsRepository.saveMany(
        childrens.map((child) => ({
          name: child.name,
          slug: slugify(child.name),
          description: child.description,
          businessId,
          parentId: parentCategoryCreated.id,
        })),
        {
          tx,
        },
      );

      return {
        parentCategoryCreated,
        ...savedChildrens,
      };
    });
  }
}
