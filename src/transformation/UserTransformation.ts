import { IUser } from "../interfaces/IUser";

class UserTransformation {
  public getUserObject = (data: any): IUser => {
    return {
      login: data.login,
      password: data.password,
    };
  };
}

export default new UserTransformation();
