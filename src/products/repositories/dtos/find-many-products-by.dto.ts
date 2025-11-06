export interface FindManyProductsByDto {
  businessId: string;
  name?: {
    value: string;
    operator: 'eq' | 'like';
  };
  productId?: string;
  barcode?: string;
  slug?: string;
  categoryId?: string;
}
