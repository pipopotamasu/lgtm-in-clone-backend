import logger from "./logger";
import dotenv from "dotenv";
import { NODE_ENV } from "app";

export const ENVIRONMENT = process.env.NODE_ENV as NODE_ENV;
const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

if (prod) {
  dotenv.config({ path: ".env.prod" });
} else if (ENVIRONMENT === "test") {
  dotenv.config({ path: ".env.test" });
} else {
  dotenv.config({ path: ".env.dev" });
}

export const MAILER_HOST = process.env["MAILER_HOST"];
export const MAILER_PORT = process.env["MAILER_PORT"];
export const MAILER_USER = process.env["MAILER_USER"];
export const MAILER_PATHWORD = process.env["MAILER_PATHWORD"];
export const MAIL_SENDER = process.env["MAIL_SENDER"];

export const SESSION_SECRET = process.env["SESSION_SECRET"];
export const MONGODB_URI = prod ? process.env["MONGODB_URI"] : process.env["MONGODB_URI_LOCAL"];

if (!SESSION_SECRET) {
  logger.error("No client secret. Set SESSION_SECRET environment variable.");
  process.exit(1);
}

if (!MONGODB_URI) {
  if (prod) {
    logger.error("No mongo connection string. Set MONGODB_URI environment variable.");
  } else {
    logger.error("No mongo connection string. Set MONGODB_URI_LOCAL environment variable.");
  }
  process.exit(1);
}
