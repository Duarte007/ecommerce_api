export interface IOrderParams {
  id: number;
  idWeb: number;
  date: string;
  iniDate: string;
  endDate: string;
  channel: number;
}

export interface IOrder {
  id: number;
  idWeb: number;
  status: number;
  amount: number;
  discount: number;
  freight: number;
  channel: number;
  orderDate: string;
  remarks: string;
  customerId: number;
  sku: string;
  productName: string;
  qtty: number;
  price: number;
  brand: string;
  method: string;
  installments: number;
  customerName: string;
  cpfCnpj: number;
  cell: string;
  email: string;
  address: string;
  zip: number;
  number: number;
  street: string;
  district: string;
  state: string;
  country: string;
  deliveryDate: string;
}
