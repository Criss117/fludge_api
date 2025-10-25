import { text } from 'drizzle-orm/sqlite-core';
import { v4 } from 'uuid';

export function UUIDv4(name = 'id') {
  return text(name)
    .primaryKey()
    .$defaultFn(() => v4())
    .notNull();
}
