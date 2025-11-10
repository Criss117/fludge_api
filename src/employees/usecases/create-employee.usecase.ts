import { Inject, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { CreateUserUseCase } from '@/users/usecases/create-user.usecase';
import { DBSERVICE, type LibSQLDatabase } from '@/db/db.module';
import { EmployeesCommandsRepository } from '../repositories/employees-commands.repository';
import { SaveManyEmployeesGroupsUseCase } from '@/employees-groups/usecases/save-many-employees-grouos.usecase';
import { EmployeeDetail } from '@/shared/entities/employee.entity';

@Injectable()
export class CreateEmployeeUseCase {
  constructor(
    @Inject(DBSERVICE) private readonly db: LibSQLDatabase,
    private readonly employeesCommandsRepository: EmployeesCommandsRepository,
    private readonly saveManyEmployeesGroupsUseCase: SaveManyEmployeesGroupsUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  public async execute(
    businessId: string,
    values: CreateEmployeeDto,
  ): Promise<EmployeeDetail> {
    const createdEmplooyee = await this.db.transaction(async (tx) => {
      const user = await this.createUserUseCase.execute(
        {
          firstName: values.firstName,
          lastName: values.lastName,
          password: values.password,
          phone: values.phone,
          isRoot: false,
          username: values.username,
        },
        {
          tx,
        },
      );

      const createdEmployee =
        await this.employeesCommandsRepository.saveAndReturn(
          {
            businessId,
            userId: user.id,
            hireDate: new Date(),
            salary: values.salary,
          },
          {
            tx,
          },
        );

      if (!values.groupIds?.length)
        return {
          ...createdEmployee,
          user,
          groups: [],
        };

      await this.saveManyEmployeesGroupsUseCase.execute(
        values.groupIds.map((groupId) => ({
          employeeId: createdEmployee.id,
          groupId,
        })),
        {
          tx,
        },
      );

      return {
        ...createdEmployee,
        user: {
          ...user,
          password: undefined,
        },
        groups: [],
      };
    });

    return createdEmplooyee;
  }
}
