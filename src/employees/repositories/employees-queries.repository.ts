import { Inject, Injectable } from '@nestjs/common';
import { DBSERVICE, type LibSQLDatabase } from '@/db/db.module';
import { and, desc, eq, getTableColumns, or, type SQL } from 'drizzle-orm';
import type {
  EmployeeDetail,
  EmployeeSummary,
} from '@/shared/entities/employee.entity';
import { FindManyEmployeesDto } from './dtos/find-many-employees.dto';
import { employeeGroups, employees } from '@/shared/dbschemas/employees.schema';
import { users } from '@/shared/dbschemas';
import { groups } from '@/shared/dbschemas/groups.schema';

type Options = {
  ensureActive?: boolean;
};

@Injectable()
export class EmployeesQueriesRepository {
  constructor(@Inject(DBSERVICE) private readonly db: LibSQLDatabase) {}

  public async findManyBy(
    meta: FindManyEmployeesDto,
    options?: Options,
  ): Promise<EmployeeSummary[]> {
    const employeesFilters: SQL[] = [];
    const optionsFilters: SQL[] = [];

    if (options?.ensureActive)
      optionsFilters.push(eq(employees.isActive, true));

    if (meta.employeeId)
      employeesFilters.push(eq(employees.id, meta.employeeId));

    return this.db
      .select({
        ...getTableColumns(employees),
        user: getTableColumns(users),
      })
      .from(employees)
      .innerJoin(users, eq(users.id, employees.userId))
      .where(
        and(
          eq(employees.businessId, meta.businessId),
          or(...employeesFilters),
          ...optionsFilters,
        ),
      )
      .orderBy(desc(employees.createdAt));
  }

  public async findOneBy(
    meta: FindManyEmployeesDto,
    options?: Options,
  ): Promise<EmployeeSummary | null> {
    const employeesFilters: SQL[] = [];
    const optionsFilters: SQL[] = [];

    if (options?.ensureActive)
      optionsFilters.push(eq(employees.isActive, true));

    if (meta.employeeId)
      employeesFilters.push(eq(employees.id, meta.employeeId));

    const [employee] = await this.db
      .select({
        ...getTableColumns(employees),
        user: getTableColumns(users),
      })
      .from(employees)
      .innerJoin(users, eq(users.id, employees.userId))
      .where(
        and(
          eq(employees.businessId, meta.businessId),
          ...employeesFilters,
          ...optionsFilters,
        ),
      )
      .orderBy(desc(employees.createdAt));

    if (!employee) return null;

    return employee;
  }

  public async findOne(
    businessId: string,
    employeeId: string,
    options?: Options,
  ): Promise<EmployeeDetail | null> {
    const optionsFilters: SQL[] = [];
    const employeeGroupsFilters: SQL[] = [];

    if (options?.ensureActive) {
      optionsFilters.push(eq(employees.isActive, true));
      employeeGroupsFilters.push(eq(employeeGroups.isActive, true));
    }

    const [employee] = await this.db
      .select({
        ...getTableColumns(employees),
        user: getTableColumns(users),
      })
      .from(employees)
      .innerJoin(users, eq(users.id, employees.userId))
      .where(
        and(
          eq(employees.businessId, businessId),
          eq(employees.id, employeeId),
          ...optionsFilters,
        ),
      );

    if (!employee) return null;

    const allEmployeeGroups = await this.db
      .select({
        ...getTableColumns(groups),
      })
      .from(employeeGroups)
      .innerJoin(groups, eq(groups.id, employeeGroups.groupId))
      .where(
        and(
          eq(employeeGroups.employeeId, employee.id),
          ...employeeGroupsFilters,
        ),
      );

    return {
      ...employee,
      user: {
        ...employee.user,
        password: undefined,
      },
      groups: allEmployeeGroups,
    };
  }
}
