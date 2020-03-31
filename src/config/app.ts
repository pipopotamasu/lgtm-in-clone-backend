import { NODE_ENV } from "app";

export const appConfig = {
  test: {
    frontend: {
      protcol: "http",
      host: "exmaple.com",
      port: 443,
    }
  },
  development: {
    frontend: {
      protcol: "http",
      host: "localhost",
      port: 3000,
    }
  },
  production: {
    frontend: {
      protcol: "https",
      host: "",
      port: 443,
    }
  }
};

export function frontendOrigin (env: NODE_ENV) {
  const { protcol, host, port } = appConfig[env].frontend;
  return `${protcol}://${host}:${port}`;
}