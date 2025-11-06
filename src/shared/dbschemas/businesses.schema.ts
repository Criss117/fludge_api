import { sqliteTable, text, index } from 'drizzle-orm/sqlite-core';
import { UUIDv4 } from './utils/uuid';
import { users } from './users.schema';
import { auditMetadata } from './utils/audit-metadata';

export const businesses = sqliteTable(
  'businesses',
  {
    id: UUIDv4(),
    rootUserId: text('root_user_id', {
      length: 36,
    })
      .notNull()
      .references(() => users.id),
    name: text('name', {
      length: 100,
    }).notNull(),
    slug: text('slug', {
      length: 100,
    }).notNull(),
    legalName: text('legal_name', {
      length: 100,
    }).notNull(),
    nit: text('nit', {
      length: 100,
    })
      .notNull()
      .unique(),
    address: text('address', {
      length: 255,
    }),
    phone: text('phone', {
      length: 15,
    }).notNull(),
    email: text('email', {
      length: 255,
    })
      .unique()
      .notNull(),
    ...auditMetadata,
  },
  (t) => [
    index('businesses_nit_idx').on(t.nit),
    index('businesses_slug_idx').on(t.slug),
    index('businesses_email_idx').on(t.name),
  ],
);

export type SelectBusiness = typeof businesses.$inferSelect;
export type InsertBusiness = typeof businesses.$inferInsert;
