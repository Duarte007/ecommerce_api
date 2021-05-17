import { connection, Knex } from "../config/database";
import { ICustomerParams, ICustomer, ICustomerAddress } from "../interfaces/ICustomer";
import Util from "../util";

class Customer {
  public get = async (data: ICustomerParams): Promise<ICustomer[]> => {
    return connection
      .select("id", "name", "companyName", "cpfCnpj", "rg", "email", "phone", "cell", "brithday", "gender")
      .from("customer")
      .where((builder: Knex.QueryBuilder): void => {
        if (data.name) {
          builder.where("name", data.name);
        }
        if (data.cpfCnpj) {
          builder.where("cpfCnpj", Util.removeNonDigit(data.cpfCnpj));
        }
        if (data.rg) {
          builder.where("rg", data.rg);
        }
        if (data.id) {
          builder.where("id", data.id);
        }
      })
      .catch(async (err: Error) => {
        return Promise.reject({
          msg: "Error when tryng get customer.",
          error: { ...err },
        });
      });
  };

  public post = (customer: ICustomer): Promise<number> => {
    return connection
      .insert(customer)
      .into("customer")
      .then((result) => {
        console.log(result);
        return result[0];
      })
      .catch((err) => {
        console.log("Error when tryng insert customer.");
        console.log(err);
        return Promise.reject({ err });
      });
  };

  public postAddress = (customerAddress: ICustomerAddress): Promise<number> => {
    return connection
      .insert(customerAddress)
      .into("customerAddress")
      .then((result) => {
        console.log(result);
        return result[0];
      })
      .catch((err) => {
        console.log("Error when tryng insert customer address.");
        console.log(err);
        return Promise.reject({ err });
      });
  };

  public getCustomerIdByCpfCnpj = (cpfCnpj: string): Promise<number> => {
    return connection
      .select("id")
      .from("customer")
      .where("cpfCnpj", Util.removeNonDigit(cpfCnpj))
      .then((response: { id: number }[]) => response[0]?.id)
      .catch((err) => Promise.reject({ err }));
  };

  public getAddressId = (address: ICustomerAddress): Promise<number> => {
    return connection
      .select("id")
      .from("customerAddress")
      .where((builder: Knex.QueryBuilder) => {
        if (address.zip) builder.where("zip", Util.removeNonDigit(address.zip));
        if (address.street) builder.where("street", address.street);
        if (address.district) builder.where("district", address.district);
        if (address.number) builder.where("number", address.number);
      })
      .then((response: { id: number }[]) => response[0]?.id)
      .catch((err) => Promise.reject({ err }));
  };

  public delete = (data: ICustomerParams): Promise<number> => {
    return connection("customer")
      .where((builder: Knex.QueryBuilder): any => {
        if (data.name) {
          builder.where("name", data.name);
        }
        if (data.cpfCnpj) {
          builder.where("cpfCnpj", Util.removeNonDigit(data.cpfCnpj));
        }
        if (data.rg) {
          builder.where("rg", data.rg);
        }
        if (data.id) {
          builder.where("id", data.id);
        }
      })
      .del()
      .catch((err) => {
        console.log(err);
        return Promise.reject("Error to delete customer");
      });
  };
}

export default new Customer();
