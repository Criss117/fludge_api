import { Inject, Injectable } from '@nestjs/common';
import { DBSERVICE, type LibSQLDatabase } from '@/db/db.module';
import { type InsertSession, sessions } from '@/shared/dbschemas/users.schema';
import { eq } from 'drizzle-orm';
import type { SessionSummary } from '@/shared/entities/session.entity';

@Injectable()
export class SessionsCommandsRepository {
  constructor(@Inject(DBSERVICE) private readonly db: LibSQLDatabase) {}

  public async save(values: InsertSession) {
    await this.db
      .insert(sessions)
      .values(values)
      .onConflictDoUpdate({
        target: sessions.id,
        set: {
          ...values,
          updatedAt: new Date(),
        },
      });
  }

  public async saveMany(values: InsertSession[]) {
    await this.db.insert(sessions).values(values).onConflictDoNothing({
      target: sessions.id,
    });
  }

  public async saveAndReturn(
    values: InsertSession,
  ): Promise<SessionSummary | null> {
    const [session] = await this.db
      .insert(sessions)
      .values(values)
      .onConflictDoUpdate({
        target: sessions.id,
        set: {
          ...values,
          updatedAt: new Date(),
        },
      })
      .returning();

    if (!session) return null;

    return session;
  }

  public async delete(sessionId: string) {
    await this.db.delete(sessions).where(eq(sessions.id, sessionId));
  }
}
