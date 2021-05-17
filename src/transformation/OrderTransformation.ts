import { IOrder, IOrderProduct } from "src/interfaces/IOrder";
import Product from "../models/product";

class OrderTransformation {
  public getOrderObject = (data: any): IOrder => {
    return {
      webId: data.webId,
      status: data.status,
      amount: data.amount,
      discount: data.discount,
      freight: data.freight,
      channel: data.channel,
      date: data.date,
      remarks: data.remarks,
      customerId: data.customerId,
    };
  };

  public getOrderProductsObject = async (data: any) => {
    let products: IOrderProduct[] = [];
    for (const product of data.products) {
      const productId = await Product.getProductIdBySku(product.sku);
      products = [
        ...products,
        {
          orderId: data.orderId,
          productId,
          qtty: product.qtty,
          price: product.price,
          brandId: product.brandId,
        },
      ];
    }
    return products;
  };

  public getOrderPaymentObject = (data: any) => {
    return {
      orderId: data.orderId,
      paymentId: data.payment.paymentId,
      installments: data.payment.installments,
    };
  };

  public getOrderDeliveryObject = (data: any) => {
    return {
      orderId: data.orderId,
      ctAddId: data.ctAddId,
      deliveryDate: data.delivery.deliveryDate,
    };
  };
}

export default new OrderTransformation();
