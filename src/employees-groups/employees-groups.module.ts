import { DbModule } from '@/db/db.module';
import { Module } from '@nestjs/common';
import { EmployeesGroupsQueriesRepository } from './repositories/employees-groups-queries.repository';
import { EmployeesGroupsCommandsRepository } from './repositories/employees-groups-commands.repository';
import { DeleteManyEmployeesGroupsUseCase } from './usecases/delete-many-employees-groups.usecase';
import { SaveManyEmployeesGroupsUseCase } from './usecases/save-many-employees-grouos.usecase';

@Module({
  imports: [DbModule],
  providers: [
    //Use cases
    DeleteManyEmployeesGroupsUseCase,
    SaveManyEmployeesGroupsUseCase,

    //Repositories
    EmployeesGroupsQueriesRepository,
    EmployeesGroupsCommandsRepository,
  ],
  exports: [DeleteManyEmployeesGroupsUseCase, SaveManyEmployeesGroupsUseCase],
})
export class EmployeesGroupsModule {}
