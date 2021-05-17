import App from "../src/app";
import request from "supertest";

export const getToken = async (): Promise<string> => {
  const params = {
    user: "adm",
    password: "12345",
  };

  return request(App)
    .post("/authenticate")
    .send(params)
    .then((res) => res.body.token);
};
