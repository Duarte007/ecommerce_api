import { connection, Knex } from "../config/database";
import { IOrderParams, IOrder } from "../interfaces/IOrder";

class Order {
  public get = async (data: IOrderParams): Promise<IOrder[]> => {
    return connection
      .select(
        "order.id",
        "order.idWeb",
        "order.status",
        "order.amount",
        "order.discount",
        "order.freight",
        "order.channel",
        "order.orderDate",
        "order.remarks",
        "order.customerId",
        "orderProduct.sku",
        "orderProduct.name as productName",
        "orderProduct.qtty",
        "orderProduct.price",
        "orderProduct.brand",
        "orderPayment.method",
        "orderPayment.installments",
        "customer.name as customerName",
        "customer.cpfCnpj",
        "customer.cell",
        "customer.email",
        "orderDelivery.address",
        "orderDelivery.zip",
        "orderDelivery.number",
        "orderDelivery.street",
        "orderDelivery.district",
        "orderDelivery.state",
        "orderDelivery.country",
        "orderDelivery.deliveryDate"
      )
      .from("order")
      .innerJoin("orderProduct", "order.id", "orderProduct.orderId")
      .innerJoin("orderPayment", "order.id", "orderPayment.orderId")
      .innerJoin("orderDelivery", "order.id", "orderDelivery.orderId")
      .where((builder: Knex.QueryBuilder): void => {
        if (data.id) {
          builder.where("id", data.id);
        }
        if (data.idWeb) {
          builder.where("idWeb", data.idWeb);
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

  public post = (orders: IOrder[]) => {
    return connection
      .insert(orders)
      .into("order")
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export default new Order();
