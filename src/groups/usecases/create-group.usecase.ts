import { Injectable } from '@nestjs/common';
import { GroupsQueriesRepository } from '../repositories/groups-queries.repository';
import { GroupsCommandsRepository } from '../repositories/groups-commands.repository';
import { CreateGroupDto } from '../dtos/create-group.dto';
import type { TX } from '@/db/db.module';
import { GroupAlreadyExistsException } from '../exceptions/group-already-exists.exception';
import { OnEvent } from '@nestjs/event-emitter';
import { allPermission } from '@/shared/entities/permissions';

type Options = {
  tx?: TX;
};

@Injectable()
export class CreateGroupUseCase {
  constructor(
    private readonly groupsQueriesRepository: GroupsQueriesRepository,
    private readonly groupsCommandsRepository: GroupsCommandsRepository,
  ) {}

  public async execute(
    businessId: string,
    values: CreateGroupDto,
    options?: Options,
  ) {
    const existingGroups = await this.groupsQueriesRepository.findManyBy(
      {
        businessId,
        name: values.name,
      },
      {
        tx: options?.tx,
        ensureActive: true,
      },
    );

    if (existingGroups.length) throw new GroupAlreadyExistsException();

    const business = await this.groupsCommandsRepository.saveAndReturn(
      {
        ...values,
        businessId,
      },
      options,
    );

    return business;
  }

  @OnEvent('business:created')
  public async onCreateBusiness(payload: { businessId: string }) {
    await this.execute(payload.businessId, {
      name: 'Administradores',
      permissions: allPermission,
      description: 'Administradores de la empresa',
      isDefault: true,
    });
  }
}
