import type { AuditMetadata } from './audit-metadata';
import type { EmployeeSummary } from './employee.entity';
import type { GroupSummary } from './group.entity';
import type { UserSummary } from './user.entity';
import type { CategorySummary } from './categories.entity';

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
  employees: EmployeeSummary[];
  groups: GroupSummary[];
  categories: CategorySummary[];
}
