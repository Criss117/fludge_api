import { Controller, Post } from '@nestjs/common';
import { GetBusiness } from '@/auth/decorators/get-business.decorator';
import { HTTPResponse } from '@/shared/http/common.response';
import type { BusinessDetail } from '@/shared/entities/business.entity';
import { Permissions } from '@/auth/decorators/permissions.decorator';

@Controller('businesses/:businessSlug/groups')
export class GroupsController {
  @Post()
  @Permissions('groups:create')
  public createGroup(@GetBusiness() business: BusinessDetail) {
    return HTTPResponse.created('Group created correctly', business);
  }
}
