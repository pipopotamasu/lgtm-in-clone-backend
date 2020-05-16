import request from "supertest";
import app from "@src/app";
import { login } from "@test/helpers/user";

describe("Get /api/v1/logout", () => {
  describe("has not loggedin yet", () => {
    it("returns 302", () => {
      return request(app).get("/api/v1/logout")
        .expect(302)
        .then(res => {
          expect(res.body.errors[0]).toBe("Please login before executing this operation");
        });
    });
  });

  describe("has already loggedin", () => {
    it("returns user", async () => {
      const { loginCookie } = await login();

      return request(app).get("/api/v1/logout")
        .set("Cookie", [loginCookie])
        .expect(200);
    });
  });
});
