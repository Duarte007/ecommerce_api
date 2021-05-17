import request from "supertest";
import App from "../../src/app";

describe("Auth tests beginning...", (): void => {
  beforeAll(async (): Promise<void> => {
    console.log("Initializing auth tests with jest...");
  });

  afterAll((): void => {
    console.log("Finished auth tests...");
  });

  it("should return status 200 and an object with a token", async (done): Promise<void> => {
    const params = {
      user: "adm",
      password: "12345",
    };

    try {
      const response = await request(App).post("/authenticate").send(params);
      expect(response.status).toBe(200);
      expect(typeof response.body.token == "string").toBe(true);
      done();
    } catch (err) {
      done.fail(err);
    }
  });

  it("should not authenticate user with wrong password", async (): Promise<void> => {
    const params = {
      user: "adm",
      password: "e123",
    };

    const response = await request(App).post("/authenticate").send(params);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("User or password is invalid!");
  });

  it("should not authenticate an inexistent user", async (): Promise<void> => {
    const params = {
      user: "admadm123",
      password: "e123",
    };

    const response = await request(App).post("/authenticate").send(params);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("User or password is invalid!");
  });

  it("should not access a protected route without token", async (): Promise<void> => {
    const response = await request(App).get("/product");
    expect(response.status).toBe(401);
  });
});
