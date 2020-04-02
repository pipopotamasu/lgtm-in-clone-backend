import nodemailer from "nodemailer";
import { MAILER_HOST, MAILER_PATHWORD, MAILER_USER, MAILER_PORT } from "@util/secrets";

export const createTransporter = () => {
  return nodemailer.createTransport({
    host: MAILER_HOST,
    port: parseInt(MAILER_PORT),
    auth: {
      user: MAILER_USER,
      pass: MAILER_PATHWORD
    }
  });
};
