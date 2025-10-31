import { AuditMetadata } from './audit-metadata';

export interface EmployeeGroupSummary extends AuditMetadata {
  employeeId: string;
  groupId: string;
}
