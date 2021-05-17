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

  public post = (products: IProduct[]): Promise<number> => {
    return connection
      .insert(products)
      .onConflict("sku")
      .ignore()
      .into("product")
      .then((result) => {
        console.log(result);
        return result[0] || 0;
      })
      .catch((err) => {
        console.log("Error when tryng insert product.");
        console.log(err);
        return Promise.reject({ err });
      });
  };

  public getProductIdBySku = (sku: string): Promise<number> => {
    return connection
      .select("id")
      .from("product")
      .where("sku", sku)
      .then((response: { id: number }[]) => response[0]?.id)
      .catch((err) => Promise.reject({ err }));
  };

  public delete = (data: IProductParams): Promise<number> => {
    return connection("product")
      .where((builder: Knex.QueryBuilder): any => {
        builder.where("sku", data.sku);
      })
      .del()
      .catch((err) => {
        console.log(err);
        return Promise.reject("Error to delete product");
      });
  };
}

export default new Product();
