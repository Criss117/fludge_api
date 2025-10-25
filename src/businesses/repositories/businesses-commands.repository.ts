import { DBSERVICE, type LibSQLDatabase } from '@/db/db.module';
import {
  businesses,
  type InsertBusiness,
} from '@/shared/dbschemas/businesses.schema';
import { BusinessSummary } from '@/shared/entities/business.entity';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class BusinessesCommandsRepository {
  constructor(@Inject(DBSERVICE) private readonly db: LibSQLDatabase) {}

  public async save(values: InsertBusiness) {
    await this.db
      .insert(businesses)
      .values(values)
      .onConflictDoUpdate({
        target: businesses.id,
        set: {
          ...values,
          updatedAt: new Date(),
        },
      });
  }

  public async saveMany(values: InsertBusiness[]) {
    await this.db.insert(businesses).values(values).onConflictDoNothing({
      target: businesses.id,
    });
  }

  public async saveAndReturn(
    values: InsertBusiness,
  ): Promise<BusinessSummary | null> {
    const [business] = await this.db
      .insert(businesses)
      .values(values)
      .onConflictDoUpdate({
        target: businesses.id,
        set: {
          ...values,
          updatedAt: new Date(),
        },
      })
      .returning();

    if (!business) return null;

    return business;
  }
}
