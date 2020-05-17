import request from "supertest";
import app from "@src/app";
import { login } from "@test/helpers/user";

describe("Get /api/v1/current_user", () => {
  describe("has not loggedin yet", () => {
    it("returns 302", () => {
      return request(app).get("/api/v1/current_user")
        .expect(302)
        .then(res => {
          expect(res.body.errors[0]).toBe("Please login before executing this operation");
        });
    });
  });

  describe("has already loggedin", () => {
    it("returns current user", async () => {
      const { loginCookie, user } = await login();

      const res = await request(app).get("/api/v1/current_user")
        .set("Cookie", [loginCookie])
        .expect(200);
      expect(res.body).toEqual(user.response());
    });
  });
});
