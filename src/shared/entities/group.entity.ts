import type { AuditMetadata } from './audit-metadata';
import type { BusinessSummary } from './business.entity';
import type { EmployeeSummary } from './employee.entity';
import type { Permission } from './permissions';

export interface GroupSummary extends AuditMetadata {
  id: string;
  name: string;
  businessId: string;
  description: string | null;
  isDefault: boolean;
  permissions: Permission[];
}

export interface GroupDetail extends GroupSummary {
  business: BusinessSummary;
  employees: EmployeeSummary[];
}
