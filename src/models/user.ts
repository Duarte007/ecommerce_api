import { connection, Knex } from "../config/database";
import { IUserParams, IUser } from "../interfaces/IUser";

class User {
  public get = async (data: IUserParams): Promise<IUser[]> => {
    return connection
      .select("id", "login", "password")
      .from("user")
      .where((builder: Knex.QueryBuilder): void => {
        if (data.user) {
          builder.where("userapi.login", data.user);
        }
        if (data.password) {
          builder.whereRaw("userapi.password = MD5(SHA1(?)) ", [
            `${data.password}`,
          ]);
        }
      })
      .catch(async (err: Error) => {
        return Promise.reject({
          msg: "Erro ao obter informações do usuário!",
          error: { ...err },
        });
      });
  };
}

export default new User();
