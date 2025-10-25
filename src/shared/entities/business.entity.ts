import type { AuditMetadata } from './audit-metadata';
import type { EmployeeDetail } from './employee.entity';
import { GroupSummary } from './group.entity';
import type { UserSummary } from './user.entity';

export interface BusinessSummary extends AuditMetadata {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  rootUserId: string;
  legalName: string | null;
  nit: string;
  address: string | null;
}

export interface BusinessDetail extends BusinessSummary {
  rootUser: UserSummary;
  employees: EmployeeDetail[];
  groups: GroupSummary[];
}
