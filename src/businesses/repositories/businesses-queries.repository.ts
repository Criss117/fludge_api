import { Inject, Injectable } from '@nestjs/common';
import { eq, or, type SQL, and, getTableColumns, desc } from 'drizzle-orm';
import { DBSERVICE, type LibSQLDatabase } from '@/db/db.module';
import type {
  BusinessDetail,
  BusinessSummary,
} from '@/shared/entities/business.entity';
import { businesses } from '@/shared/dbschemas/businesses.schema';
import { users } from '@/shared/dbschemas';
import { employees } from '@/shared/dbschemas/employees.schema';
import { groups } from '@/shared/dbschemas/groups.schema';
import { categories } from '@/shared/dbschemas/categories.schema';
import type { FindManyBusinessesDto } from './dtos/find-many-businesses.dto';
import type { FindOneBusinessDto } from './dtos/find-one-business.dto';

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

    if (options?.ensureActive) {
      optionsFilters.push(eq(businesses.isActive, true));
    }

    if (meta.slug) filters.push(eq(businesses.slug, meta.slug));

    if (meta.id) filters.push(eq(businesses.id, meta.id));

    const [business] = await this.db
      .select({
        ...getTableColumns(businesses),
        rootUser: getTableColumns(users),
      })
      .from(businesses)
      .innerJoin(users, eq(users.id, businesses.rootUserId))
      .where(and(...filters, ...optionsFilters));

    if (!business) return null;

    const businessGroupsPromise = this.findBusinessGroups(business.id, options);

    const businessEmployeesPromise = this.findBusinessEmployees(
      business.id,
      options,
    );

    const businessCategoriesPromise = this.findBusinessCategories(
      business.id,
      options,
    );

    const [businessEmployees, businessCategories, businessGroups] =
      await Promise.all([
        businessEmployeesPromise,
        businessCategoriesPromise,
        businessGroupsPromise,
      ]);

    return {
      ...business,
      rootUser: {
        ...business.rootUser,
        password: undefined,
      },
      employees: businessEmployees,
      groups: businessGroups,
      categories: businessCategories,
    };
  }

  private async findBusinessEmployees(
    businessId: string,
    options?: Options,
  ): Promise<BusinessDetail['employees']> {
    const employeesFilters: SQL[] = [];

    if (options?.ensureActive) {
      employeesFilters.push(eq(employees.isActive, true));
    }

    const selectedEmployees = await this.db
      .select({
        ...getTableColumns(employees),
        user: getTableColumns(users),
      })
      .from(employees)
      .innerJoin(users, eq(users.id, employees.userId))
      .where(and(eq(employees.businessId, businessId), ...employeesFilters))
      .orderBy(desc(employees.createdAt));

    return selectedEmployees.map((se) => ({
      ...se,
      user: {
        ...se.user,
        password: undefined,
      },
    }));
  }

  private async findBusinessCategories(
    businessId: string,
    options?: Options,
  ): Promise<BusinessDetail['categories']> {
    const categoriesFilters: SQL[] = [];

    if (options?.ensureActive) {
      categoriesFilters.push(eq(categories.isActive, true));
    }

    return this.db
      .select()
      .from(categories)
      .where(and(eq(categories.businessId, businessId), ...categoriesFilters))
      .orderBy(desc(categories.createdAt));
  }

  private async findBusinessGroups(
    businessId: string,
    options?: Options,
  ): Promise<BusinessDetail['groups']> {
    const groupsFilters: SQL[] = [];

    if (options?.ensureActive) {
      groupsFilters.push(eq(groups.isActive, true));
    }

    return this.db
      .select()
      .from(groups)
      .where(and(eq(groups.businessId, businessId), ...groupsFilters))
      .orderBy(desc(groups.createdAt));
  }
}
