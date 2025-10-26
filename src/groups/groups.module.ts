import { BusinessesModule } from '@/businesses/businesses.module';
import { Module } from '@nestjs/common';
import { GroupsController } from './controllers/groups.controller';
import { CreateGroupUseCase } from './usecases/create-group.usecase';
import { GroupsQueriesRepository } from './repositories/groups-queries.repository';
import { GroupsCommandsRepository } from './repositories/groups-commands.repository';
import { DbModule } from '@/db/db.module';
import { FindOneGroupUseCase } from './usecases/find-one-group.usecase';

@Module({
  imports: [BusinessesModule, DbModule],
  controllers: [GroupsController],
  providers: [
    //Use cases
    CreateGroupUseCase,
    FindOneGroupUseCase,

    //Repositories
    GroupsQueriesRepository,
    GroupsCommandsRepository,
  ],
  exports: [CreateGroupUseCase],
})
export class GroupsModule {}
