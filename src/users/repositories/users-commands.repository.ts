import { Inject, Injectable } from '@nestjs/common';
import { DBSERVICE, type TX, type LibSQLDatabase } from '@/db/db.module';
import {
  users,
  type InsertUser,
  type SelectUser,
} from '@/shared/dbschemas/users.schema';

type Options = {
  tx?: TX;
};

@Injectable()
export class UsersCommandsRepository {
  constructor(@Inject(DBSERVICE) private readonly db: LibSQLDatabase) {}

  public async save(values: InsertUser, options?: Options) {
    const db = options?.tx ?? this.db;

    await db
      .insert(users)
      .values(values)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...values,
          updatedAt: new Date(),
        },
      });
  }

  public async saveAndReturn(
    values: InsertUser,
    options?: Options,
  ): Promise<SelectUser> {
    const db = options?.tx ?? this.db;

    const [user] = await db
      .insert(users)
      .values(values)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...values,
          updatedAt: new Date(),
        },
      })
      .returning();

    return user;
  }
}
