import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { UUIDv4 } from './utils/uuid';
import { users } from './users.schema';
import { index } from 'drizzle-orm/sqlite-core';
import { auditMetadata } from './utils/audit-metadata';

export const businesses = sqliteTable(
  'businesses',
  {
    id: UUIDv4(),
    rootUserId: text('root_user_id')
      .notNull()
      .references(() => users.id),
    name: text('name').notNull(),
    legalName: text('legal_name'),
    nit: text('nit').notNull().unique(),
    address: text('address'),
    phone: text('phone'),
    email: text('email').unique(),
    ...auditMetadata,
  },
  (t) => [index('businesses_nit_idx').on(t.nit)],
);

export type SelectBusiness = typeof businesses.$inferSelect;
export type InsertBusiness = typeof businesses.$inferInsert;
