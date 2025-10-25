import type { BusinessDetail } from '@/shared/entities/business.entity';
import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetBusiness = createParamDecorator(
  (data: keyof BusinessDetail, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const business = req.business as BusinessDetail;

    if (!business)
      throw new InternalServerErrorException('business not found (request)');

    return !data ? business : business[data];
  },
);
