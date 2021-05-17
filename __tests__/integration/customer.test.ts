import request from "supertest";
import App from "../../src/app";
import { getToken } from "../jestUtils";

let token = "";
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

describe("Customers tests beginning...", (): void => {
  beforeAll(async (): Promise<void> => {
    token = await getToken();
  });

  afterAll((): void => {
    console.log("Finished customers tests...");
  });

  it("should return status 401 and inform that token not provided", async (done): Promise<void> => {
    const response = await request(App).post(`/customer`).send(customer);

    expect(response.body.msg).toEqual(`Token not provided!`);
    expect(response.status).toBe(401);
    done();
  });

  it("should try to insert a customer without sending the 'cpfCnpj' and receive an error", async (done): Promise<void> => {
    const invalidCustomer = JSON.parse(JSON.stringify(customer));
    delete invalidCustomer.cpfCnpj;
    const response = await request(App).post(`/customer`).send(invalidCustomer).set("Authorization", token);

    expect(response.body).toBeDefined();
    expect(response.body.msg).toEqual(`Invalid body. 'cpfCnpj' required.`);
    expect(response.status).toBe(500);

    done();
  });

  it("should try to insert a customer without sending the 'name' and receive an error", async (done): Promise<void> => {
    const invalidCustomer = JSON.parse(JSON.stringify(customer));
    delete invalidCustomer.name;
    const response = await request(App).post(`/customer`).send(invalidCustomer).set("Authorization", token);

    expect(response.body).toBeDefined();
    expect(response.body.msg).toEqual(`Invalid body. 'name' required.`);
    expect(response.status).toBe(500);

    done();
  });

  it("should try to insert a customer without sending the 'address' and receive an error", async (done): Promise<void> => {
    const invalidCustomer = JSON.parse(JSON.stringify(customer));
    delete invalidCustomer.address;
    const response = await request(App).post(`/customer`).send(invalidCustomer).set("Authorization", token);

    expect(response.body).toBeDefined();
    expect(response.body.msg).toEqual(`Invalid body. 'address' required.`);
    expect(response.status).toBe(500);

    done();
  });

  it("should try to insert a customer sending a invalid 'cpfCnpj' and receive an error", async (done): Promise<void> => {
    const invalidCustomer = JSON.parse(JSON.stringify(customer));
    invalidCustomer.cpfCnpj = "2";
    const response = await request(App).post(`/customer`).send(invalidCustomer).set("Authorization", token);

    expect(response.body).toBeDefined();
    expect(response.body.msg).toEqual(`Invalid customer object. 'cpfCnpj' invalid.`);
    expect(response.status).toBe(500);

    done();
  });

  it("should return status 200 and insert the customer", async (done): Promise<void> => {
    const response = await request(App).post(`/customer`).send(customer).set("Authorization", token);

    expect(response.body).toBeDefined();
    expect(response.body.msg).toEqual(`Customer successfully inserted!`);
    expect(response.status).toBe(200);
    done();
  });

  it("must try to insert a customer with 'cpfCnpj' already registered and receive an error", async (done): Promise<void> => {
    const response = await request(App).post(`/customer`).send(customer).set("Authorization", token);

    expect(response.body).toBeDefined();
    expect(response.body.msg).toEqual(`Customer with cpfCnpj ${customer.cpfCnpj} already exists`);
    expect(response.status).toBe(500);
    done();
  });

  it("should return status 200 and a object with customer", async (done): Promise<void> => {
    const cpfCnpj = "121.944.366-26";

    const response = await request(App).get(`/customer?cpfCnpj=${cpfCnpj}`).set("Authorization", token);

    console.log(response.body);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data).toMatchSnapshot();
    expect(response.status).toBe(200);
    done();
  });

  it("should try to remove order without passing the cpfCnpj and receive 400 status", async (done): Promise<void> => {
    const response = await request(App).delete(`/customer`).set("Authorization", token);

    expect(response.body.msg).toBe(`Invalid body! 'cpfCnpj' required`);
    expect(response.status).toBe(400);
    done();
  });

  it("should return status 200 and remove customer", async (done): Promise<void> => {
    const cpfCnpj = "121.944.366-26";

    const response = await request(App).delete(`/customer`).send({ cpfCnpj }).set("Authorization", token);

    expect(response.body.msg).toBe("Customer successfully deleted!");
    expect(response.status).toBe(200);
    done();
  });
});
