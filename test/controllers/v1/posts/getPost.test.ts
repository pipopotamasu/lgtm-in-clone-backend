import request from "supertest";
import app from "@src/app";
import { Post } from "@models/Post";
import { PostBookmark } from "@models/PostBookmark";
import { Types } from "mongoose";
import { login } from "@test/helpers/user";

describe("Get /api/v1/posts/:id", () => {
  describe("errors", () => {
    describe("fetch by not ObjectId", () => {
      it("returns not found error", async () => {
        const res = await request(app).get("/api/v1/posts/foo").expect(404);
        expect(res.body.errors[0]).toBe("Not found.");
      });
    });
    describe("post does not exits", () => {
      describe("fetch by ObjectId", () => {
        it("returns not found error", async () => {
          const res = await request(app).get(`/api/v1/posts/${Types.ObjectId()}`).expect(404);
          expect(res.body.errors[0]).toBe("Not found.");
        });
      });
    });
  });

  describe("post exists", () => {
    fit("is successfull get post", async () => {
      const { loginCookie, user } = await login()
      const post = new Post({ src: "path/to/src", userId: "testuserid" });
      const bookmark = await PostBookmark.create({ postId: post.id, userId: user.id })
      post.bookmarks.push(bookmark)
      await post.save();

      const res = await request(app).get(`/api/v1/posts/${post.id}`).set("Cookie", [loginCookie]).expect(200);

      console.log(post.response())
      expect(res.body.post).toEqual(post.response());
    });

    it("is successfull get post", async () => {
      const post = await Post.create({ src: "path/to/src", userId: "testuserid" });
      const res = await request(app).get(`/api/v1/posts/${post.id}`).expect(200);

      expect(res.body.post).toEqual(post.response());
    });
  });
});
