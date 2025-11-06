import { DBSERVICE, TX, type LibSQLDatabase } from '@/db/db.module';
import { InsertProduct, products } from '@/shared/dbschemas/products.schema';
import { Inject, Injectable } from '@nestjs/common';

type Options = {
  tx?: TX;
};

@Injectable()
export class ProductsCommandsRepository {
  constructor(@Inject(DBSERVICE) private readonly db: LibSQLDatabase) {}

  public async save(values: InsertProduct, options?: Options) {
    const db = options?.tx ?? this.db;

    await db
      .insert(products)
      .values(values)
      .onConflictDoUpdate({
        target: products.id,
        set: {
          ...values,
          updatedAt: new Date(),
        },
      });
  }

  public async saveAndReturn(values: InsertProduct, options?: Options) {
    const db = options?.tx ?? this.db;

    const [product] = await db
      .insert(products)
      .values(values)
      .onConflictDoUpdate({
        target: products.id,
        set: {
          ...values,
          updatedAt: new Date(),
        },
      })
      .returning();

    return product;
  }
}
