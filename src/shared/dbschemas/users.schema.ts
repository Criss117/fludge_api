import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { auditMetadata } from './utils/audit-metadata';
import { index } from 'drizzle-orm/sqlite-core';
import { UUIDv4 } from './utils/uuid';

export const users = sqliteTable(
  'users',
  {
    id: UUIDv4(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    email: text('email').unique(),
    username: text('username').unique(),
    phone: text('phone'),
    emailVerified: integer('email_verified', { mode: 'boolean' })
      .default(false)
      .notNull(),
    password: text('password').notNull(),
    isRoot: integer('is_root', { mode: 'boolean' }).notNull(),
    ...auditMetadata,
  },
  (t) => [
    index('users_first_name_last_name_index').on(t.firstName, t.lastName),
    index('users_username_index').on(t.username),
    index('users_email_index').on(t.email),
  ],
);

export const sessions = sqliteTable(
  'sessions',
  {
    id: UUIDv4(),
    expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
    token: text('token').unique(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    ...auditMetadata,
  },
  (t) => [index('sessions_token_index').on(t.token)],
);

export type SelectUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type SelectSession = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;
