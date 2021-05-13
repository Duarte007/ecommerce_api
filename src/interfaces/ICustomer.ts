export interface ICustomerParams {
  name?: string;
  cpfCnpj?: number;
  rg?: number;
  id?: number;
}

export interface ICustomer {
  id: number;
  name: string;
  companyName?: string;
  cpfCnpj: number;
  rg?: number;
  phone?: string;
  email?: string;
  cell: string;
  brithday: string;
  gender?: string;
}
