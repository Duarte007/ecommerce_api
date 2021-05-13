import { connection } from "../config/database";

class Dump {
  public initTables = async (): Promise<boolean> => {
    const order = ``;
    const orderProduct = ``;
    const orderPayment = ``;
    const orderDelivery = ``;
    const product = ``;
    const customer = ``;
    const customerAddress = ``;
    const user = ``;

    return connection.schema
      .hasTable("order")
      .then(async (exists: boolean) => {
        if (!exists) return connection.schema.raw(order);
        return;
      })
      .then(async () => {
        return connection.schema
          .hasTable("orderProduct")
          .then(async (exists: boolean) => {
            if (!exists) return connection.schema.raw(orderProduct);
            return;
          });
      })
      .then(async () => {
        return connection.schema
          .hasTable("orderPayment")
          .then(async (exists: boolean) => {
            if (!exists) return connection.schema.raw(orderPayment);
            return;
          });
      })
      .then(async () => {
        return connection.schema
          .hasTable("orderDelivery")
          .then(async (exists: boolean) => {
            if (!exists) return connection.schema.raw(orderDelivery);
            return;
          });
      })
      .then(async () => {
        return connection.schema
          .hasTable("product")
          .then(async (exists: boolean) => {
            if (!exists) return connection.schema.raw(product);
            return;
          });
      })
      .then(async () => {
        return connection.schema
          .hasTable("customer")
          .then(async (exists: boolean) => {
            if (!exists) return connection.schema.raw(customer);
            return;
          });
      })
      .then(async () => {
        return connection.schema
          .hasTable("customerAddress")
          .then(async (exists: boolean) => {
            if (!exists) return connection.schema.raw(customerAddress);
            return;
          });
      })
      .then(async () => {
        return connection.schema
          .hasTable("user")
          .then(async (exists: boolean) => {
            if (!exists) return connection.schema.raw(user);
            return;
          });
      })
      .then(async () => {
        console.log("Table verification completed!");
        // await connection.destroy();
        return true;
      })
      .catch((err: Error) => {
        console.log("Error checking tables.");
        console.log(err);
        return false;
      });
  };
}

export default new Dump();
