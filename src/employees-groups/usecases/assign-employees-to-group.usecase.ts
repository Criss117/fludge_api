import { Injectable } from '@nestjs/common';
import { EmployeesGroupsCommandsRepository } from '../repositories/employees-groups-commands.repository';
import type { TX } from '@/db/db.module';

type Options = {
  tx?: TX;
};

@Injectable()
export class AssignEmployeesToGroupUseCase {
  constructor(
    private readonly employeesGroupsCommandsRepository: EmployeesGroupsCommandsRepository,
  ) {}

  public async execute(
    groupId: string,
    employeeIds: string[],
    options?: Options,
  ) {
    await this.employeesGroupsCommandsRepository.saveMany(
      employeeIds.map((employeeId) => ({
        employeeId,
        groupId,
      })),
      options,
    );
  }
}
