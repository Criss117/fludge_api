import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BusinessesCommandsRepository } from '../repositories/businesses-commands.repository';
import { BusinessesQueriesRepository } from '../repositories/businesses-queries.repository';
import { CreateBusinessDto } from '../dtos/create-business.dto';
import { BusinessAlreadyExistsException } from '../exceptions/business-already-exists.exception';

@Injectable()
export class CreateBusinessUseCase {
  constructor(
    private readonly businessesCommandsRepository: BusinessesCommandsRepository,
    private readonly businessesQueriesRepository: BusinessesQueriesRepository,
  ) {}

  public async execute(userId: string, values: CreateBusinessDto) {
    const exisitingBusinesses =
      await this.businessesQueriesRepository.findManyBy(
        {
          name: values.name,
          nit: values.nit,
        },
        {
          ensureActive: true,
        },
      );

    if (exisitingBusinesses.length) throw new BusinessAlreadyExistsException();

    const createdBusiness =
      await this.businessesCommandsRepository.saveAndReturn({
        ...values,
        rootUserId: userId,
      });

    if (!createdBusiness)
      throw new InternalServerErrorException('Error al crear el negocio');

    return createdBusiness;
  }
}
