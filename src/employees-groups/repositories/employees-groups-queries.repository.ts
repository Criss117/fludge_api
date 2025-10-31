import { DBSERVICE, TX, type LibSQLDatabase } from '@/db/db.module';
import { employeeGroups } from '@/shared/dbschemas/employees.schema';
import { EmployeeGroupSummary } from '@/shared/entities/employee-group.entity';
import { Inject, Injectable } from '@nestjs/common';
import { FindManyEmployeesGroupsDto } from './dtos/find-many-employees-groups.dto';
import { and, eq, inArray, or, SQL } from 'drizzle-orm';

type Options = {
  ensureActive?: boolean;
  tx?: TX;
};

@Injectable()
export class EmployeesGroupsQueriesRepository {
  constructor(@Inject(DBSERVICE) private readonly db: LibSQLDatabase) {}

  public async findManyBy(
    meta: FindManyEmployeesGroupsDto,
    options?: Options,
  ): Promise<EmployeeGroupSummary[]> {
    const optionsFilters: SQL[] = [];
    const employeesGroupsFilters: SQL[] = [];

    if (options?.ensureActive)
      optionsFilters.push(eq(employeeGroups.isActive, true));

    if (meta.employeeIds)
      employeesGroupsFilters.push(
        inArray(employeeGroups.employeeId, meta.employeeIds),
      );
    if (meta.groupIds)
      employeesGroupsFilters.push(
        inArray(employeeGroups.groupId, meta.groupIds),
      );

    return this.db
      .select()
      .from(employeeGroups)
      .where(and(or(...employeesGroupsFilters), ...optionsFilters));
  }

  // public async findOneBy(
  //   meta: FindManyEmployeesGroupsDto,
  //   options?: Options,
  // ): Promise<EmployeeGroupSummary | null> {
  //   const optionsFilters: SQL[] = [];
  //   const employeesGroupsFilters: SQL[] = [];

  //   if (options?.ensureActive)
  //     optionsFilters.push(eq(employeeGroups.isActive, true));

  //   if (meta.employeeId)
  //     employeesGroupsFilters.push(
  //       eq(employeeGroups.employeeId, meta.employeeId),
  //     );
  //   if (meta.groupId)
  //     employeesGroupsFilters.push(eq(employeeGroups.groupId, meta.groupId));

  //   const [employeeGroup] = await this.db
  //     .select()
  //     .from(employeeGroups)
  //     .where(and(...employeesGroupsFilters, ...optionsFilters));
  //   if (!employeeGroup) return null;

  //   return employeeGroup;
  // }
}
