import { Inject, Injectable } from '@nestjs/common';
import {
  and,
  desc,
  eq,
  getTableColumns,
  inArray,
  or,
  type SQL,
} from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import { DBSERVICE, type LibSQLDatabase } from '@/db/db.module';
import type {
  CategoryDetail,
  CategorySummary,
} from '@/shared/entities/categories.entity';
import { FindManyCategoriesByDto } from './dtos/find-many-categories-by.dto';
import { categories } from '@/shared/dbschemas/categories.schema';
import { FindOneCategoryDto } from './dtos/find-one-category.dto';

type Options = {
  ensureActive?: boolean;
};

@Injectable()
export class CategoriesQueriesRepository {
  constructor(@Inject(DBSERVICE) private readonly db: LibSQLDatabase) {}

  public async findManyBy(
    meta: FindManyCategoriesByDto,
    options?: Options,
  ): Promise<CategorySummary[]> {
    const optionsFilter: SQL[] = [];
    const categoriesFilter: SQL[] = [];

    if (options?.ensureActive) {
      optionsFilter.push(eq(categories.isActive, true));
    }

    if (meta.ids) categoriesFilter.push(inArray(categories.id, meta.ids));
    if (meta.names) categoriesFilter.push(inArray(categories.name, meta.names));
    if (meta.slugs) categoriesFilter.push(inArray(categories.slug, meta.slugs));

    const selectedCategories = await this.db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.businessId, meta.businessId),
          or(...categoriesFilter),
          ...optionsFilter,
        ),
      )
      .orderBy(desc(categories.createdAt));

    return selectedCategories;
  }

  public async findOneBy(
    meta: FindManyCategoriesByDto,
    options?: Options,
  ): Promise<CategorySummary | null> {
    const optionsFilter: SQL[] = [];
    const categoriesFilter: SQL[] = [];

    if (options?.ensureActive) {
      optionsFilter.push(eq(categories.isActive, true));
    }

    if (meta.ids) categoriesFilter.push(inArray(categories.id, meta.ids));
    if (meta.names) categoriesFilter.push(inArray(categories.name, meta.names));
    if (meta.slugs) categoriesFilter.push(inArray(categories.slug, meta.slugs));

    const [selectedCategory] = await this.db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.businessId, meta.businessId),
          ...categoriesFilter,
          ...optionsFilter,
        ),
      );

    if (!selectedCategory) return null;

    return selectedCategory;
  }

  public async findOne(
    meta: FindOneCategoryDto,
    options?: Options,
  ): Promise<CategoryDetail | null> {
    if (!meta.id && !meta.slug) return null;
    const optionsFilter: SQL[] = [];
    const categoriesFilter: SQL[] = [];

    if (options?.ensureActive) {
      optionsFilter.push(eq(categories.isActive, true));
    }

    if (meta.id) categoriesFilter.push(eq(categories.id, meta.id));
    if (meta.slug) categoriesFilter.push(eq(categories.slug, meta.slug));

    const parentCategory = alias(categories, 'parent_category');

    const [selectedCategory] = await this.db
      .select({
        ...getTableColumns(categories),
        parent: getTableColumns(parentCategory),
      })
      .from(categories)
      .leftJoin(parentCategory, eq(parentCategory.id, categories.parentId))
      .where(
        and(
          eq(categories.businessId, meta.businessId),
          ...categoriesFilter,
          ...optionsFilter,
        ),
      );

    if (!selectedCategory) return null;

    if (selectedCategory.parentId) return selectedCategory;

    const childrenCategories = await this.db
      .select()
      .from(categories)
      .where(
        and(eq(categories.parentId, selectedCategory.id), ...optionsFilter),
      );

    return { ...selectedCategory, childrens: childrenCategories };
  }
}
