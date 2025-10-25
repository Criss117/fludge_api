import { AuditMetadata } from './audit-metadata';

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

export interface BusinessDetail extends BusinessSummary {}
