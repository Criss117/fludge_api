import { BusinessesModule } from '@/businesses/businesses.module';
import { DbModule } from '@/db/db.module';
import { Module } from '@nestjs/common';
import { EmployeesController } from './controllers/employees.controller';
import { EmployeesQueriesRepository } from './repositories/employees-queries.repository';
import { EmployeesCommandsRepository } from './repositories/employees-commands.repository';
import { FindOneEmployeeUseCase } from './usecases/find-one-employee.usecase';
import { UsersModule } from '@/users/users.module';
import { CreateEmployeeUseCase } from './usecases/create-employee.usecase';
import { EmployeesGroupsModule } from '@/employees-groups/employees-groups.module';
import { AssignGroupsToEmployeeUseCase } from './usecases/assign-groups-to-employee.usecase';
import { RemoveGroupsFromEmployeeUseCase } from './usecases/remove-groups-from-employee.usecase';

@Module({
  imports: [DbModule, BusinessesModule, UsersModule, EmployeesGroupsModule],
  controllers: [EmployeesController],
  providers: [
    //Use cases
    FindOneEmployeeUseCase,
    CreateEmployeeUseCase,
    AssignGroupsToEmployeeUseCase,
    RemoveGroupsFromEmployeeUseCase,

    //Repositories
    EmployeesQueriesRepository,
    EmployeesCommandsRepository,
  ],
})
export class EmployeesModule {}
