import request from "supertest";
import app from "@src/app";
import { Post } from "@models/Post";
import { PostBookmark } from "@models/PostBookmark";
import { login } from "@test/helpers/user";

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

  it("is successfull get posts with bookmark status", async () => {
    const { loginCookie, user } = await login();
    const post = new Post({ src: "path/to/src", userId: "testuserid" });
    const bookmark = await PostBookmark.create({ postId: post.id, userId: user.id });
    post.bookmarks.push(bookmark);
    await post.save();
    const res = await request(app).get("/api/v1/posts").set("Cookie", [loginCookie]).expect(200);
    expect(res.body.posts[0].bookmarked).toBe(true);
  });
});
