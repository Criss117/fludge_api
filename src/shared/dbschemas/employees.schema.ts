import {
  sqliteTable,
  text,
  integer,
  index,
  primaryKey,
  unique,
} from 'drizzle-orm/sqlite-core';
import { UUIDv4 } from './utils/uuid';
import { auditMetadata } from './utils/audit-metadata';
import { businesses } from './businesses.schema';
import { users } from './users.schema';
import { groups } from './groups.schema';

export const employees = sqliteTable(
  'employees',
  {
    id: UUIDv4(),
    businessId: text('business_id', {
      length: 36,
    })
      .references(() => businesses.id)
      .notNull(),
    userId: text('user_id', {
      length: 36,
    })
      .references(() => users.id)
      .notNull(),
    hireDate: integer('hire_date', {
      mode: 'timestamp',
    }).notNull(),
    salary: integer('salary').notNull(),
    email: text('email', {
      length: 255,
    }),
    ...auditMetadata,
  },
  (t) => [
    index('employees_business_id_idx').on(t.businessId),
    index('employees_user_id_idx').on(t.userId),
  ],
);

export const employeeGroups = sqliteTable(
  'employee_groups',
  {
    employeeId: text('employee_id', {
      length: 36,
    })
      .references(() => employees.id)
      .notNull(),
    groupId: text('group_id', {
      length: 36,
    })
      .references(() => groups.id)
      .notNull(),
    ...auditMetadata,
  },
  (t) => [
    primaryKey({
      columns: [t.employeeId, t.groupId],
      name: 'employee_groups_pk',
    }),
    unique('employee_groups_employee_id_group_id').on(t.employeeId, t.groupId),
  ],
);

export type InsertEmployee = typeof employees.$inferInsert;
export type SelectEmployee = typeof employees.$inferSelect;

export type InsertEmployeeGroup = typeof employeeGroups.$inferInsert;
export type SelectEmployeeGroup = typeof employeeGroups.$inferSelect;
