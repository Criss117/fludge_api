import { sqliteTable } from 'drizzle-orm/sqlite-core';
import { integer } from 'drizzle-orm/sqlite-core';
import { UUIDv4 } from './utils/uuid';
import { auditMetadata } from './utils/audit-metadata';
import { text } from 'drizzle-orm/sqlite-core';
import { businesses } from './businesses.schema';
import { users } from './users.schema';
import { primaryKey } from 'drizzle-orm/sqlite-core';
import { unique } from 'drizzle-orm/sqlite-core';
import { groups } from './groups.schema';

export const employees = sqliteTable('employees', {
  id: UUIDv4(),
  businessId: text('business_id')
    .references(() => businesses.id)
    .notNull(),
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),
  hireDate: integer('hire_date', {
    mode: 'timestamp',
  }).notNull(),
  salary: integer('salary').notNull(),
  ...auditMetadata,
});

export const employeeGroups = sqliteTable(
  'employee_groups',
  {
    employeeId: text('employee_id')
      .references(() => employees.id)
      .notNull(),
    groupId: text('group_id')
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
