import { BusinessesModule } from '@/businesses/businesses.module';
import { Module } from '@nestjs/common';
import { GroupsController } from './controllers/groups.controller';

@Module({
  imports: [BusinessesModule],
  controllers: [GroupsController],
})
export class GroupsModule {}
