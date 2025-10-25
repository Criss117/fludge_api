import { Module } from '@nestjs/common';
import { BusinessesController } from './controllers/businesses.controller';
import { DbModule } from '../db/db.module';
import { BusinessesCommandsRepository } from './repositories/businesses-commands.repository';
import { BusinessesQueriesRepository } from './repositories/businesses-queries.repository';
import { CreateBusinessUseCase } from './usecases/create-business.usecase';

@Module({
  imports: [DbModule],
  controllers: [BusinessesController],
  providers: [
    //UseCases
    CreateBusinessUseCase,

    //Repositories
    BusinessesCommandsRepository,
    BusinessesQueriesRepository,
  ],
})
export class BusinessesModule {}
