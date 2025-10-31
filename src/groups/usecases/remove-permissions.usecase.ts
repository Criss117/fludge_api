import { Injectable } from '@nestjs/common';
import { GroupsQueriesRepository } from '../repositories/groups-queries.repository';
import { EnsurePermissionsDto } from '../dtos/ensure-permissions.dto';
import { GroupNotFoundException } from '../exceptions/group-not-found.exception';
import { GroupsCommandsRepository } from '../repositories/groups-commands.repository';

@Injectable()
export class RemovePermissionsUseCase {
  constructor(
    private readonly groupsQueriesRepository: GroupsQueriesRepository,
    private readonly groupsCommandsRepository: GroupsCommandsRepository,
  ) {}

  public async execute(
    businessId: string,
    groupId: string,
    values: EnsurePermissionsDto,
  ) {
    const exitingGroup = await this.groupsQueriesRepository.findOneBy({
      businessId,
      groupId: groupId,
    });

    if (!exitingGroup) throw new GroupNotFoundException();

    const newPermissions = exitingGroup.permissions.filter(
      (permission) => !values.permissions.includes(permission),
    );

    await this.groupsCommandsRepository.save({
      ...exitingGroup,
      permissions: newPermissions,
    });
  }
}
