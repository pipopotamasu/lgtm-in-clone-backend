import request from "supertest";
import app from "@src/app";
import { Post, PostDocument } from "@models/Post";
import { login } from "@test/helpers/user";
import { PostBookmark } from "@models/PostBookmark";
import { Types } from "mongoose";

describe("Post /api/v1/posts/:id/bookmark", () => {
  describe("has not loggedin yet", () => {
    it("returns 302", async () => {
      const post = await Post.create({ src: "path/to/src", userId: "testuserid" });
      const res = await request(app).post(`/api/v1/posts/${post.id}/bookmark`).expect(302);

      expect(res.body.errors[0]).toBe("Please login before executing this operation");
    });
  });

  describe("post does not exist", () => {
    it("returns 404", async () => {
      const { loginCookie } = await login();
      const res = await request(app).post(`/api/v1/posts/${Types.ObjectId()}/bookmark`).set("Cookie", [loginCookie]).expect(404);
      expect(res.body.errors[0]).toBe("Post does not exist.");
    });
  });

  describe("has logged in", () => {
    it("saves post bookmark", async () => {
      const { loginCookie, user } = await login();
      let post: PostDocument | null = await Post.create({ src: "path/to/src", userId: "testuserid" });
      await request(app).post(`/api/v1/posts/${post.id}/bookmark`).set("Cookie", [loginCookie]).expect(201);

      const bookmark = await PostBookmark.findOne({ userId: user.id, postId: post.id });
      expect(bookmark).toBeTruthy();

      post = await Post.findById(post.id).populate("bookmarks");
      expect(post!.bookmarks[0].id).toBe(bookmark!.id);
    });

    it("saves post bookmark multiple", async () => {
      const { loginCookie, user } = await login();
      const post = await Post.create({ src: "path/to/src", userId: "testuserid" });

      const bookmark = await PostBookmark.create({ userId: user.id, postId: post.id });
      post.bookmarks.push(bookmark);
      await post.save();
      await request(app).post(`/api/v1/posts/${post.id}/bookmark`).set("Cookie", [loginCookie]).expect(201);

      const bookmarks = await PostBookmark.find({ userId: user.id, postId: post.id });
      expect(bookmarks.length).toBe(1);
    });
  });
});
