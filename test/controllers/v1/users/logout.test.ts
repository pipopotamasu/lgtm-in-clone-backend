import request from "supertest";
import app from "@src/app";
import { User } from "@models/User";

describe("Get /api/v1/logout", () => {
  describe("has not already loggedin", () => {
    it("returns 302", () => {
      return request(app).get("/api/v1/logout")
        .expect(302)
        .then(res => {
          expect(res.body.msgs[0]).toBe("Please login before executing this operation");
        });
    });
  });

  describe("has not already loggedin", () => {
    it("returns user", async () => {
      let loginCookie;
      await User.create({ email: "test@example.com", password: "password" });
      await request(app).post("/api/v1/login")
        .send({email: "test@example.com", password: "password"})
        .expect(200)
        .then(res => {
          loginCookie = res.header["set-cookie"][0].split(";")[0];
        });

      return request(app).get("/api/v1/logout")
        .set("Cookie", [loginCookie])
        .expect(200);
    });
  });
});
