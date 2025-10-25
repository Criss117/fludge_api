import { DbModule } from '@/db/db.module';
import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { SignInUseCase } from './usecases/sign-in.usecase';
import { SessionsCommandsRepository } from './repositories/sessions-commands.repository';
import { SessionsQueriesRepository } from './repositories/sessions-queries.repository';
import { EnsureSessionUseCase } from './usecases/ensure-session.usecase';
import { SignUpUseCase } from './usecases/sign-up.usecase';
import { SignOutUseCase } from './usecases/sign-out.usecase';
import { CloseAllSessionUseCase } from './usecases/close-all-session.usecase';

@Module({
  imports: [ConfigModule, UsersModule, DbModule],
  controllers: [AuthController],
  providers: [
    //UseCases
    SignUpUseCase,
    SignInUseCase,
    SignOutUseCase,
    CloseAllSessionUseCase,
    EnsureSessionUseCase,

    //Repositories
    SessionsCommandsRepository,
    SessionsQueriesRepository,
  ],
  exports: [],
})
export class AuthModule {}
