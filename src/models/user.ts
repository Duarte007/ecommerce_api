import { connection, Knex } from "../config/database";
import { IUserParams, IUser } from "../interfaces/IUser";

class User {
  public get = async (data: IUserParams): Promise<IUser[]> => {
    return connection
      .select("id", "login", "password")
      .from("user")
      .where((builder: Knex.QueryBuilder): void => {
        if (data.user) {
          builder.where("login", data.user);
        }
        if (data.password) {
          builder.whereRaw("password = MD5(SHA1(?)) ", [`${data.password}`]);
        }
      })
      .catch(async (err: Error) => {
        return Promise.reject({
          msg: "Error to get user!",
          error: { ...err },
        });
      });
  };

  public post = async (user: IUser): Promise<number[]> => {
    return connection
      .raw(`INSERT INTO user (login, password) VALUES ('${user.login}', MD5(SHA1('${user.password}')));`)
      .catch(async (err: Error) => {
        return Promise.reject({
          msg: "Error to set user!",
          error: { ...err },
        });
      });
  };
}

export default new User();
