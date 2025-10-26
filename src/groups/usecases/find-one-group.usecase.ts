import { Injectable } from '@nestjs/common';
import { GroupsQueriesRepository } from '../repositories/groups-queries.repository';
import { GroupNotFoundException } from '../exceptions/group-not-found.exception';

@Injectable()
export class FindOneGroupUseCase {
  constructor(
    private readonly groupsQueriesRepository: GroupsQueriesRepository,
  ) {}

  public async execute(businessId: string, groupId: string) {
    const group = await this.groupsQueriesRepository.findOne(
      businessId,
      groupId,
      {
        ensureActive: true,
      },
    );

    if (!group) throw new GroupNotFoundException();

    return group;
  }
}
