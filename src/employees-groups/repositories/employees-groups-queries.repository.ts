import { DBSERVICE, type LibSQLDatabase } from '@/db/db.module';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class EmployeesGroupsQueriesRepository {
  constructor(@Inject(DBSERVICE) private readonly db: LibSQLDatabase) {}
}
