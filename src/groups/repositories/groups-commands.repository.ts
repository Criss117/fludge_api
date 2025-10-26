import { Inject, Injectable } from '@nestjs/common';
import { DBSERVICE, type TX, type LibSQLDatabase } from '@/db/db.module';
import { groups, type InsertGroup } from '@/shared/dbschemas/groups.schema';
import { GroupSummary } from '@/shared/entities/group.entity';

type Options = {
  tx?: TX;
};

@Injectable()
export class GroupsCommandsRepository {
  constructor(@Inject(DBSERVICE) private readonly db: LibSQLDatabase) {}

  public async save(values: InsertGroup, options?: Options) {
    const db = options?.tx ?? this.db;

    await db
      .insert(groups)
      .values(values)
      .onConflictDoUpdate({
        target: groups.id,
        set: {
          ...values,
          updatedAt: new Date(),
        },
      });
  }

  public async saveAndReturn(
    values: InsertGroup,
    options?: Options,
  ): Promise<GroupSummary> {
    const db = options?.tx ?? this.db;

    const [group] = await db
      .insert(groups)
      .values(values)
      .onConflictDoUpdate({
        target: groups.id,
        set: {
          ...values,
          updatedAt: new Date(),
        },
      })
      .returning();

    return group;
  }
}
