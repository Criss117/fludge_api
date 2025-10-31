import { Injectable } from '@nestjs/common';
import { EmployeesGroupsCommandsRepository } from '../repositories/employees-groups-commands.repository';
import type { TX } from '@/db/db.module';
import { InsertEmployeeGroup } from '@/shared/dbschemas/employees.schema';

type Options = {
  tx?: TX;
};

@Injectable()
export class SaveManyEmployeesGroupsUseCase {
  constructor(
    private readonly employeesGroupsCommandsRepository: EmployeesGroupsCommandsRepository,
  ) {}

  public async execute(values: InsertEmployeeGroup[], options?: Options) {
    await this.employeesGroupsCommandsRepository.saveMany(values, options);
  }
}
