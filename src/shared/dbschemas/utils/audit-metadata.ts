import { sql } from 'drizzle-orm';
import { integer } from 'drizzle-orm/sqlite-core';

export const auditMetadata = {
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  deletedAt: integer('deleted_at', { mode: 'timestamp_ms' }),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
};
