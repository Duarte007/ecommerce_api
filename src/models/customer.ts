import { connection, Knex } from "../config/database";
import { ICustomerParams, ICustomer } from "../interfaces/ICustomer";

class Customer {
  public get = async (data: ICustomerParams): Promise<ICustomer[]> => {
    return connection
      .select(
        "id",
        "name",
        "companyName",
        "cpfCnpj",
        "rg",
        "email",
        "phone",
        "cell",
        "brithday",
        "gender"
      )
      .from("customer")
      .where((builder: Knex.QueryBuilder): void => {
        if (data.name) {
          builder.where("name", data.name);
        }
        if (data.cpfCnpj) {
          builder.where("cpfCnpj", data.cpfCnpj);
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

  public post = (customers: ICustomer[]) => {
    return connection
      .insert(customers)
      .into("customer")
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log("Error when tryng insert customer.");
        console.log(err);
      });
  };
}

export default new Customer();
