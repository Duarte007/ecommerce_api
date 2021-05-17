import { connection, Knex } from "../config/database";
import { IOrderParams, IOrder, IOrderPayment, IOrderProduct, IOrderDelivery } from "../interfaces/IOrder";

class Order {
  public get = async (data: IOrderParams): Promise<IOrder[]> => {
    return connection
      .select(
        "order.id",
        "order.webId",
        "order.status",
        "order.amount",
        "order.discount",
        "order.freight",
        "order.channel",
        "order.date",
        "order.remarks",
        "order.customerId",
        "product.sku",
        "product.name as productName",
        "orderProduct.qtty",
        "orderProduct.price",
        "product.brandId",
        "orderPayment.paymentId",
        "orderPayment.installments",
        "customer.name as customerName",
        "customer.cpfCnpj",
        "customer.cell",
        "customer.email",
        "customerAddress.zip",
        "customerAddress.number",
        "customerAddress.street",
        "customerAddress.district",
        "customerAddress.state",
        "customerAddress.country",
        "orderDelivery.deliveryDate"
      )
      .from("order")
      .innerJoin("orderProduct", "order.id", "orderProduct.orderId")
      .innerJoin("product", "orderProduct.productId", "product.id")
      .innerJoin("customer", "order.customerId", "customer.id")
      .innerJoin("orderPayment", "order.id", "orderPayment.orderId")
      .innerJoin("orderDelivery", "order.id", "orderDelivery.orderId")
      .innerJoin("customerAddress", "orderDelivery.ctAddId", "customerAddress.id")
      .where((builder: Knex.QueryBuilder): void => {
        if (data.id) {
          builder.where("id", data.id);
        }
        if (data.webId) {
          builder.where("webId", data.webId);
        }
        if (data.date) {
          builder.where("date", data.date);
        }
        if (data.iniDate && data.endDate) {
          builder.whereBetween("date", [data.iniDate, data.endDate]);
        }
        if (data.channel) {
          builder.where("channel", data.channel);
        }
      })
      .catch(async (err: Error) => {
        return Promise.reject({
          msg: "Error when tryng get order.",
          error: { ...err },
        });
      });
  };

  public post = async (order: IOrder, trx: Knex.Transaction): Promise<number> => {
    const db = trx || connection;
    return db
      .insert(order)
      .into("order")
      .then((result) => {
        console.log("Order successfully inserted");
        console.log(result);
        return result[0];
      })
      .catch((err) => {
        console.log(err);
        return Promise.reject({ msg: "Error inserting order.", err });
      });
  };

  public postOrderPayment = async (orderPayment: IOrderPayment, trx: Knex.Transaction): Promise<number> => {
    const db = trx || connection;
    return db
      .insert(orderPayment)
      .into("orderPayment")
      .then((result) => {
        console.log("Payment information for the successfully entered order");
        console.log(result);
        return result[0];
      })
      .catch((err) => {
        console.log(err);
        return Promise.reject({ msg: "Error entering order payment information.", err });
      });
  };

  public postOrderProducts = async (orderProducts: IOrderProduct[], trx: Knex.Transaction): Promise<number> => {
    const db = trx || connection;
    return db
      .insert(orderProducts)
      .into("orderProduct")
      .then((result) => {
        console.log("Order products successfully inserted");
        console.log(result);
        return result[0];
      })
      .catch((err) => {
        console.log(err);
        return Promise.reject({ msg: "Error inserting order products.", err });
      });
  };

  public postOrderDelivery = async (orderDelivery: IOrderDelivery, trx: Knex.Transaction): Promise<number> => {
    const db = trx || connection;
    return db
      .insert(orderDelivery)
      .into("orderDelivery")
      .then((result) => {
        console.log("Order delivery information entered successfully");
        console.log(result);
        return result[0];
      })
      .catch((err) => {
        console.log(err);
        return Promise.reject({ msg: "Error when entering order delivery address data.", err });
      });
  };

  public delete = (data: IOrderParams): Promise<number> => {
    return connection("order")
      .where((builder: Knex.QueryBuilder): any => {
        builder.where("webId", data.webId);
        if (data.id) {
          builder.where("id", data.id);
        }
      })
      .del()
      .catch((err) => {
        console.log(err);
        return Promise.reject("Error to delete order");
      });
  };
}

export default new Order();
