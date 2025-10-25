import { EnsureSessionUseCase } from '@/auth/usecases/ensure-session.usecase';
import { FindOneUserUseCase } from '@/users/usecases/find-one-user.usecase';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public-route.decorator';
import { ConfigService } from '@nestjs/config';
import { NoSessionException } from '../exceptions/no-session.exception';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly ensureSessionUseCase: EnsureSessionUseCase,
    private readonly findOneUserUseCase: FindOneUserUseCase,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();

    const authCookieName =
      this.configService.getOrThrow<string>('AUTH_COOKIE_NAME');

    const sessionToken = (request.cookies[authCookieName] ||
      request.headers['authorization']?.split(' ')[1]) as string | undefined;

    if (!sessionToken) throw new NoSessionException();

    const userAgent = request.headers['user-agent'] as string | undefined;

    const session = await this.ensureSessionUseCase.execute(
      sessionToken,
      userAgent,
    );

    const user = await this.findOneUserUseCase.execute(session.userId, {
      ensureActive: true,
    });

    request.user = user;
    request.session = session;

    return true;
  }
}
