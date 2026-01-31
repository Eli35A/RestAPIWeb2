import request from "supertest";
import app from "../src/app";
import { registerAndLogin } from "./helpers";

describe("Posts CRUD", () => {
  test("posts crud", async () => {
    const eli = await registerAndLogin();
    const beli = await registerAndLogin();

    const create = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${eli.accessToken}`)
      .send({ message: "Hello" });
    expect(create.status).toBe(201);
    const postId = create.body._id as string;
    expect(postId).toBeTruthy();

    const list = await request(app).get("/posts");
    expect(list.status).toBe(200);

    const get = await request(app).get(`/posts/${postId}`);
    expect(get.status).toBe(200);

    const forbidden = await request(app)
      .put(`/posts/${postId}`)
      .set("Authorization", `Bearer ${beli.accessToken}`)
      .send({ message: "Hack" });
    expect(forbidden.status).toBe(403);

    const update = await request(app)
      .put(`/posts/${postId}`)
      .set("Authorization", `Bearer ${eli.accessToken}`)
      .send({ message: "Updated" });
    expect(update.status).toBe(200);
    expect(update.body.message).toBe("Updated");

    const delForbidden = await request(app)
      .delete(`/posts/${postId}`)
      .set("Authorization", `Bearer ${beli.accessToken}`);
    expect(delForbidden.status).toBe(403);

    const del = await request(app)
      .delete(`/posts/${postId}`)
      .set("Authorization", `Bearer ${eli.accessToken}`);
    expect(del.status).toBe(204);
  });
});
