import request from "supertest";
import app from "@src/app";
import { User } from "@models/User";

describe("Delete /api/v1/account/delete", () => {
  describe("has not already loggedin", () => {
    it("returns 302", () => {
      return request(app).delete("/api/v1/account/delete")
        .expect(302)
        .then(res => {
          expect(res.body.msgs[0]).toBe("Please login before executing this operation");
        });
    });
  });

  describe("has already loggedin", () => {
    it("returns user", async () => {
      let loginCookie;
      await User.create({ email: "test@example.com", password: "password" });
      await request(app).post("/api/v1/login")
        .send({email: "test@example.com", password: "password"})
        .expect(200)
        .then(res => {
          loginCookie = res.header["set-cookie"][0].split(";")[0];
        });

      return request(app).delete("/api/v1/account/delete")
        .set("Cookie", [loginCookie])
        .expect(200)
        .then((res) => {
          expect(res.body.msgs[0]).toBe("Your account was deleted");
          User.findOne({ email: "test@example.com" }, (err, user) => {
            expect(user).toBe(undefined);
          });
        });
    });
  });
});
