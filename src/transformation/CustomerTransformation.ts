import { ICustomer, ICustomerAddress } from "src/interfaces/ICustomer";

class CustomerTransformation {
  public getCustomerObject = (data: any): ICustomer => {
    return {
      name: data.name,
      companyName: data.companyName,
      cpfCnpj: data.cpfCnpj?.toString()?.replace(/[-\.]/g, ""),
      rg: parseInt(data.rg?.toString()?.replace(/[-\.]/g, "") ?? "0"),
      email: data.email,
      phone: data.phone,
      cell: data.cell,
      brithday: data.brithday,
      gender: data.gender,
    };
  };

  public getCustomerAddressObject = (data: any, customerId: number): ICustomerAddress => {
    return {
      customerId,
      zip: data.zip?.toString()?.replace(/[-\.]/g, ""),
      number: data.number,
      street: data.street,
      district: data.district,
      state: data.state,
      country: data.country,
    };
  };
}

export default new CustomerTransformation();
