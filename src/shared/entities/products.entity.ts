import { AuditMetadata } from './audit-metadata';
import { BusinessSummary } from './business.entity';
import { CategorySummary } from './categories.entity';

export interface ProductSummary extends AuditMetadata {
  id: string;
  name: string;
  slug: string;
  businessId: string;
  description: string | null;
  categoryId: string | null;
  barcode: string;
  purchasePrice: number;
  salePrice: number;
  wholesalePrice: number;
  offerPrice: number | null;
  quentitySold: number;
  stock: number;
  minStock: number;
  allowNegativeStock: boolean;
  productImage: string | null;
}

export interface ProductDetail extends ProductSummary {
  business: BusinessSummary;
  category: CategorySummary | null;
}
