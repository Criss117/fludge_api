import { text } from 'drizzle-orm/sqlite-core';
import { v7 } from 'uuid';

export function UUIDv4(name = 'id') {
  return text(name, {
    length: 36,
  })
    .primaryKey()
    .$defaultFn(() => v7())
    .notNull();
}
