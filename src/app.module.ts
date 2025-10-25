import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BusinessesModule } from './businesses/businesses.module';

@Module({
  imports: [ConfigModule.forRoot(), DbModule, UsersModule, AuthModule, BusinessesModule],
  controllers: [AppController],
})
export class AppModule {}
