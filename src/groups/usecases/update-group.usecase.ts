import { Injectable } from '@nestjs/common';
import { GroupsQueriesRepository } from '../repositories/groups-queries.repository';
import { GroupsCommandsRepository } from '../repositories/groups-commands.repository';
import { UpdateGroupDto } from '../dtos/update-group.dto';
import { GroupNotFoundException } from '../exceptions/group-not-found.exception';

@Injectable()
export class UpdateGroupUsecase {
  constructor(
    private readonly groupsQueriesRepository: GroupsQueriesRepository,
    private readonly groupsCommandsRepository: GroupsCommandsRepository,
  ) {}

  async execute(businessId: string, groupId: string, values: UpdateGroupDto) {
    const group = await this.groupsQueriesRepository.findOneBy({
      businessId,
      groupId,
    });

    if (!group) throw new GroupNotFoundException();

    await this.groupsCommandsRepository.save({
      ...group,
      ...values,
      businessId,
      id: groupId,
    });
  }
}
