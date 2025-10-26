import { BusinessesModule } from '@/businesses/businesses.module';
import { DbModule } from '@/db/db.module';
import { Module } from '@nestjs/common';
import { EmployeesController } from './controllers/employees.controller';
import { EmployeesQueriesRepository } from './repositories/employees-queries.repository';
import { EmployeesCommandsRepository } from './repositories/employees-commands.repository';
import { FindOneEmployeeUseCase } from './usecases/find-one-employee.usecase';
import { UsersModule } from '@/users/users.module';
import { CreateEmployeeUseCase } from './usecases/create-employee.usecase';

@Module({
  imports: [DbModule, BusinessesModule, UsersModule],
  controllers: [EmployeesController],
  providers: [
    //Use cases
    FindOneEmployeeUseCase,
    CreateEmployeeUseCase,
    //Repositories
    EmployeesQueriesRepository,
    EmployeesCommandsRepository,
  ],
})
export class EmployeesModule {}
