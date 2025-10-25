import { Injectable } from '@nestjs/common';
import { BusinessesQueriesRepository } from '../repositories/businesses-queries.repository';
import { BusinessNotFoundException } from '../exceptions/business-not-found.exception';
import { FindOneBusinessDto } from '../repositories/dtos/find-one-business.dto';

@Injectable()
export class FindOneBusinessUseCase {
  constructor(
    private readonly businessesQueriesRepository: BusinessesQueriesRepository,
  ) {}

  public async execute(meta: FindOneBusinessDto) {
    const business = await this.businessesQueriesRepository.findOne(meta);

    if (!business) throw new BusinessNotFoundException();

    return business;
  }
}
