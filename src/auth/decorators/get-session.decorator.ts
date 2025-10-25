import type { SessionSummary } from '@/shared/entities/session.entity';
import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetSession = createParamDecorator(
  (data: keyof SessionSummary, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const session = req.session as SessionSummary;

    if (!session)
      throw new InternalServerErrorException('session not found (request)');

    return !data ? session : session[data];
  },
);
