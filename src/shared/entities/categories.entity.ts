import { AuditMetadata } from './audit-metadata';

export interface CategorySummary extends AuditMetadata {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  businessId: string;
  parentId: string | null;
}

export interface CategoryDetail extends CategorySummary {
  parent: CategorySummary | null;
  childrens?: CategorySummary[];
}
