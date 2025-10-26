import { Inject, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { CreateUserUseCase } from '@/users/usecases/create-user.usecase';
import { DBSERVICE, type LibSQLDatabase } from '@/db/db.module';
import { EmployeesCommandsRepository } from '../repositories/employees-commands.repository';

@Injectable()
export class CreateEmployeeUseCase {
  constructor(
    @Inject(DBSERVICE) private readonly db: LibSQLDatabase,
    private readonly employeesCommandsRepository: EmployeesCommandsRepository,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  public async execute(businessId: string, values: CreateEmployeeDto) {
    await this.db.transaction(async (tx) => {
      const user = await this.createUserUseCase.execute(
        {
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          password: values.password,
          phone: values.phone,
        },
        'isEmployee',
        {
          tx,
        },
      );

      await this.employeesCommandsRepository.save(
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
    });
  }
}
