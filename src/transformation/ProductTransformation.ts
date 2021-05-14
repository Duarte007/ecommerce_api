import { IProduct } from "src/interfaces/IProduct";

class ProductTransformation {
  public getProductObject = (data: any): IProduct[] => {
    let formattedProducts: IProduct[] = [];
    for (const product of data) {
      formattedProducts = [
        ...formattedProducts,
        {
          sku: product.sku,
          name: product.name,
          costPrice: product.costPrice,
          salePrice: product.salePrice,
          brandId: product.brandId,
          stock: product.stock,
        },
      ];
    }
    return formattedProducts;
  };
}

export default new ProductTransformation();
