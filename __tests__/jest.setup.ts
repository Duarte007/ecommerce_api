import { connection } from "../src/config/database";

jest.setTimeout(20000);

afterAll(async () => {
  connection.destroy();
});
