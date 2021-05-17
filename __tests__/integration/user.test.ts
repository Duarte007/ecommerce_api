import request from "supertest";
import App from "../../src/app";

describe("User tests beginning...", (): void => {
  afterAll((): void => {
    console.log("Finished user tests...");
  });

  it("must return status 200 and an object with a success message", async (done): Promise<void> => {
    const user = {
      login: "adm",
      password: "12345",
    };

    const response = await request(App).post(`/user`).send(user);

    expect(response.body).toBeDefined();
    expect(response.body.msg).toEqual(`User '${user.login}' successfully inserted!`);
    expect(response.status).toBe(200);
    done();
  });
});
