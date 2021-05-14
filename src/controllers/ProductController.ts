import { Request, Response } from "express";
import ProductTransformation from "../transformation/ProductTransformation";
import Product from "../models/product";
import { IController } from "../interfaces";
import { IProduct } from "src/interfaces/IProduct";

class ProductController implements IController {
  public get = async (req: Request, res: Response): Promise<Response> => {
    try {
      const params = {
        sku: req.query?.sku?.toString() || "",
      };
      const products = await Product.get(params);
      console.log(products);
      console.log("Products successfully returned");
      return res.status(200).json({ data: products });
    } catch (err) {
      return res.status(500).json({ msg: "Error when trying to get product", error: err.message });
    }
  };

  public post = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = req.body;
      if (!Array.isArray(data)) return res.status(400).json({ msg: "Invalid body. We expect a array." });

      const formattedProduct = ProductTransformation.getProductObject(data);
      await this.checkProducts(formattedProduct);
      const result = await Product.post(formattedProduct);
      if (result) {
        console.log("Product(s) successfully registered!");
        return res.status(200).json({ msg: "Product successfully inserted!", data: formattedProduct });
      }
      return res.status(500).json({ msg: "Error when trying to insert product", data: formattedProduct });
    } catch (err) {
      return res.status(500).json(err);
    }
  };

  private checkProducts = async (products: IProduct[]) => {
    for (const prd of products) {
      if (!prd.sku) return Promise.reject({ msg: `Invalid product object. 'sku' required.`, data: prd });
      if (!prd.name) return Promise.reject({ msg: `Invalid product object. 'name' required.`, data: prd });
      if (!prd.salePrice) return Promise.reject({ msg: `Invalid product object. 'salePrice' required.`, data: prd });
      const response = await Product.get({ sku: prd.sku });
      if (response.length) return Promise.reject({ msg: `Product ${prd.sku} already exists`, data: prd });
    }
  };
}

export default new ProductController();
