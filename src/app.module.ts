import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BusinessesModule } from './businesses/businesses.module';
import { GroupsModule } from './groups/groups.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EmployeesModule } from './employees/employees.module';
import { EmployeesGroupsModule } from './employees-groups/employees-groups.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    DbModule,
    UsersModule,
    AuthModule,
    BusinessesModule,
    GroupsModule,
    EmployeesModule,
    EmployeesGroupsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
