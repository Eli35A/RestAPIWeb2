import request from "supertest";
import app from "../src/app";
import { registerAndLogin } from "./helpers";

describe("Comments CRUD", () => {
  test("comments crud", async () => {
    const alice = await registerAndLogin();
    const bob = await registerAndLogin();

    // create post
    const post = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${alice.accessToken}`)
      .send({ message: "Post" });
    expect(post.status).toBe(201);
    const postId = post.body._id as string;

    // create comment
    const create = await request(app)
      .post(`/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${alice.accessToken}`)
      .send({ message: "VERY Nice" });
    expect(create.status).toBe(201);
    const commentId = create.body._id as string;

    const listForPost = await request(app).get(`/posts/${postId}/comments`);
    expect(listForPost.status).toBe(200);

    const get = await request(app).get(`/comments/${commentId}`);
    expect(get.status).toBe(200);

    const forbidUpdate = await request(app)
      .put(`/comments/${commentId}`)
      .set("Authorization", `Bearer ${bob.accessToken}`)
      .send({ postId, message: "Hack" });
    expect(forbidUpdate.status).toBe(403);

    const update = await request(app)
      .put(`/comments/${commentId}`)
      .set("Authorization", `Bearer ${alice.accessToken}`)
      .send({ postId, message: "Edited" });
    expect(update.status).toBe(200);
    expect(update.body.message).toBe("Edited");

    const forbidDelete = await request(app)
      .delete(`/comments/${commentId}`)
      .set("Authorization", `Bearer ${bob.accessToken}`);
    expect(forbidDelete.status).toBe(403);

    const del = await request(app)
      .delete(`/comments/${commentId}`)
      .set("Authorization", `Bearer ${alice.accessToken}`);
    expect(del.status).toBe(204);
  });
});
