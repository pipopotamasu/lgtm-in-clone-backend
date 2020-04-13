import request from "supertest";
import app from "@src/app";
import { Post } from "@models/Post";

describe("Get /api/v1/posts", () => {
  it("is successfull get posts as desc order", async () => {
    const post = await Post.create({ src: "path/to/src", userId: "testuserid" });
    const post2 = await Post.create({ src: "path/to/src", userId: "testuserid2" });
    const res = await request(app).get("/api/v1/posts").expect(200);

    expect(res.body.posts[0].userId).toBe(post2.userId);
    expect(res.body.posts[1].userId).toBe(post.userId);
  });

  it("is successfull get posts as pagination", async () => {
    for (let i = 0; i <= 20; i++) {
      await Post.create({ src: "path/to/src", userId: `testuserid${i + 1}` });
    }
    const res = await request(app).get("/api/v1/posts?page=2").expect(200);
    expect(res.body.posts[0].userId).toBe("testuserid1");
  });
});
