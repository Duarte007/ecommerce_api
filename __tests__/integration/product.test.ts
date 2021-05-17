import request from "supertest";
import App from "../../src/app";
import { getToken } from "../jestUtils";

let token = "";
const product = [
  {
    sku: String(~~(Math.random() * 99999999)),
    name: "PRODUTO TESTE",
    costPrice: 15.05,
    salePrice: 32.65,
    brandId: 2,
    stock: 20,
  },
];
describe("Products tests beginning...", (): void => {
  beforeAll(async (): Promise<void> => {
    token = await getToken();
  });

  afterAll((): void => {
    console.log("Finished products tests...");
  });

  it("should return status 401 and inform that token not provided", async (done): Promise<void> => {
    const response = await request(App).post(`/product`).send(product);

    expect(response.body.msg).toEqual(`Token not provided!`);
    expect(response.status).toBe(401);
    done();
  });

  it("should try to insert a product without sending the 'sku' and receive an error", async (done): Promise<void> => {
    const invalidProduct = JSON.parse(JSON.stringify(product));
    delete invalidProduct[0].sku;
    const response = await request(App).post(`/product`).send(invalidProduct).set("Authorization", token);

    expect(response.body).toBeDefined();
    expect(response.body.msg).toEqual(`Invalid product object. 'sku' required.`);
    expect(response.status).toBe(500);

    done();
  });

  it("should try to insert a product without sending the 'name' and receive an error", async (done): Promise<void> => {
    const invalidProduct = JSON.parse(JSON.stringify(product));
    delete invalidProduct[0].name;
    const response = await request(App).post(`/product`).send(invalidProduct).set("Authorization", token);

    expect(response.body).toBeDefined();
    expect(response.body.msg).toEqual(`Invalid product object. 'name' required.`);
    expect(response.status).toBe(500);

    done();
  });

  it("should try to insert a product without sending the 'salePrice' and receive an error", async (done): Promise<void> => {
    const invalidProduct = JSON.parse(JSON.stringify(product));
    delete invalidProduct[0].salePrice;
    const response = await request(App).post(`/product`).send(invalidProduct).set("Authorization", token);

    expect(response.body).toBeDefined();
    expect(response.body.msg).toEqual(`Invalid product object. 'salePrice' required.`);
    expect(response.status).toBe(500);

    done();
  });

  it("should return status 200 and insert the product", async (done): Promise<void> => {
    const response = await request(App).post(`/product`).send(product).set("Authorization", token);

    expect(response.body).toBeDefined();
    expect(response.body.msg).toEqual(`Product successfully inserted!`);
    expect(response.status).toBe(200);
    done();
  });

  it("must try to insert a product with 'sku' already registered and receive an error", async (done): Promise<void> => {
    const response = await request(App).post(`/product`).send(product).set("Authorization", token);

    expect(response.body).toBeDefined();
    expect(response.body.msg).toEqual(`Product ${product[0].sku} already exists`);
    expect(response.status).toBe(500);
    done();
  });

  it("should return status 200 and a object with product", async (done): Promise<void> => {
    const sku = product[0].sku;

    const response = await request(App).get(`/product?sku=${sku}`).set("Authorization", token);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data).toMatchSnapshot();
    expect(response.status).toBe(200);
    done();
  });

  it("should try to remove a product without passing the sku and receive 400 status", async (done): Promise<void> => {
    const response = await request(App).delete(`/product`).set("Authorization", token);

    expect(response.body.msg).toBe(`Invalid body! 'sku' required`);
    expect(response.status).toBe(400);
    done();
  });

  it("should return status 200 and remove product", async (done): Promise<void> => {
    const sku = product[0].sku;

    const response = await request(App).delete(`/product`).send({ sku }).set("Authorization", token);

    expect(response.body.msg).toBe(`Product with sku '${sku}' successfully deleted!`);
    expect(response.status).toBe(200);
    done();
  });
});
