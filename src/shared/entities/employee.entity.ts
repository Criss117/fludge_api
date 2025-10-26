import type { AuditMetadata } from './audit-metadata';
import type { GroupSummary } from './group.entity';
import type { UserSummary } from './user.entity';

export interface EmployeeSummary extends AuditMetadata {
  id: string;
  businessId: string;
  userId: string;
  hireDate: Date;
  salary: number;
  user: UserSummary;
}

export interface EmployeeDetail extends EmployeeSummary {
  groups: GroupSummary[];
}
