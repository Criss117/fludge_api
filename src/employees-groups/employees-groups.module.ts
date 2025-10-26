import { DbModule } from '@/db/db.module';
import { Module } from '@nestjs/common';
import { EmployeesGroupsQueriesRepository } from './repositories/employees-groups-queries.repository';
import { EmployeesGroupsCommandsRepository } from './repositories/employees-groups-commands.repository';
import { AssignGroupsToEmployeeUseCase } from './usecases/assign-groups-to-employee.usecase';
import { AssignEmployeesToGroupUseCase } from './usecases/assign-employees-to-group.usecase';

@Module({
  imports: [DbModule],
  providers: [
    //Use cases
    AssignGroupsToEmployeeUseCase,
    AssignEmployeesToGroupUseCase,

    //Repositories
    EmployeesGroupsQueriesRepository,
    EmployeesGroupsCommandsRepository,
  ],
  exports: [AssignGroupsToEmployeeUseCase, AssignEmployeesToGroupUseCase],
})
export class EmployeesGroupsModule {}
