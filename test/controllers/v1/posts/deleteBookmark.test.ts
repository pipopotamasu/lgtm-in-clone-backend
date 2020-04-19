import request from "supertest";
import app from "@src/app";
import { Post } from "@models/Post";
import { login } from "@test/helpers/user";
import { PostBookmark } from "@models/PostBookmark";
import { Types } from "mongoose";


describe("Delete /api/v1/posts/:id/bookmark", () => {
  describe("has not loggedin yet", () => {
    it("returns 302", async () => {
      const post = await Post.create({ src: "path/to/src", userId: "testuserid" });
      const res = await request(app).delete(`/api/v1/posts/${post.id}/bookmark`).expect(302);

      expect(res.body.msgs[0]).toBe("Please login before executing this operation");
    });
  });

  describe("post does not exist", () => {
    it("returns 404", async () => {
      const { loginCookie } = await login();
      const res = await request(app).delete(`/api/v1/posts/${Types.ObjectId()}/bookmark`).set("Cookie", [loginCookie]).expect(404);
      expect(res.body.errors[0]).toBe("Post does not exist.");
    });
  });

  describe("has logged in", () => {
    it("deletes post bookmark", async () => {
      const { loginCookie, user } = await login();
      const post = await Post.create({ src: "path/to/src", userId: "testuserid" });
      const bookmark = await PostBookmark.create({ userId: user.id, postId: post.id });
      post.bookmarks.push(bookmark);
      await post.save();
      await request(app).delete(`/api/v1/posts/${post.id}/bookmark`).set("Cookie", [loginCookie]).expect(200);

      const deletedBookmark = await PostBookmark.findOne({ userId: user.id, postId: post.id });
      expect(deletedBookmark).toBeFalsy();
      const p = await Post.findById(post.id).populate("bookmarks");
      expect(p!.bookmarks.length).toBe(0);
    });
  });
});
