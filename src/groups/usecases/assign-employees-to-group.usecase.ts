import { Injectable } from '@nestjs/common';
import { GroupsQueriesRepository } from '../repositories/groups-queries.repository';
import { GroupNotFoundException } from '../exceptions/group-not-found.exception';
import { SaveManyEmployeesGroupsUseCase } from '@/employees-groups/usecases/save-many-employees-grouos.usecase';
import { EnsureEmployeeIdsDto } from '../dtos/ensure-employee-ids.dto';

@Injectable()
export class AssignEmployeesToGroupUseCase {
  constructor(
    private readonly groupsQueriesRepository: GroupsQueriesRepository,
    private readonly saveManyEmployeesGroupsUseCase: SaveManyEmployeesGroupsUseCase,
  ) {}

  public async execute(
    businessId: string,
    groupId: string,
    values: EnsureEmployeeIdsDto,
  ) {
    const group = await this.groupsQueriesRepository.findOneBy({
      businessId,
      groupId,
    });

    if (!group) throw new GroupNotFoundException();

    await this.saveManyEmployeesGroupsUseCase.execute(
      values.employeeIds.map((employeeId) => ({
        employeeId,
        groupId,
      })),
    );
  }
}
