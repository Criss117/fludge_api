import {
  sqliteTable,
  text,
  unique,
  type AnySQLiteColumn,
} from 'drizzle-orm/sqlite-core';
import { UUIDv4 } from './utils/uuid';
import { auditMetadata } from './utils/audit-metadata';
import { businesses } from './businesses.schema';

export const categories = sqliteTable(
  'categories',
  {
    id: UUIDv4(),
    name: text('name', {
      length: 100,
    }).notNull(),
    slug: text('slug', {
      length: 100,
    }).notNull(),
    description: text('description', {
      length: 255,
    }),
    businessId: text('businessId', {
      length: 36,
    })
      .references(() => businesses.id)
      .notNull(),
    parentId: text('parentId').references((): AnySQLiteColumn => categories.id),
    ...auditMetadata,
  },
  (t) => [
    unique('categories_name_unique').on(t.businessId, t.name),
    unique('categories_slug_unique').on(t.businessId, t.slug),
  ],
);

export type SelectCategory = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;
