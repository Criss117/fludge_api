import { Module } from '@nestjs/common';
import { UsersCommandsRepository } from './repositories/users-commands.repository';
import { UsersQueriesRepository } from './repositories/users-queries.repository';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { DbModule } from '@/db/db.module';
import { FindOneUserByUseCase } from './usecases/find-one-user-by.usecase';
import { FindOneUserUseCase } from './usecases/find-one-user.usecase';

@Module({
  imports: [DbModule],
  controllers: [],
  providers: [
    //UseCases
    CreateUserUseCase,
    FindOneUserByUseCase,
    FindOneUserUseCase,

    //Repositories
    UsersCommandsRepository,
    UsersQueriesRepository,
  ],
  exports: [CreateUserUseCase, FindOneUserByUseCase, FindOneUserUseCase],
})
export class UsersModule {}
