import app from "@src/app";
import request from "supertest";
import { User, UserDocument } from "@models/User";

export async function login (email = "test@example.com"): Promise<{ loginCookie: string; user: UserDocument }> {
  const user = await User.create({ email, password: "password" });
  const res = await request(app).post("/api/v1/login")
    .send({email, password: "password"})
    .expect(200);
  const loginCookie = res.header["set-cookie"][0].split(";")[0];

  return { loginCookie, user };
}
