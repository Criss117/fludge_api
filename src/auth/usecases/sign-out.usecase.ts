import { Injectable } from '@nestjs/common';
import { SessionsCommandsRepository } from '../repositories/sessions-commands.repository';
import { SessionsQueriesRepository } from '../repositories/sessions-queries.repository';

@Injectable()
export class SignOutUseCase {
  constructor(
    private readonly sessionsCommandsRepository: SessionsCommandsRepository,
    private readonly sessionsQueriesRepository: SessionsQueriesRepository,
  ) {}

  public async execute(sessionIds: string[]) {
    const sessions = await this.sessionsQueriesRepository.findManyBy({
      sessionIds,
    });

    if (!sessions.length) return;

    const updateSessionsPromise = sessions.map((session) =>
      this.sessionsCommandsRepository.save({
        ...session,
        expiresAt: new Date(),
        token: null,
      }),
    );

    await Promise.all(updateSessionsPromise);
  }
}
