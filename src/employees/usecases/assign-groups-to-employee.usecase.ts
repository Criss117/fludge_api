import { Injectable } from '@nestjs/common';
import { EmployeesQueriesRepository } from '../repositories/employees-queries.repository';
import { EmployeeNotFoundException } from '../exceptions/employee-not-found.exception';
import { SaveManyEmployeesGroupsUseCase } from '@/employees-groups/usecases/save-many-employees-grouos.usecase';
import { EnsureGroupIdsDto } from '../dtos/ensure-group-ids.dto';

@Injectable()
export class AssignGroupsToEmployeeUseCase {
  constructor(
    private readonly employeesQueriesRepository: EmployeesQueriesRepository,
    private readonly saveManyEmployeesGroupsUseCase: SaveManyEmployeesGroupsUseCase,
  ) {}

  public async execute(
    businessId: string,
    employeeId: string,
    values: EnsureGroupIdsDto,
  ) {
    const employee = await this.employeesQueriesRepository.findOneBy({
      businessId,
      employeeId,
    });

    if (!employee) throw new EmployeeNotFoundException();

    await this.saveManyEmployeesGroupsUseCase.execute(
      values.groupIds.map((groupId) => ({
        employeeId,
        groupId,
      })),
    );
  }
}
