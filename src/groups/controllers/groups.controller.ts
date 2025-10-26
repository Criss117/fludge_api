import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GetBusiness } from '@/auth/decorators/get-business.decorator';
import { HTTPResponse } from '@/shared/http/common.response';
import { Permissions } from '@/auth/decorators/permissions.decorator';
import { CreateGroupUseCase } from '../usecases/create-group.usecase';
import { safeAction } from '@/shared/http/safe-action';
import { CreateGroupDto } from '../dtos/create-group.dto';
import { FindOneGroupUseCase } from '../usecases/find-one-group.usecase';

@Controller('businesses/:businessSlug/groups')
export class GroupsController {
  constructor(
    private readonly createGroupUseCase: CreateGroupUseCase,
    private readonly findOneGroupUseCase: FindOneGroupUseCase,
  ) {}

  @Post()
  @Permissions('groups:create')
  public async createGroup(
    @GetBusiness('id') businessId: string,
    @Body() values: CreateGroupDto,
  ) {
    const res = await safeAction(
      () => this.createGroupUseCase.execute(businessId, values),
      'Error al crear el grupo',
    );

    return HTTPResponse.created('Grupo creado correctamente', res);
  }

  @Get(':groupId')
  @Permissions('groups:read')
  public async findOneGroup(
    @GetBusiness('id') businessId: string,
    @Param('groupId') groupId: string,
  ) {
    const res = await safeAction(
      () => this.findOneGroupUseCase.execute(businessId, groupId),
      'Error al obtener el grupo',
    );

    return HTTPResponse.ok('Grupo obtenido correctamente', res);
  }
}
