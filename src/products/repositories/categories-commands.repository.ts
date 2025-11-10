import { Inject, Injectable } from '@nestjs/common';
import { DBSERVICE, type TX, type LibSQLDatabase } from '@/db/db.module';
import {
  categories,
  type InsertCategory,
} from '@/shared/dbschemas/categories.schema';
import type { CategorySummary } from '@/shared/entities/categories.entity';

type Options = {
  tx?: TX;
};

@Injectable()
export class CategoriesCommandsRepository {
  constructor(@Inject(DBSERVICE) private readonly db: LibSQLDatabase) {}

  public async save(values: InsertCategory, options?: Options) {
    const db = options?.tx || this.db;

    await db
      .insert(categories)
      .values(values)
      .onConflictDoUpdate({
        target: categories.id,
        set: {
          ...values,
          updatedAt: new Date(),
        },
      });
  }

  public async saveAndReturn(
    values: InsertCategory,
    options?: Options,
  ): Promise<CategorySummary> {
    const db = options?.tx || this.db;

    const [categorySaved] = await db
      .insert(categories)
      .values(values)
      .onConflictDoUpdate({
        target: categories.id,
        set: {
          ...values,
          updatedAt: new Date(),
        },
      })
      .returning();

    return categorySaved;
  }

  public async saveMany(values: InsertCategory[], options?: Options) {
    const db = options?.tx || this.db;

    return db
      .insert(categories)
      .values(values)
      .onConflictDoNothing()
      .returning();
  }
}
