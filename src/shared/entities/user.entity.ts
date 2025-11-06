import type { AuditMetadata } from './audit-metadata';
import type { BusinessSummary } from './business.entity';
import type { EmployeeDetail } from './employee.entity';
import type { SessionSummary } from './session.entity';

export interface UserSummary extends AuditMetadata {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  username: string | null;
  phone: string | null;
  emailVerified: boolean;
  password?: string | null;
  isRoot: boolean;
}

export interface UserDetail extends UserSummary {
  sessions: SessionSummary[];
  isRootIn?: BusinessSummary[];
  employeeDetail?: Omit<EmployeeDetail, 'user'>;
  isEmployeeIn?: BusinessSummary;
}
