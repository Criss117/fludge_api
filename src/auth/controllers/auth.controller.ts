import type { Request, Response } from 'express';
import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { HTTPResponse } from '@/shared/http/common.response';
import { CreateUserDto } from '@/users/dtos/create-user.dto';
import { SignUpUseCase } from '../usecases/sign-up.usecase';
import { safeAction } from '@/shared/http/safe-action';
import { SignInUseCase } from '../usecases/sign-in.usecase';
import { SignInDto } from '../dtos/sign-in.dto';
import { ConfigService } from '@nestjs/config';
import { Public } from '../decorators/public-route.decorator';
import { GetUser } from '../decorators/get-user.decorator';
import type { UserDetail } from '@/shared/entities/user.entity';
import { GetSession } from '../decorators/get-session.decorator';
import { SignOutUseCase } from '../usecases/sign-out.usecase';
import { CloseAllSessionUseCase } from '../usecases/close-all-session.usecase';
import { SignInEmployeeDto } from '../dtos/sign-in-employee.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly signInUseCase: SignInUseCase,
    private readonly configService: ConfigService,
    private readonly signOutUseCase: SignOutUseCase,
    private readonly closeAllSessionUseCase: CloseAllSessionUseCase,
  ) {}

  @Post('sign-up')
  @Public()
  public async signup(@Body() values: CreateUserDto) {
    await safeAction(
      () => this.signUpUseCase.execute(values),
      'Error al crear el usuario',
    );

    return HTTPResponse.created<null>('Usuario creado correctamente');
  }

  @Post('sign-in')
  @Public()
  public async signIn(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() values: SignInDto,
  ) {
    const authCookieName =
      this.configService.getOrThrow<string>('AUTH_COOKIE_NAME');

    const userAgent = request.headers['user-agent'];

    const session = await safeAction(
      () => this.signInUseCase.rootUser(values, { userAgent }),
      'Error al iniciar sesión',
    );

    response.cookie(authCookieName, session.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: session.expiresAt.getTime() - Date.now(),
      expires: session.expiresAt,
    });

    return HTTPResponse.ok('Sesión iniciada correctamente', session);
  }

  @Post('sign-in-employee')
  @Public()
  public async signInEmployee(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() values: SignInEmployeeDto,
  ) {
    const authCookieName =
      this.configService.getOrThrow<string>('AUTH_COOKIE_NAME');

    const userAgent = request.headers['user-agent'];

    const session = await safeAction(
      () => this.signInUseCase.employeeUser(values, { userAgent }),
      'Error al iniciar sesión',
    );

    response.cookie(authCookieName, session.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: session.expiresAt.getTime() - Date.now(),
      expires: session.expiresAt,
    });

    return HTTPResponse.ok('Sesión iniciada correctamente', session);
  }

  @Get('me')
  public me(@GetUser() user: UserDetail) {
    return HTTPResponse.ok('Usuario obtenido correctamente', user);
  }

  @Post('sign-out')
  public async signOut(
    @GetSession('id') sessionId: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    await safeAction(
      () => this.signOutUseCase.execute([sessionId]),
      'Error al cerrar la sesión',
    );

    const authCookieName =
      this.configService.getOrThrow<string>('AUTH_COOKIE_NAME');

    response.cookie(authCookieName, '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 0,
      expires: new Date(),
    });

    return HTTPResponse.ok('Sesión cerrada correctamente');
  }

  @Post('close-all-sessions')
  public async closeAllSessions(
    @GetUser('id') userId: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    await safeAction(
      () => this.closeAllSessionUseCase.execute(userId),
      'Error al cerrar todas las sesiones',
    );

    const authCookieName =
      this.configService.getOrThrow<string>('AUTH_COOKIE_NAME');

    response.cookie(authCookieName, '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 0,
      expires: new Date(),
    });

    return HTTPResponse.ok('Sesiones cerradas correctamente');
  }
}
