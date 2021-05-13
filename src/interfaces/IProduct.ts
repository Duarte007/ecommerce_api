export interface IProductParams {
  sku?: string;
}

export interface IProduct {
  sku: string;
  name: string;
  costPrice: number;
  salePrice: number;
  brandId: string;
  stock: string;
}
