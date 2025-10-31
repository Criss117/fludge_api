import { Injectable } from '@nestjs/common';
import { EmployeesGroupsCommandsRepository } from '../repositories/employees-groups-commands.repository';

@Injectable()
export class DeleteManyEmployeesGroupsUseCase {
  constructor(
    private readonly employeesGroupsCommandsRepository: EmployeesGroupsCommandsRepository,
  ) {}

  public async execute(groupIds: string[], employeeIds: string[]) {
    await this.employeesGroupsCommandsRepository.deleteMany({
      employeeIds,
      groupIds,
    });
  }
}
