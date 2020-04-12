import request from "supertest";
import app from "@src/app";
import { login } from "@test/helpers/user";
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
      const { loginCookie } = await login();

      return request(app).delete("/api/v1/account/delete")
        .set("Cookie", [loginCookie])
        .expect(200)
        .then((res: request.Response) => {
          expect(res.body.msgs[0]).toBe("Your account was deleted");
          User.findOne({ email: "test@example.com" }, (_err, user) => {
            expect(user).toBe(null);
          });
        });
    });
  });
});
