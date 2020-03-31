import request from "supertest";
import app from "@src/app";
import { User } from "@models/User";

// TODO: set your mail credentials
describe.skip("Post /api/v1/signup_with_mail_activation", () => {
  describe("validation errors", () => {
    describe("email", () => {
      describe("invalid email form", () => {
        it("returns error", async () => {
          return request(app).post("/api/v1/signup_with_mail_activation")
            .send({email: "foobar", password: "password", confirmPassword: "password"})
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
        it("returns error", async () => {
          return request(app).post("/api/v1/signup_with_mail_activation")
            .send({email: "test@example.com", password: "pas", confirmPassword: "pas"})
            .expect(400)
            .then(res => {
              expect(res.body.errors[0]).toEqual(
                { location: "body", msg: "Password must be at least 4 characters long", param: "password", value: "pas"}
              );
            });
        });
      });
    });

    describe("confirm password", () => {
      describe("do not match with password", () => {
        it("returns error", async () => {
          return request(app).post("/api/v1/signup_with_mail_activation")
            .send({email: "test@example.com", password: "password", confirmPassword: "passwordpassword"})
            .expect(400)
            .then(res => {
              expect(res.body.errors[0]).toEqual(
                { location: "body", msg: "Passwords do not match", param: "confirmPassword", value: "passwordpassword"}
              );
            });
        });
      });
    });
  });

  describe("save user", () => {
    describe("when exits user", () => {
      it("returns error", async () => {
        await User.create({ email: "test@example.com" });
        return request(app).post("/api/v1/signup_with_mail_activation")
          .send({email: "test@example.com", password: "password", confirmPassword: "password"})
          .expect(409)
          .then(res => {
            expect(res.body.errors[0]).toEqual(
              { msg: "Already exists user" }
            );
          });
      });
    });

    describe("when new user", () => {
      it("returns user", () => {
        return request(app).post("/api/v1/signup_with_mail_activation")
          .send({email: "test@example.com", password: "password", confirmPassword: "password"})
          .expect(201)
          .then(res => {
            expect(res.body.msgs[0]).toBe("check your email address to activate your account");
          });
      });
    });
  });
});
