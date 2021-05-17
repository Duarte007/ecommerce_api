export interface IOrderParams {
  id?: number;
  webId?: number;
  date?: string;
  iniDate?: string;
  endDate?: string;
  channel?: number;
}

export interface IOrder {
  id?: number;
  webId: number;
  status: number;
  amount: number;
  discount: number;
  freight: number;
  channel: number;
  date: string;
  remarks: string;
  customerId: number;
}
export interface IOrderProduct {
  orderId: number;
  productId: number;
  qtty: number;
  price: number;
  brandId: number;
}

export interface IOrderPayment {
  orderId: number;
  paymentId: string;
  installments: number;
}

export interface IOrderDelivery {
  orderId: number;
  ctAddId: number;
  deliveryDate: string;
}
