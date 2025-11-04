import type { AuditMetadata } from './audit-metadata';
import type { EmployeeDetail } from './employee.entity';
import { GroupSummary } from './group.entity';
import type { UserSummary } from './user.entity';

export interface BusinessSummary extends AuditMetadata {
  id: string;
  name: string;
  email: string;
  phone: string;
  rootUserId: string;
  slug: string;
  legalName: string;
  nit: string;
  address: string | null;
}

export interface BusinessDetail extends BusinessSummary {
  rootUser: UserSummary;
  employees: EmployeeDetail[];
  groups: GroupSummary[];
}
