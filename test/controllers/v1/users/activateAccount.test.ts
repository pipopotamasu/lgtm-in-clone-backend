import request from "supertest";
import app from "@src/app";
import { User } from "@models/User";

describe("GET /account/activation", () => {
  describe("errors", () => {
    describe("not exist user", () => {
      it("returns erros", () => {
        return request(app).get("/api/v1/account/activation?activation_token=foobar")
          .expect(404)
          .then((res) => {
            expect(res.body.errors[0]).toBe("Does not exist user.");
          });
      });
    });
  });

  describe("activation", () => {
    it("be successfull activation", async () => {
      const user = await User.create(
        { email: "test@example.com", password: "password", accountActivationToken: "foobar", activated: false }
      );

      return request(app).get("/api/v1/account/activation?activation_token=foobar")
        .expect(200)
        .then(async () => {
          const activatedUser = await User.findById(user._id);
          expect(activatedUser.activated).toBe(true);
        });
    });
  });
});
