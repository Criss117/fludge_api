import type { AuditMetadata } from './audit-metadata';
import type { BusinessSummary } from './business.entity';
import type { GroupSummary } from './group.entity';
import type { SessionSummary } from './session.entity';

export interface UserSummary extends AuditMetadata {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  emailVerified: boolean;
  phone: string | null;
  isRoot: boolean;
}

export interface UserDetail extends UserSummary {
  sessions: SessionSummary[];
  isRootIn?: BusinessSummary[];
  isEmployeeIn?: BusinessSummary & { groups: GroupSummary[] };
}
