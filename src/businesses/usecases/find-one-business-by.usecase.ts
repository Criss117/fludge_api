import { Injectable } from '@nestjs/common';
import { BusinessesQueriesRepository } from '../repositories/businesses-queries.repository';
import { BusinessNotFoundException } from '../exceptions/business-not-found.exception';
import type { FindManyBusinessesDto } from '../repositories/dtos/find-many-businesses.dto';

@Injectable()
export class FindOneBusinessByUseCase {
  constructor(
    private readonly businessesQueriesRepository: BusinessesQueriesRepository,
  ) {}

  public async execute(meta: FindManyBusinessesDto) {
    const business = await this.businessesQueriesRepository.findOneBy(meta);

    if (!business) throw new BusinessNotFoundException();

    return business;
  }
}
