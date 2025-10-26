import { DBSERVICE, type TX, type LibSQLDatabase } from '@/db/db.module';
import { employees, InsertEmployee } from '@/shared/dbschemas/employees.schema';
import { Inject, Injectable } from '@nestjs/common';

type Options = {
  tx?: TX;
};

@Injectable()
export class EmployeesCommandsRepository {
  constructor(@Inject(DBSERVICE) private readonly db: LibSQLDatabase) {}

  public async save(values: InsertEmployee, options?: Options) {
    const db = options?.tx ?? this.db;

    await db
      .insert(employees)
      .values(values)
      .onConflictDoUpdate({
        target: employees.id,
        set: { ...values, updatedAt: new Date() },
      });
  }

  public async saveAndReturn(values: InsertEmployee, options?: Options) {
    const db = options?.tx ?? this.db;

    const [employee] = await db
      .insert(employees)
      .values(values)
      .onConflictDoUpdate({
        target: employees.id,
        set: { ...values, updatedAt: new Date() },
      })
      .returning();

    return employee;
  }
}
