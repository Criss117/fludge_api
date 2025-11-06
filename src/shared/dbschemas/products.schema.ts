import {
  sqliteTable,
  text,
  integer,
  unique,
  index,
} from 'drizzle-orm/sqlite-core';
import { UUIDv4 } from './utils/uuid';
import { businesses } from './businesses.schema';
import { auditMetadata } from './utils/audit-metadata';
import { categories } from './categories.schema';

export const products = sqliteTable(
  'products',
  {
    id: UUIDv4(),
    businessId: text('business_id')
      .references(() => businesses.id)
      .notNull(),
    categoryId: text('category_id', {
      length: 36,
    }).references(() => categories.id),

    barcode: text('barcode', {
      length: 255,
    }).notNull(),
    name: text('name', {
      length: 100,
    }).notNull(),
    slug: text('slug', {
      length: 100,
    }).notNull(),
    description: text('description', {
      length: 255,
    }),

    purchasePrice: integer('purchase_price').notNull(),
    salePrice: integer('sale_price').notNull(),
    wholesalePrice: integer('wholesale_price').notNull(),
    offerPrice: integer('offer_price'),

    quentitySold: integer('quantity_sold').notNull().default(0),
    stock: integer('stock').notNull(),
    minStock: integer('min_stock').notNull(),
    allowNegativeStock: integer('allow_negative_stock', {
      mode: 'boolean',
    })
      .notNull()
      .default(false),

    productImage: text('product_image', {
      length: 255,
    }),

    ...auditMetadata,
  },
  (t) => [
    index('products_business_id_idx').on(t.businessId),
    index('products_slug_idx').on(t.slug),
    index('products_barcode_idx').on(t.barcode),
    index('products_name_idx').on(t.name),

    unique('products_slug_unique').on(t.businessId, t.slug),
  ],
);

export type SelectProduct = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
