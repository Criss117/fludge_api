import {
  integer,
  primaryKey,
  index,
  sqliteTable,
  text,
  unique,
} from 'drizzle-orm/sqlite-core';
import { businesses } from './businesses.schema';
import { auditMetadata } from './utils/audit-metadata';
import { UUIDv4 } from './utils/uuid';
import { products } from './products.schema';

export const providers = sqliteTable(
  'providers',
  {
    id: UUIDv4(),
    businessId: text('business_id', {
      length: 36,
    })
      .references(() => businesses.id)
      .notNull(),

    legalName: text('legal_name', {
      length: 100,
    }).notNull(),
    name: text('name', {
      length: 100,
    }).notNull(),
    nit: text('nit', {
      length: 100,
    }).notNull(),

    contactName: text('contact_name', {
      length: 100,
    }),
    contactEmail: text('contact_email', {
      length: 255,
    }),
    contactPhone: text('contact_phone', {
      length: 15,
    }),

    ...auditMetadata,
  },
  (t) => [
    unique('providers_nit_unique').on(t.businessId, t.nit),
    unique('providers_name_unique').on(t.businessId, t.name),

    index('providers_business_id_idx').on(t.businessId),
    index('providers_nit_idx').on(t.nit),
    index('providers_name_idx').on(t.name),
  ],
);

export const providersProducts = sqliteTable(
  'providers_products',
  {
    providerId: text('provider_id', {
      length: 36,
    })
      .references(() => providers.id)
      .notNull(),
    productId: text('product_id', {
      length: 36,
    })
      .references(() => products.id)
      .notNull(),

    purchasePrice: integer('purchase_price').notNull(),
    notes: text('notes', {
      length: 255,
    }),
    ...auditMetadata,
  },
  (t) => [
    index('providers_products_provider_id_idx').on(t.providerId),
    index('providers_products_product_id_idx').on(t.productId),

    primaryKey({
      columns: [t.providerId, t.productId],
      name: 'providers_products_pk',
    }),
  ],
);

export type SelectProvider = typeof providers.$inferSelect;
export type InsertProvider = typeof providers.$inferInsert;

export type SelectProviderProduct = typeof providersProducts.$inferSelect;
export type InsertProviderProduct = typeof providersProducts.$inferInsert;
