import { Injectable } from '@nestjs/common';
import { EmployeesQueriesRepository } from '../repositories/employees-queries.repository';
import { DeleteManyEmployeesGroupsUseCase } from '@/employees-groups/usecases/delete-many-employees-groups.usecase';
import { EnsureGroupIdsDto } from '../dtos/ensure-group-ids.dto';

@Injectable()
export class RemoveGroupsFromEmployeeUseCase {
  constructor(
    private readonly employeesQueriesRepository: EmployeesQueriesRepository,
    private readonly deleteManyEmployeesGroupsUseCase: DeleteManyEmployeesGroupsUseCase,
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

    if (!employee) throw new Error('Employee not found');

    await this.deleteManyEmployeesGroupsUseCase.execute(values.groupIds, [
      employeeId,
    ]);
  }
}
