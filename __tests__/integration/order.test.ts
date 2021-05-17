import request from "supertest";
import App from "../../src/app";
import { getToken } from "../jestUtils";
import Util from "../../src/util";

let token = "";

const order = {
  webId: ~~(Math.random() * 99999999),
  amount: 100,
  channel: 1,
  products: [
    {
      sku: "0001",
      price: 100,
      qtty: 1,
    },
  ],
  payment: {
    paymentId: 1,
  },
  customer: {
    cpfCnpj: "12194436626",
  },
  delivery: {
    zip: "30720450",
    street: "Itororo",
    number: "459",
    district: "Padre Eustaquio",
    state: "MG",
    country: "Brasil",
    deliveryDate: "2021-08-07",
  },
};

const product = [
  {
    sku: "0001",
    name: "PRODUTO TESTE",
    costPrice: 15.05,
    salePrice: 32.65,
    brandId: 2,
    stock: 20,
  },
];

const customer = {
  name: "Duarte",
  companyName: "",
  cpfCnpj: "121.944.366-26",
  rg: "15.205.650",
  email: "",
  phone: "",
  cell: "31994568745",
  brithday: "",
  gender: 1,
  address: {
    zip: "31260390",
    number: 50,
    street: "Rua Mirian Wanderley Lara",
    district: "Dona Clara",
    state: "MG",
    country: "Brasil",
  },
};

describe("Orders tests beginning...", (): void => {
  beforeAll(async (): Promise<void> => {
    token = await getToken();
  });

  afterAll(async (): Promise<void> => {
    const responseDelProduct = await request(App).delete(`/product`).send({ sku: product[0].sku }).set("Authorization", token);

    expect(responseDelProduct.status).toBe(200);

    const responseDelCustomer = await request(App)
      .delete(`/customer`)
      .send({ cpfCnpj: customer.cpfCnpj })
      .set("Authorization", token);

    expect(responseDelCustomer.status).toBe(200);
    console.log("Finished orders tests...");
  });

  it("should return status 401 and inform that token not provided", async (done): Promise<void> => {
    const response = await request(App).post(`/order`).send(order);

    expect(response.body.msg).toEqual(`Token not provided!`);
    expect(response.status).toBe(401);
    done();
  });

  it("should return status 200 and insert the order", async (done): Promise<void> => {
    const responseProduct = await request(App).post(`/product`).send(product).set("Authorization", token);

    expect(responseProduct.status).toBe(200);

    const responseCustomer = await request(App).post(`/customer`).send(customer).set("Authorization", token);

    expect(responseCustomer.status).toBe(200);

    const response = await request(App).post(`/order`).send(order).set("Authorization", token);

    expect(response.body).toBeDefined();
    expect(response.body.msg).toEqual(`Order successfully inserted!`);
    expect(response.status).toBe(200);

    done();
  });

  it("must try to insert an orde with 'webId' already registered and receive an error", async (done): Promise<void> => {
    const response = await request(App).post(`/order`).send(order).set("Authorization", token);

    expect(response.body).toBeDefined();
    expect(response.body.msg).toEqual(`Order with 'webId' ${order.webId} already exists`);
    expect(response.status).toBe(500);

    done();
  });

  it("should try to insert an order without sending the 'webId' and receive an error", async (done): Promise<void> => {
    const invalidOrder = JSON.parse(JSON.stringify(order));
    delete invalidOrder.webId;
    const response = await request(App).post(`/order`).send(invalidOrder).set("Authorization", token);

    expect(response.body).toBeDefined();
    expect(response.body.msg).toEqual(`Invalid body. 'webId' required.`);
    expect(response.status).toBe(500);

    done();
  });

  it("should try to insert an order without sending the 'channel' and receive an error", async (done): Promise<void> => {
    const invalidOrder = JSON.parse(JSON.stringify(order));
    delete invalidOrder.channel;
    const response = await request(App).post(`/order`).send(invalidOrder).set("Authorization", token);

    expect(response.body).toBeDefined();
    expect(response.body.msg).toEqual(`Invalid body. 'channel' required.`);
    expect(response.status).toBe(500);

    done();
  });

  it("should try to insert an order without sending the 'products' and receive an error", async (done): Promise<void> => {
    const invalidOrder = JSON.parse(JSON.stringify(order));
    delete invalidOrder.products;
    const response = await request(App).post(`/order`).send(invalidOrder).set("Authorization", token);

    expect(response.body).toBeDefined();
    expect(response.body.msg).toEqual(`Invalid body. 'products' required.`);
    expect(response.status).toBe(500);

    done();
  });

  it("should try to insert an order without sending the 'payment' and receive an error", async (done): Promise<void> => {
    const invalidOrder = JSON.parse(JSON.stringify(order));
    delete invalidOrder.payment;
    const response = await request(App).post(`/order`).send(invalidOrder).set("Authorization", token);

    expect(response.body).toBeDefined();
    expect(response.body.msg).toEqual(`Invalid body. 'payment' required.`);
    expect(response.status).toBe(500);

    done();
  });

  it("should try to insert an order without sending the 'delivery' and receive an error", async (done): Promise<void> => {
    const invalidOrder = JSON.parse(JSON.stringify(order));
    delete invalidOrder.delivery;
    const response = await request(App).post(`/order`).send(invalidOrder).set("Authorization", token);

    expect(response.body).toBeDefined();
    expect(response.body.msg).toEqual(`Invalid body. 'delivery' required.`);
    expect(response.status).toBe(500);

    done();
  });

  it("should try to insert an order without sending the 'customer' and receive an error", async (done): Promise<void> => {
    const invalidOrder = JSON.parse(JSON.stringify(order));
    delete invalidOrder.customer;
    const response = await request(App).post(`/order`).send(invalidOrder).set("Authorization", token);

    expect(response.body).toBeDefined();
    expect(response.body.msg).toEqual(`Invalid body. 'customer' required.`);
    expect(response.status).toBe(500);

    done();
  });

  it("should return status 200 and a object with order", async (done): Promise<void> => {
    const response = await request(App).get(`/order?webId=${order.webId}`).set("Authorization", token);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data).toMatchSnapshot();
    expect(response.status).toBe(200);
    done();
  });

  it("should try to remove order without passing the webId and receive 400 status", async (done): Promise<void> => {
    const response = await request(App)
      .delete(`/order`)
      .set("Authorization", await getToken());

    expect(response.body.msg).toBe(`Invalid body! 'webId' required`);
    expect(response.status).toBe(400);
    done();
  });

  it("should return status 200 and remove order", async (done): Promise<void> => {
    const response = await request(App).delete(`/order`).send({ webId: order.webId }).set("Authorization", token);
    expect(response.body.msg).toBe(`Order with webId '${order.webId}' successfully deleted!`);
    expect(response.status).toBe(200);
    done();
  });
});
