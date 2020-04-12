import request from "supertest";
import app from "@src/app";
import { login } from "../../../helpers/user";

describe("Post /api/v1/posts", () => {
  describe("has not loggedin yet", () => {
    it("returns 302", () => {
      return request(app).post("/api/v1/posts")
        .expect(302)
        .then(res => {
          expect(res.body.msgs[0]).toBe("Please login before executing this operation");
        });
    });
  });

  describe("has already loggedin", () => {
    fit("is successfull upload image", async () => {
      const loginCookie = await login();

      return request(app)
        .post("/api/v1/posts")
        .attach('file', 'test/fixtures/test_image.png')
        .set("Cookie", [loginCookie])
        .expect(201);
    });
  })
});
