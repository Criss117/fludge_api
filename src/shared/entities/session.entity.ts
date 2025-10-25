import { AuditMetadata } from './audit-metadata';

export interface SessionSummary extends AuditMetadata {
  id: string;
  expiresAt: Date;
  token: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  userId: string;
}
