import { Inject, Injectable } from '@nestjs/common';
import { and, eq, getTableColumns, or, type SQL } from 'drizzle-orm';
import { DBSERVICE, type TX, type LibSQLDatabase } from '@/db/db.module';
import { FindManyGroupsBy } from './dtos/find-many-groups-by.dto';
import { groups } from '@/shared/dbschemas/groups.schema';
import type { GroupDetail, GroupSummary } from '@/shared/entities/group.entity';
import { businesses } from '@/shared/dbschemas/businesses.schema';
import { employeeGroups, employees } from '@/shared/dbschemas/employees.schema';
import { users } from '@/shared/dbschemas';

type Options = {
  ensureActive?: boolean;
  tx?: TX;
};

@Injectable()
export class GroupsQueriesRepository {
  constructor(@Inject(DBSERVICE) private readonly db: LibSQLDatabase) {}

  public async findManyBy(
    meta: FindManyGroupsBy,
    options?: Options,
  ): Promise<GroupSummary[]> {
    const db = options?.tx ?? this.db;
    const optionsFilters: SQL[] = [];
    const groupsFilters: SQL[] = [];

    if (options?.ensureActive) optionsFilters.push(eq(groups.isActive, true));

    if (meta.groupId) groupsFilters.push(eq(groups.id, meta.groupId));

    if (meta.name) groupsFilters.push(eq(groups.name, meta.name));

    return db
      .select()
      .from(groups)
      .where(
        and(
          or(...groupsFilters, eq(groups.businessId, meta.businessId)),
          ...optionsFilters,
        ),
      );
  }

  public async findOneBy(
    meta: FindManyGroupsBy,
    options?: Options,
  ): Promise<GroupSummary | null> {
    const db = options?.tx ?? this.db;
    const optionsFilters: SQL[] = [];
    const groupsFilters: SQL[] = [];

    if (options?.ensureActive) optionsFilters.push(eq(groups.isActive, true));

    if (meta.groupId) groupsFilters.push(eq(groups.id, meta.groupId));

    if (meta.name) groupsFilters.push(eq(groups.name, meta.name));

    const [group] = await db
      .select()
      .from(groups)
      .where(
        and(
          ...groupsFilters,
          eq(groups.businessId, meta.businessId),
          ...optionsFilters,
        ),
      );

    if (!group) return null;

    return group;
  }

  public async findOne(
    businessId: string,
    groupId: string,
    options?: Options,
  ): Promise<GroupDetail | null> {
    const optionsFilters: SQL[] = [];
    const employeesInGroupFilters: SQL[] = [];

    if (options?.ensureActive) {
      optionsFilters.push(eq(groups.isActive, true));
      employeesInGroupFilters.push(eq(employeeGroups.isActive, true));
    }

    const [group] = await this.db
      .select({
        ...getTableColumns(groups),
        business: getTableColumns(businesses),
      })
      .from(groups)
      .innerJoin(businesses, eq(businesses.id, groups.businessId))
      .where(
        and(
          eq(groups.businessId, businessId),
          eq(groups.id, groupId),
          ...optionsFilters,
        ),
      );

    if (!group) return null;

    const employeesInGroup = await this.db
      .select({
        ...getTableColumns(employees),
        user: getTableColumns(users),
      })
      .from(employeeGroups)
      .innerJoin(employees, eq(employees.id, employeeGroups.employeeId))
      .innerJoin(users, eq(users.id, employees.userId))
      .where(
        and(eq(employeeGroups.groupId, group.id), ...employeesInGroupFilters),
      );

    return {
      ...group,
      employees: employeesInGroup.map((e) => ({
        ...e,
        user: { ...e.user, password: undefined },
      })),
    };
  }
}
