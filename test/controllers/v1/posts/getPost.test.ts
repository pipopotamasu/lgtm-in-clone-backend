import request from "supertest";
import app from "@src/app";
import { Post } from "@models/Post";
import { Types } from "mongoose";

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
    it("is successfull get post", async () => {
      const post = await Post.create({ src: "path/to/src", userId: "testuserid" });
      const res = await request(app).get(`/api/v1/posts/${post.id}`).expect(200);

      expect(res.body.post).toEqual(post.response());
    });
  });
});
