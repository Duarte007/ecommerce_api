import { connection } from "../config/database";

class Dump {
  public initTables = async (): Promise<boolean> => {
    const payment =
      "CREATE TABLE `payment` (" +
      "`id` int(11) NOT NULL AUTO_INCREMENT," +
      "`name` varchar(40) NOT NULL DEFAULT ''," +
      "PRIMARY KEY (`id`)" +
      ") ENGINE=InnoDB DEFAULT CHARSET=latin1;";
    const order =
      "CREATE TABLE `order` (" +
      "`id` int(11) NOT NULL AUTO_INCREMENT," +
      "`webId` varchar(20) NOT NULL DEFAULT '0'," +
      "`status` int(5) NOT NULL DEFAULT 0," +
      "`amount` double(6,3) NOT NULL DEFAULT 0," +
      "`discount` double(6,3) NOT NULL DEFAULT 0," +
      "`freight` double(6,3) NOT NULL DEFAULT 0," +
      "`channel` int(5) NOT NULL DEFAULT 0," +
      "`date` DATE," +
      "`remarks` varchar(255) NOT NULL DEFAULT ''," +
      "`customerId` int(11) NOT NULL DEFAULT 0," +
      "PRIMARY KEY (`id`)," +
      "CONSTRAINT `fk_customerId` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE CASCADE," +
      "KEY i2(`webId`, `date`)," +
      "KEY i3(`date`)," +
      "KEY i4(`status`)" +
      ") ENGINE=InnoDB DEFAULT CHARSET=latin1;";
    const orderProduct =
      "CREATE TABLE `orderProduct` (" +
      "`id` int(11) NOT NULL AUTO_INCREMENT," +
      "`orderId` int(11) NOT NULL," +
      "`productId` int(11) NOT NULL," +
      "`qtty` int(10) NOT NULL DEFAULT 0," +
      "`price` double(6,3) NOT NULL DEFAULT 0," +
      "`brandId` int(11) NOT NULL DEFAULT 0," +
      "PRIMARY KEY (`id`)," +
      "CONSTRAINT `fk_orderId_orderProduct` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE," +
      "CONSTRAINT `fk_productId_orderProduct` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE," +
      "KEY i2 (`orderId`)" +
      ") ENGINE=InnoDB DEFAULT CHARSET=latin1;";
    const orderPayment =
      "CREATE TABLE `orderPayment` (" +
      "`id` int(11) NOT NULL AUTO_INCREMENT," +
      "`orderId` int(11) NOT NULL," +
      "`paymentId` int(11) NOT NULL," +
      "`installments` int(10) NOT NULL DEFAULT 1," +
      "PRIMARY KEY (`id`)," +
      "CONSTRAINT `fk_orderId_orderPayment` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE," +
      "CONSTRAINT `fk_paymentId_orderPayment` FOREIGN KEY (`paymentId`) REFERENCES `payment`(`id`) ON DELETE CASCADE," +
      "KEY i2 (`orderId`)" +
      ") ENGINE=InnoDB DEFAULT CHARSET=latin1;";
    const orderDelivery =
      "CREATE TABLE `orderDelivery` (" +
      "`id` int(11) NOT NULL AUTO_INCREMENT," +
      "`orderId` int(11) NOT NULL," +
      "`ctAddId` int(11) NOT NULL," +
      "`deliveryDate` date," +
      "PRIMARY KEY (`id`)," +
      "CONSTRAINT `fk_orderId_orderDelivery` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE," +
      "CONSTRAINT `fk_ctAddId_orderDelivery` FOREIGN KEY (`ctAddId`) REFERENCES `customerAddress`(`id`) ON DELETE CASCADE," +
      "KEY i2 (`orderId`)" +
      ") ENGINE=InnoDB DEFAULT CHARSET=latin1;";
    const product =
      "CREATE TABLE `product` (" +
      "`id` int(11) NOT NULL AUTO_INCREMENT," +
      "`sku` char(16) NOT NULL DEFAULT ''," +
      "`name` varchar(60) NOT NULL DEFAULT ''," +
      "`costPrice` double(6,3) NOT NULL DEFAULT 0," +
      "`salePrice` double(6,3) NOT NULL DEFAULT 0," +
      "`brandId` int(5) NOT NULL DEFAULT 0," +
      "`stock` int(5) NOT NULL DEFAULT 0," +
      "PRIMARY KEY (`id`)," +
      "UNIQUE (`sku`)," +
      "KEY i2 (`sku`)" +
      ") ENGINE=InnoDB DEFAULT CHARSET=latin1;";
    const customer =
      "CREATE TABLE `customer` (" +
      "`id` int(11) NOT NULL AUTO_INCREMENT," +
      "`name` varchar(60) NOT NULL DEFAULT ''," +
      "`companyName` varchar(60) NOT NULL DEFAULT ''," +
      "`cpfCnpj` varchar(14) NOT NULL DEFAULT '0'," +
      "`rg` int(10) NOT NULL DEFAULT 0," +
      "`email` varchar(60) NOT NULL DEFAULT ''," +
      "`phone` char(12) NOT NULL DEFAULT ''," +
      "`cell` char(12) NOT NULL DEFAULT ''," +
      "`brithday` date," +
      "`gender` int(1) NOT NULL DEFAULT 0," +
      "PRIMARY KEY (`id`)," +
      "KEY i2 (`cpfCnpj`)," +
      "KEY i3 (`rg`)," +
      "KEY i4 (`gender`)" +
      ") ENGINE=InnoDB DEFAULT CHARSET=latin1;";
    const customerAddress =
      "CREATE TABLE `customerAddress` (" +
      "`id` int(11) NOT NULL AUTO_INCREMENT," +
      "`customerId` int(11) NOT NULL," +
      "`zip` int(10) NOT NULL DEFAULT 0," +
      "`number` int(5) NOT NULL DEFAULT 0," +
      "`street` varchar(60) NOT NULL," +
      "`district` varchar(60) NOT NULL," +
      "`state` varchar(10) NOT NULL," +
      "`country` varchar(20) NOT NULL," +
      "PRIMARY KEY (`id`)," +
      "CONSTRAINT `fk_customerId_customerAddress` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE CASCADE," +
      "KEY i2 (`customerId`)" +
      ") ENGINE=InnoDB DEFAULT CHARSET=utf8";
    const user =
      "CREATE TABLE `user` (" +
      "`id` int(11) NOT NULL AUTO_INCREMENT," +
      "`login` varchar(40) NOT NULL DEFAULT ''," +
      "`password` varchar(40) NOT NULL DEFAULT ''," +
      "PRIMARY KEY (`id`)" +
      ") ENGINE=MyISAM DEFAULT CHARSET=latin1;";

    return connection.schema
      .hasTable("customer")
      .then(async (exists: boolean) => {
        if (!exists) return connection.schema.raw(customer);
        return;
      })
      .then(async () => {
        return connection.schema.hasTable("customerAddress").then(async (exists: boolean) => {
          if (!exists) return connection.schema.raw(customerAddress);
          return;
        });
      })
      .then(async () => {
        return connection.schema.hasTable("order").then(async (exists: boolean) => {
          if (!exists) return connection.schema.raw(order);
          return;
        });
      })
      .then(async () => {
        return connection.schema.hasTable("product").then(async (exists: boolean) => {
          if (!exists) return connection.schema.raw(product);
          return;
        });
      })
      .then(async () => {
        return connection.schema.hasTable("orderProduct").then(async (exists: boolean) => {
          if (!exists) return connection.schema.raw(orderProduct);
          return;
        });
      })
      .then(async () => {
        return connection.schema.hasTable("payment").then(async (exists: boolean) => {
          if (!exists) {
            await connection.schema.raw(payment);
            return connection.insert({ name: "CARTAO" }).into("payment");
          }
          return;
        });
      })
      .then(async () => {
        return connection.schema.hasTable("orderPayment").then(async (exists: boolean) => {
          if (!exists) return connection.schema.raw(orderPayment);
          return;
        });
      })
      .then(async () => {
        return connection.schema.hasTable("orderDelivery").then(async (exists: boolean) => {
          if (!exists) return connection.schema.raw(orderDelivery);
          return;
        });
      })
      .then(async () => {
        return connection.schema.hasTable("user").then(async (exists: boolean) => {
          if (!exists) return connection.schema.raw(user);
          return;
        });
      })
      .then(async () => {
        console.log("Table verification completed!");
        return true;
      })
      .catch((err: Error) => {
        console.log("Error checking tables.");
        console.log(err);
        return false;
      });
  };
}

export default new Dump();
