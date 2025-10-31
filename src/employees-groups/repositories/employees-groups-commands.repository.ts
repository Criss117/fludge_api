import { Inject, Injectable } from '@nestjs/common';
import { and, inArray } from 'drizzle-orm';
import { DBSERVICE, TX, type LibSQLDatabase } from '@/db/db.module';
import {
  employeeGroups,
  type InsertEmployeeGroup,
} from '@/shared/dbschemas/employees.schema';
import { DeleteManyEmployeesGroupsDto } from './dtos/delete-many-employees-groups.dto';

type Options = {
  tx?: TX;
};

@Injectable()
export class EmployeesGroupsCommandsRepository {
  constructor(@Inject(DBSERVICE) private readonly db: LibSQLDatabase) {}

  public async save(values: InsertEmployeeGroup, options?: Options) {
    const db = options?.tx ?? this.db;

    await db
      .insert(employeeGroups)
      .values(values)
      .onConflictDoUpdate({
        target: [employeeGroups.employeeId, employeeGroups.groupId],
        set: {
          ...values,
          updatedAt: new Date(),
        },
      });
  }

  public async saveAndReturn(values: InsertEmployeeGroup, options?: Options) {
    const db = options?.tx ?? this.db;

    const [employeeGroup] = await db
      .insert(employeeGroups)
      .values(values)
      .onConflictDoUpdate({
        target: [employeeGroups.employeeId, employeeGroups.groupId],
        set: {
          ...values,
          updatedAt: new Date(),
        },
      })
      .returning();

    return employeeGroup;
  }

  public async saveMany(values: InsertEmployeeGroup[], options?: Options) {
    const db = options?.tx ?? this.db;

    await db
      .insert(employeeGroups)
      .values(values)
      .onConflictDoNothing({
        target: [employeeGroups.employeeId, employeeGroups.groupId],
      });
  }

  public async saveManyAndReturn(
    values: InsertEmployeeGroup[],
    options?: Options,
  ) {
    const db = options?.tx ?? this.db;

    return db
      .insert(employeeGroups)
      .values(values)
      .onConflictDoNothing({
        target: [employeeGroups.employeeId, employeeGroups.groupId],
      })
      .returning();
  }

  public async deleteMany(
    values: DeleteManyEmployeesGroupsDto,
    options?: Options,
  ) {
    const db = options?.tx ?? this.db;

    await db
      .delete(employeeGroups)
      .where(
        and(
          inArray(employeeGroups.employeeId, values.employeeIds),
          inArray(employeeGroups.groupId, values.groupIds),
        ),
      );
  }
}
