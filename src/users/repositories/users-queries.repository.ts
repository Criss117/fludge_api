import { DBSERVICE, type LibSQLDatabase } from '@/db/db.module';
import { Inject, Injectable } from '@nestjs/common';
import { and, eq, getTableColumns, or, type SQL, gt } from 'drizzle-orm';
import { sessions, users } from '@/shared/dbschemas';
import { businesses } from '@/shared/dbschemas/businesses.schema';
import { employeeGroups, employees } from '@/shared/dbschemas/employees.schema';
import { groups } from '@/shared/dbschemas/groups.schema';
import type { FindManyUsersByDto } from './dtos/find-many-users-by.dto';
import type { SessionSummary } from '@/shared/entities/session.entity';
import type { UserDetail, UserSummary } from '@/shared/entities/user.entity';

type Options = {
  withPassword?: boolean;
  ensureActive?: boolean;
};

@Injectable()
export class UsersQueriesRepository {
  constructor(@Inject(DBSERVICE) private readonly db: LibSQLDatabase) {}

  public findManyBy(meta: FindManyUsersByDto): Promise<UserSummary[]> {
    const filters: SQL[] = [];

    if (meta.id) {
      filters.push(eq(users.id, meta.id));
    }

    if (meta.firstName) {
      filters.push(eq(users.firstName, meta.firstName));
    }

    if (meta.lastName) {
      filters.push(eq(users.lastName, meta.lastName));
    }

    if (meta.email) {
      filters.push(eq(users.email, meta.email));
    }

    return this.db
      .select()
      .from(users)
      .where(or(...filters));
  }

  public async findOneBy(
    meta: FindManyUsersByDto,
  ): Promise<UserSummary | null> {
    const filters: SQL[] = [];

    if (meta.id) {
      filters.push(eq(users.id, meta.id));
    }

    if (meta.firstName) {
      filters.push(eq(users.firstName, meta.firstName));
    }

    if (meta.lastName) {
      filters.push(eq(users.lastName, meta.lastName));
    }

    if (meta.email) {
      filters.push(eq(users.email, meta.email));
    }

    const [user] = await this.db
      .select()
      .from(users)
      .where(and(...filters));

    if (!user) return null;

    return user;
  }

  public async findOne(
    userId: string,
    options?: Options,
  ): Promise<UserDetail | null> {
    const sessionsFilters: SQL[] = [];
    const businessesFilters: SQL[] = [];
    const employeesFilters: SQL[] = [];
    const employeeGroupsFilters: SQL[] = [];

    if (options?.ensureActive) {
      sessionsFilters.push(gt(sessions.expiresAt, new Date()));
      businessesFilters.push(eq(businesses.isActive, true));
      employeesFilters.push(eq(employees.isActive, true));
    }

    const arrayUser = await this.db
      .select({
        ...getTableColumns(users),
        sessions: getTableColumns(sessions),
      })
      .from(users)
      .leftJoin(
        sessions,
        and(...sessionsFilters, eq(sessions.userId, users.id)),
      )
      .where(eq(users.id, userId));

    if (!arrayUser || !arrayUser.length) return null;

    const user = arrayUser[0];

    const userSessions: SessionSummary[] = [];

    for (const user of arrayUser) {
      if (user.sessions) userSessions.push(user.sessions);
    }

    if (user.isRoot) {
      const rootInBusinesses = await this.db
        .select()
        .from(businesses)
        .where(and(eq(businesses.rootUserId, user.id), ...businessesFilters));

      return {
        ...user,
        password: options?.withPassword ? user.password : undefined,
        sessions: userSessions,
        isRootIn: rootInBusinesses,
      };
    }

    const employeeInBusinessePromise = this.db
      .select({
        ...getTableColumns(businesses),
      })
      .from(employees)
      .innerJoin(businesses, eq(businesses.id, employees.id))
      .where(and(eq(employees.userId, user.id), ...employeesFilters));

    const employeeGroupsPromise = this.db
      .select({
        ...getTableColumns(groups),
      })
      .from(employeeGroups)
      .innerJoin(groups, eq(groups.id, employeeGroups.groupId))
      .where(
        and(eq(employeeGroups.employeeId, user.id), ...employeeGroupsFilters),
      );

    const [[employeeInBusiness], employeeGroup] = await Promise.all([
      employeeInBusinessePromise,
      employeeGroupsPromise,
    ]);

    return {
      ...user,
      password: options?.withPassword ? user.password : undefined,
      sessions: userSessions,
      isEmployeeIn: {
        ...employeeInBusiness,
        groups: employeeGroup,
      },
    };
  }
}
