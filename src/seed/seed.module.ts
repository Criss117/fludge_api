import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { DbModule } from '@/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
