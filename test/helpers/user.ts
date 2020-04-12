import app from "@src/app";
import request from "supertest";
import { User, UserDocument } from "@models/User";

export async function login (): Promise<{ loginCookie: string; user: UserDocument }> {
  const user = await User.create({ email: "test@example.com", password: "password" });
  const res = await request(app).post("/api/v1/login")
    .send({email: "test@example.com", password: "password"})
    .expect(200)
  const loginCookie = res.header["set-cookie"][0].split(";")[0];

  return { loginCookie, user };
}
