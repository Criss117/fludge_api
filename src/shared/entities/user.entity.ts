import { AuditMetadata } from './audit-metadata';
import { SessionSummary } from './session.entity';

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
}
