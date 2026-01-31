import request from "supertest";
import app from "../src/app";
import { registerAndLogin } from "./helpers";

describe("Users CRUD", () => {
  test("users crud", async () => {
    const eli = await registerAndLogin();

    const create = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${eli.accessToken}`)
      .send({
        username: `eli_${Math.random().toString(16).slice(2)}`,
        email: `eli_${Math.random().toString(16).slice(2)}@example.com`,
        password: "blabla",
        bio: "eli here rn",
      });
    expect(create.status).toBe(201);
    const userId = create.body.id as string;
    expect(userId).toBeTruthy();

    const list = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${eli.accessToken}`);
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);

    const get = await request(app)
      .get(`/users/${userId}`)
      .set("Authorization", `Bearer ${eli.accessToken}`);
    expect(get.status).toBe(200);
    expect(get.body.id).toBe(userId);

    const update = await request(app)
      .put(`/users/${userId}`)
      .set("Authorization", `Bearer ${eli.accessToken}`)
      .send({ bio: "Updated" });
    expect(update.status).toBe(200);
    expect(update.body.bio).toBe("Updated");

    const del = await request(app)
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${eli.accessToken}`);
    expect(del.status).toBe(204);

    const getAfter = await request(app)
      .get(`/users/${userId}`)
      .set("Authorization", `Bearer ${eli.accessToken}`);
    expect(getAfter.status).toBe(404);
  });
});
