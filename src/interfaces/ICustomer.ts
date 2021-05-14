export interface ICustomerParams {
  name?: string;
  cpfCnpj?: string;
  rg?: number;
  id?: number;
}

export interface ICustomer {
  id?: number;
  name: string;
  companyName?: string;
  cpfCnpj: string;
  rg?: number;
  phone?: string;
  email?: string;
  cell: string;
  brithday: string;
  gender?: string;
}

export interface ICustomerAddress {
  id?: number;
  customerId: number;
  zip: string;
  number: number;
  street: string;
  district: string;
  state: string;
  country: string;
}

export interface ICustomerToInsert extends ICustomer {
  address: ICustomerAddress;
}
