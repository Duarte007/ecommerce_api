import { Request, Response } from "express";
import OrderTransformation from "../transformation/OrderTransformation";
import { IController } from "../interfaces";
import Order from "../models/order";
import Customer from "../models/customer";
import { Knex } from "knex";
import { connection } from "../config/database";
import CustomerTransformation from "../transformation/CustomerTransformation";

class OrderController implements IController {
  public get = async (req: Request, res: Response): Promise<Response> => {
    try {
      const params = {
        id: parseInt(req.query?.id?.toString()?.replace(/[-\.]/g, "") ?? "0"),
        webId: parseInt(req.query?.webId?.toString()?.replace(/[-\.]/g, "") ?? "0"),
        date: req.query?.date?.toString() || "",
        iniDate: req.query?.iniDate?.toString() || "",
        endDate: req.query?.endDate?.toString() || "",
        channel: parseInt(req.query?.channel?.toString()?.replace(/[-\.]/g, "") ?? "0"),
      };
      const orders = await Order.get(params);
      console.log("Order successfully returned.");
      return res.status(200).json({ data: orders });
    } catch (err) {
      return res.status(500).json({ msg: "Error when trying to get order", error: err });
    }
  };

  public post = async (req: Request, res: Response): Promise<Response> => {
    let trx: Knex.Transaction | undefined = undefined;
    try {
      const data = req.body;
      const trxProvider = connection.transactionProvider();
      trx = await trxProvider();
      if (typeof data !== "object") return res.status(400).json({ msg: "Invalid body. We expect a object." });
      await this.checkOrder(data);

      data.customerId = await Customer.getCustomerIdByCpfCnpj(data.customer.cpfCnpj);
      const formattedOrder = OrderTransformation.getOrderObject(data);
      const newOrder = await Order.post(formattedOrder, trx);
      data.orderId = newOrder;

      const formattedOrderProducts = await OrderTransformation.getOrderProductsObject(data);
      await Order.postOrderProducts(formattedOrderProducts, trx);
      console.log("Order products successfully inserted!");
      const formattedOrderPayment = await OrderTransformation.getOrderPaymentObject(data);
      await Order.postOrderPayment(formattedOrderPayment, trx);
      console.log("Order payment information entered successfully!");
      const ctAddId = await Customer.getAddressId(data.delivery);
      if (!ctAddId) {
        const address = CustomerTransformation.getCustomerAddressObject(data.delivery, data.customerId);
        const newAddressId = await Customer.postAddress(address);
        console.log("New address customer entered successfully!", newAddressId);
        data.ctAddId = newAddressId;
      } else {
        console.log("Address customer: ", ctAddId);
        data.ctAddId = ctAddId;
      }
      const formattedOrderDelivery = await OrderTransformation.getOrderDeliveryObject(data);
      await Order.postOrderDelivery(formattedOrderDelivery, trx);
      console.log("Order delivery information entered successfully!");
      await trx.commit();
      return res.status(200).json({ msg: "Order successfully inserted!", data: { id: newOrder, webId: data.webId } });
    } catch (err) {
      if (trx) await trx.rollback();
      return res.status(500).json({ msg: err.msg || "Error when trying to insert order", error: err });
    }
  };

  public delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const params = req.body;
      if (!params.webId) return res.status(400).json({ msg: "Invalid body! 'webId' required" });
      const order = await Order.delete(params);
      return res.status(200).json({ msg: `Order with webId '${params.webId}' successfully deleted!` });
    } catch (err) {
      return res.status(500).json({ msg: "Error when trying to delete order", error: err.message });
    }
  };

  private checkOrder = async (order: any) => {
    if (order.hasOwnProperty && !order.hasOwnProperty("webId")) return Promise.reject({ msg: "Invalid body. 'webId' required." });
    if (!order.hasOwnProperty("amount")) return Promise.reject({ msg: "Invalid body. 'amount' required.", data: order });
    if (!order.hasOwnProperty("channel")) return Promise.reject({ msg: "Invalid body. 'channel' required.", data: order });
    if (!order.hasOwnProperty("products")) return Promise.reject({ msg: "Invalid body. 'products' required.", data: order });
    if (Array.isArray(order.products) && !order.products[0].hasOwnProperty("sku"))
      return Promise.reject({ msg: "Invalid body. 'products.sku' required.", data: order });
    if (!order.products[0].hasOwnProperty("price"))
      return Promise.reject({ msg: "Invalid body. 'products.price' required.", data: order });
    if (!order.products[0].hasOwnProperty("qtty"))
      return Promise.reject({ msg: "Invalid body. 'products.qtty' required.", data: order });
    if (!order.hasOwnProperty("customer")) return Promise.reject({ msg: "Invalid body. 'customer' required.", data: order });
    if (!order.customer.hasOwnProperty("cpfCnpj"))
      return Promise.reject({ msg: "Invalid body. 'customer.cpfCnpj' required.", data: order });
    if (!order.hasOwnProperty("payment")) return Promise.reject({ msg: "Invalid body. 'payment' required.", data: order });
    if (!order.payment.hasOwnProperty("paymentId"))
      return Promise.reject({ msg: "Invalid body. 'payment.paymentId' required.", data: order });
    if (!order.hasOwnProperty("delivery")) return Promise.reject({ msg: "Invalid body. 'delivery' required.", data: order });
    if (!order.delivery.hasOwnProperty("deliveryDate"))
      return Promise.reject({ msg: "Invalid body. 'delivery.deliveryDate' required.", data: order });
    if (!order.delivery.hasOwnProperty("zip"))
      return Promise.reject({ msg: "Invalid body. 'delivery.zip' required.", data: order });
    if (!order.delivery.hasOwnProperty("street"))
      return Promise.reject({ msg: "Invalid body. 'delivery.zip' required.", data: order });
    if (!order.delivery.hasOwnProperty("number"))
      return Promise.reject({ msg: "Invalid body. 'delivery.number' required.", data: order });
    if (!order.delivery.hasOwnProperty("district"))
      return Promise.reject({ msg: "Invalid body. 'delivery.district' required.", data: order });
    const response = await Order.get({ webId: order.webId });
    if (response.length) return Promise.reject({ msg: `Order with 'webId' ${order.webId} already exists`, data: order });
  };
}

export default new OrderController();
