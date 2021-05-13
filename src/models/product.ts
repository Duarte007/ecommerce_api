import { connection, Knex } from "../config/database";
import { IProductParams, IProduct } from "../interfaces/IProduct";

class Product {
  public get = async (data: IProductParams): Promise<IProduct[]> => {
    return connection
      .select("sku", "name", "costPrice", "salePrice", "brandId", "stock")
      .from("product")
      .where((builder: Knex.QueryBuilder): void => {
        if (data.sku) {
          builder.where("sku", data.sku);
        }
      })
      .catch(async (err: Error) => {
        return Promise.reject({
          msg: "Error when tryng get product.",
          error: { ...err },
        });
      });
  };

  public post = (products: IProduct[]) => {
    return connection
      .insert(products)
      .into("product")
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log("Error when tryng insert product.");
        console.log(err);
      });
  };
}

export default new Product();
