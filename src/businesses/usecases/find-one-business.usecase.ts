import { BadRequestException, Injectable } from '@nestjs/common';
import { BusinessesQueriesRepository } from '../repositories/businesses-queries.repository';
import { BusinessNotFoundException } from '../exceptions/business-not-found.exception';
import { FindOneBusinessDto } from '../repositories/dtos/find-one-business.dto';
import { UserCanNotAccessException } from '@/auth/exceptions/user-cannot-access.exception';

@Injectable()
export class FindOneBusinessUseCase {
  constructor(
    private readonly businessesQueriesRepository: BusinessesQueriesRepository,
  ) {}

  public async execute(meta: FindOneBusinessDto, loggedUserId: string) {
    if (!meta.id && !meta.slug) {
      throw new BadRequestException('Invalid query');
    }

    const business = await this.businessesQueriesRepository.findOne(meta);

    if (!business) throw new BusinessNotFoundException();

    //TODO: Check if user is root or employee
    const logedUserIsRootOrEmployee = business.rootUserId === loggedUserId;

    if (!logedUserIsRootOrEmployee) throw new UserCanNotAccessException();

    if (business.rootUserId === loggedUserId) {
      return business;
    }

    //TODO: If the logged user is an employee, check if the business is owned by the employee
    return business;
  }
}
