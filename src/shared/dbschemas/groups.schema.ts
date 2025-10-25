import { sqliteTable } from 'drizzle-orm/sqlite-core';
import { UUIDv4 } from './utils/uuid';
import { text } from 'drizzle-orm/sqlite-core';
import { businesses } from './businesses.schema';
import { integer } from 'drizzle-orm/sqlite-core';
import { auditMetadata } from './utils/audit-metadata';
import type { Permission } from '../entities/permissions';

export const groups = sqliteTable('groups', {
  id: UUIDv4(),
  businessId: text('business_id')
    .references(() => businesses.id)
    .notNull(),
  name: text('name').notNull(),
  description: text('description'),
  isDefault: integer('is_default', {
    mode: 'boolean',
  })
    .default(false)
    .notNull(),
  permissions: text('permissions', {
    mode: 'json',
  })
    .notNull()
    .$type<Permission[]>(),
  ...auditMetadata,
});

export type InsertGroup = typeof groups.$inferInsert;
export type SelectGroup = typeof groups.$inferSelect;
