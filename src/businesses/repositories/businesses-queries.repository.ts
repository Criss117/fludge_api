import { Inject, Injectable } from '@nestjs/common';
import { eq, or, type SQL, and, getTableColumns } from 'drizzle-orm';
import { DBSERVICE, type LibSQLDatabase } from '@/db/db.module';
import type {
  BusinessDetail,
  BusinessSummary,
} from '@/shared/entities/business.entity';
import type { FindManyBusinessesDto } from './dtos/find-many-businesses.dto';
import { businesses } from '@/shared/dbschemas/businesses.schema';
import { FindOneBusinessDto } from './dtos/find-one-business.dto';
import { users } from '@/shared/dbschemas';
import { employees } from '@/shared/dbschemas/employees.schema';
import { groups } from '@/shared/dbschemas/groups.schema';

type Options = {
  ensureActive?: boolean;
};

@Injectable()
export class BusinessesQueriesRepository {
  constructor(@Inject(DBSERVICE) private readonly db: LibSQLDatabase) {}

  public async findManyBy(
    meta: FindManyBusinessesDto,
    options?: Options,
  ): Promise<BusinessSummary[]> {
    const filters: SQL[] = [];
    const optionsFilters: SQL[] = [];

    if (options?.ensureActive)
      optionsFilters.push(eq(businesses.isActive, true));

    if (meta.rootUserId)
      filters.push(eq(businesses.rootUserId, meta.rootUserId));

    if (meta.name) filters.push(eq(businesses.name, meta.name));

    if (meta.nit) filters.push(eq(businesses.nit, meta.nit));

    if (meta.id) filters.push(eq(businesses.id, meta.id));

    if (meta.slug) filters.push(eq(businesses.slug, meta.slug));

    return this.db
      .select()
      .from(businesses)
      .where(and(or(...filters), ...optionsFilters));
  }

  public async findOneBy(
    meta: FindManyBusinessesDto,
    options?: Options,
  ): Promise<BusinessSummary | null> {
    const filters: SQL[] = [];
    const optionsFilters: SQL[] = [];

    if (options?.ensureActive)
      optionsFilters.push(eq(businesses.isActive, true));

    if (meta.rootUserId)
      filters.push(eq(businesses.rootUserId, meta.rootUserId));

    if (meta.name) filters.push(eq(businesses.name, meta.name));

    if (meta.nit) filters.push(eq(businesses.nit, meta.nit));

    if (meta.id) filters.push(eq(businesses.id, meta.id));

    if (meta.slug) filters.push(eq(businesses.slug, meta.slug));

    const [business] = await this.db
      .select()
      .from(businesses)
      .where(and(...filters, ...optionsFilters));

    if (!business) return null;

    return business;
  }

  public async findOne(
    meta: FindOneBusinessDto,
    options?: Options,
  ): Promise<BusinessDetail | null> {
    const filters: SQL[] = [];
    const optionsFilters: SQL[] = [];
    const employeesFilters: SQL[] = [];
    const groupsFilters: SQL[] = [];

    if (options?.ensureActive) {
      optionsFilters.push(eq(businesses.isActive, true));
      employeesFilters.push(eq(employees.isActive, true));
      groupsFilters.push(eq(groups.isActive, true));
    }

    if (meta.slug) filters.push(eq(businesses.slug, meta.slug));

    if (meta.id) filters.push(eq(businesses.id, meta.id));

    const selectBusiness = await this.db
      .select({
        ...getTableColumns(businesses),
        rootUser: getTableColumns(users),
        group: getTableColumns(groups),
      })
      .from(businesses)
      .innerJoin(users, eq(users.id, businesses.rootUserId))
      .leftJoin(groups, eq(groups.businessId, businesses.id))
      .where(and(...filters, ...optionsFilters));

    if (!selectBusiness || !selectBusiness.length) return null;

    const businessGroups: BusinessDetail['groups'] = [];
    const business = { ...selectBusiness[0], group: undefined };

    for (const business of selectBusiness) {
      if (business.group) businessGroups.push(business.group);
    }

    const businessEmployeesPromise = this.db
      .select({
        ...getTableColumns(employees),
        user: getTableColumns(users),
      })
      .from(employees)
      .innerJoin(users, eq(users.id, employees.userId))
      .where(and(eq(employees.businessId, business.id), ...employeesFilters));

    const [businessEmployees] = await Promise.all([businessEmployeesPromise]);

    return {
      ...business,
      rootUser: {
        ...business.rootUser,
        password: undefined,
      },
      employees: businessEmployees,
      groups: businessGroups,
    };
  }
}
