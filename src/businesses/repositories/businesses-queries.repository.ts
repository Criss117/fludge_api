import { Inject, Injectable } from '@nestjs/common';
import { eq, or, type SQL, and } from 'drizzle-orm';
import { DBSERVICE, type LibSQLDatabase } from '@/db/db.module';
import type {
  BusinessDetail,
  BusinessSummary,
} from '@/shared/entities/business.entity';
import type { FindManyBusinessesDto } from './dtos/find-many-businesses.dto';
import { businesses } from '@/shared/dbschemas/businesses.schema';
import { FindOneBusinessDto } from './dtos/find-one-business.dto';

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
  ): Promise<BusinessDetail | null> {
    const filters: SQL[] = [];

    if (meta.slug) filters.push(eq(businesses.slug, meta.slug));

    if (meta.id) filters.push(eq(businesses.id, meta.id));

    const [business] = await this.db
      .select()
      .from(businesses)
      .where(and(...filters));

    if (!business) return null;

    return business;
  }
}
