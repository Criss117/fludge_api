import { Injectable } from '@nestjs/common';
import { EnsureEmployeeIdsDto } from '../dtos/ensure-employee-ids.dto';
import { GroupNotFoundException } from '../exceptions/group-not-found.exception';
import { GroupsQueriesRepository } from '../repositories/groups-queries.repository';
import { DeleteManyEmployeesGroupsUseCase } from '@/employees-groups/usecases/delete-many-employees-groups.usecase';

@Injectable()
export class RemoveEmployeesFromGroupUseCase {
  constructor(
    private readonly groupsQueriesRepository: GroupsQueriesRepository,
    private readonly deleteManyEmployeesGroupsUseCase: DeleteManyEmployeesGroupsUseCase,
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

    await this.deleteManyEmployeesGroupsUseCase.execute(
      [groupId],
      values.employeeIds,
    );
  }
}
