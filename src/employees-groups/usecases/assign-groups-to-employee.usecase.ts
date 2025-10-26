import { Injectable } from '@nestjs/common';
import { EmployeesGroupsCommandsRepository } from '../repositories/employees-groups-commands.repository';
import type { TX } from '@/db/db.module';

type Options = {
  tx?: TX;
};

@Injectable()
export class AssignGroupsToEmployeeUseCase {
  constructor(
    private readonly employeesGroupsCommandsRepository: EmployeesGroupsCommandsRepository,
  ) {}

  public async execute(
    employeeId: string,
    groupIds: string[],
    options?: Options,
  ) {
    await this.employeesGroupsCommandsRepository.saveMany(
      groupIds.map((groupId) => ({
        employeeId,
        groupId,
      })),
      options,
    );
  }
}
