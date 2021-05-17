import { Request, Response } from "express";
import CustomerTransformation from "../transformation/CustomerTransformation";
import { IController } from "../interfaces";
import Customer from "../models/customer";
import { ICustomer, ICustomerToInsert } from "src/interfaces/ICustomer";
import Util from "../util";

class CustomerController implements IController {
  public get = async (req: Request, res: Response): Promise<Response> => {
    try {
      const params = {
        name: req.query?.name?.toString() || "",
        cpfCnpj: req.query?.cpfCnpj?.toString()?.replace(/[-\.]/g, ""),
        rg: parseInt(req.query?.rg?.toString()?.replace(/[-\.]/g, "") ?? "0"),
        id: parseInt(req.query?.id?.toString()?.replace(/[-\.]/g, "") ?? "0"),
      };
      const customers = await Customer.get(params);
      return res.status(200).json({ data: customers });
    } catch (err) {
      return res.status(500).json({ msg: "Error when trying to get customer", error: err.message });
    }
  };

  public post = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = req.body;
      if (typeof data !== "object") return res.status(400).json({ msg: "Invalid body. We expect a object." });
      await this.checkCustomer(data);
      const formattedCustomer = CustomerTransformation.getCustomerObject(data);
      const customerId = await Customer.post(formattedCustomer);
      if (customerId) {
        const customerAddress = CustomerTransformation.getCustomerAddressObject(data.address, customerId);
        const addressId = await Customer.postAddress(customerAddress);
        if (addressId) return res.status(200).json({ msg: "Customer successfully inserted!" });
      }
      return res.status(500).json({
        msg: "Error when trying to insert customer",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.msg || "Error when trying to insert customer", err });
    }
  };

  public delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const params = req.body;
      if (!params.cpfCnpj) return res.status(400).json({ msg: "Invalid body! 'cpfCnpj' required" });
      const customer = await Customer.delete(params);
      return res.status(200).json({ msg: `Customer successfully deleted!` });
    } catch (err) {
      return res.status(500).json({ msg: "Error when trying to delete customer", error: err.message });
    }
  };

  private checkCustomer = async (customer: ICustomerToInsert) => {
    if (customer.hasOwnProperty && !customer.hasOwnProperty("cpfCnpj"))
      return Promise.reject({ msg: "Invalid body. 'cpfCnpj' required." });
    if (!customer.hasOwnProperty("name")) return Promise.reject({ msg: "Invalid body. 'name' required.", data: customer });
    if (!customer.hasOwnProperty("address")) return Promise.reject({ msg: "Invalid body. 'address' required.", data: customer });
    if (!customer.address.hasOwnProperty("zip"))
      return Promise.reject({ msg: "Invalid body. 'address.zip' required.", data: customer });
    if (!customer.address.hasOwnProperty("number"))
      return Promise.reject({ msg: "Invalid body. 'address.number' required.", data: customer });
    if (!customer.address.hasOwnProperty("street"))
      return Promise.reject({ msg: "Invalid body. 'address.street' required.", data: customer });
    if (!Util.validateCpfCnpj(customer.cpfCnpj))
      return Promise.reject({ msg: `Invalid customer object. 'cpfCnpj' invalid.`, data: customer });
    const response = await Customer.get({ cpfCnpj: customer.cpfCnpj });
    if (response.length)
      return Promise.reject({ msg: `Customer with cpfCnpj ${customer.cpfCnpj} already exists`, data: customer });
  };
}

export default new CustomerController();
