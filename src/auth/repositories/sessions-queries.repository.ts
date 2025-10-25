import { DBSERVICE, type LibSQLDatabase } from '@/db/db.module';
import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq, inArray, or, SQL } from 'drizzle-orm';
import { sessions } from '@/shared/dbschemas';
import type { FindManySessionsByDto } from './dtos/find-many-sessions-by.dto';
import type { SessionSummary } from '@/shared/entities/session.entity';

@Injectable()
export class SessionsQueriesRepository {
  constructor(@Inject(DBSERVICE) private readonly db: LibSQLDatabase) {}

  public async findManyBy(
    meta: FindManySessionsByDto,
  ): Promise<SessionSummary[]> {
    const filtes: SQL[] = [];

    if (meta.userId) filtes.push(eq(sessions.userId, meta.userId));

    if (meta.sessionIds) filtes.push(inArray(sessions.id, meta.sessionIds));

    return this.db
      .select()
      .from(sessions)
      .where(or(...filtes))
      .orderBy(desc(sessions.createdAt));
  }

  public async findOne(token: string): Promise<SessionSummary | null> {
    const [session] = await this.db
      .select()
      .from(sessions)
      .where(and(eq(sessions.token, token)));

    if (!session) return null;

    return session;
  }
}
