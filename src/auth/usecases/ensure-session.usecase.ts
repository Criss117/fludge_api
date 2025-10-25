import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SessionsQueriesRepository } from '../repositories/sessions-queries.repository';
import { NoSessionException } from '../exceptions/no-session.exception';
import { SessionsCommandsRepository } from '../repositories/sessions-commands.repository';
import { expirationDate } from '@/shared/utils/expiration-date';

@Injectable()
export class EnsureSessionUseCase {
  constructor(
    private readonly sessionsQueriesRepository: SessionsQueriesRepository,
    private readonly sessionsCommandsRepository: SessionsCommandsRepository,
  ) {}

  public async execute(token: string, userAgent?: string) {
    const currentSession = await this.sessionsQueriesRepository.findOne(token);

    if (!currentSession) throw new NoSessionException();

    if (currentSession.expiresAt < new Date())
      throw new NoSessionException('La sesión ha caducado');

    if (userAgent && currentSession.userAgent !== userAgent)
      throw new NoSessionException(
        'El usuario no tiene permiso para esta acción',
      );

    const sessionUpdated = await this.sessionsCommandsRepository.saveAndReturn({
      ...currentSession,
      expiresAt: expirationDate(), // 24 hours,
    });

    if (!sessionUpdated)
      throw new InternalServerErrorException('Error al actualizar la sesión');

    return sessionUpdated;
  }
}
