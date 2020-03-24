import request from "supertest";
import app from "@src/app";
import { User } from "@models/User";

describe("Post /api/v1/postLogin", () => {
  describe("validation errors", () => {
    describe("email", () => {
      describe("invalid email form", () => {
        it("return error", async () => {
          request(app).post("/api/v1/login")
            .send({email: "foobar", password: "password"})
            .expect(400)
            .then(res => {
              expect(res.body.errors[0]).toEqual(
                { location: "body", msg: "Email is not valid", param: "email", value: "foobar" }
              );
            });
        });
      });
    });

    describe("password", () => {
      describe("invalid password length", () => {
        it("return error", async () => {
          request(app).post("/api/v1/login")
            .send({ email: "test@example.com", password: "pas" })
            .expect(400)
            .then(res => {
              expect(res.body.errors[0]).toEqual(
                { location: "body", msg: "Password must be at least 4 characters long", param: "password", value: "pas"}
              );
            });
        });
      });
    });
  });

  describe("login", () => {
    describe("not registered account", () => {
      it("returns error", () => {
        request(app).post("/api/v1/login")
          .send({email: "test@example.com", password: "password"})
          .expect(401)
          .then(res => {
            expect(res.body.errors[0]).toEqual(
              { msg: "invalid account" }
            );
          });
      });
    });

    describe("when exits user", () => {
      it("returns user", async () => {
        const user = await User.create({ email: "test@example.com", password: "password" });
        request(app).post("/api/v1/login")
          .send({email: "test@example.com", password: "password"})
          .expect(200)
          .then(res => {
            expect(res.body.user.email).toBe(
              user.email,
            );
          });
      });
    });
  });
});
