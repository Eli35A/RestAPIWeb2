import request from "supertest";
import app from "../src/app";

describe("Auth", () => {
  test("authentication process", async () => {
    const username = `eli_${Math.random().toString(16).slice(2)}`;
    const email = `${username}@example.com`;
    const password = "blabla";

    const reg = await request(app).post("/auth/register").send({ username, email, password });
    expect(reg.status).toBe(201);
    expect(reg.body.accessToken).toBeTruthy();
    expect(reg.body.refreshToken).toBeTruthy();

    const login = await request(app).post("/auth/login").send({ emailOrUsername: username, password });
    expect(login.status).toBe(200);

    const oldRefresh = login.body.refreshToken as string;
    const refresh = await request(app).post("/auth/refresh").send({ refreshToken: oldRefresh });
    expect(refresh.status).toBe(200);
    expect(refresh.body.accessToken).toBeTruthy();
    expect(refresh.body.refreshToken).toBeTruthy();

    const refreshAgain = await request(app).post("/auth/refresh").send({ refreshToken: oldRefresh });
    expect(refreshAgain.status).toBe(401);

    const logout = await request(app).post("/auth/logout").send({ refreshToken: refresh.body.refreshToken });
    expect(logout.status).toBe(204);
  });
});
