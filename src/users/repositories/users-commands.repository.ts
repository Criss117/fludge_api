import { Inject, Injectable } from '@nestjs/common';
import { DBSERVICE, type LibSQLDatabase } from '@/db/db.module';
import {
  users,
  type InsertUser,
  type SelectUser,
} from '@/shared/dbschemas/users.schema';

@Injectable()
export class UsersCommandsRepository {
  constructor(@Inject(DBSERVICE) private readonly db: LibSQLDatabase) {}

  public async save(values: InsertUser) {
    await this.db
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

  public async saveAndReturn(values: InsertUser): Promise<SelectUser> {
    const [user] = await this.db
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
