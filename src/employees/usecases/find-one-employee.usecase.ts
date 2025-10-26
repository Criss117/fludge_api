import { Injectable } from '@nestjs/common';
import { EmployeesQueriesRepository } from '../repositories/employees-queries.repository';
import { EmployeeNotFoundException } from '../exceptions/employee-not-found.exception';

@Injectable()
export class FindOneEmployeeUseCase {
  constructor(
    private readonly employeesQueriesRepository: EmployeesQueriesRepository,
  ) {}

  public async execute(businessId: string, employeeId: string) {
    const employee = await this.employeesQueriesRepository.findOne(
      businessId,
      employeeId,
      {
        ensureActive: true,
      },
    );

    if (!employee) throw new EmployeeNotFoundException();

    return employee;
  }
}
