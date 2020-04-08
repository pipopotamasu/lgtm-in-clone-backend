import request from "supertest";
import app from "@src/app";
import { User, ACCOUNT_ACTIVATION_EXPIRES_HOUR } from "@models/User";
import { addHours } from "date-fns";

describe.skip("GET /account/activation", () => {
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

    describe("exceeded expire limit", () => {
      it("returns error", async () => {
        const user = await User.create(
          {
            email: "test@example.com",
            password: "password",
            activationTokenPublishedAt: addHours(new Date(), ACCOUNT_ACTIVATION_EXPIRES_HOUR + 1),
            accountActivationToken: "foobar",
            activated: false
          }
        );
        return request(app).get("/api/v1/account/activation?activation_token=foobar")
          .expect(401)
          .then((res) => {
            expect(res.body.errors[0]).toBe("Activation expired.");
          });
      });
    });
  });

  describe("activation", () => {
    it("be successfull activation", async () => {
      const user = await User.create(
        {
          email: "test@example.com",
          password: "password",
          activationTokenPublishedAt: new Date(),
          accountActivationToken: "foobar",
          activated: false
        }
      );

      return request(app).get("/api/v1/account/activation?activation_token=foobar")
        .expect(200)
        .then(async () => {
          const activatedUser = await User.findById(user.id);
          expect(activatedUser.activated).toBe(true);
        });
    });
  });
});
