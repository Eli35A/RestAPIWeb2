import request from "supertest";
import app from "../src/app";

export const registerAndLogin = async (
  overrides?: Partial<{ username: string; email: string; password: string }>
) => {
  const username = overrides?.username || `user_${Math.random().toString(16).slice(2)}`;
  const email = overrides?.email || `${username}@example.com`;
  const password = overrides?.password || "blabla";

  const reg = await request(app)
    .post("/auth/register")
    .send({ username, email, password });

  expect([201, 409]).toContain(reg.status);

  const login = await request(app)
    .post("/auth/login")
    .send({ emailOrUsername: username, password });

  expect(login.status).toBe(200);

  return {
    username,
    email,
    password,
    user: login.body.user as { id: string; username: string; email: string },
    accessToken: login.body.accessToken as string,
    refreshToken: login.body.refreshToken as string,
  };
};
