import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BusinessesCommandsRepository } from '../repositories/businesses-commands.repository';
import { BusinessesQueriesRepository } from '../repositories/businesses-queries.repository';
import { CreateBusinessDto } from '../dtos/create-business.dto';
import { BusinessAlreadyExistsException } from '../exceptions/business-already-exists.exception';
import { slugify } from '@/shared/utils/slugify';

@Injectable()
export class CreateBusinessUseCase {
  constructor(
    private readonly businessesCommandsRepository: BusinessesCommandsRepository,
    private readonly businessesQueriesRepository: BusinessesQueriesRepository,
    private eventEmitter: EventEmitter2,
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
        slug: slugify(values.name),
        rootUserId: userId,
      });

    if (!createdBusiness)
      throw new InternalServerErrorException('Error al crear el negocio');

    this.eventEmitter.emit('business:created', {
      businessId: createdBusiness.id,
    });

    return createdBusiness;
  }
}
