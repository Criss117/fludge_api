import { BusinessesModule } from '@/businesses/businesses.module';
import { Module } from '@nestjs/common';
import { GroupsController } from './controllers/groups.controller';
import { CreateGroupUseCase } from './usecases/create-group.usecase';
import { GroupsQueriesRepository } from './repositories/groups-queries.repository';
import { GroupsCommandsRepository } from './repositories/groups-commands.repository';
import { DbModule } from '@/db/db.module';
import { FindOneGroupUseCase } from './usecases/find-one-group.usecase';
import { AddPermissionsUseCase } from './usecases/add-permissions.usecase';
import { RemovePermissionsUseCase } from './usecases/remove-permissions.usecase';
import { EmployeesGroupsModule } from '@/employees-groups/employees-groups.module';
import { RemoveEmployeesFromGroupUseCase } from './usecases/remove-employees-from-group.usecase';
import { AssignEmployeesToGroupUseCase } from './usecases/assign-employees-to-group.usecase';
import { UpdateGroupUsecase } from './usecases/update-group.usecase';

@Module({
  imports: [BusinessesModule, DbModule, EmployeesGroupsModule],
  controllers: [GroupsController],
  providers: [
    //Use cases
    CreateGroupUseCase,
    FindOneGroupUseCase,
    AddPermissionsUseCase,
    RemovePermissionsUseCase,
    RemoveEmployeesFromGroupUseCase,
    AssignEmployeesToGroupUseCase,
    UpdateGroupUsecase,

    //Repositories
    GroupsQueriesRepository,
    GroupsCommandsRepository,
  ],
  exports: [CreateGroupUseCase],
})
export class GroupsModule {}
